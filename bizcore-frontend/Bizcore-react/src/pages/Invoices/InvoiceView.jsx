import React, { useState, useEffect } from 'react';
import { Funnel, Search, Eye, FilePlus2, View, X, CalendarX2, ChevronLeft, CalendarRange, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import InvoiceActionPopUpView from './InvoiceActionPopUpView';
import axios from 'axios';

const InvoiceView = ({ setActiveSection, setInvoiceId, invoices, setInvoices, refreshInvoices, refreshPayments, handleInvoiceDataChange }) => {
    const [filter, setFilter] = useState('all'); // Default filter to 'all'
    const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion
    const [selectedInvoice, setSelectedInvoice] = useState(null);  // Selected invoice state

    const [filteredInvoices, setFilteredInvoices] = useState(invoices); // State to store filtered customer list

    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page


    const [modeOfSupplyFilter, setModeOfSupplyFilter] = useState(null); // To store selected type filter
    const [showModeOfSupplyDropdown, setShowModeOfSupplyDropdown] = useState(false); // To toggle dropdown visibility

    const [paymentStatusFilter, setPaymentStatusFilter] = useState(null); // To store selected type filter
    const [paymentStatusDropdown, setPaymentStatusDropdown] = useState(false); // To toggle dropdown visibility

    const [isPopupDeleteConfirm, setIsPopupDeleteConfirm] = useState(false); // State to control popup visibility

    const [isPopupActionView, setIsPopupActionView] = useState(false); // State to control popup visibility

    const closePopupActionView = () => setIsPopupActionView(false);

    const showPopupAction = () => setIsPopupActionView(true);

    useEffect(() => {
        // Fetch data from Django backend
        axios.get('http://localhost:8000/api/invoices/')
            .then(response => {
                setInvoices(response.data); // Set items in state
                setFilteredInvoices(response.data); // Initialize filtered list
                refreshInvoices();
            })
            .catch(error => {
                console.error('There was an error fetching the Invoice Data!', error);
                setLoading(false);  // Stop loading if there's an error
            });
    }, []);

    // Handle filter change
    useEffect(() => {
        filterInvoices();
    }, [filter, invoices, searchQuery, modeOfSupplyFilter]);

    const filterInvoices = () => {
        let filtered = invoices;

        // Filter by customer type (individual or business)
        if (modeOfSupplyFilter) {
            filtered = filtered.filter(invoice => invoice.mode_of_supply === modeOfSupplyFilter);
        }

        // Filter by customer type (individual or business)
        if (paymentStatusFilter) {
            filtered = filtered.filter(invoice => invoice.payment_status === paymentStatusFilter);
        }

        // Filter by status (active, inactive, etc.)
        if (filter !== 'all') {
            filtered = filtered.filter(invoice => invoice.invoice_status === filter);
        }

        // Filter by search query on name, sku_code, hsn_sac_code, or barcode
        if (searchQuery) {
            setCurrentPage(1); // Reset to first page when the filter changes
            filtered = filtered.filter(invoice => {
                // Use optional chaining and nullish coalescing to prevent errors on null/undefined
                const invoice_number = invoice.invoice_number ? invoice.invoice_number.toLowerCase() : '';
                const invoice_date = invoice.invoice_date ? invoice.invoice_date.toLowerCase() : '';
                const grand_total = invoice.grand_total ? invoice.grand_total.toLowerCase() : '';
                const customer_name = invoice.customer_name ? invoice.customer_name.toLowerCase() : '';
                const createdAt = invoice.created_at ? invoice.created_at.toLowerCase() : '';

                return (
                    invoice_number.includes(searchQuery.toLowerCase()) ||
                    invoice_date.includes(searchQuery.toLowerCase()) ||
                    grand_total.includes(searchQuery.toLowerCase()) ||
                    customer_name.includes(searchQuery.toLowerCase()) ||
                    createdAt.includes(searchQuery.toLowerCase())
                );
            });
        }

        setFilteredInvoices(filtered);
        const paginate = (pageNumber) => {
            // Don't reset page when changing pages
            setCurrentPage(pageNumber);
        };
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);  // Set the selected date
        if (!date) {
            setFilteredInvoices(invoices);  // If no date is selected, show all invoices
            return;
        }

        // Filter invoices based on the selected date
        const filtered = invoices.filter((invoice) => {
            const InvoiceDate = new Date(invoice.created_at);
            setCurrentPage(1); // Reset to first page when the filter changes

            const selectedDateWithoutTime = new Date(date);
            setCurrentPage(1); // Reset to first page when the filter changes
            selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

            return InvoiceDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
        });

        setFilteredInvoices(filtered);  // Update the filtered invoices list
    };

    const handleClearDate = () => {
        setSelectedDate(null);  // Reset the selected date
        setFilteredInvoices(invoices);  // Reset the customer list
    };

    const handleRowClick = (invoice) => {
        setSelectedInvoice(invoice);  // Store the selected invoice
        setIsPopupActionView(true);  // Open the popup
        console.log('selected invoice', invoice)
    };

    // Get current invoice to display based on pagination
    const indexOfLastInvoice = currentPage * itemsPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
    // Ensure filteredInvoices is an array before calling slice
    const currentInvoice = Array.isArray(filteredInvoices) ? filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice) : [];

    const paginate = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);  // Update page number only on user request
        }
    };
    useEffect(() => {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage, 10));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const totalPages = Math.ceil((filteredInvoices?.length || 0) / itemsPerPage);  // Safe calculation of totalPages

    return (
        <div className='flex flex-col'>
            <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
                <h1 style={{
                    fontFamily: '"Outfit", sans-serif',  // Apply Google font
                    fontWeight: 600,                    // Apply bold weight
                    fontOpticalSizing: 'auto',           // Apply optical sizing
                }}
                    className='text-blue-700 text-2xl p-2'>Invoice Details</h1>
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
                    <button className='flex justify-center items-center p-4 h-10 bg-blue-700 border-none rounded-md hover:bg-blue-500'>
                        <Funnel className='text-white' />
                    </button>
                    <button
                        onClick={() => setActiveSection('invoice-form')}
                        className='flex items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
                        <FilePlus2
                            className='text-white' />
                    </button>
                </div>
            </div>

            <div className='flex justify-between items-center'>
                <div className="flex items-center mt-2 gap-4 p-4">
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
                        className={`p-2 w-24 rounded-full text-white ${filter === 'returned' ? 'bg-purple-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('returned')}
                    >
                        Returned
                    </button>
                    
                    <button
                        className={`p-2 w-24 rounded-full text-white ${filter === 'cancelled' ? 'bg-red-600' : 'bg-gray-200'}`}
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled
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
                <div className="flex items-center mt-6 pr-4">
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
                    <thead className="sticky top-0 bg-white  border-b border-gray-400 text-xs font-semibold text-gray-600 rounded-xl">
                        <tr>
                            <th className="px-2 py-3 text-center">SI.No</th>
                            <th className="px-2 py-3 text-center">Invoice Number</th>
                            <th className="px-2 py-3 text-center">Customer Name</th>
                            <th className="px-2 py-3 text-center">Invoice Date</th>
                            <th className="px-2 py-3 text-center">Invoice Type</th>
                            <th className="px-2 py-3 text-center">GST Type</th>
                            <th className="px-2 py-3 text-center">Sub Total</th>
                            <th className="px-2 py-3 text-center">Total GST</th>
                            <th className="px-2 py-3 text-center">Grand Total</th>
                            <th className="px-2 py-3 text-center">Mode Of Supply</th>
                            <th className="px-2 py-3 text-center">Tax Status</th>
                            <th className="px-2 py-3 text-center">Payment Status</th>

                            <th className="px-2 py-3 text-center">Status</th>
                            <th className="px-2 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInvoice && currentInvoice.length > 0 ? (
                            currentInvoice.map((invoice, index) => (
                                <tr
                                    key={invoice.id}
                                    className="hover:bg-gray-100 transition-all duration-300 border-b text-sm border-gray-400 text-gray-700"
                                    onClick={() => handleRowClick(invoice)} // Pass the invoice to handleRowClick
                                >
                                    <td className="px-1 py-2 text-center">{index + 1}</td>
                                    <td className="px-1 py-2 text-center">{invoice.invoice_number}</td>
                                    <td className="px-1 py-2 text-center">{invoice.customer_name}</td>
                                    <td className="px-1 py-2 text-center">{invoice.invoice_date}</td>
                                    <td className="px-1 py-2 text-center">{invoice.invoice_type}</td>
                                    <td className="px-1 py-2 text-center">{invoice.gst_type}</td>
                                    <td className="px-1 py-2 text-center">{invoice.sub_total}</td>
                                    <td className="px-1 py-2 text-center">{invoice.total_gst}</td>
                                    <td className="px-1 py-2 text-center font-semibold text-green-500">{invoice.grand_total}</td>

                                    <td className="px-4 py-2 text-center">
                                        <span
                                            className={`px-3 flex justify-center items-center rounded-3xl border 
                                                ${invoice.mode_of_supply === 'direct' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold shadow-lg' : // Modern gradient yellow for direct
                                                    invoice.mode_of_supply === 'delivery' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold shadow-lg' : // Modern gradient sky for delivery
                                                        'bg-gray-200 text-gray-700 font-semibold'}`} // Default color for no mode of supply or other cases
                                        >
                                            {/* Capitalize and display the mode of supply */}
                                            {invoice.mode_of_supply.charAt(0).toUpperCase() + invoice.mode_of_supply.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-1 py-2 text-center">
                                        <span
                                            className={`px-3 flex justify-center items-center rounded-3xl border-2 
                                                ${invoice.tax_status === 'paid' ? 'bg-gradient-to-r from-green-400 to-green-600 text-transparent font-semibold bg-clip-text' : // Gradient for paid
                                                    invoice.tax_status === 'unpaid' ? 'bg-gradient-to-r from-red-400 to-red-600 text-transparent font-semibold  bg-clip-text' : // Gradient for unpaid
                                                        'border-gray-600 text-gray-600'}`} // Default gray for unknown statuses
                                        >
                                            {invoice.tax_status.charAt(0).toUpperCase() + invoice.tax_status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <span
                                            className={`px-1 flex justify-center rounded-md border 
                                            ${invoice.payment_status === 'paid' ? 'bg-green-400 font-semibold border-green-500 text-white shadow-md' : // Green border for paid
                                                    invoice.payment_status === 'partial' ? 'bg-blue-400 font-semibold border-blue-500 text-white shadow-md' : // Blue border for partial
                                                        invoice.payment_status === 'unpaid' ? 'bg-red-400 font-semibold border-red-500 text-white shadow-lg' : ''}`}
                                        >
                                            {/* Display the status as Paid, Partial, Unpaid */}
                                            {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                                        </span>
                                    </td>

                                    <td className="px-1 py-3 text-center">
                                        <span
                                            className={`px-3 flex justify-center items-center rounded-3xl border-2 
                                                ${invoice.invoice_status === 'active' ? 'border-[transparent] bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text' : // Gradient border and text for active
                                                    invoice.invoice_status === 'returned' ? 'border-[transparent] bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text' : // Gradient border and text for returned
                                                        invoice.invoice_status === 'amended' ? 'border-[transparent] bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text' : // Gradient border and text for amended
                                                            invoice.invoice_status === 'archived' ? 'border-[transparent] bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text' : // Gradient border and text for archived
                                                                invoice.invoice_status === 'cancelled' ? 'border-[transparent] bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text' : // Gradient border and text for cancelled
                                                                    'border-gray-600 text-gray-600'}`} // Default gray color for unknown statuses
                                        >
                                            {invoice.invoice_status.charAt(0).toUpperCase() + invoice.invoice_status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-1 py-2 text-center">
                                        <button
                                            onClick={() => setActiveSection('invoice-detail')}
                                            className="text-gray-400 hover:text-blue-600"
                                        >
                                            <View />
                                        </button>
                                    </td>
                                </tr>
                            ))) : (
                            <td colSpan="11" className="p-3 text-center text-red-500 font-semibold">
                                No Invoice found for the selected filters.
                            </td>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Popup Section */}
            {
                isPopupActionView && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className="bg-white p-4 rounded-lg shadow-xl w-3/4"
                            style={{ maxWidth: '700px' }}>
                            {/* Back Button */}

                            <InvoiceActionPopUpView invoice={selectedInvoice}
                                refreshInvoices={refreshInvoices}
                                setInvoiceId={setInvoiceId}
                                setActiveSection={setActiveSection}
                                handleInvoiceDataChange={handleInvoiceDataChange}
                                closePopupActionView={closePopupActionView}
                                refreshPayments={refreshPayments} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default InvoiceView
