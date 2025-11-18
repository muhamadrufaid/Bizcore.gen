import React, { useState, useEffect } from 'react'
import { UserPlus, Trash2, CalendarRange, Search, CalendarX2, ChevronRight, ChevronLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import axios from 'axios';

const VendorView = ({ setActiveSection, setVendorId }) => {

  const [filter, setFilter] = useState('all'); // Default filter to 'all'
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]); // State to store filtered vendors list

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page


  useEffect(() => {
    // Fetch data from Django backend
    axios.get('http://localhost:8000/api/vendors/')
      .then(response => {
        setVendors(response.data); // Set items in state
        setFilteredVendors(response.data); // Initialize filtered list
      })
      .catch(error => {
        console.error('There was an error fetching the Vendors Data!', error);
      });
  }, []);

  useEffect(() => {
    filterVendors();
  }, [filter, vendors, searchQuery]);


  const filterVendors = () => {
    let filtered = vendors;
    // Filter by search query on company_name, contact_person, phone, or email
    if (searchQuery) {
      setCurrentPage(1); // Reset to first page when the filter changes
      filtered = filtered.filter(vendor => {
        // Use optional chaining and nullish coalescing to prevent errors on null/undefined
        const company_name = vendor.company_name ? vendor.company_name.toLowerCase() : '';
        const contact_person = vendor.contact_person ? vendor.contact_person.toLowerCase() : '';
        const phone = vendor.phone ? vendor.phone.toLowerCase() : '';
        const email = vendor.email ? vendor.email.toLowerCase() : '';
        const createdAt = vendor.created_at ? vendor.created_at.toLowerCase() : '';

        return (
          company_name.includes(searchQuery.toLowerCase()) ||
          contact_person.includes(searchQuery.toLowerCase()) ||
          email.includes(searchQuery.toLowerCase()) ||
          phone.includes(searchQuery.toLowerCase()) ||
          createdAt.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredVendors(filtered);
    setCurrentPage(1); // Reset to first page when the filter changes
  };

  // Handle filter change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredVendors(vendors); // Show all vendors
    } else {
      setFilteredVendors(vendors.filter(vendor => vendor.status === filter)); // Filter by status
    }
  }, [filter, vendors]);

  const handleDateChange = (date) => {
    setSelectedDate(date);  // Set the selected date
    if (!date) {
      setFilteredVendors(vendors);  // If no date is selected, show all vendors
      return;
    }

    // Filter vendors based on the selected date
    const filtered = vendors.filter((vendor) => {
      const vendorDate = new Date(vendor.created_at);
      setCurrentPage(1); // Reset to first page when the filter changes
      const selectedDateWithoutTime = new Date(date);
      selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

      return vendorDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
    });

    setFilteredVendors(filtered);  // Update the filtered vendors list
  };

  const handleClearDate = () => {
    setSelectedDate(null);  // Reset the selected date
    setFilteredVendors(vendors);  // Reset the vendors list
  };

  const handleDelete = (id) => {
    setSelectedItem(id);  // Set the selected item to delete
    setShowModal(true);    // Show the confirmation modal
  }

  const confirmDelete = () => {
    axios.delete(`http://localhost:8000/api/vendors/${selectedItem}/`)  // Call DELETE API
      .then(response => {
        console.log(`Vendor with ID ${selectedItem} deleted`);
        // Update the vendors state by filtering out the deleted customer
        setVendors(vendors.filter(vendor => vendor.id !== selectedItem));
        setFilteredVendors(filteredVendors.filter(vendor => vendor.id !== selectedItem)); // Update filtered list
        setShowModal(false); // Close the modal after successful deletion
      })
      .catch(error => {
        console.error('There was an error deleting the vendor!', error);
      });
  }

  const handleRowClick = (id) => {
    // Set the customer ID for detail view
    setVendorId(id);
    // Navigate to customer detail view
    setActiveSection('vendor-detail');  // You should have a section for customer details
    console.log(`Show details for vendor with ID: ${id}`);
  }

  // Get current customers to display based on pagination
  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendor = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);


  return (
    <div className='flex flex-col'>
      <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
        <h1 style={{
          fontFamily: '"Outfit", sans-serif',  // Apply Google font
          fontWeight: 600,                    // Apply bold weight
          fontOpticalSizing: 'auto',           // Apply optical sizing
        }}
          className='text-blue-700 text-2xl p-2'>Vendor Accounts</h1>
        <div className='flex pr-2 gap-2'>
          <div className='flex justify-between bg-blue-700 w-80 rounded-md p-0.5 pl-1'>
            <div style={{ background: 'rgba(241,246,250,255)' }} className="flex rounded-lg w-76 pl-2">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Handle search query
              />
              <button className='flex items-center pl-3 bg-blue-700'>
                <Search className='text-white' />
              </button>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('vendor-add')}
            className='flex items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
            <UserPlus
              className='text-white' />
            {/* <h2 className='text-white'>CREATE CUSTOMER</h2> */}
          </button>
        </div>
      </div>

      {/* Filter and Table Section - Now Blended Together */}

      <div className=''>
        {/* Filter Buttons */}
        <div className='flex justify-between items-center p-4'>
          <div className="flex items-center gap-4 mt-2">
            <button
              className={`p-2 w-24 rounded-full text-white ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`p-2 w-24 rounded-full text-white ${filter === 'active' ? 'bg-green-600' : 'bg-gray-200'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`p-2 w-24 rounded-full text-white ${filter === 'inactive' ? 'bg-red-600' : 'bg-gray-200'}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </button>

            <h2 className="text-md text-gray-600 flex items-center justify-center font-semibold">
              {selectedDate ? `Selected Date: ${selectedDate.toLocaleDateString()}` : ''}
            </h2>
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {/* Prev Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="py-1 mx-1 border border-blue-500 text-blue-500 rounded-xs disabled:bg-gray-400"
            >
              <ChevronLeft />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;

              // Display only 5 page numbers at a time (1, 2, 3, 4, 5)
              if (
                pageNumber >= currentPage - 2 &&
                pageNumber <= currentPage + 2 &&
                pageNumber <= totalPages
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-2 py-1 mx-1 ${currentPage === pageNumber ? 'border border-blue-700 text-blue-500' : 'border-blue-500 text-blue-400'} rounded-xs`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              return null;
            })}

            {/* Next Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className=" py-1 mx-1 border border-blue-500 text-blue-500 rounded-xs disabled:bg-gray-400"
            >

              <ChevronRight />
            </button>
          </div>

          <div className="flex items-center mt-6">
            {/* Show calendar dropdown when the calendar icon is clicked */}
            <button className="flex gap-1">
              <div className="">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText='Select Date'
                  className='border '
                />
              </div>
              {selectedDate ? (
                <CalendarX2 onClick={handleClearDate} />
              ) : (
                <CalendarRange />
              )}
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className='m-2 bg-white overflow-x-auto max-h-120 custom-scrollbar rounded-xl pb-5 custom-shadow-black'>
          <table className="bg-white w-full table-auto border-collapse rounded-lg">
            <thead className="sticky top-0 bg-white  border-b border-gray-400 text-sm text-gray-600 rounded-xl">
              <tr>
                <th className="p-3 text-center">Si.No</th>
                <th className="p-3 text-center">Company Name</th>
                <th className="p-3 text-center">Contact Person</th>
                <th className="p-3 text-center">Phone</th>
                <th className="p-3 text-center">Email</th>
                <th className="p-3 text-center">GST Number</th>
                <th className="p-3 text-center">Current Balance</th>
                <th className="p-3 text-center">Total Purchases</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentVendor.length > 0 ? (
                currentVendor.map((vendor, index) => (
                  <tr key={vendor.id}
                    onClick={() => handleRowClick(vendor.id)} // Row click event
                    className="hover:bg-gray-100 transition-all duration-300 border-b border-gray-400 text-gray-700">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{vendor.company_name}</td>
                    <td className="p-3 text-center">{vendor.contact_person}</td>
                    <td className="p-3 text-center">{vendor.phone}</td>
                    <td className="p-3 text-center">{vendor.email}</td>
                    <td className="p-3 text-center">{vendor.gst_number}</td>
                    <td className="p-3 text-center">{vendor.current_balance}</td>
                    <td className="p-3 text-center">{vendor.total_purchases}</td>
                    <td className="p-3 text-center"><span
                      className={`px-2 flex justify-center rounded-3xl border ${vendor.status === 'active' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                        }`}
                    >
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span></td>
                    <td className="p-3 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(vendor.id); }}  // Stop row click propagation
                        className="text-red-400 hover:text-red-600">
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))) : (
                <td colSpan="10" className="p-3 text-center text-red-500 font-semibold">
                  No Vendor found for the selected filters.
                </td>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-700">Are you sure you want to delete this Vendor?</h2>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}  // Close modal
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default VendorView
