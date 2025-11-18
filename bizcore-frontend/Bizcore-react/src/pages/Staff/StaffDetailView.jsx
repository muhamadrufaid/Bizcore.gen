import React from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';

const StaffDetailView = ({ setActiveSection }) => {
    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('staff-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Staff Detail
                    </h1>
                </div>
                <div
                    onClick={() => setActiveSection('staff-edit')}
                    className='flex items-center justify-center bg-blue-500 w-30  h-8 rounded-md hover:bg-blue-700 p-5'>
                    <button
                        className="flex gap-2 text-white"><SquarePen />
                        <label className='text-white'>Edit </label>
                    </button>
                </div>

            </div>
            <div className="bg-white p-6 rounded-lg shadow-md m-4">

                {/* Product Details */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Name</label>
                        <p className="text-gray-800">Suraj</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Phone</label>
                        <p className="text-gray-800">XXXXXXX</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Email</label>
                        <p className="text-gray-800">suraj@gmail.com</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Date of Birth</label>
                        <p className="text-gray-800">DD-MM-YYYY</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Marital Status</label>
                        <p className="text-gray-800">Unmarried</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Address</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Identification Number</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Education</label>
                        <p className="text-gray-800">B.com</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Role</label>
                        <p className="text-gray-800">Cashier</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">salary</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Salary Date</label>
                        <p className="text-gray-800">XXXXX</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Salary Type</label>
                        <p className="text-gray-800">Monthly</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Advance </label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Advance Date</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Joined Date</label>
                        <p className="text-gray-800">DD-MM-YYYY</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Total Salary Paid</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Bonus</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">UPI ID</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Bank Name</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Account Number</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">IFSC Code</label>
                        <p className="text-gray-800">XXXX</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Agreement Validity</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Status</label>
                        <p className="text-gray-800">Active</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Created at</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Updated at</label>
                        <p className="text-gray-800">None</p>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default StaffDetailView
