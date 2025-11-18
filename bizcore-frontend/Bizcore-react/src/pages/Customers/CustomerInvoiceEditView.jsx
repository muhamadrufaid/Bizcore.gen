import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerInvoiceEditView = ({ customer, onCustomerUpdated, closePopup, setCustomers }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        billing_address: '',
        city: '',
        pincode: '',
        state: '',
        gst_number: '',
        pan_number: '',
        customer_type: 'individual',
        current_balance: 0,
        credit_earned: 0,
        credit_used_count: 0,
        whole_purchase_amount: 0,
    });

    useEffect(() => {
        // Pre-fill the form with the customer data when it is passed as a prop
        if (customer) {
            setFormData({
                name: customer.name || '',
                phone: customer.phone || '',
                email: customer.email || '',
                billing_address: customer.billing_address || '',
                city: customer.city || '',
                pincode: customer.pincode || '',
                state: customer.state || '',
                gst_number: customer.gst_number || '',
                pan_number: customer.pan_number || '',
                customer_type: customer.customer_type || 'individual',
                current_balance: customer.current_balance || 0,
                credit_earned: customer.credit_earned || 0,
                credit_used_count: customer.credit_used_count || 0,
                whole_purchase_amount: customer.whole_purchase_amount || 0,
            });
        }
    }, [customer]);

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send the updated data to the backend
        const updatedCustomer = { ...formData };

        axios.put(`http://localhost:8000/api/customers/${customer.id}/`, updatedCustomer)
            .then((response) => {

                // Optionally, you can update your customers list if needed
                // For example, if you maintain a list of customers:
                setCustomers(prevCustomers =>
                    prevCustomers.map(customer =>
                        customer.id === response.data.id ? response.data : customer
                    )
                );

                // Call onCustomerUpdated function to update the customer in the parent component
                onCustomerUpdated(response.data);
                console.log('Customer updated successfully:', response.data);
                closePopup();
            })
            .catch((error) => {
                console.error('There was an error updating the customer!', error);
            });
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full flex items-center bg-white">
                <h1 className="text-2xl font-semibold text-blue-700 pl-5" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Edit Customer
                </h1>
            </div>

            {/* Customer Edit Form */}
            <div className="m-4">
                <form className="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="">
                        <h1 className="pl-2 text-gray-700">Personal Info</h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                            {/* Left Column: Name, Phone, Email, Address */}
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-gray-600 text-sm pb-1">Customer Name <span className='text-red-400 text-sm '>(Required)</span> </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter customer name"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phone" className="text-gray-600 text-sm pb-1">Phone <span className='text-red-400 text-sm '>(Required)</span> </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-gray-600 text-sm pb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
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

                    {/* Address Details */}
                    <div>
                        <h1 className="pl-2 pt-1 text-gray-700">Address Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                            <div className="flex flex-col">
                                <label htmlFor="billing_address" className="text-gray-600 text-sm pb-1">Address</label>
                                <input
                                    type="text"
                                    id="billing_address"
                                    name="billing_address"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.billing_address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="city" className="text-gray-600 text-sm pb-1">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pincode" className="text-gray-600 text-sm pb-1">Pincode</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Enter pincode"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="state" className="text-gray-600 text-sm pb-1">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Business Details */}
                    <div>
                        <h1 className="pl-2 pt-1 text-gray-700">Business Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                            <div className="flex flex-col">
                                <label htmlFor="gst_number" className="text-gray-600 text-sm pb-1">GST Number</label>
                                <input
                                    type="text"
                                    id="gst_number"
                                    name="gst_number"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.gst_number}
                                    onChange={handleChange}
                                    placeholder="Enter GST number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pan_number" className="text-gray-600 text-sm pb-1">PAN Number</label>
                                <input
                                    type="text"
                                    id="pan_number"
                                    name="pan_number"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.pan_number}
                                    onChange={handleChange}
                                    placeholder="Enter PAN number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className='bg-gray-100 rounded-md'>
                        <h1 className="pl-2 pt-1 text-gray-700">Account Details <span className='text-blue-400 text-sm '>(Readonly)</span></h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                            <div className="flex flex-col">
                                <label htmlFor="current_balance" className="text-gray-600 text-sm pb-1">Current Balance <span className='text-blue-400 text-sm '>*</span></label>
                                <input
                                    type="text"
                                    id="current_balance"
                                    name="current_balance"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.current_balance}
                                    onChange={handleChange}
                                    placeholder="Enter current balance"
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="credit_earned" className="text-gray-600 text-sm pb-1">Credit Earned <span className='text-blue-400 text-md'>*</span></label>
                                <input
                                    type="text"
                                    name="credit_earned"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.credit_earned}
                                    onChange={handleChange}
                                    placeholder="Enter credit earned"
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="credit_used_count" className="text-gray-600 text-sm pb-1">Credit Used Count <span className='text-blue-400 text-md '>*</span></label>
                                <input
                                    type="text"
                                    name="credit_used_count"
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    value={formData.credit_used_count}
                                    onChange={handleChange}
                                    placeholder="Enter credit used count"
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="whole_purchase_amount" className="text-gray-600 text-sm pb-1">Whole Purchase Total <span className='text-blue-400 text-md '>*</span></label>
                                <input
                                    type="text"
                                    name="whole_purchase_amount"
                                    value={formData.whole_purchase_amount}
                                    onChange={handleChange}
                                    className="border border-gray-400 p-2 rounded-sm text-gray-600"
                                    placeholder="Enter total purchase amount"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerInvoiceEditView;
