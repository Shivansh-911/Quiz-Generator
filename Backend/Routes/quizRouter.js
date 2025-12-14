import express from 'express';
import { createWorker } from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';

import generateQuizPrompt from '../utils/GenerateQuiz.js';
import generateQuery from '../utils/generateQuery.js';
import readFileBasedOnType from '../utils/ReadFile.js';
import chunkText from '../utils/chunkText.js';
import embedChunks from '../utils/embedChunks.js';
import { cosineSimilarity } from '../utils/similarity.js';
import verifyUser from '../Middlewares/QuizValidation.js';
import Quiz from '../Models/Quiz.js';
import convertPdfToImages from '../utils/convertPdfToImages.js';

import groq from '../utils/groqClient.js';

dotenv.config();

const router = express.Router();


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


router.get('/', verifyUser, async (req, res) => {
  try {
    //console.log('User Info:', req.user);  
    const email = req.user?.email;
    if (!email) return res.json([]);

    const quizzes = await Quiz.find({ email });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.post('/', verifyUser, upload.single('file'), async (req, res) => {
  try {
    const { topics, description, difficulty, numQuestions } = req.body;
    const filePath = req.file.path;

    let text = await readFileBasedOnType(filePath);

    /* ---------- OCR FALLBACK ---------- */
    if (!text || text.length < 10) {
      const images = await convertPdfToImages(filePath);
      const worker = await createWorker('eng');
      let ocrText = '';

      for (const img of images) {
        const { data } = await worker.recognize(img);
        ocrText += data.text + '\n';
        fs.unlinkSync(img);
      }

      await worker.terminate();
      text = ocrText.trim();
    }

    fs.unlinkSync(filePath);

    if (!text || text.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient text extracted from file',
      });
    }


    //console.log('Extracted Text:', text.slice(0, 500));
    

    /* ---------------- RAG PIPELINE ---------------- */
    const chunks = chunkText(text);
    const embeddedChunks = await embedChunks(chunks);

    const query = generateQuery({ topics, description });

    // embed query
    const queryEmbedding = (await embedChunks([query]))[0].embedding;

    const topChunks = embeddedChunks
      .map(({ embedding, text }) => ({
        text,
        score: cosineSimilarity(queryEmbedding, embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.text)
      .join('\n');

    //console.log('Top Chunks:', topChunks);
    /* ---------------- PROMPT ---------------- */
    const prompt = generateQuizPrompt({
      context: topChunks,
      numQuestions,
      difficulty,
      topics,
      description,
    });

    /* ---------------- GROQ GENERATION ---------------- */
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    let raw = completion.choices[0].message.content;
    raw = raw.replace(/```json|```/g, '').trim();

    const quiz = JSON.parse(raw);

    /* ---------------- SAVE QUIZ ---------------- */
    if (req.user?.email) {
      await Quiz.create({
        email: req.user.email,
        quizTitle: quiz.quizTitle,
        quizDescription: quiz.quizDescription,
        questions: quiz.questions,
      });
    }

  

    res.json({ success: true, quiz });
  } catch (err) {
    console.error('Quiz generation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
