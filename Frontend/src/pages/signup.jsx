import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import axios from '../components/axios';
import { handleSuccess, handleError, checkTokenValidity } from '../utils';
import 'react-toastify/ReactToastify.css';
import Navbar from '../components/Navbar';

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (checkTokenValidity()) {
      navigate('/quizzes');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError('Please fill all the fields');
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post('/auth/signup', signupInfo);
      const { success, message, error } = data;

      setIsLoading(false);

      if (success) {
        handleSuccess('Signup successful');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (err) {
      setIsLoading(false);
      handleError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Navbar />
      <div className="w-full flex justify-center items-center py-20">
        <div className="bg-[#1e1e1e] p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold font-mono mb-8 text-center">
            Create an Account
          </h1>

          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <div>
              <label htmlFor="name" className="block mb-1">Name</label>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                value={signupInfo.name}
                placeholder="John Doe"
                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#444] focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                value={signupInfo.email}
                placeholder="you@example.com"
                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#444] focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={signupInfo.password}
                placeholder="Create a password"
                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#444] focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute top-[2.8rem] right-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-md font-medium transition-all"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto border-b-2 border-white rounded-full"
                  viewBox="0 0 24 24"
                ></svg>
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="text-center">
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="text-purple-500 underline hover:text-purple-400"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  );
};

export default Signup;
