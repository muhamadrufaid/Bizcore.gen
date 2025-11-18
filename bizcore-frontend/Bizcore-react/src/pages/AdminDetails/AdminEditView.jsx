import React from 'react'
import { ChevronLeft, SaveAll } from 'lucide-react';


const AdminEditView = ({ setActiveSection }) => {
    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center pr-2 justify-between bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('admin-profile')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Edit Profile
                    </h1>
                </div>

                <div className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <SaveAll className='w-5 h-5' />
                    <button className=''>
                        Save Changes
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md m-4">

                <div className="grid grid-cols-2 md:grid-cols-3 sm:grid-cols-1 gap-4 ">
                    <div className="flex flex-col">
                        <label className="text-gray-700">Username</label>
                        <input
                            type="text"
                            className="border p-2 rounded-sm text-gray-600 border-gray-400"
                            placeholder="Enter category name"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">Phone</label>
                        <input
                            type="text"
                            className="border p-2 rounded-sm text-gray-600 border-gray-400"
                            placeholder="Enter phone"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">Email</label>
                        <input
                            type="text"
                            className="border p-2 rounded-sm text-gray-600 border-gray-400"
                            placeholder="Enter email"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 w-full pt-6 sm:grid-cols-1 gap-10 pb-4 ">
                    <div className="flex flex-col w-full">
                        <label className="text-gray-700">Upload Profile Image</label>
                        <input
                            type="text"
                            className="border p-2 rounded-sm w-full h-40 text-gray-600 border-gray-400"

                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-gray-700">Upload Cover Image</label>
                        <input
                            type="text"
                            className="border p-2 rounded-sm  text-gray-600 h-40 border-gray-400"

                        />
                    </div>

                </div>

                <div className='flex pt-4'>
                    <button 
                    onClick={() => setActiveSection('admin-password-change')}
                    className='font-semibold underline text-blue-400 hover:text-blue-600'>Change Password</button>
                </div>
            </div>
        </div>

    )
}

export default AdminEditView
