import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';

const StaffAddView = ({ setActiveSection }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        dob: '',
        maritalStatus: '',
        address: '',
        identificationNumber: '',
        education: '',
        role: '',
        salary: '',
        salaryDate: '',
        salaryType: '',
        advance: '',
        advanceDate: '',
        joinedDate: '',
        totalSalaryPaid: '',
        bonus: '',
        upiId: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        agreementValidity: '',
        status: 'Active', // Default to Active
    });

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between j p-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('staff-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        New Staff
                    </h1>
                </div>
                <div className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <Save className='w-5 h-5' />
                    <button className=''>
                        Save Staff
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md m-4 pb-10">
                <form>
                    {/* Form Fields */}
                    <div>
                        <h1 className='font-semibold text-lg  text-blue-600'>Personal Details</h1>
                    </div>
                    <div className='flex flex-col gap-8'>
                        <div className="flex gap-4 ">
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Name</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter Name'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Phone</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter Phone'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Email</label>
                                <input
                                    type="emial"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter email'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Date of Birth</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter date of birth'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Gender</label>
                                <select
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">female</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 ">
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Address</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter address'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">ID Number</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter id Number'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Marital Status</label>
                                <select
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                >
                                    <option value="married">Married</option>
                                    <option value="unmarried">UnMarried</option>
                                </select>
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Education</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter latest education'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Role</label>
                                <select
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                >
                                    <option value="Cashier">Cashier</option>
                                    <option value="Accountant">Accountant</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='pt-2'>
                        <h1 className='font-semibold text-lg text-red-400'>Bussiness Details</h1>
                    </div>
                    <div className='flex flex-col gap-8'>
                        <div className="flex gap-4 ">
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Salary</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter salary'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Salary Date</label>
                                <input
                                    type="date"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter salary date'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Advance</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter advance amount'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Advance Date</label>
                                <input
                                    type="date"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter advance date'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Bonus</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter bonus'
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 ">
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">PF Number</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter address'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Salary Type</label>
                                <select
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="daily">Daily</option>
                                </select>
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Total Salary Paid</label>
                                <input
                                    type="text"
                                    className="p-2 border border-gray-400 rounded-sm"
                                    placeholder='Enter  salary paid'
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Status</label>
                                <select
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex w-full flex-col">
                                <label className="text-gray-600 text-sm font-semibold">Joined Date</label>
                                <input
                                    type="date"
                                    className="p-2 border border-gray-400 rounded-sm"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffAddView;
