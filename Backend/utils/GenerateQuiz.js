function generateQuizPrompt({ context, numQuestions, difficulty, topics, description }) {
   return `
 You are an expert quiz creator. Your task is to generate a multiple-choice quiz based on the provided text.
 
 Instructions:
 1. Number of Questions:
    - Create ${numQuestions} multiple-choice questions.
 2. Question Format:
    - Each question should be clear, concise, and based on the text.
    - Provide four answer options labeled A, B, C, and D.
    - Only one option must be correct.
    - Incorrect options should be realistic, as a possible answer to that question to avoid easy elimination.
 3. Difficulty Level:
    - Overall difficulty should be '${difficulty}'.
    - This would entail, if the difficulty is 'easy', the questions should be simple and straightforward, with the options being easy to differentiate, while if the difficulty is 'hard', the questions should be more complex and require deeper understanding of the text, or have very similar options, confusing the reader.
    - If possible, maintain a slight variation in question difficulty while keeping the overall level at '${difficulty}'.
 4. Topics (Optional):
    - If applicable, prioritize the following topics or keywords: ${topics || "no specific topics provided"}.
 5. Description (Optional):
    - Focus the questions according to the description: ${description || "no specific description provided"}.
 6. Avoid plagiarism:
    - Do not copy text verbatim. Paraphrase if needed.  
 7. Answer Key:
    - After all questions, provide an answer key in this format:
      - 1. A
      - 2. C
      - 3. B
      - ...
 8.Finally, output ONLY a JSON object,nothing else, just this object, not a single character before or after it, matching this schema:
{
   "quizTitle": "string",
   "quizDescription": "string (number of questions, difficulty, topics)",
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctIndex": integer  
    }
  ]
}
 Source Text:
 """
 ${context}
 """
   `;
}

export default generateQuizPrompt;
