import React, { useState, useEffect } from 'react';
import { ChevronLeft, SaveAll } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const VendorEditView = ({ setActiveSection, vendorData }) => {

  const [formData, setFormData] = useState({
    company_name: vendorData?.company_name || '',
    contact_person: vendorData?.contact_person || '',
    phone: vendorData?.phone || '',
    email: vendorData?.email || '',
    address: vendorData?.address || '',
    gst_number: vendorData?.gst_number || '',
    pan_number: vendorData?.pan_number || '',
    current_balance: vendorData?.current_balance || '',
    total_purchases: vendorData?.total_purchases || '',
    status: vendorData?.status || 'active',
  });

  useEffect(() => {
    if (vendorData) {
      setFormData({
        company_name: vendorData?.company_name || '',
        contact_person: vendorData?.contact_person || '',
        phone: vendorData?.phone || '',
        email: vendorData?.email || '',
        address: vendorData?.address || '',
        gst_number: vendorData?.gst_number || '',
        pan_number: vendorData?.pan_number || '',
        current_balance: vendorData?.current_balance || '',
        total_purchases: vendorData?.total_purchases || '',
        status: vendorData?.status || 'active',
      });
    }
  }, [vendorData]);

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

    if (!formData.company_name || !formData.phone || !formData.contact_person) {

      toast.error("Please fill the company name, contact person and phone number it's required.")
      return;  // Prevent form submission
    }

    axios.put(`http://localhost:8000/api/vendors/${vendorData.id}/`, formData)
      .then(response => {
        console.log("Vendor updated successfully", response.data);
        toast.success('Vendor updated successfully!')
        setActiveSection('vendor-view');
      })
      .catch(error => {
        if (error.response) {
          console.error('Error updating vendor:', error.response.data);
          toast.error('There was an error updating the vendor.')
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
            onClick={() => setActiveSection('vendor-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
          >
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Edit Vendor
          </h1>
        </div>
        {/* Submit Button */}
        <div
          onClick={handleSubmit}
          className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
          <SaveAll className='w-5 h-5' />
          <button className=''>
            Save Changes
          </button>
        </div>
      </div>

      {/* Customer Add Form */}
      <div className='m-4'>
        <form className="p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Name, Phone, Email, Address */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="company_name" className="text-gray-600 pb-1 text-sm">Company Name</label>
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
                <label htmlFor="contact_person" className="text-gray-600 pb-1 text-sm">Contact Person</label>
                <input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter contact person"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-gray-600 pb-1 text-sm">Phone</label>
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
                <label htmlFor="status" className="text-gray-600 pb-1 text-sm">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

            </div>

            {/* Right Column: City, Pincode, State, GST Number, PAN Number, Customer Type */}
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
                  placeholder="Enter gstin"
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
                  placeholder="Enter pan number"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="current_balance" className="text-gray-600 pb-1 text-sm">Current Balance <span className='text-sm text-blue-700'>(Read only)</span></label>
                <input
                  type="text"
                  id="current_balance"
                  name="current_balance"
                  value={formData.current_balance}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter current balance"
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="total_purchases" className="text-gray-600 pb-1 text-sm">Total Purchase <span className='text-sm text-blue-700'>(Read only)</span></label>
                <input
                  type="text"
                  id="total_purchases"
                  name="total_purchases"
                  value={formData.total_purchases}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter total purchase"
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="address" className="text-gray-600 pb-1 text-sm">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter address"
                />
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default VendorEditView
