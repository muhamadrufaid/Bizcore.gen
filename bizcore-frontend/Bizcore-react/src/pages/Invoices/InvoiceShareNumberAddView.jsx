import React, { useState } from 'react';
import { Mail, MessageSquareMore, MessageCircle } from 'lucide-react';

const InvoiceShareNumberAddView = ({ closeModal }) => {
    const [selectedOption, setSelectedOption] = useState('whatsapp'); // Default to WhatsApp
    const [saveNumber, setSaveNumber] = useState(false); // State to manage checkbox

    const handleOptionClick = (option) => {
        setSelectedOption(option); // Toggle between 'whatsapp', 'message', 'email'
    };

    const handleCheckboxChange = () => {
        setSaveNumber(!saveNumber); // Toggle the checkbox state
    };

    return (
        <div className="fixed inset-0  backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-140 h-96">
                <h2 className="text-2xl font-semibold mb-6">Share Invoice Via</h2>

                {/* Buttons for selecting sharing option */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        onClick={() => handleOptionClick('whatsapp')}
                        className={`px-4 py-2 ${selectedOption === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-gray-300'} rounded-md`}
                    >
                        <MessageCircle />
                    </button>
                    <button
                        onClick={() => handleOptionClick('message')}
                        className={`px-4 py-2 ${selectedOption === 'message' ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-md`}
                    >
                        <MessageSquareMore />
                    </button>
                    <button
                        onClick={() => handleOptionClick('email')}
                        className={`flex gap-2 px-4 py-2 ${selectedOption === 'email' ? 'bg-red-500 text-white' : 'bg-gray-300'} rounded-md`}
                    >
                        <Mail />
                    </button>
                </div>

                {/* Content for the selected option */}
                <div className="space-y-4 pt-6">
                    {selectedOption === 'whatsapp' && (
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm text-gray-600 font-semibold">Phone Number</label>
                            <input
                                type="text"
                                id="whatsapp"
                                className="mt-1 p-2 border rounded-sm border-gray-400 text-gray-600 w-full"
                                placeholder="Enter WhatsApp number"
                            />
                        </div>
                    )}

                    {selectedOption === 'message' && (
                        <div>
                            <label htmlFor="message" className="block text-sm text-gray-600 font-semibold">Phone Number</label>
                            <input
                                type="text"
                                id="message"
                                className="mt-1 p-2 border rounded-md border-gray-400 text-gray-600 w-full"
                                placeholder="Enter phone number"
                            />
                        </div>
                    )}

                    {selectedOption === 'email' && (
                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-600 font-semibold">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 p-2 border rounded-md border-gray-400 text-gray-600 w-full"
                                placeholder="Enter email address"
                            />
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex justify-between  gap-3 mt-20">
                    <div className="flex items-center mt-1">
                        <input
                            type="checkbox"
                            id="saveNumber"
                            checked={saveNumber}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        <label htmlFor="saveNumber" className="text-sm font-semibold">
                            Save this details for future use
                        </label>
                    </div>

                    <div className='flex gap-2'>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 px-4 text-gray-800 p-2 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-blue-400 px-6 font-semibold text-white p-2 rounded-md hover:bg-blue-500"
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceShareNumberAddView;
