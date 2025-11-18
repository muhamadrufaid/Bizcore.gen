import React, { useState, useEffect } from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';
import axios from 'axios';

const CustomerDetailView = ({ setActiveSection, customerId, setCustomerData }) => {

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (customerId) {
      // Fetch customer data based on ID
      axios.get(`http://localhost:8000/api/customers/${customerId}/`)
        .then(response => {
          setCustomer(response.data);  // Set the customer data
          setCustomerData(response.data);  // Pass the customer data to parent for editing
        })
        .catch(error => {
          console.error('Error fetching customer details:', error);
        });
    }
  }, [customerId, setCustomerData]);

  if (!customer) {
    return <div>Loading...</div>; // Show loading until customer data is fetched
  }

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400">
        <div className='flex items-center'>
          <button
            onClick={() => setActiveSection('customer-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Customer Profile
          </h1>
        </div>

        <div
          onClick={() => setActiveSection('customer-edit')}
          className='flex items-center justify-center bg-blue-500 w-30 h-8 rounded-md hover:bg-blue-700 p-5'>
          <button
            className="flex gap-2 text-white"><SquarePen />
            <label className='text-white'>Edit </label>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md m-4">
        {/* Product Details */}
        <div className='pt-2 pb-2'>
          <h1 className='font-semibold'>Basic Details</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Customer Name</label>
            <p className="text-gray-800">{customer.name}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Phone</label>
            <p className="text-gray-800">{customer.phone}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Email</label>
            <p className="text-gray-800">{customer.email || "none"}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Customer Type</label>
            <p className="text-gray-800">{customer.customer_type}</p>
          </div>
        </div>

        <div className='pt-2 pb-2'>
          <h1 className='font-semibold'>Address Details</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Address</label>
            <p className="text-gray-800">{customer.billing_address || "none"}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">City</label>
            <p className="text-gray-800">{customer.city || "none"}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">State</label>
            <p className="text-gray-800">{customer.state || "none"}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Pincode</label>
            <p className="text-gray-800">{customer.pincode || "none"}</p>
          </div>
        </div>

        <div className='pt-2 pb-2'>
          <h1 className='font-semibold'>Account Details</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Credit Earned</label>
            <p className="text-gray-800">{customer.credit_earned}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Credit Used Count</label>
            <p className="text-gray-800">{customer.credit_used_count}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Current Balance</label>
            <p className="text-gray-800">{customer.current_balance}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Purchase Total</label>
            <p className="text-gray-800">{customer.whole_total_purchase_amount}</p>
          </div>
        </div>
        <div className='pt-2 pb-2'>
          <h1 className='font-semibold'>Bussiness Details</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">GST Number</label>
            <p className="text-gray-800">{customer.gst_number || "none"}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">PAN Number</label>
            <p className="text-gray-800">{customer.pan_number || "none"}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-medium">Status</label>
            <p className="text-gray-800">{customer.status || "none"}</p>
          </div>

        </div>
        <div className='flex justify-end p-4'>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailView;
