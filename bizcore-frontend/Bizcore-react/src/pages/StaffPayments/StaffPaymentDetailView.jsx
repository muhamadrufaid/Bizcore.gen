import React from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';

const StaffPaymentDetailView = ({ setActiveSection }) => {
    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('staffpayment-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Staff Payment Detail
                    </h1>
                </div>
                <div
                    onClick={() => setActiveSection('staffpayment-edit')}
                    className='flex items-center justify-center bg-blue-500 w-30  h-8 rounded-md hover:bg-blue-700 p-5'>
                    <button
                        className="flex gap-2 text-white"><SquarePen />
                        <label className='text-white'>Edit </label>
                    </button>
                </div>

            </div>
            <div className="bg-white p-6 rounded-lg shadow-md m-4">

                {/* Product Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Staff</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Salary</label>
                        <p className="text-gray-800">None</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Payment Mode</label>
                        <p className="text-gray-800">None</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Payment For</label>
                        <p className="text-gray-800">None</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Amount Paid</label>
                        <p className="text-gray-800">None</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Payment Date</label>
                        <p className="text-gray-800">None</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Remarks</label>
                        <p className="text-gray-800">None</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Status</label>
                        <p className="text-gray-800">Paid</p>
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

export default StaffPaymentDetailView
