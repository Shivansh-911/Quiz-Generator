import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'
import { handleSuccess, handleError, checkTokenValidity } from '../utils'
import 'react-toastify/dist/ReactToastify.css'

const Upload = () => {
  const url = import.meta.env.VITE_API_UPLOAD_URL
  const navigate = useNavigate()

  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadInfo, setUploadInfo] = useState({
    file: null,
    topics: '',
    description: '',
    difficulty: 'easy',
    numQuestions: 5,
  })
  const [errors, setErrors] = useState({ file: false, numQuestions: false })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(checkTokenValidity())
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFileName(file?.name || '')
    setUploadInfo(prev => ({ ...prev, file }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUploadInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { file, numQuestions } = uploadInfo
    const newErrors = {}
    if (!file) newErrors.file = 'Please upload a file'
    if (!numQuestions) newErrors.numQuestions = 'Please enter number of questions'
    else if (numQuestions < 1 || numQuestions > 50)
      newErrors.numQuestions = 'Number of questions should be between 1 and 50'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', uploadInfo.file)
      formData.append('topics', uploadInfo.topics)
      formData.append('description', uploadInfo.description)
      formData.append('difficulty', uploadInfo.difficulty)
      formData.append('numQuestions', uploadInfo.numQuestions)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
        body: formData,
      })

      const data = await response.json()
      console.log(data)
      if(!data.success) {
        throw new Error(data.error || 'Failed to generate quiz')
      }
      navigate('/quiz', { state: { quiz: data.quiz } })
      handleSuccess('Quiz generated successfully!')
    } catch (error) {
      console.error(error)
      handleError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Navbar />

      <div className="w-full flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-xl">
          {/* Prompt to log in if not saved */}
          {!isLoggedIn && (
            <div className="mb-6 p-4 bg-yellow-600 text-black rounded-md text-center">
              Want to <Link to="/login" className="underline font-semibold">log in</Link> and save your quizzes?
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#1e1e1e] p-10 rounded-2xl shadow-2xl flex flex-col gap-6"
          >
            <h1 className="text-3xl font-bold font-mono mb-0 text-center">
              Upload Notes to Generate Quiz
            </h1>

            {/* File Upload */}
            <div>
              <label className="block mb-1">
                Upload File (PDF, DOCX, TXT) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="w-full p-2 rounded-md bg-[#2b2b2b] border border-[#444] text-gray-200"
              />
              {fileName && <p className="text-sm mt-1 text-gray-400">Selected: {fileName}</p>}
              {errors.file && <p className="text-red-400 text-sm mt-1">{errors.file}</p>}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block mb-1">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                name="difficulty"
                value={uploadInfo.difficulty}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#444] text-gray-300"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block mb-1">
                Number of Questions <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numQuestions"
                min={1}
                max={50}
                value={uploadInfo.numQuestions}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#444] text-gray-200"
              />
              {errors.numQuestions && (
                <p className="text-red-400 text-sm mt-1">{errors.numQuestions}</p>
              )}
            </div>

            {/* Topics */}
            <div>
              <label className="block mb-1">Topics / Keywords</label>
              <input
                type="text"
                name="topics"
                value={uploadInfo.topics}
                onChange={handleChange}
                placeholder="e.g. Photosynthesis, Newton's Laws"
                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#444] placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1">Description (For more accurate generation)</label>
              <input
                type="text"
                name="description"
                value={uploadInfo.description}
                onChange={handleChange}
                placeholder="e.g. Theory based questions, Solving problems"
                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#444] placeholder:text-gray-400"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-md 
                font-medium transition-all flex justify-center items-center gap-2
                ${loading ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </>
              ) : 'Generate Quiz'}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  )
}

export default Upload
