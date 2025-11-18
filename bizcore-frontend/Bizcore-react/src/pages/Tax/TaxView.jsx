import React, { useState, useEffect } from 'react';
import { Funnel, ChevronDown, CalendarRange, Search, CalendarX2, FunnelX, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import axios from 'axios';

const TaxView = ({ setActiveSection, setInvoiceId, invoiceData, setInvoiceData, refreshInvoices }) => {
    const [filter, setFilter] = useState('all'); // Default filter to 'all'
    const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion

    const [taxStatus, setTaxStatus] = useState('');  // To store selected tax status

    const [taxpayment, setTaxPayment] = useState([]);
    const [filteredTaxPayment, setFilteredTaxPayment] = useState([]); // State to store filtered taxpay list

    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const [gstTypeFilter, setGstTypeFilter] = useState(null); // To store selected taxpay type filter
    const [showGstTypeDropdown, setShowGstTypeDropdown] = useState(false); // To toggle dropdown visibility

    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page

    useEffect(() => {
        // Fetch data from Django backend
        axios.get('http://localhost:8000/api/invoices/')
            .then(response => {
                setTaxPayment(response.data); // Set items in state
                setFilteredTaxPayment(response.data); // Initialize filtered list
                refreshInvoices();
            })
            .catch(error => {
                console.error('There was an error fetching the Invoice Tax Data!', error);
                setLoading(false);  // Stop loading if there's an error
            });
    }, []);

    // Handle filter change
    useEffect(() => {
        filterTaxPayments();
        refreshInvoices();
    }, [filter, taxpayment, searchQuery, gstTypeFilter]);

    const filterTaxPayments = () => {
        let filtered = taxpayment;

        // Filter by taxpay type (individual or business)
        if (gstTypeFilter) {
            filtered = filtered.filter(taxpay => taxpay.gst_type === gstTypeFilter);
        }

        // Filter by status (active, inactive, etc.)
        if (filter !== 'all') {
            filtered = filtered.filter(taxpay => taxpay.tax_status === filter);
        }

        // Filter by search query on invoiceNumber, invoiceDate, customerName, or grandTotal
        if (searchQuery) {
            setCurrentPage(1); // Reset to first page when the filter changes
            filtered = filtered.filter(taxpay => {
                // Use optional chaining and nullish coalescing to prevent errors on null/undefined
                const invoiceNumber = taxpay.invoice_number ? taxpay.invoice_number.toLowerCase() : '';
                const invoiceDate = taxpay.invoice_date ? taxpay.invoice_date.toLowerCase() : '';
                const customerName = taxpay.customer_name ? taxpay.customer_name.toLowerCase() : '';
                const grandTotal = taxpay.grand_total ? taxpay.grand_total.toLowerCase() : '';
                const createdAt = taxpay.created_at ? taxpay.created_at.toLowerCase() : '';

                return (
                    invoiceNumber.includes(searchQuery.toLowerCase()) ||
                    invoiceDate.includes(searchQuery.toLowerCase()) ||
                    customerName.includes(searchQuery.toLowerCase()) ||
                    grandTotal.includes(searchQuery.toLowerCase()) ||
                    createdAt.includes(searchQuery.toLowerCase())
                );
            });
        }

        setFilteredTaxPayment(filtered);
        setCurrentPage(1); // Reset to first page when the filter changes
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);  // Set the selected date
        if (!date) {
            setFilteredTaxPayment(taxpayment);  // If no date is selected, show all taxpayment
            return;
        }

        // Filter customers based on the selected date
        const filtered = taxpayment.filter((taxpay) => {
            const invoiceDate = new Date(taxpay.invoice_date);
            setCurrentPage(1); // Reset to first page when the filter changes
            const selectedDateWithoutTime = new Date(date);
            selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

            return invoiceDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
        });

        setFilteredTaxPayment(filtered);  // Update the filtered taxpayment list
    };

    const handleClearDate = () => {
        setSelectedDate(null);  // Reset the selected date
        setFilteredTaxPayment(taxpayment);  // Reset the taxpayment list
    };

    useEffect(() => {
        // Assuming invoiceData is coming as a prop
        setFilteredTaxPayment(invoiceData);
        refreshInvoices();
    }, [invoiceData]);

    const handleSave = () => {
        if (selectedItem && taxStatus) {
            const updatedInvoice = {
                id: selectedItem.id,  // Use the ID from selectedItem
                tax_status: taxStatus  // Updated tax_status
            };

            // Make sure invoiceData is an array
            if (Array.isArray(invoiceData) && invoiceData !== null) {
                axios.put(`http://127.0.0.1:8000/api/invoices/${updatedInvoice.id}/`, updatedInvoice)
                    .then(response => {
                        // Update the invoice in state with new tax status
                        const updatedInvoiceIndex = invoiceData.findIndex(invoice => invoice.id === updatedInvoice.id);

                        if (updatedInvoiceIndex !== -1) {
                            const updatedInvoiceData = [...invoiceData];
                            updatedInvoiceData[updatedInvoiceIndex] = { ...updatedInvoiceData[updatedInvoiceIndex], tax_status: taxStatus };

                            // Update the state with the new invoice data
                            setInvoiceData(updatedInvoiceData);
                            refreshInvoices();
                            setFilteredTaxPayment(updatedInvoiceData);
                        }

                        setShowModal(false);  // Close the modal
                    })
                    .catch(error => {
                        console.error('Error updating tax status:', error);
                    });
            } else {
                console.error("invoiceData is not an array or is null:", invoiceData);
            }
        }
    };

    useEffect(() => {
        if (Array.isArray(invoiceData) && invoiceData !== null) {
            setFilteredTaxPayment(invoiceData);
            refreshInvoices();
        } else {
            console.error("invoiceData is not an array or is null:", invoiceData);
        }
    }, [invoiceData]);

    // Handle filter and search logic
    useEffect(() => {
        filterTaxPayments();
    }, [filter, searchQuery, gstTypeFilter, invoiceData]);


    // Handle row click to show the modal with invoice details
    const handleRowClick = (taxpay) => {
        setSelectedItem(taxpay);
        setTaxStatus(taxpay.tax_status); // Set the current status
        setShowModal(true); // Open the modal
    };

    const [expandedRow, setExpandedRow] = useState(null);

    const handleToggleRow = (e, id) => {
        e.stopPropagation(); // Prevent event propagation
        setExpandedRow(prevExpandedRow => (prevExpandedRow === id ? null : id)); // Toggle row expansion
    };

    // Get current tax to display based on pagination
    const indexOfLastTax = currentPage * itemsPerPage;
    const indexOfFirstTax = indexOfLastTax - itemsPerPage;
    const currentTax = filteredTaxPayment.slice(indexOfFirstTax, indexOfLastTax);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredTaxPayment.length / itemsPerPage);

    return (
        <div className='flex flex-col'>
            <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
                <h1 style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                    fontOpticalSizing: 'auto',
                }} className='text-blue-700 text-2xl p-2'>Tax Details</h1>
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
                        onClick={() => setShowGstTypeDropdown(!showGstTypeDropdown)}
                        className='flex justify-center items-center p-4 h-10 bg-blue-700 border-none rounded-md hover:bg-blue-500'
                    >
                        {gstTypeFilter ? (
                            <FunnelX className='text-white' />
                        ) : (
                            <Funnel className='text-white' />
                        )}
                    </button>
                </div>
            </div>
            {/* Customer Type Dropdown */}
            {showGstTypeDropdown && (
                <div className="absolute top-28 right-5 md:w-80 sm:w-40 z-10 bg-white shadow-lg rounded-md p-4">
                    <div className='flex justify-end'>
                        <button
                            onClick={() => {
                                setGstTypeFilter(null);
                                setShowGstTypeDropdown(false);
                            }}
                            className="text-red-500  font-semibold hover:text-red-700">
                            clear filter
                        </button>
                    </div>
                    <div className="flex flex-col items-center">

                        <h3 className="font-semibold mb-2">Select GST Type</h3>
                        <button
                            onClick={() => {
                                setGstTypeFilter('cgst_sgst');
                                setShowGstTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            INTRASTATE
                        </button>
                        <button
                            onClick={() => {
                                setGstTypeFilter('igst');
                                setShowGstTypeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            INTERSTATE
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
                            className={`p-2 w-24 rounded-full text-white ${filter === 'paid' ? 'bg-green-600' : 'bg-gray-200'}`}
                            onClick={() => setFilter('paid')}
                        >
                            Paid
                        </button>
                        <button
                            className={`p-2 w-24 rounded-full text-white ${filter === 'unpaid' ? 'bg-red-600' : 'bg-gray-200'}`}
                            onClick={() => setFilter('unpaid')}
                        >
                            Unpaid
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
                        <thead className="sticky top-0 bg-white border-b border-gray-400 text-sm text-gray-600 rounded-xl">
                            <tr>
                                <th className="p-3 text-center">Si.No</th>
                                <th className="p-3 text-center">Invoice Number</th>
                                <th className="p-3 text-center">Customer Name</th>
                                <th className="p-3 text-center">Invoice Date</th>
                                <th className="p-3 text-center">Sub Total</th>
                                <th className="p-3 text-center">Total Tax</th>
                                <th className="p-3 text-center">Grand Total</th>
                                <th className="p-3 text-center">Gst Type</th>
                                <th className="p-3 text-center">Payable Tax</th>
                                <th className="p-3 text-center">Tax Status</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTax.length > 0 ? (
                                currentTax.map((taxpay, index) => (
                                    <React.Fragment key={taxpay.id}>
                                        <tr
                                            onClick={() => handleRowClick(taxpay)}
                                            className="hover:bg-gray-100 text-sm transition-all duration-300 border-b border-gray-400 text-gray-700"
                                        >
                                            <td className="p-2 text-center">{index + 1}</td>
                                            <td className="p-2 text-center">{taxpay.invoice_number}</td>
                                            <td className="p-2 text-center">{taxpay.customer_name}</td>
                                            <td className="p-2 text-center">{taxpay.invoice_date}</td>
                                            <td className="p-2 text-center">{taxpay.sub_total}</td>
                                            <td className="p-2 text-center">{taxpay.total_gst}</td>
                                            <td className="p-2 text-center">{taxpay.grand_total}</td>
                                            <td className="p-2 text-center font-semibold ">
                                                {taxpay.gst_type === 'igst' ? 'IGST' :
                                                    taxpay.gst_type === 'cgst_sgst' ? 'CGST SGST' : taxpay.gst_type.toUpperCase()}
                                            </td>
                                            <td className="p-2 text-center text-red-500 font-semibold">{taxpay.total_payable_tax}</td>
                                            <td className="p-3 text-center"><span
                                                className={`px-1 flex justify-center items-center rounded-3xl text-white font-semibold border ${taxpay.tax_status === 'paid' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-red-500 hover:bg-violet-400'
                                                    }`}
                                            >
                                                {taxpay.tax_status.charAt(0).toUpperCase() + taxpay.tax_status.slice(1)}
                                            </span></td>
                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={(e) => handleToggleRow(e, taxpay.id)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    {expandedRow === taxpay.id ? <ChevronUp /> : <ChevronDown />} {/* Toggle icon */}

                                                </button>
                                            </td>
                                        </tr>

                                        {/* This is the expanded row that will show additional details */}
                                        {expandedRow === taxpay.id && (
                                            <tr>
                                                <td colSpan="11" className=" bg-gray-100">
                                                    {/* You can add any additional information here */}
                                                    <div className='flex flex-col gap-2 p-2 h-20 '>
                                                        <div className='flex justify-between'>
                                                            <h1 className='underline'>Tax Calculation</h1>
                                                            <p className='border px-2 rounded-xl'> Calculation Logic = Output Tax - Input Tax = Payable Tax</p>
                                                        </div>
                                                        <div className='flex justify-between' >
                                                            <p className='font-semibold' >Input Tax Credit = <span className='pl-2 text-blue-600'>{taxpay.total_input_tax}</span></p>
                                                            <p className='font-semibold' >Output Tax Collected = <span className='pl-2 text-green-600'>{taxpay.total_output_tax}</span></p>
                                                            <p className='font-semibold' >Payable Tax =<span className='pl-2 text-red-600'>{taxpay.total_payable_tax}</span></p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="p-3 text-center text-red-500 font-semibold">
                                        No tax details found for the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for updating tax status */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-md max-w-lg w-full">
                        <p className="text-lg font-semibold text-blue-800">{selectedItem.invoice_number}</p>
                        <h3 className="text-md text-gray-600 mt-2">You want to change the tax status of this invoice?</h3>

                        <div className="mt-4 flex flex-col gap-4">
                            <select
                                value={taxStatus}
                                onChange={(e) => setTaxStatus(e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxView;
