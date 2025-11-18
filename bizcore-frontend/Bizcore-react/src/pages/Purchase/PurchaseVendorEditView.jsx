import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseVendorEditView = ({ vendor, closePopup, onVendorUpdated, setVendors }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    gst_number: '',
    pincode: '',
    pan_number: '',
    address: '',
    current_balance: 0,
    total_purchases: 0,
    status: 'active', // Default is 'individual'
  });

  useEffect(() => {
    // Pre-fill the form with the vendor data when it is passed as a prop
    if (vendor) {
      setFormData({
        company_name: vendor.company_name || '',
        contact_person: vendor.contact_person || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        gst_number: vendor.gst_number || '',
        pincode: vendor.pincode || '',
        pan_number: vendor.pan_number || '',
        address: vendor.address || '',
        current_balance: vendor.current_balance || 0,
        total_purchases: vendor.total_purchases || 0,
        status: vendor.status || 'active', // Default is 'individual'
      });
    }
  }, [vendor]);

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
    const updatedVendor = { ...formData };

    axios.put(`http://localhost:8000/api/vendors/${vendor.id}/`, updatedVendor)
      .then((response) => {

        // Optionally, you can update your customers list if needed
        // For example, if you maintain a list of vendors:
        setVendors(prevVendors =>
          prevVendors.map(vendor =>
            vendor.id === response.data.id ? response.data : vendor
          )
        );

        // Call onCustomerUpdated function to update the vendor in the parent component
        onVendorUpdated(response.data);
        console.log('Vendor updated successfully:', response.data);
        closePopup();
      })
      .catch((error) => {
        console.error('There was an error updating the vendor!', error);
      });
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full flex items-center bg-white">
        <h1 className="text-2xl font-semibold text-blue-700 pl-5" style={{ fontFamily: '"Outfit", sans-serif' }}>
          Edit Vendor
        </h1>
      </div>

      {/* Customer Edit Form */}
      <div className="m-4">
        <form className="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
              {/* Left Column: Name, Phone, Email, Address */}
              <div className="flex flex-col">
                <label htmlFor="company_name" className="text-gray-600 text-sm pb-1">Company Name <span className='text-red-400 text-sm '>(Required)</span> </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  className="border border-gray-400 p-2 rounded-sm text-gray-600"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="contact_person" className="text-gray-600 text-sm pb-1">Contact Person <span className='text-red-400 text-sm '>(Required)</span> </label>
                <input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  className="border border-gray-400 p-2 rounded-sm text-gray-600"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Enter contact person name"
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
                <label htmlFor="address" className="text-gray-600 text-sm pb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="border border-gray-400 p-2 rounded-sm text-gray-600"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="status" className="text-gray-600 text-sm pb-1">Status</label>
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

          <div>
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
          <div className='bg-gray-100 rounded-md mt-4'>
            <h1 className="pl-2 pt-1 text-gray-700">Account Details <span className='text-blue-400 text-sm '>(Readonly)</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              <div className="flex flex-col">
                <label htmlFor="current_balance" className="text-gray-600 text-sm pb-1">Current Balance <span className='text-blue-400 text-sm '>*</span></label>
                <input
                  type="number"
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
                <label htmlFor="total_purchases" className="text-gray-600 text-sm pb-1">Total Purchase <span className='text-blue-400 text-md'>*</span></label>
                <input
                  type="number"
                  id="total_purchases"
                  name="total_purchases"
                  className="border border-gray-400 p-2 rounded-sm text-gray-600"
                  value={formData.total_purchases}
                  onChange={handleChange}
                  placeholder="Enter credit earned"
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

export default PurchaseVendorEditView
