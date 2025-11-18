import React, { useState, useEffect } from 'react';
import { ChevronLeft, SaveAll } from 'lucide-react';
import axios from 'axios';

const CustomerEditView = ({ setActiveSection, customerData }) => {

    const [formData, setFormData] = useState({
        name: customerData?.name || '',
        phone: customerData?.phone || '',
        email: customerData?.email || '',
        billing_address: customerData?.billing_address || '',
        city: customerData?.city || '',
        pincode: customerData?.pincode || '',
        state: customerData?.state || '',
        gst_number: customerData?.gst_number || '',
        pan_number: customerData?.pan_number || '',
        customer_type: customerData?.customer_type || 'individual',
        status: customerData?.status || 'active',
        current_balance: customerData?.current_balance || '',
        credit_earned: customerData?.credit_earned || '',
        credit_used_count: customerData?.credit_used_count || '',
        whole_total_purchase_amount: customerData?.whole_total_purchase_amount || '',
    });

    useEffect(() => {
        if (customerData) {
            setFormData({
                name: customerData.name || '',
                phone: customerData.phone || '',
                email: customerData.email || '',
                billing_address: customerData.billing_address || '',
                city: customerData.city || '',
                pincode: customerData.pincode || '',
                state: customerData.state || '',
                gst_number: customerData.gst_number || '',
                pan_number: customerData.pan_number || '',
                customer_type: customerData.customer_type || 'individual',
                status: customerData?.status || 'active',
                current_balance: customerData.current_balance || 0,
                credit_earned: customerData.credit_earned || 0,
                credit_used_count: customerData.credit_used_count || 0.00,
                whole_total_purchase_amount: customerData.whole_total_purchase_amount || '',
            });
        }
    }, [customerData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData); // Log the entire form data

        axios.put(`http://localhost:8000/api/customers/${customerData.id}/`, formData)
            .then(response => {
                console.log("Customer updated successfully", response.data);
                setActiveSection('customer-view');
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error updating customer:', error.response.data);
                    alert(`Error: ${error.response.data}`);
                }
            });
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('customer-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Edit Customer
                    </h1>
                </div>
                <div
                    onClick={handleSubmit}
                    className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <SaveAll className='w-5 h-5' />
                    <button type="submit">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Customer Edit Form */}
            <div className='m-4'>
                <form className="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                    {/* Personal Info Section */}
                    <div>
                        <h1 className='pl-2 text-gray-700'>Personal Info</h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-gray-600 text-sm pb-1">Customer Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter customer name"
                                />
                            </div>


                            <div className="flex flex-col">
                                <label htmlFor="phone" className="text-gray-600 text-sm pb-1">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-gray-600 text-sm pb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="customer_type" className="text-gray-600 text-sm pb-1">Customer Type</label>
                                <select
                                    id="customer_type"
                                    name="customer_type"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.customer_type}
                                    onChange={handleChange}
                                >
                                    <option value="individual">Individual</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Address Details Section */}
                    <div>
                        <h1 className='pl-2 pt-1 text-gray-700'>Address Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                            <div className="flex flex-col">
                                <label htmlFor="address" className="text-gray-600 text-sm pb-1">Address</label>
                                <input
                                    type="text"
                                    id="billing_address"
                                    name="billing_address"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter address"
                                    value={formData.billing_address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="city" className="text-gray-600 text-sm pb-1">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pincode" className="text-gray-600 text-sm pb-1">Pincode</label>
                                <input
                                    type="number"
                                    id="pincode"
                                    name="pincode"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="state" className="text-gray-600 text-sm pb-1">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Details Section */}
                    <div>
                        <h1 className='pl-2 pt-1 text-gray-700'>Account Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                            <div className="flex flex-col">
                                <label htmlFor="current_balance" className="text-gray-600 text-sm pb-1">Current Balance <span className='text-sm text-blue-700'>(Read only)</span></label>
                                <input
                                    type="text"
                                    id="current_balance"
                                    name="current_balance"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter current balance"
                                    value={formData.current_balance}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="credit_earned" className="text-gray-600 text-sm pb-1">Credit Earned <span className='text-sm text-blue-700'>(Read only)</span></label>
                                <input
                                    type="text"
                                    name="credit_earned"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter credit earned"
                                    value={formData.credit_earned}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="credit_used_count" className="text-gray-600 text-sm pb-1">Credit Used Count <span className='text-sm text-blue-700'>(Read only)</span></label>
                                <input
                                    type="text"
                                    name="credit_used_count"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter credit used count"
                                    value={formData.credit_used_count}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="whole_purchase_amount" className="text-gray-600 text-sm pb-1">Whole Purchase Total <span className='text-sm text-blue-700'>(Read only)</span></label>
                                <input
                                    type="text"
                                    name="whole_total_purchase_amount"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter total purchase amount"
                                    value={formData.whole_total_purchase_amount}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Details Section */}
                    <div>
                        <h1 className='pl-2 pt-1 text-gray-700'>Business Details</h1>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-2'>
                            <div className="flex flex-col">
                                <label htmlFor="gst_number" className="text-gray-600 text-sm pb-1">GST Number</label>
                                <input
                                    type="text"
                                    id="gst_number"
                                    name="gst_number"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter GST number"
                                    value={formData.gst_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pan_number" className="text-gray-600 text-sm pb-1">PAN Number</label>
                                <input
                                    type="text"
                                    id="pan_number"
                                    name="pan_number"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter PAN number"
                                    value={formData.pan_number}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="customer_type" className="text-gray-600 text-sm pb-1">Customer Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerEditView;
