import React, { useState } from 'react';

const PassWordForgotView = ({ closeModal }) => {
    const [isSuccess, setIsSuccess] = useState(false); // State to handle success message visibility

    const handleSubmit = () => {
        // Logic for submitting the email (like sending a request to the backend)

        // Set success message visible
        setIsSuccess(true);
    };

    return (
        <div className="flex flex-col">
            {isSuccess ? (
                // Success message after submitting the form
                <div className="flex flex-col items-center justify-center p-4 bg-green-100 rounded-lg">
                    <h2 className="text-xl font-semibold text-green-600">Success!</h2>
                    <p className="text-sm text-green-600 mt-2">Password reset instructions have been sent to your email.</p>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-blue-500 text-white p-2 px-4 rounded-md mt-4"
                    >
                        Close
                    </button>
                </div>
            ) : (
                // Form to enter email if not successful
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
                    <div className="space-y-4">
                        <div className='pt-6 pb-6'>
                            <label htmlFor="email" className="block text-sm font-semibold">Enter your Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 p-2 border rounded-md w-full"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={closeModal} // Close the modal when clicked
                                className="bg-gray-300 text-gray-800 p-2 px-3 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit} // Call handleSubmit when clicked
                                className="bg-blue-500 text-white p-2 px-4 rounded-md"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PassWordForgotView;
