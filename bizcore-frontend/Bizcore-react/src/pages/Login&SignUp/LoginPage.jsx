import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const LoginPage = ({ toggleSignUp, toggleForgot }) => {

    const navigate = useNavigate();
    const handleLoginClick = () => {
        // Simulate a login process (if necessary)
        // Then navigate to '/bizcore'
        navigate('/bizcore');
    };

    return (
        <div className="flex flex-col w-96 px-8 py-4">
            <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
            <form className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                    />
                </div>
                <div>
                    <input
                        type='text'
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                    />
                </div>
                <button
                    onClick={handleLoginClick}
                    className="w-full mt-2 bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Login
                </button>

            </form>
            <div className='flex justify-between pr-1 pl-1 pt-5'>
                <button
                    onClick={toggleForgot}
                    className='underline text-sm text-blue-500 hover:text-blue-700'>Forgot Password</button>
                <p className='text-sm text-gray-500'>New user? <button
                    onClick={toggleSignUp}
                    className='underline text-blue-500 hover:text-blue-700'>Signup</button></p>
            </div>

        </div>
    );
}

export default LoginPage;
