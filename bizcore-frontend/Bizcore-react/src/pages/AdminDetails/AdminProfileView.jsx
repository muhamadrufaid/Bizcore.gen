import React, { useState } from 'react';
import { UserCog, PenLine, UserRound } from 'lucide-react'; // Assuming you're using lucide icons for modern feel

const AdminProfileView = ({ closeModal, setActiveSection }) => {
    return (
        <div className='flex flex-col'>
            <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
                <h1 style={{
                    fontFamily: '"Outfit", sans-serif',  // Apply Google font
                    fontWeight: 600,                    // Apply bold weight
                    fontOpticalSizing: 'auto',           // Apply optical sizing
                }}
                    className='text-blue-700 text-2xl p-2'>Admin Profile</h1>

                <div className='flex'>
                    <button
                        onClick={() => setActiveSection('staff-view')}
                        className='flex mr-2 gap-2 items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
                        <UserCog
                            className='text-white' />
                        <p className='text-white font-semibold'>Staff Settings</p>
                    </button>
                    <button
                        onClick={() => setActiveSection('admin-edit')}
                        className='flex mr-2 gap-2 items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
                        <PenLine
                            className='text-white' />
                        <p className='text-white font-semibold'></p>
                    </button>
                </div>
            </div>


            <div className='m-2 shadow-lg rounded-lg'>
                <div className='flex flex-col items-center justify-center bg-white w-full h-full rounded-lg p-4'>

                    <div className='flex justify-center items-center w-full bg-cyan-500 rounded-md h-59' style={{ background: 'linear-gradient(90deg, #26687aff 0%, #abe054ff 100%)' }}>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                        <h1 className='font-bold text-xl text-white opacity-25 w-full pl-6'> BizCore</h1>
                    </div>

                    <div className='absolute flex items-center justify-center shadow-2xl bottom-25 relative bg-transparent w-52 h-52 rounded-full' style={{ background: 'linear-gradient(90deg, #9ea72bff 0%, #abe054ff 100%)' }}>
                        <div className='flex items-center justify-center bg-white  w-48 h-48 rounded-full '>
                            <UserRound  className='w-1/1 h-1/2 opacity-20' style={{ textDecoration: 'linear-gradient(90deg, #26687aff 0%, #abe054ff 100%)' }}/>
                        </div>
                    </div>

                    <div className='absolute relative bottom-20 flex items-center justify-center'>
                        <div className='flex flex-col items-center'>
                            <label className='text-2xl font-semibold text-gray-800'>John Bosco</label>
                            <p className='text-lg font-semibold text-gray-700'>johnbosco@gmail.com</p>
                        </div>
                    </div>

                    <button
                        className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Logout
                    </button>

                </div>
            </div>


        </div>
    );
};

export default AdminProfileView;
