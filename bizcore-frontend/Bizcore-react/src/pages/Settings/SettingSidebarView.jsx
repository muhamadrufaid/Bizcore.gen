import React, { useState } from 'react';
import { ChevronDown, BanknoteArrowUp, ChartPie, UserRound, Landmark, Handshake } from 'lucide-react';

const SettingSidebarView = ({ setActiveSection }) => {
    const [isStaffAccountOpen, setIsStaffAccountOpen] = useState(false); // State for toggling the dropdown

    const toggleStaffAccount = () => {
        setIsStaffAccountOpen(!isStaffAccountOpen); // Toggle the visibility of Add and Edit buttons
    };

    const [isBussinessProfileOpen, setIsBussinessProfileOpen] = useState(false); // State for toggling the dropdown

    const toggleBussinessProfile = () => {
        setIsBussinessProfileOpen(!isBussinessProfileOpen); // Toggle the visibility of Add and Edit buttons
    };

    const [isShareOptionsOpen, setIsShareOptionsOpen] = useState(false); // State for toggling the dropdown

    const toggleShareOptions = () => {
        setIsShareOptionsOpen(!isShareOptionsOpen); // Toggle the visibility of Add and Edit buttons
    };

    const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false); // State for toggling the dropdown

    const toggleBankDetails = () => {
        setIsBankDetailsOpen(!isBankDetailsOpen); // Toggle the visibility of Add and Edit buttons
    };

    return (
        <div className='w-46 max-h-[calc(99vh-6vh)] overflow-y-auto custom-scrollbar-sidebar'>
            <div className='flex items-center custom-bottom-shadow p-1'>
                <h1
                    style={{
                        fontFamily: '"Zain", sans-serif',
                        fontWeight: 800,
                        fontOpticalSizing: 'auto',
                        fontStyle: 'normal',
                    }}
                    className='text-white text-md ml-1 '
                >Settings</h1>
            </div>
            <hr className='text-white w-full' />

            <div className='flex flex-col'>

                {/* Other buttons */}
                <button
                    onClick={toggleBussinessProfile} // Toggle the visibility of the sub-buttons
                    className="flex items-center justify-between space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full">
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'>
                        Bussiness Info
                    </h1>
                    <ChevronDown />
                </button>

                {/* Additional buttons under Staff Account */}
                {isBussinessProfileOpen && (
                    <div className="flex flex-col text-sm bg-blue-900">
                        <button
                            onClick={() => setActiveSection("bussiness-profile")}
                            className="flex items-center gap-2 p-3 text-white hover:bg-gray-400 w-full">
                            <Handshake /> Profile
                        </button>

                    </div>
                )}

                <button
                    onClick={toggleShareOptions}
                    className="flex items-center justify-between space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full">
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'>
                       Bank Info
                    </h1>
                    <ChevronDown />
                </button>

                {/* Additional buttons under Staff Account */}
                {isShareOptionsOpen && (
                    <div className="flex flex-col text-sm bg-blue-900">
                        <button
                            onClick={() => setActiveSection("bank-view")}
                            className="flex items-center gap-2 p-3 text-white p-2 hover:bg-gray-400 w-full">
                            <Landmark /> Bank Details
                        </button>
                    </div>
                )}           
            </div>
        </div>
    );
};

export default SettingSidebarView;
