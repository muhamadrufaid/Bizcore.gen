import React from 'react'
import { ChevronLeft, Save } from 'lucide-react';

const StaffPaymentAddView = ({ setActiveSection }) => {
    const statusOptions = ['Salary', 'Bonus', 'Advance'];
    const paymentModeOptions = ['Cash', 'Card', 'UPI', 'Bank', 'Credit', 'Wallet', 'Hybrid'];
    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
                <div className='flex items-center '>
                    <button
                        onClick={() => setActiveSection('staffpayment-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        New Staff Payment
                    </h1>
                </div>
                <div className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <Save className='w-5 h-5' />
                    <button className=''>
                        Save Payment
                    </button>
                </div>
            </div>

            <div className='m-4 bg-white p-2 rounded-md'>
                <div className='flex justify-between p-3'>
                    <div className='flex flex-col gap-2'>
                        <div className="flex items-center bg-gray-100 p-2 rounded-sm gap-4">
                            <label className="text-gray-700 font-semibold">Select Staff</label>
                            <input
                                type="text"
                                className="border p-1 w-60 rounded-sm border-gray-500 "
                                placeholder="Enter name"
                            />
                        </div>
                        <div className="flex gap-4 pl-2">
                            <label className="text-gray-700 font-semibold">Salary</label>
                            <p className=''>None</p>
                        </div>
                        <div className="flex gap-4 pl-2">
                            <label className="text-gray-700 font-semibold">Advance</label>
                            <p className=''>None</p>
                        </div>
                        <div className="flex gap-4 pl-2">
                            <label className="text-gray-700 font-semibold">Bonus</label>
                            <p className=''>None</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-4">
                            <label className="text-gray-700 font-semibold">Payment Date</label>
                            <p className=''>none</p>
                        </div>
                    </div>
                </div>
                <div className='flex gap-10 p-4 bg-gray-100 mb-2 rounded-sm'>
                    <div className='flex flex-col gap-1'>
                        <label className="text-gray-700 text-sm font-semibold">Payment Mode</label>
                        <select
                            name="status"
                            className="border p-1 w-60 border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100">
                            <option value="" >Select Payment Mode</option>
                            {paymentModeOptions.map((mode, i) => (
                                <option className='' key={i} value={mode}>{mode}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className="text-gray-700 text-sm font-semibold">Payment For</label>

                        <select
                            name="status"
                            className="border p-1 w-60 border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100">
                            <option value="" >Select Payment Status</option>
                            {statusOptions.map((status, i) => (
                                <option className='' key={i} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 text-sm font-semibold">Remarks </label>
                        <input
                            type="text"
                            className="border p-1 w-60 border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                            placeholder='Enter remarks'
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 items-end p-2'>

                    <div className="flex items-center">
                        <label className="text-gray-700 text-sm font-semibold pr-2">Amount Paid :</label>
                        <input
                            type="text"
                            className="border p-1 pr-2 rounded-sm border-gray-400 text-right"
                            placeholder='0.00'
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default StaffPaymentAddView
