import React, { useState } from 'react';
import { PackagePlus, Funnel, Search, SquarePen, Trash2, Ellipsis, CirclePlus } from 'lucide-react';


const StaffPaymentView = ({ setActiveSection }) => {
    const [showActions, setShowActions] = useState({}); // To keep track of which product's actions are visible
    const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion

    const data = [
        { id: 1, staff: 'Simon', salary: 'None', amount_paid: 'None', payment_mode: 'None', payment_for: 'None', status: 'paid', payment_date: 'None' },
    ];

    const handleDelete = (id) => {
        setSelectedItem(id);  // Set the selected item to delete
        setShowModal(true);    // Show the confirmation modal
    }

    const confirmDelete = () => {
        // Handle deletion logic
        console.log(`Deleted staffpayment with ID: ${selectedItem}`);
        setShowModal(false); // Close the modal after confirmation
    }

    const handleRowClick = (id) => {
        // Navigate to customer detail view
        setActiveSection('staffpayment-detail');  // You should have a section for customer details
        console.log(`Show details for staffpayment with ID: ${id}`);
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
                <h1 style={{
                    fontFamily: '"Outfit", sans-serif',  // Apply Google font
                    fontWeight: 600,                    // Apply bold weight
                    fontOpticalSizing: 'auto',           // Apply optical sizing
                }}
                    className='text-blue-700 text-2xl p-2'>Staff Payment Details</h1>
                <div className='flex pr-2 gap-2'>
                    <div className='flex justify-between bg-blue-700 w-80 rounded-md p-0.5 pl-1'>
                        <div style={{ background: 'rgba(241,246,250,255)' }} className="flex rounded-lg w-76 pl-2">
                            {/* Search Bar */}
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-lg focus:outline-none"
                            />
                            <button className='flex items-center pl-3 bg-blue-700'>
                                <Search className='text-white' />
                            </button>
                        </div>
                    </div>
                    <button className='flex justify-center items-center p-4 h-10 bg-blue-700 border-none rounded-md hover:bg-blue-500'>
                        <Funnel className='text-white' />
                        {/* <h2 className='text-white'>Filter</h2> */}
                    </button>
                    <button
                        onClick={() => setActiveSection('staffpayment-add')}
                        className='flex items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
                        <CirclePlus
                            className='text-white' />
                    </button>
                </div>
            </div>

            <div className='flex justify-between items-center'>
                <div className="flex items-center mt-2 gap-4 p-4">
                    <button
                        className='p-2 w-24 rounded-full text-white hover:bg-blue-600 bg-gray-200'
                    >
                        All
                    </button>
                    <button
                        className='p-2 w-24 rounded-full text-white hover:bg-cyan-600 bg-gray-200'

                    >
                        Draft
                    </button>
                    <button
                        className='p-2 w-24 rounded-full text-white hover:bg-green-600 bg-gray-200'
                    >
                        Active
                    </button>
                </div>
            </div>
            <div className='m-2 bg-white overflow-x-auto max-h-120 custom-scrollbar rounded-xl pb-5 custom-shadow-black'>
                <table className="bg-white w-full table-auto border-collapse rounded-lg">
                    <thead className="sticky top-0 bg-white  border-b border-gray-400 text-sm text-gray-600 rounded-xl">
                        <tr>
                            <th className="p-3 text-center">SI.No</th>
                            <th className="p-3 text-center">Staff</th>
                            <th className="p-3 text-center">Salary</th>
                            <th className="p-3 text-center">Payment Mode</th>
                            <th className="p-3 text-center">Payment For</th>
                            <th className="p-3 text-center">Amount Paid</th>
                            <th className="p-3 text-center">Payment Date</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}
                                onClick={() => handleRowClick(item.id)}
                                className="hover:bg-gray-100 transition-all duration-300 border-b border-gray-400 text-gray-700">
                                <td className="p-3 text-center">{item.id}</td>
                                <td className="p-3 text-center">{item.staff}</td>
                                <td className="p-3 text-center">{item.salary}</td>
                                <td className="p-3 text-center">{item.payment_mode}</td>
                                <td className="p-3 text-center">{item.payment_for}</td>
                                <td className="p-3 text-center">{item.amount_paid}</td>
                                <td className="p-3 text-center">{item.payment_date}</td>
                                <td className="p-3 text-center">{item.status}</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}  // Stop row click propagation
                                        className="text-red-400 hover:text-red-600">
                                        <Trash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Confirmation Modal for Deletion */}
            {showModal && (
                <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
                        <h2 className="text-xl font-semibold text-gray-700">Are you sure you want to delete this staff payment?</h2>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}  // Close modal
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StaffPaymentView
