import { useState } from 'react'
import './App.css'
import { Routes, Route,Navigate } from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import Upload from './pages/upload'
import Quiz from './pages/quiz'
import Quizzes from './pages/myQuizzes'


function App() {

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Navigate to="/upload" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="*" element={<Navigate to="/upload" />} />
      </Routes>
    </>
  )
}

export default App
