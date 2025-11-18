import React, { useState } from 'react';

const SignUpView = ({ toggleLogin, toggleOTPView }) => {

    return (
        <div className="bg-white w-99 px-6 py-2 rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
            <form className="space-y-4" >
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                    />
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                    />
                </div>   
            </form>
            <button
                    onClick={toggleOTPView}
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Sign Up
                </button>

            <div className='flex justify-between pr-1 pl-1 pt-5'>
                <p className='text-sm text-gray-500'>
                    Have an Account?{' '}
                    <button
                        onClick={toggleLogin}
                        className='underline text-blue-500 hover:text-blue-700'>
                        Sign In
                    </button>
                </p>
            </div>


        </div>
    );
};

export default SignUpView;
