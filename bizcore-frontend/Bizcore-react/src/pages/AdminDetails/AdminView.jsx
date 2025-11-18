import React, { useState, useEffect, useRef } from 'react';
import { Pencil, User } from 'lucide-react';
import AdminProfileView from './AdminProfileView';

const AdminView = ({ setActiveSection, closeAdmin }) => {

    const handleAdminAddClick = () => {
        setActiveSection('admin-profile'); // Set the active section to 'admin-add'
        closeAdmin(); // Trigger closeAdmin to close the current admin view
    };

    return (
        <div className="p-2">
            <div
                onClick={handleAdminAddClick}
                className="flex items-center p-1 rounded-lg gap-3 hover:bg-gray-100">
                <div className="flex justify-center text-white items-center w-16 h-16 rounded-full bg-blue-200" >
                    <User className='h-8 w-8' />
                </div>
                <div className="flex flex-col">
                    <div className="flex">
                        <h1 className="font-semibold text-lg">John Bosco</h1>

                        <button
                            className="pl-3" >
                            <Pencil className="w-4 h-5" />
                        </button>
                    </div>
                    <p className="text-sm font-semibold">johnbosco@gmail.com</p>

                </div>
            </div>
        </div>

    );
};

export default AdminView;
