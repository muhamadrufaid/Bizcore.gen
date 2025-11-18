import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const VendorAddView = ({ setActiveSection }) => {

  // Step 1: Set up state for form data
  const [vendorData, setVendorData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    gst_number: '',
    pan_number: '',
    address: '',
    current_balance: 0.00,
    total_purchases: 0.00,
    status: 'active',
  });

  // Step 2: Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(vendorData);

    if (!vendorData.company_name || !vendorData.phone || !vendorData.contact_person) {

      toast.error("Please fill the company name, contact person and phone number it's required.")
      return;  // Prevent form submission
    }

    axios.post('http://localhost:8000/api/vendors/', vendorData)
      .then(response => {
        console.log('Vendor created:', response.data);
        toast.success('Vendor created successfully!')

        // Optionally, navigate to the customer list after successful creation
        setActiveSection('vendor-view');
      })
      .catch(error => {
        console.error('There was an error creating the vendor:', error);
        toast.error('There was an error creating the vendor.')
        console.log(error.response.data);  // Log the error response to get more details
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
            New Vendor
          </h1>
        </div>
        <div
          onClick={handleSubmit}
          className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
          <Save className='w-5 h-5' />
          <button className=''>
            Save Vendor
          </button>
        </div>
      </div>

      {/* Customer Add Form */}
      <div className='m-4'>
        <form className="p-6 pb-10 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Name, Phone, Email, Address */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="company_name" className="text-gray-600 pb-1 text-sm">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={vendorData.company_name}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter company name"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="contact_person" className="text-gray-600 pb-1 text-sm">Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  value={vendorData.contact_person}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter contact person"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-gray-600 pb-1 text-sm">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={vendorData.phone}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-600 pb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={vendorData.email}
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
                  value={vendorData.status}
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
                  name="gst_number"
                  value={vendorData.gst_number}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter gstin"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="pan_number" className="text-gray-600 pb-1 text-sm">PAN Number</label>
                <input
                  type="text"
                  name="pan_number"
                  value={vendorData.pan_number}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter pan number"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="current_balance" className="text-gray-600 pb-1 text-sm">Current Balance <span className='text-sm text-blue-700'>(Read only)</span></label>
                <input
                  type="text"
                  name="current_balance"
                  value={vendorData.current_balance}
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
                  name="total_purchases"
                  value={vendorData.total_purchases}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter total purchase"
                  readOnly />
              </div>

              <div className="flex flex-col">
                <label htmlFor="address" className="text-gray-600 pb-1 text-sm">Address</label>
                <input
                  type="text"
                  name="address"
                  value={vendorData.address}
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
  );
};

export default VendorAddView;
