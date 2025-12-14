# 📚 Quiz Generator App

An AI-powered web application that generates personalized multiple-choice quizzes from uploaded documents (PDF, DOCX, TXT). It uses a Retrieval-Augmented Generation (RAG) pipeline and Google Gemini API to create high-quality quizzes based on user-selected difficulty, topics, and descriptions.

## 🚀 Features

- 📄 **Document Upload**: Supports PDF, DOCX, and TXT files; OCR for scanned PDFs via Tesseract.
- 🔍 **Text Extraction**: Utilizes `pdf-parse`, `mammoth`, and `tesseract.js` to accurately extract content.
- 🤖 **RAG Pipeline**: Implements Retrieval-Augmented Generation to fetch relevant content from large documents.
- ✨ **Quiz Generation**: Uses Gemini API to create MCQ quizzes tailored to difficulty level and key topics.
- 👤 **User Authentication**: JWT-based secure login/signup system.
- 💾 **Persistent Storage**: Quizzes saved to MongoDB for logged-in users; guest users get one-time quizzes.
- 💻 **Responsive UI**: Built with React + Vite + Tailwind CSS for a smooth experience across devices.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- JWT Authentication
- MongoDB (via Mongoose)

### Quiz Generation & Utilities
- Gemini API (via Google AI SDK)
- Retrieval-Augmented Generation (RAG)
- Tesseract.js (OCR for scanned PDFs)
- pdf-parse (for text PDFs)
- Mammoth (for DOCX files)

## 🧠 How It Works

1. **User Uploads a File**  
   Supports `.pdf`, `.docx`, and `.txt`. If the PDF is scanned, Tesseract performs OCR.

2. **Text Extraction**  
   Depending on the file type:
   - `.pdf`: `pdf-parse` or `tesseract.js`
   - `.docx`: `mammoth`
   - `.txt`: direct text read

3. **RAG Pipeline**  
   - Extracted text is chunked and embedded.
   - Vector store (in-memory) is used to retrieve the most relevant chunks based on user input (topics/description).

4. **Prompt to Gemini API**  
   - A custom prompt is generated using the selected difficulty and retrieved chunks.
   - Gemini API returns an MCQ quiz.

5. **Quiz Delivery & Persistence**  
   - Quiz is shown in a clean UI.
   - Logged-in users have their quizzes saved in MongoDB.
   - Guest users can view/attempt the quiz once.
