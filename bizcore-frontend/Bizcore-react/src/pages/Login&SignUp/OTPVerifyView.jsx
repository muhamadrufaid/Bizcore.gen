import React from 'react';

const OTPVerifyView = ({ setIsOTPVisible, setIsSignUpVisible, setIsLoginVisible }) => {

    // Handle Change Email click - Go back to SignUp view
    const handleChangeEmail = () => {
        setIsOTPVisible(false); // Close OTP Verify view
        setIsSignUpVisible(true); // Show SignUp view
    };

    // Handle Verify OTP click - Show Login view
    const handleVerifyOTP = () => {
        setIsOTPVisible(false); // Close OTP Verify view
        setIsLoginVisible(true); // Show Login view
    };

    return (
        <div className="bg-white p-6 rounded-lg w-99 py-10">
            <h2 className="text-xl font-semibold text-center mb-4">Enter OTP</h2>

            {/* OTP Inputs */}
            <div className="flex justify-between mb-4">
                {Array(6).fill('').map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
            </div>

            {/* Verify OTP Button */}
            <button
                onClick={handleVerifyOTP}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Verify OTP
            </button>

            {/* Resend OTP Button */}
            <button
                className="w-full mt-4 text-blue-500 underline hover:text-blue-700 focus:outline-none"
            >
                Resend OTP
            </button>

            {/* Display Email */}
            <div className="mt-4 text-sm text-gray-500 text-center">
                <p>Email sent to: user@example.com</p>
                <button
                    onClick={handleChangeEmail} // Change email handler
                    className="mt-2 text-blue-500 underline hover:text-blue-700 focus:outline-none"
                >
                    Change Email
                </button>
            </div>
        </div>
    );
};

export default OTPVerifyView;
