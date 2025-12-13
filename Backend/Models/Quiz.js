import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    quizTitle: {
      type: String,
      required: true,
    },
    quizDescription: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          validate: [arr => arr.length === 4, 'Each question must have 4 options'],
          required: true,
        },
        correctIndex: {
          type: Number,
          required: true,
          min: 0,
          max: 3,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', QuizSchema);
