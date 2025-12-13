import express from 'express';
import { createWorker } from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import generateQuizPrompt from '../utils/GenerateQuiz.js';
import generateQuery from '../utils/generateQuery.js';
import readFileBasedOnType from '../utils/ReadFile.js';
import { GoogleGenAI } from '@google/genai';
import chunkText from '../utils/chunkText.js';
import embedChunks from '../utils/embedChunks.js';
import { cosineSimilarity } from '../utils/similarity.js';
import verifyUser from '../Middlewares/QuizValidation.js';
import Quiz from '../Models/Quiz.js';
import convertPdfToImages from '../utils/convertPdfToImages.js';

dotenv.config();

const router = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', verifyUser, async (req, res) => {
    const email = req.headers.email;
    if (!email) {
        return res.status(400).json({ success: false, error: 'Email header is required' });
    }
    try {
        const Quizzes = await Quiz.find({ email });
        res.json(Quizzes);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/', verifyUser, upload.single('file'), async (req, res) => {
    try {
        const { topics, description, difficulty, numQuestions } = req.body;
        const filePath = req.file.path;

        let text1 = await readFileBasedOnType(filePath);
        if (text1.length < 10) {
            const images = await convertPdfToImages(filePath);
            let trText = '';
            const worker = await createWorker();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');

            for (const imagePath of images) {
                try {
                    const { data: { text } } = await worker.recognize(imagePath);
                    fs.unlinkSync(imagePath);
                    trText += text + '\n';
                } catch (err) {
                    console.error(`Failed to OCR image ${imagePath}`, err);
                }
            }
            text1 = trText.trim();
        }

        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete file:', err);
        });

        if (!text1 || text1.length < 10) {
            return res.status(400).json({ success: false, error: 'Failed to extract sufficient text from the file.' });
        }

        const chunks = chunkText(text1);
        const embeddedChunks = await embedChunks(chunks);

        const query = generateQuery({ topics, description });
        const model = new GoogleGenAI({ apiKey });

        const queryEmbeddingResponse = await model.models.embedContent({
            model: 'embedding-001',
            contents: query,
        });

        const queryEmbeddingObj = queryEmbeddingResponse.embeddings[0];
        const queryVector = Array.isArray(queryEmbeddingObj.values)
            ? queryEmbeddingObj.values
            : queryEmbeddingObj;

        const topK = 5;
        const topChunks = embeddedChunks
            .map(item => {
                const chunkVector = Array.isArray(item.embedding.values)
                    ? item.embedding.values
                    : item.embedding;

                return {
                    text: item.text,
                    similarity: cosineSimilarity(queryVector, chunkVector)
                };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK)
            .map(item => item.text)
            .join('\n');

        const finalPrompt = generateQuizPrompt({
            context: topChunks,
            numQuestions,
            difficulty,
            topics,
            description
        });

        const result = await model.models.generateContent({
            model: "gemini-2.0-flash",
            contents: finalPrompt
        });

        let raw = result.text;
        raw = raw.replace(/```json\s*([\s\S]*?)```/, '$1').trim();

        let quizObj;
        try {
            quizObj = JSON.parse(raw);
        } catch (e) {
            throw new Error("Failed to parse quiz JSON");
        }

        if (req.user && req.user.email) {
            const newQuiz = new Quiz({
                email: req.user.email,
                quizTitle: quizObj.quizTitle,
                quizDescription: quizObj.quizDescription,
                questions: quizObj.questions
            });

            await newQuiz.save();
        }

        res.json({ success: true, quiz: quizObj });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error });
    }
});

export default router;
