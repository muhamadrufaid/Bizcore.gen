import React from 'react';

const InvoiceCustomerView = ({ selectedCustomer, closePopup }) => {
    return (
        <div className="flex flex-col">
            <div className="bg-white p-6 rounded-lg m-4">
                <div className="flex flex-col">
                    <h1 className="text-blue-400 text-lg pb-4 font-semibold">Selected Customer Details</h1>
                </div>

                {/* Basic Customer Details */}
                <div className="pt-2 pb-2">
                    <h1 className="font-semibold underline">Basic Details</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Customer Name</label>
                        <p className="text-gray-800">{selectedCustomer.name}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Phone</label>
                        <p className="text-gray-800">{selectedCustomer.phone}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Email</label>
                        <p className="text-gray-800">{selectedCustomer.email}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Customer Type</label>
                        <p className="text-gray-800">{selectedCustomer.customer_type}</p>
                    </div>
                </div>

                {/* Address Details */}
                <div className="pt-2 pb-2">
                    <h1 className="font-semibold underline">Address Details</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Address</label>
                        <p className="text-gray-800">{selectedCustomer.billing_address}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">City</label>
                        <p className="text-gray-800">{selectedCustomer.city}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">State</label>
                        <p className="text-gray-800">{selectedCustomer.state}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Pincode</label>
                        <p className="text-gray-800">{selectedCustomer.pincode}</p>
                    </div>
                </div>
                <div className='pt-2 pb-2'>
                    <h1 className='font-semibold underline'>Account Details</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Credit Earned</label>
                        <p className="text-gray-800">{selectedCustomer.credit_earned}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Credit Used Count</label>
                        <p className="text-gray-800">{selectedCustomer.credit_used_count}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Current Balance</label>
                        <p className="text-gray-800">{selectedCustomer.current_balance}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">Purchase Total</label>
                        <p className="text-gray-800">{selectedCustomer.whole_total_purchase_amount}</p>
                    </div>
                </div>

                {/* Business Details */}
                <div className="pt-2 pb-2">
                    <h1 className="font-semibold underline">Business Details</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">GST Number</label>
                        <p className="text-gray-800">{selectedCustomer.gst_number}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-800 font-medium">PAN Number</label>
                        <p className="text-gray-800">{selectedCustomer.pan_number}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceCustomerView;
