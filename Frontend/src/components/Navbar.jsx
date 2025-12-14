import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils';
import { checkTokenValidity } from '../utils';

const Navbar = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const isValid = checkTokenValidity();
        setLoggedIn(isValid);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogoutAndNavigate = () => {
        handleLogout();
        navigate('/upload');
    };

    const goToQuizzes = () => {
        navigate('/quizzes');
        setDropdownOpen(false);
    };

    return (
        <nav className='text-white w-full p-4 flex bg-black justify-around items-center text-lg font-semibold relative'>
            <div className="logo">
                <button onClick={() => navigate("/upload")} className='flex items-center gap-2'>
                    QuizGen 🧠
                </button>
            </div>
            <div className='flex items-center gap-20'>
                <a href='https://github.com/shreyassiu/Quiz_Gen' target='_blank' rel="noreferrer" className='text-white flex items-center gap-3'>
                    <img width={25} className='invert' src="/icons/github.png" alt="" />
                    <div className='font-semibold'>Github</div>
                </a>

                {loggedIn ? (
                    <div className='relative' ref={dropdownRef}>
                        <button onClick={toggleDropdown} className='flex items-center gap-2'>
                            Profile ⏷
                        </button>
                        {dropdownOpen && (
                            <div className='absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-40 z-50'>
                                <button
                                    onClick={goToQuizzes}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-200'
                                >
                                    My Quizzes
                                </button>
                                <button
                                    onClick={handleLogoutAndNavigate}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-200'
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')}>Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
