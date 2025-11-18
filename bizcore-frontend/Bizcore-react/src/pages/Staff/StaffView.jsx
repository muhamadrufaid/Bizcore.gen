import React from 'react';

const StaffView = ({ setActiveSection }) => {
    return (
        <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <div className="text-center p-10 md:p-20">
                <div className="mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                        className="w-32 h-32 mx-auto animate-pulse"
                        fill="none"
                    >
                        <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="10" className="opacity-70" />
                        <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="10" className="opacity-50" />
                        <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="10" className="opacity-30" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    We're Building Something Awesome
                </h1>
                <p className="text-lg md:text-xl mb-8">
                    Our page is currently under construction. Please check back soon for updates!
                </p>

                <div className="flex justify-center space-x-4">
                    <a

                        className="px-8 py-3 text-lg font-semibold rounded-full bg-yellow-500 text-blue-900 hover:bg-yellow-400 transition duration-300"
                    >
                        Contact Us
                    </a>

                    <button
                    onClick={() => setActiveSection('admin-profile')}
                        className="px-8 py-3 text-lg font-semibold rounded-full border-2 border-white hover:bg-white hover:text-blue-900 transition duration-300"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffView;
