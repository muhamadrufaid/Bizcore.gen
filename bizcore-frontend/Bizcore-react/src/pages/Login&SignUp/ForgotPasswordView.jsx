import React from 'react';

const ForgotPasswordView = ({ setIsLoginVisible, setIsForgotVisible }) => {

    // Handle Verify OTP click - Show Login view
    const handleBackLogin = () => {
        setIsLoginVisible(true);
        setIsForgotVisible(false)
    };
    return (
        <div className="bg-white p-6 rounded-lg w-99 max-w-lg  py-10">
            <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

            {/* Email Input */}
            <div className="space-y-4 mb-4">
                <label htmlFor="email" className="block text-sm text-gray-600">Enter your registered email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Reset Password Button */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Reset Password
            </button>

            {/* Back to Login */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                    Remember your password?{' '}
                    <button
                        onClick={handleBackLogin}
                        className="text-blue-500 hover:text-blue-700">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordView;
