import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const PurchaseVendorCreateView = ({ onVendorCreated, phone }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        phone: phone || '',
        email: '',
        gst_number: '',
        pan_number: '',
        address: '',
        current_balance: 0,
        total_purchases: 0,
        status: 'active', // Default is 'individual'
    });

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Ensure proper number formatting for fields like current_balance and total_purchases
        if (name === 'current_balance' || name === 'total_purchases') {
            // Convert to a number before setting state
            setFormData((prevData) => ({
                ...prevData,
                [name]: parseFloat(value) || 0, // If invalid number, set to 0
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Handle form submission to create a new vendor
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send POST request to your API to create a new vendor
        axios.post('http://localhost:8000/api/vendors/', formData)
            .then((response) => {
                // Pass the created vendor data back to the parent component
                onVendorCreated(response.data);
            })
            .catch((error) => {
                // Log error response for debugging
                console.error('Error creating vendor:', error.response?.data || error.message);
                alert('Error creating vendor: ' + (error.response?.data || error.message));
            });
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full flex items-center bg-white">
                <h1 className="text-2xl pl-5 font-semibold text-blue-700" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Create New Vendor
                </h1>
            </div>

            {/* Customer Add Form */}
            <div className='m-4'>
                <form className="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Name, Phone, Email, Address */}
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="company_name" className="text-gray-600 pb-1 text-sm">Company Name<span className='text-red-400 text-sm '>(Required)</span> </label>
                                <input
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="contact_person" className="text-gray-600 pb-1 text-sm">Contact Person<span className='text-red-400 text-sm '>(Required)</span> </label>
                                <input
                                    type="text"
                                    id="contact_person"
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter contact person name"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phone" className="text-gray-600 pb-1 text-sm">Phone<span className='text-red-400 text-sm'>(Required)</span></label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-gray-600 pb-1 text-sm">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>

                        {/* Right Column: City, Pincode, State, GST Number, PAN Number */}
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="gst_number" className="text-gray-600 pb-1 text-sm">GST Number</label>
                                <input
                                    type="text"
                                    id="gst_number"
                                    name="gst_number"
                                    value={formData.gst_number}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter Gst Number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pan_number" className="text-gray-600 pb-1 text-sm">PAN Number</label>
                                <input
                                    type="text"
                                    id="pan_number"
                                    name="pan_number"
                                    value={formData.pan_number}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter Pan Number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="current_balance" className="text-gray-600 pb-1 text-sm">Current Balance</label>
                                <input
                                    type="number"
                                    id="current_balance"
                                    name="current_balance"
                                    value={formData.current_balance}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter Curent Balance"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="total_purchases" className="text-gray-600 pb-1 text-sm">Total Purchase</label>
                                <input
                                    type="number"
                                    id="total_purchases"
                                    name="total_purchases"
                                    value={formData.total_purchases}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter Total Purchase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Fields: GST Number, PAN Number */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 mt-4'>
                        <div className="flex flex-col">
                            <label htmlFor="address" className="text-gray-600 pb-1 text-sm">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                placeholder="Enter Address"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                        >
                            Save Vendor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchaseVendorCreateView;
