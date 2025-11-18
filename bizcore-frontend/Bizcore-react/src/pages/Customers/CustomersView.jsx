import React, { useState, useEffect } from 'react';
import { UserPlus, Funnel, Trash2, CalendarRange, Search, CalendarX2, FunnelX, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import axios from 'axios';

const CustomersView = ({ setActiveSection, setCustomerId }) => {
  const [filter, setFilter] = useState('all'); // Default filter to 'all'
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]); // State to store filtered customer list

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const [customerTypeFilter, setCustomerTypeFilter] = useState(null); // To store selected customer type filter
  const [showCustomerTypeDropdown, setShowCustomerTypeDropdown] = useState(false); // To toggle dropdown visibility

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page


  useEffect(() => {
    // Fetch data from Django backend
    axios.get('http://localhost:8000/api/customers/')
      .then(response => {
        setCustomers(response.data); // Set items in state
        setFilteredCustomers(response.data); // Initialize filtered list
      })
      .catch(error => {
        console.error('There was an error fetching the Customer Data!', error);
        setLoading(false);  // Stop loading if there's an error
      });
  }, []);

  // Handle filter change
  useEffect(() => {
    filterCustomers();
  }, [filter, customers, searchQuery, customerTypeFilter]);

  const filterCustomers = () => {
    let filtered = customers;

    // Filter by customer type (individual or business)
    if (customerTypeFilter) {
      filtered = filtered.filter(customer => customer.customer_type === customerTypeFilter);
    }

    // Filter by status (active, inactive, etc.)
    if (filter !== 'all') {
      filtered = filtered.filter(customer => customer.status === filter);
    }

    // Filter by search query on name, sku_code, hsn_sac_code, or barcode
    if (searchQuery) {
      filtered = filtered.filter(customer => {
        // Use optional chaining and nullish coalescing to prevent errors on null/undefined
        const name = customer.name ? customer.name.toLowerCase() : '';
        const phone = customer.phone ? customer.phone.toLowerCase() : '';
        const email = customer.email ? customer.email.toLowerCase() : '';
        const billingAddress = customer.billing_address ? customer.billing_address.toLowerCase() : '';
        const createdAt = customer.created_at ? customer.created_at.toLowerCase() : '';

        return (
          name.includes(searchQuery.toLowerCase()) ||
          phone.includes(searchQuery.toLowerCase()) ||
          email.includes(searchQuery.toLowerCase()) ||
          billingAddress.includes(searchQuery.toLowerCase()) ||
          createdAt.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when the filter changes
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);  // Set the selected date
    if (!date) {
      setFilteredCustomers(customers);  // If no date is selected, show all customers
      return;
    }

    // Filter customers based on the selected date
    const filtered = customers.filter((customer) => {
      const customerDate = new Date(customer.created_at);
      const selectedDateWithoutTime = new Date(date);
      selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

      return customerDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
    });

    setFilteredCustomers(filtered);  // Update the filtered customers list
  };

  const handleClearDate = () => {
    setSelectedDate(null);  // Reset the selected date
    setFilteredCustomers(customers);  // Reset the customer list
  };

  const handleDelete = (id) => {
    setSelectedItem(id);  // Set the selected item to delete
    setShowModal(true);    // Show the confirmation modal
  }

  const confirmDelete = () => {
    axios.delete(`http://localhost:8000/api/customers/${selectedItem}/`)  // Call DELETE API
      .then(response => {
        console.log(`Customer with ID ${selectedItem} deleted`);
        // Update the customers state by filtering out the deleted customer
        setCustomers(customers.filter(customer => customer.id !== selectedItem));
        setFilteredCustomers(filteredCustomers.filter(customer => customer.id !== selectedItem)); // Update filtered list
        setShowModal(false); // Close the modal after successful deletion
      })
      .catch(error => {
        console.error('There was an error deleting the customer!', error);
      });
  }

  const handleRowClick = (id) => {
    // Set the customer ID for detail view
    setCustomerId(id);
    // Navigate to customer detail view
    setActiveSection('customer-detail');  // You should have a section for customer details
    console.log(`Show details for customer with ID: ${id}`);
  }

  // Get current customers to display based on pagination
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);


  return (
    <div className='flex flex-col'>
      <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
        <h1 style={{
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          fontOpticalSizing: 'auto',
        }} className='text-blue-700 text-2xl p-2'>Customer Accounts</h1>
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
            onClick={() => setShowCustomerTypeDropdown(!showCustomerTypeDropdown)}
            className='flex justify-center items-center p-4 h-10 bg-blue-700 border-none rounded-md hover:bg-blue-500'
          >
            {customerTypeFilter ? (
              <FunnelX className='text-white' />
            ) : (
              <Funnel className='text-white' />
            )}
          </button>
          <button
            onClick={() => setActiveSection('customer-add')}
            className='flex items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
            <UserPlus className='text-white' />
          </button>
        </div>
      </div>
      {/* Customer Type Dropdown */}
      {showCustomerTypeDropdown && (
        <div className="absolute top-28 right-5 md:w-80 sm:w-40 z-10 bg-white shadow-lg rounded-md p-4">
          <div className='flex justify-end'>
            <button
              onClick={() => {
                setCustomerTypeFilter(null);
                setShowCustomerTypeDropdown(false);
              }}
              className="text-red-500  font-semibold hover:text-red-700">
              clear filter
            </button>
          </div>
          <div className="flex flex-col items-center">

            <h3 className="font-semibold mb-2">Select Customer Type</h3>
            <button
              onClick={() => {
                setCustomerTypeFilter('individual');
                setShowCustomerTypeDropdown(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Individual
            </button>
            <button
              onClick={() => {
                setCustomerTypeFilter('business');
                setShowCustomerTypeDropdown(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Business
            </button>
          </div>
        </div>
      )}

      {/* Filter and Table Section */}
      <div>
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
                <th className="p-3 text-center">Name</th>
                <th className="p-3 text-center">Phone</th>
                <th className="p-3 text-center">Email</th>
                <th className="p-3 text-center">Customer Type</th>
                <th className="p-3 text-center">Current Balance</th>
                <th className="p-3 text-center">Credit Earned</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-100 transition-all duration-300 border-b text-sm border-gray-400 text-gray-700"
                    onClick={() => handleRowClick(customer.id)}  // Row click event
                  >
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{customer.name}</td>
                    <td className="p-3 text-center">{customer.phone}</td>
                    <td className="p-3 text-center">{customer.email}</td>
                    <td className="p-3 text-center"><span
                      className={`px-4 text-center rounded-3xl text-white font-semibold border shadow-lg ${customer.customer_type === 'individual' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-red-500 hover:bg-violet-400'
                        }`}
                    >
                     {customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1)}
                    </span></td>
                    <td className="p-3 text-center">{customer.current_balance}</td>
                    <td className="p-3 text-center">{customer.credit_earned}</td>
                    <td className="p-3 text-center"><span
                      className={`px-1 flex justify-center rounded-3xl border ${customer.status === 'active' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                        }`}
                    >
                       {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span></td>
                    <td className="p-3 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}  // Stop row click propagation
                        className="text-red-400 hover:text-red-600">
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <td colSpan="9" className="p-3 text-center text-red-500 font-semibold">
                  No customer found for the selected filters.
                </td>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-700">Are you sure you want to delete this<br></br> <span className="font-semibold text-blue-500">{customers.find(c => c.id === selectedItem)?.name}</span> <span className='text-blue-500' >?</span></h2>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
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
  );
};

export default CustomersView;
