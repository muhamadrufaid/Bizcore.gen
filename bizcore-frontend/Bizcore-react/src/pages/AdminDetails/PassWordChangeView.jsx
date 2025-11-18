import React, { useState } from 'react';
import { ChevronLeft, SaveAll } from 'lucide-react';
import PassWordForgotView from './PassWordForgotView';

const PassWordChangeView = ({ setActiveSection }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

    const openModal = () => {
        setIsModalOpen(true); // Show the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center pr-2 justify-between bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('admin-edit')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Change Password
                    </h1>
                </div>

                <div className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <SaveAll className='w-5 h-5' />
                    <button className=''>
                        Save Password
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center m-4">
                <div className='flex flex-col justify-between w-140 h-99 bg-white p-4 rounded-xl shadow-lg pt-6'>
                    <div className='flex flex-col w-full gap-3'>
                        <div className="flex flex-col">
                            <label className="text-gray-500">Current Password</label>
                            <input
                                type="text"
                                className="border p-2 rounded-sm text-gray-600 border-gray-400"
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500">New Password</label>
                            <input
                                type="text"
                                className="border p-2 rounded-sm text-gray-600 border-gray-400"
                                placeholder="Enter enter new password"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500">Confirm New Password</label>
                            <input
                                type="text"
                                className="border p-2 rounded-sm text-gray-600 border-gray-400"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    <div className='p-2'>
                        <button
                            className='font-semibold text-blue-400 underline hover:text-blue-600'
                            onClick={openModal} // Open the modal when clicked
                        >
                            Forgot Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Popup for Forgot Password */}
            {isModalOpen && (
                <div className="fixed inset-0  backdrop-blur-xs flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-140 h-69 shadow-lg">
                        <PassWordForgotView closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PassWordChangeView;
