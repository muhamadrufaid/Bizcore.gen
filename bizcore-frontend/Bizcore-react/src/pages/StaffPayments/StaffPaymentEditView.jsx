import React from 'react'
import { ChevronLeft, SaveAll } from 'lucide-react';

const StaffPaymentEditView = ({ setActiveSection }) => {
    const statusOptions = ['Paid', 'Unpaid'];
    const paymentOptions = ['Salary', 'Bonus', 'Advance'];
    const paymentModeOptions = ['Cash', 'Card', 'UPI', 'Bank', 'Credit', 'Wallet', 'Hybrid'];

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center pr-2 justify-between bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('staffpayment-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Edit Staff Payment
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
                <form>
                    <div className="grid grid-cols-2 md:grid-cols-3 sm:grid-cols-1 gap-4 ">
                        <div className="flex flex-col">
                            <label className="text-gray-700">Staff</label>
                            <input
                                className="border p-2 rounded-sm border-gray-500"
                                placeholder="Enter staff name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700">Salary</label>
                            <input
                                className="border p-2 rounded-sm border-gray-500"
                                placeholder="Enter salary"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700">Bonus</label>
                            <input
                                className="border p-2 rounded-sm border-gray-500"
                                placeholder="Enter bonus"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700">Advance</label>
                            <input
                                className="border p-2 rounded-sm border-gray-500"
                                placeholder="Enter advance"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700">Payment Mode</label>
                            <select
                                className="border p-2 rounded-sm border-gray-500"
                            >
                                <option value="">Select Payment Mode</option>
                                {paymentModeOptions.map((mode, i) => (
                                    <option key={i} value={mode}>{mode}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700">Payment For</label>
                            <select
                                className="border p-2 rounded-sm border-gray-500"
                            >
                                <option value="">Select Payment For</option>
                                {paymentOptions.map((payment, i) => (
                                    <option key={i} value={payment}>{payment}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700">Payment Date</label>
                            <input
                                type='date'
                                className="border p-2 rounded-sm border-gray-500"
                                placeholder="Enter payment date"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700">Remarks</label>
                            <input
                                className="border p-2 rounded-sm border-gray-500"
                                placeholder="Enter remarks"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700">Status</label>
                            <select
                                name="status"

                                className="border p-2 rounded-sm border-gray-500"
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map((status, i) => (
                                    <option key={i} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='flex justify-end pt-4'>
                        <div className="flex flex-col w-96">
                            <label className="text-gray-700">Amount Paid</label>
                            <input
                                className="border p-2 rounded-sm border-gray-500"
                                placeholder="Enter amount paid"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StaffPaymentEditView
