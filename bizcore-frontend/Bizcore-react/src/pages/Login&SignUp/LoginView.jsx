import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import LoginPage from './LoginPage';
import SignUpView from './SignUpView';
import OTPVerifyView from './OTPVerifyView';
import ForgotPasswordView from './ForgotPasswordView';

const LoginView = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [isSignUpVisible, setIsSignUpVisible] = useState(false);
    const [isOTPVisible, setIsOTPVisible] = useState(false);
    const [isForgotVisible, setIsForgotVisible] = useState(false)

    const toggleLogin = () => {
        setIsLoginVisible(!isLoginVisible);
        setIsSignUpVisible(false);
    };

    const toggleForgot = () => {
        setIsForgotVisible(!isForgotVisible);
        setIsLoginVisible(false);
    };

    const toggleSignUp = () => {
        setIsSignUpVisible(!isSignUpVisible);
        setIsLoginVisible(false);
    };

    const toggleOTPView = () => {
        setIsOTPVisible(!isOTPVisible); // Toggle OTP view visibility
        setIsSignUpVisible(false)
    };

    return (
        <div className='flex items-center justify-center'>
            <div className="flex flex-col w-full p-2 h-screen"
                style={{ background: 'linear-gradient(90deg, #3F2B96 0%, #5f88efff 100%)' }}>

                <div className='p-4 w-full'>
                    <h1
                        style={{
                            fontFamily: '"Lexend", sans-serif',
                            fontWeight: 600,
                            fontOpticalSizing: 'auto',
                        }}
                        className="text-white text-5xl"
                    >
                        BizCore.
                    </h1>
                    <p className='pl-1 text-white text-sm font-semibold'>The Smart Way to Run Your Business.</p>
                </div>

                <div className='bg-transparent flex mt-15 items-center justify-center'>
                    <p className='text-xl text-white'
                        style={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 600,
                            fontOpticalSizing: 'auto',
                        }}>
                        Welcome back! Please log in to continue.
                    </p>
                </div>

                <div className='flex w-full mt-20 pt-4 bg-transparent justify-center'>
                    <div className='flex gap-6 pr-6'>
                        <div
                            className='flex flex-col items-center'>
                            <div className='flex p-1 rounded-full hover:bg-indigo-800 transition-transform duration-300 ease-in-out transform hover:scale-110 relative'>
                                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-gray-600">
                                    <User className="w-10 h-10" />
                                </div>
                            </div>
                            <label className='font-semibold pt-2 text-white'>User</label>
                        </div>
                    </div>
                    <div className="h-20 pr-4 pl-4 border-l-2 border-white border-gray-500"></div>
                    <div className='flex gap-6'>
                        <div
                            onClick={toggleLogin} // Toggle login modal on click
                            className='flex flex-col items-center'>
                            <div className='flex p-1 rounded-full hover:bg-indigo-800 transition-transform duration-300 ease-in-out transform hover:scale-110 relative'>
                                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-gray-600">
                                    <User className="w-10 h-10" />
                                </div>
                            </div>
                            <label className='font-semibold pt-2 text-white'>ADMIN</label>
                        </div>
                    </div>
                </div>

                {/* Render the LoginPage as a pop-up when isLoginVisible is true */}
                {isLoginVisible && (
                    <div className="fixed inset-0  bg-transparent flex items-center justify-center z-50 backdrop-blur-xs">
                        <div className="bg-white p-6 rounded-lg shadow-lg  max-w-lg relative">
                            <button onClick={toggleLogin} className="absolute top-3 right-3 text-xl text-gray-500"><X /></button>
                            <LoginPage toggleSignUp={toggleSignUp} toggleForgot={toggleForgot} />
                        </div>
                    </div>
                )}

                {/* Render the SignUpView as a pop-up when isSignUpVisible is true */}
                {isSignUpVisible && (
                    <div className="fixed inset-0  bg-transparent flex items-center justify-center z-50 backdrop-blur-xs">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg relative">
                            <button onClick={toggleSignUp} className="absolute top-3 right-3 text-xl text-gray-500"><X /></button>
                            <SignUpView toggleLogin={toggleLogin} toggleOTPView={toggleOTPView} />
                        </div>
                    </div>
                )}

                {/* OTP Verification Modal */}
                {isForgotVisible && (
                    <div className="fixed inset-0  bg-transparent flex items-center justify-center z-50 backdrop-blur-xs">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg relative">
                            <button onClick={toggleForgot} className="absolute top-3 right-3 text-xl text-gray-500">
                                <X />
                            </button>
                            <ForgotPasswordView
                                setIsLoginVisible={setIsLoginVisible}
                                setIsForgotVisible={setIsForgotVisible}
                            />
                        </div>
                    </div>
                )}

                {isOTPVisible && (
                    <div className="fixed inset-0  bg-transparent flex items-center justify-center z-50 backdrop-blur-xs">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg relative">
                            <button onClick={toggleOTPView} className="absolute top-3 right-3 text-xl text-gray-500">
                                <X />
                            </button>
                            <OTPVerifyView
                                setIsOTPVisible={setIsOTPVisible}
                                setIsSignUpVisible={setIsSignUpVisible}
                                setIsLoginVisible={setIsLoginVisible}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginView;
