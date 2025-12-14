import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import  Navbar  from '../components/Navbar';
import { checkTokenValidity } from '../utils';

const LOCAL_STORAGE_KEY = 'quizAppState';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz || JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))?.quiz;

  useEffect(() => {
    // If no quiz is found, redirect to the upload page
    if (!quiz) {
      navigate('/upload');
    }
  }, [quiz, navigate]);


  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return saved?.selectedAnswers || Array(quiz?.questions?.length || 0).fill(null);
  });

  const [submitted, setSubmitted] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return saved?.submitted || false;
  });

  const [score, setScore] = useState(0);

  // Save to localStorage on every change
  useEffect(() => {
    if (quiz) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ quiz, selectedAnswers, submitted }));
    }
  }, [quiz, selectedAnswers, submitted]);

  useEffect(() => {
    if (submitted && quiz) {
      let count = 0;
      quiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) count++;
      });
      setScore(count);
    }
  }, [submitted, quiz, selectedAnswers]);

  const handleSelect = (qIdx, optIdx) => {
    if (!submitted) {
      const updated = [...selectedAnswers];
      updated[qIdx] = optIdx;
      setSelectedAnswers(updated);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRetake = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSelectedAnswers(Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  if (!quiz) {
    return <div className="text-white text-center p-10">No quiz data found.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="bg-[#0f0f0f] min-h-screen text-white px-4 py-10">
        <div className="max-w-3xl mx-auto bg-[#1e1e1e] p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold font-mono text-center mb-6">{quiz.quizTitle}</h1>
          {submitted && (
            <div className="text-center mb-6 text-green-400 font-semibold text-xl">
              Score: {score} / {quiz.questions.length}
            </div>
          )}

          {quiz.questions.map((q, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-lg font-semibold mb-3">{idx + 1}. {q.question}</h2>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = selectedAnswers[idx] === i;
                  const isCorrect = q.correctIndex === i;

                  let base = "w-full p-3 rounded-md border transition-all cursor-pointer";
                  let styles = "bg-[#2b2b2b] border-[#444] hover:bg-[#333]";

                  if (submitted) {
                    if (isSelected && isCorrect) styles = "bg-green-700 border-green-500";
                    else if (isSelected && !isCorrect) styles = "bg-red-700 border-red-500";
                    else if (isCorrect) styles = "bg-green-700 border-green-500 opacity-70";
                  } else if (isSelected) {
                    styles = "bg-purple-700 border-purple-500";
                  }

                  return (
                    <div
                      key={i}
                      className={`${base} ${styles}`}
                      onClick={() => handleSelect(idx, i)}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-700 hover:bg-purple-600 py-3 rounded-md mt-4 text-white font-semibold transition-all"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleRetake}
                className="bg-[#444] hover:bg-[#555] text-white py-2 px-6 rounded-md font-semibold transition-all"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
