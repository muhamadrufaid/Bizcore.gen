import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerAddView = ({ setActiveSection }) => {
  // Step 1: Set up state for form data
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    gst_number: '',
    pan_number: '',
  });

  // Step 2: Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerData.name || !customerData.phone) {

      toast.error('Please fill in both the customer name and phone number.')
      return;  // Prevent form submission
    }


    axios.post('http://localhost:8000/api/customers/', customerData)
      .then(response => {
        console.log('Customer created:', response.data);
        toast.success('Customer created successfully!')
        // Optionally, navigate to the customer list after successful creation
        setActiveSection('customer-view');
      })
      .catch(error => {
        console.error('There was an error creating the customer:', error);
        toast.error('There was an error creating the customer.')
        console.log(error.response.data);  // Log the error response to get more details
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
            New Customer
          </h1>
        </div>
        <div
          onClick={handleSubmit}
          className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
          <Save className='w-5 h-5' />
          <button>
            Save Customer
          </button>
        </div>
      </div>

      {/* Customer Add Form */}
      <div className='m-4 '>
        <form className="p-6 pb-10 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Name, Phone, Email, Address */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-600 pb-1 text-sm">Customer Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-gray-600 pb-1 text-sm">Phone</label>
                <input
                  type="number"
                  name="phone"
                  value={customerData.phone}
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
                  value={customerData.email}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter email"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="customer_type" className="text-gray-600 pb-1 text-sm">Customer Type</label>
                <select
                  name="customer_type"
                  value={customerData.customer_type}
                  onChange={handleChange}
                  id="customer_type"
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                >
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            {/* Right Column: City, Pincode, State, GST Number, PAN Number, Customer Type */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="address" className="text-gray-600 pb-1 text-sm">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customerData.billing_address}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter address"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="city" className="text-gray-600 pb-1 text-sm">City</label>
                <input
                  type="text"
                  name="city"
                  value={customerData.city}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter city"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="pincode" className="text-gray-600 pb-1 text-sm">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={customerData.pincode}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter pincode"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="state" className="text-gray-600 pb-1 text-sm">State</label>
                <input
                  type="text"
                  name="state"
                  value={customerData.state}
                  onChange={handleChange}
                  className="border p-2 rounded-sm border-gray-400 text-gray-600"
                  placeholder="Enter state"
                />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 mt-4'>
            <div className="flex flex-col">
              <label htmlFor="gst_number" className="text-gray-600 pb-1 text-sm">GST Number</label>
              <input
                type="text"
                name="gst_number"
                value={customerData.gst_number}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter GST number"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="pan_number" className="text-gray-600 pb-1 text-sm">PAN Number</label>
              <input
                type="text"
                name="pan_number"
                value={customerData.pan_number}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter PAN number"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddView;
