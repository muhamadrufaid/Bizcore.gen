import React, { useState } from 'react';
import { MailWarning, Bell, ScrollText, ChevronDown, User, House } from 'lucide-react';
import AdminView from '../../pages/AdminDetails/AdminView'; // AdminView Component

const Navbar = ({ setActiveSection }) => {
    const [isAdminViewVisible, setIsAdminViewVisible] = useState(false); // State for toggling AdminView visibility

    const toggleAdminView = () => {
        setIsAdminViewVisible(!isAdminViewVisible); // Toggle the visibility of AdminView
    };

    const closeAdmin = () => {
        setIsAdminViewVisible(false)
    }

    return (
        <div className="flex gap-4 items-center justify-end w-full pr-3">
            <div className='flex gap-2'>
                <div
                    onClick={() => setActiveSection('analytics-view')}
                    className='flex items-center justify-center text-gray-700 p-2 hover:bg-indigo-100 rounded-full'>
                    <House />
                </div>
                <div
                    onClick={() => setActiveSection('invoice-form')}
                    className='flex items-center justify-center text-gray-700 p-2 hover:bg-indigo-100 rounded-full'>
                    <ScrollText />
                </div>
                <div
                   onClick={() => setActiveSection('staff-view')}
                    className='flex items-center justify-center text-gray-700 p-2 hover:bg-indigo-100 rounded-full'>
                   <MailWarning />
                </div>
                <div
                    onClick={() => setActiveSection('alert-view')}
                    className='flex items-center justify-center text-gray-700 p-2 hover:bg-indigo-100 rounded-full'>
                    <Bell />
                </div>
            </div>
            <div className='flex bg-white'>
                <div
                    className='flex items-center gap-2 w-full pl-2 py-0 px-2 hover:bg-indigo-200 rounded-lg cursor-pointer'
                    onClick={toggleAdminView} // Toggle the visibility of AdminView when clicked
                >
                    <div className='w-9 h-9 flex items-center justify-center text-white bg-cyan-400 rounded-full'>
                        <User />
                    </div>
                    <div className='pl-1'>
                        <label className='text-sm font-semibold'>John Bosco</label>
                        <p className='text-xs'>Admin</p>
                    </div>
                    <div className='text-gray-700'>
                        <ChevronDown />
                    </div>
                </div>
            </div>

            {/* AdminView Popup */}
            {isAdminViewVisible && (
                <div className="absolute top-15 right-2 bg-transparent flex items-center justify-center z-50 pr-2">
                    <div className="bg-white rounded-lg shadow-lg w-75 max-w-sm relative ">
                        <AdminView setActiveSection={setActiveSection} closeAdmin={closeAdmin} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
