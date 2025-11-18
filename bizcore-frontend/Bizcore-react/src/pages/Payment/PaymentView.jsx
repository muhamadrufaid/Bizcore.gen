import React, { useState, useEffect } from 'react';
import { ListPlus, Funnel, FunnelX, Search, CalendarRange, CalendarX2, ChevronRight, ChevronLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import axios from 'axios';

const PaymentView = ({ setActiveSection, setPaymentId }) => {
    const [filter, setFilter] = useState('all'); // Default filter to 'all'
    const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion

    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]); // State to store filtered payment list

    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const [paymentTypeFilter, setPaymentTypeFilter] = useState(null); // To store selected payment mode filter
    const [showPaymentTypeDropdown, setShowPaymentTypeDropdown] = useState(false); // To toggle dropdown visibility

    const [currentPage, setCurrentPage] = useState(1); // Current page state
      const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page

    useEffect(() => {
        // Fetch data from Django backend
        axios.get('http://localhost:8000/api/payments/')
            .then(response => {
                setPayments(response.data); // Set items in state
                setFilteredPayments(response.data); // Initialize filtered list
            })
            .catch(error => {
                console.error('There was an error fetching the Payment Data!', error);
                setLoading(false);  // Stop loading if there's an error
            });
    }, []);

    // Handle filter change
    useEffect(() => {
        filterPayments();
    }, [filter, payments, searchQuery, paymentTypeFilter]);

    const filterPayments = () => {
        let filtered = payments;

        // Filter by payment type (individual or business)
        if (paymentTypeFilter) {
            filtered = filtered.filter(payment => payment.payment_mode === paymentTypeFilter);
        }

        // Filter by status (active, inactive, etc.)
        if (filter !== 'all') {
            filtered = filtered.filter(payment => payment.payment_status === filter);
        }

        // Filter by search query on invoiceNumber, customerName, billAmount, or referenceNumber
        if (searchQuery) {
             setCurrentPage(1); // Reset to first page when the filter changes
            filtered = filtered.filter(payment => {
                // Use optional chaining and nullish coalescing to prevent errors on null/undefined
                const invoiceNumber = payment.invoice_number ? payment.invoice_number.toLowerCase() : '';
                const customerName = payment.customer_name ? payment.customer_name.toLowerCase() : '';
                const billAmount = payment.bill_amount ? payment.bill_amount.toLowerCase() : '';
                const referenceNumber = payment.reference_number ? payment.reference_number.toLowerCase() : '';
                const createdAt = payment.created_at ? payment.created_at.toLowerCase() : '';

                return (
                    invoiceNumber.includes(searchQuery.toLowerCase()) ||
                    customerName.includes(searchQuery.toLowerCase()) ||
                    billAmount.includes(searchQuery.toLowerCase()) ||
                    referenceNumber.includes(searchQuery.toLowerCase()) ||
                    createdAt.includes(searchQuery.toLowerCase())
                );
            });
        }

        setFilteredPayments(filtered);
        setCurrentPage(1); // Reset to first page when the filter changes
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);  // Set the selected date
        if (!date) {
            setFilteredPayments(payments);  // If no date is selected, show all payments
            return;
        }

        // Filter payments based on the selected date
        const filtered = payments.filter((payment) => {
            const paymentDate = new Date(payment.paid_at);
            setCurrentPage(1); // Reset to first page when the filter changes
            const selectedDateWithoutTime = new Date(date);
            selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

            return paymentDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
        });

        setFilteredPayments(filtered);  // Update the filtered payments list
    };

    const handleClearDate = () => {
        setSelectedDate(null);  // Reset the selected date
        setFilteredPayments(payments);  // Reset the payments list
    };

    const handleDelete = (id) => {
        setSelectedItem(id);  // Set the selected item to delete
        setShowModal(true);    // Show the confirmation modal
    }

    const handleRowClick = (id) => {
        // Set the customer ID for detail view
        setPaymentId(id);
        // Navigate to customer detail view
        setActiveSection('payment-detail');  // You should have a section for customer details
        console.log(`Show details for payment with ID: ${id}`);
    }

     // Get current customers to display based on pagination
  const indexOfLastPayments = currentPage * itemsPerPage;
  const indexOfFirstPayments = indexOfLastPayments - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayments, indexOfLastPayments);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    return (
        <div className='flex flex-col'>
            <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
                <h1 style={{
                    fontFamily: '"Outfit", sans-serif',  // Apply Google font
                    fontWeight: 600,                    // Apply bold weight
                    fontOpticalSizing: 'auto',           // Apply optical sizing
                }}
                    className='text-blue-700 text-2xl p-2'>Payment Details</h1>
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
                        onClick={() => setShowPaymentTypeDropdown(!showPaymentTypeDropdown)}
                        className='flex justify-center items-center p-4 h-10 bg-blue-700 border-none rounded-md hover:bg-blue-500'>
                        {paymentTypeFilter ? (
                            <FunnelX className='text-white' />
                        ) : (
                            <Funnel className='text-white' />
                        )}

                    </button>
                </div>
            </div>
            {/* Customer Type Dropdown */}
            {showPaymentTypeDropdown && (
                <div className="absolute top-28 right-5 md:w-80 sm:w-40 z-10 bg-white shadow-lg rounded-md p-4">
                    <div className='flex justify-end'>
                        <button
                            onClick={() => {
                                setPaymentTypeFilter(null);
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="text-red-500  font-semibold hover:text-red-700">
                            clear filter
                        </button>
                    </div>
                    <div className="flex flex-col items-center">

                        <h3 className="font-semibold mb-2">Select Payment Mode</h3>
                        <button
                            onClick={() => {
                                setPaymentTypeFilter('cash');
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Cash
                        </button>
                        <button
                            onClick={() => {
                                setPaymentTypeFilter('card');
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Card
                        </button>
                        <button
                            onClick={() => {
                                setPaymentTypeFilter('upi');
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            UPI
                        </button>
                        <button
                            onClick={() => {
                                setPaymentTypeFilter('bank');
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Bank Transfer
                        </button> <button
                            onClick={() => {
                                setPaymentTypeFilter('credit');
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Credit
                        </button>
                        <button
                            onClick={() => {
                                setPaymentTypeFilter('wallet');
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Wallet
                        </button>
                        <button
                            onClick={() => {
                                setPaymentTypeFilter('hybird');
                                setShowPaymentTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Hybrid CASH + ONLINE
                        </button>
                    </div>
                </div>
            )}

            <div className='flex justify-between items-center p-4'>
                <div className="flex items-center gap-4 mt-2">
                    <button
                        className={`p-2 w-24 rounded-full text-white ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`p-2 w-24 rounded-full text-white ${filter === 'paid' ? 'bg-green-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('paid')}
                    >
                        Paid
                    </button>
                    <button
                        className={`p-2 w-24 rounded-full text-white ${filter === 'partial' ? 'bg-red-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('partial')}
                    >
                        Partial
                    </button>
                    <button
                        className={`p-2 w-24 rounded-full text-white ${filter === 'unpaid' ? 'bg-red-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('unpaid')}
                    >
                        Unpaid
                    </button>
                    <button
                        className={`p-2 w-24 rounded-full text-white ${filter === 'reversed' ? 'bg-red-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('reversed')}
                    >
                        Reversed
                    </button>
                    <button
                        className={`p-2 w-24 rounded-full text-white ${filter === 'failed' ? 'bg-red-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('failed')}
                    >
                        failed
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
            <div className='m-2 bg-white overflow-x-auto max-h-120 custom-scrollbar rounded-xl pb-5 custom-shadow-black'>
                <table className="bg-white w-full table-auto border-collapse rounded-lg">
                    <thead className="sticky top-0 bg-white  border-b border-gray-400 text-sm text-gray-600 rounded-xl">
                        <tr>
                            <th className="p-3 text-center">SI.No</th>
                            <th className="p-3 text-center">Invoice Number</th>
                            <th className="p-3 text-center">Customer Name</th>
                            <th className="p-3 text-center">Due Date</th>
                            <th className="p-3 text-center">Bill Amount</th>
                            <th className="p-3 text-center">Amount Paid</th>
                            <th className="p-3 text-center">Balance Due</th>
                            <th className="p-3 text-center">Payment Mode</th>
                            <th className="p-3 text-center">Paid at</th>
                            <th className="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayments.length > 0 ? (
                            currentPayments.map((payment, index) => (
                                <tr
                                    key={payment.id}
                                    onClick={() => handleRowClick(payment.id)}
                                    className="hover:bg-gray-100 transition-all duration-300 border-b border-gray-400 text-gray-700">
                                    <td className="p-3 text-center">{index + 1}</td>
                                    <td className="p-3 text-center">{payment.invoice_number}</td>
                                    <td className="p-3 text-center">{payment.customer_name}</td>
                                    <td className="p-3 text-center">{payment.due_date}</td>
                                    <td className="p-3 text-center">{payment.bill_amount}</td>
                                    <td className="p-3 text-center">{payment.amount_paid}</td>
                                    <td className="p-3 text-center">{payment.balance_due}</td>
                                    <td className="p-3 text-center">{payment.payment_mode}</td>
                                    <td className="p-3 text-center">
                                        {new Date(payment.paid_at).toLocaleString('en-GB', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}
                                    </td>

                                    <td className="p-3 text-center">{payment.payment_status}</td>
                                </tr>
                            ))) : (
                            <td colSpan="10" className="p-3 text-center text-red-500 font-semibold">
                                No payments found for the selected filters.
                            </td>
                        )}
                    </tbody>
                </table>
            </div>


            {/* Confirmation Modal for Deletion */}
            {showModal && (
                <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full ">
                        <h2 className="text-xl font-semibold text-gray-700">Are you sure you want to delete this Payment?</h2>
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

export default PaymentView
