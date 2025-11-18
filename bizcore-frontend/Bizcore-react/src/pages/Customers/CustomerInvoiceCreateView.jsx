import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const CustomerInvoiceCreateView = ({ onCustomerCreated, phone }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: phone || '',
        email: '',
        billing_address: '',
        city: '',
        pincode: '',
        state: '',
        gst_number: '',
        pan_number: '',
        customer_type: 'individual', // Default is 'individual'
    });

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission to create a new customer
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send POST request to your API to create a new customer
        axios.post('http://localhost:8000/api/customers/', formData)
            .then((response) => {
                // Pass the created customer data back to the parent component
                onCustomerCreated(response.data);
            })
            .catch((error) => {
                console.error('Error creating customer:', error);
            });
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full flex items-center bg-white">
                <h1 className="text-2xl pl-5 font-semibold text-blue-700" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Create New Customer
                </h1>
            </div>

            {/* Customer Add Form */}
            <div className='m-4'>
                <form className="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Name, Phone, Email, Address */}
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-gray-600 pb-1 text-sm">Customer Name <span className='text-red-400 text-sm '>(Required)</span> </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter customer name"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phone" className="text-gray-600 pb-1 text-sm">Phone <span className='text-red-400 text-sm'>(Required)</span></label>
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

                            <div className="flex flex-col">
                                <label htmlFor="customer_type" className="text-gray-600 pb-1 text-sm">Customer Type</label>
                                <select
                                    id="customer_type"
                                    name="customer_type"
                                    value={formData.customer_type}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                >
                                    <option value="individual">Individual</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column: City, Pincode, State, GST Number, PAN Number */}
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="billing_address" className="text-gray-600 pb-1 text-sm">Address</label>
                                <input
                                    type="text"
                                    id="billing_address"
                                    name="billing_address"
                                    value={formData.billing_address}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter address"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="city" className="text-gray-600 pb-1 text-sm">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pincode" className="text-gray-600 pb-1 text-sm">Pincode</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter pincode"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="state" className="text-gray-600 pb-1 text-sm">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Fields: GST Number, PAN Number */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 mt-4'>
                        <div className="flex flex-col">
                            <label htmlFor="gst_number" className="text-gray-600 pb-1 text-sm">GST Number</label>
                            <input
                                type="text"
                                id="gst_number"
                                name="gst_number"
                                value={formData.gst_number}
                                onChange={handleChange}
                                className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                placeholder="Enter GST number"
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
                                placeholder="Enter PAN number"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                        >
                            Save Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerInvoiceCreateView;
