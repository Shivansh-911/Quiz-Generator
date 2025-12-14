# 📚 Quiz Generator App

An AI-powered web application that generates personalized multiple-choice quizzes from uploaded documents (PDF, DOCX, TXT). It uses a **Retrieval-Augmented Generation (RAG)** pipeline, **Groq API**, and **Hugging Face API** to create high-quality quizzes based on user-selected difficulty, topics, and descriptions.

---

## 🚀 Features

- 📄 **Document Upload**  
  Supports PDF, DOCX, and TXT files.

- 🔍 **Text Extraction**  
  Utilizes `pdf-parse` for PDFs and `mammoth` for DOCX files.

- 🤖 **RAG Pipeline**  
  Implements Retrieval-Augmented Generation to fetch relevant content from large documents.

- ✨ **Quiz Generation**  
  Uses Groq API to create MCQ quizzes tailored to difficulty level and key topics.

- 👤 **User Authentication**  
  JWT-based secure login/signup system.

- 💾 **Persistent Storage**  
  Quizzes saved to MongoDB for logged-in users; guest users get one-time quizzes.

- 💻 **Responsive UI**  
  Built with React + Vite + Tailwind CSS for a smooth experience across devices.

---

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
- Groq API (via Groq SDK)
- Retrieval-Augmented Generation (RAG)
- Embedding Chunks (via Hugging Face API)
- pdf-parse (for text PDFs)
- Mammoth (for DOCX files)

---

## 🧠 How It Works

### 1. User Uploads a File
Supports `.pdf`, `.docx`, and `.txt`.

### 2. Text Extraction
Depending on the file type:
- `.pdf`: `pdf-parse`
- `.docx`: `mammoth`
- `.txt`: direct text read

### 3. RAG Pipeline
- Extracted text is chunked and embedded using Hugging Face API.
- In-memory similarity search retrieves the most relevant chunks based on user input (topics/description).

### 4. Prompt to Groq API
- A custom prompt is generated using the selected difficulty and retrieved chunks.
- Groq API returns an MCQ quiz.

### 5. Quiz Delivery & Persistence
- Quiz is shown in a clean UI.
- Logged-in users have their quizzes saved in MongoDB.
- Guest users can view/attempt the quiz once.
