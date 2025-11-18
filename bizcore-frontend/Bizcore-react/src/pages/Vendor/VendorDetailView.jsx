import React, { useState, useEffect } from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';
import axios from 'axios';

const VendorDetailView = ({ setActiveSection, vendorId, setVendorData }) => {

  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    if (vendorId) {
      // Fetch vendor data based on ID
      axios.get(`http://localhost:8000/api/vendors/${vendorId}/`)
        .then(response => {
          setVendor(response.data);
          setVendorData(response.data);
        })
        .catch(error => {
          console.error('Error fetching vendor details:', error);
        });
    }
  }, [vendorId, setVendorData]);

  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400">
        <div className='flex items-center'>
          <button
            onClick={() => setActiveSection('vendor-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Vendor Details
          </h1>
        </div>
        <div
          onClick={() => setActiveSection('vendor-edit')}
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
            <label className="text-gray-600 font-medium">Company Name</label>
            <p className="text-gray-800">{vendor.company_name}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Contact Person</label>
            <p className="text-gray-800">{vendor.contact_person}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Phone</label>
            <p className="text-gray-800">{vendor.phone}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Email</label>
            <p className="text-gray-800">{vendor.email}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">PAN Number</label>
            <p className="text-gray-800">{vendor.pan_number}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">GST Number</label>
            <p className="text-gray-800">{vendor.gst_number}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Address</label>
            <p className="text-gray-800">{vendor.address}</p>
          </div>


          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Current Balance</label>
            <p className="text-gray-800">{vendor.current_balance}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Total Purchase</label>
            <p className="text-gray-800">{vendor.total_purchases}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Status</label>
            <p className="text-gray-800">{vendor.status}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Address</label>
            <p className="text-gray-800">{vendor.company_name}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Created at</label>
            <p className="text-gray-800">{vendor.created_at}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Updated at</label>
            <p className="text-gray-800">{vendor.updated_at}</p>
          </div>

        </div>
      </div>
    </div >
  )
}

export default VendorDetailView
