import React, { useState, useEffect } from 'react';
import { Eye, Search, CalendarX2, ChevronLeft, CalendarRange, ChevronRight, X, Trash2, PencilLine } from 'lucide-react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import { toast } from 'react-toastify';
import DraftInvoicePreview from './DraftInvoicePreview';

const DraftView = ({ setActiveSection, setDraftInvoiceId, draftInvoices, setDraftInvoices, refreshDraftInvoices }) => {

  const [filter, setFilter] = useState('all');
  const [filteredDraftInvoice, setFilteredDraftInvoice] = useState(draftInvoices);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(24); // Number of items per page

  const [showPreview, setShowPreview] = useState(false);  // For controlling the preview modal
  const [previewDraft, setPreviewDraft] = useState(null);  // For storing the selected draft invoice

  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    // Fetch data from Django backend
    axios.get('http://localhost:8000/api/draft-invoices/')
      .then(response => {
        setDraftInvoices(response.data); // Set items in state
        setFilteredDraftInvoice(response.data); // Initialize filtered list
        refreshDraftInvoices();
      })
      .catch(error => {
        console.error('There was an error fetching the Draft Invoices!', error);
      });
  }, []);


  // Handle filter change
  useEffect(() => {
    filterDraftInvoice();
  }, [filter, draftInvoices, searchQuery]);

  const filterDraftInvoice = () => {
    let filtered = draftInvoices;

    // Filter by status (active, inactive, etc.)
    if (filter !== 'all') {
      filtered = filtered.filter(draft => draft.invoice_status === filter);
    }

    // Filter by search query on name, sku_code, hsn_sac_code, or barcode
    if (searchQuery) {
      setCurrentPage(1); // Reset to first page when the filter changes
      filtered = filtered.filter(draft => {
        // Use optional chaining and nullish coalescing to prevent errors on null/undefined
        const draft_number = draft.draft_number ? draft.draft_number.toLowerCase() : '';
        const draft_date = draft.draft_date ? draft.draft_date.toLowerCase() : '';
        const grand_total = draft.grand_total ? draft.grand_total.toLowerCase() : '';
        const customer_name = draft.customer_name ? draft.customer_name.toLowerCase() : '';
        const createdAt = draft.created_at ? draft.created_at.toLowerCase() : '';

        return (
          draft_number.includes(searchQuery.toLowerCase()) ||
          draft_date.includes(searchQuery.toLowerCase()) ||
          grand_total.includes(searchQuery.toLowerCase()) ||
          customer_name.includes(searchQuery.toLowerCase()) ||
          createdAt.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredDraftInvoice(filtered);
    const paginate = (pageNumber) => {
      // Don't reset page when changing pages
      setCurrentPage(pageNumber);
    };
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);  // Set the selected date
    if (!date) {
      setFilteredDraftInvoice(draftInvoices);  // If no date is selected, show all invoices
      return;
    }

    // Filter invoices based on the selected date
    const filtered = draftInvoices.filter((drafts) => {
      const DraftDate = new Date(drafts.created_at);
      setCurrentPage(1); // Reset to first page when the filter changes
      const selectedDateWithoutTime = new Date(date);
      selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

      return DraftDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
    });

    setFilteredDraftInvoice(filtered);  // Update the filtered invoices list
  };

  const handleClearDate = () => {
    setSelectedDate(null);  // Reset the selected date
    setFilteredDraftInvoice(draftInvoices);  // If no date is selected, show all invoices
  };

  const handleDelete = (id) => {
    // Confirm delete action
    axios.post(`http://localhost:8000/api/draft-invoices/${id}/cancel/`)
      .then(response => {
        toast.success('Draft invoice deleted successfully.');
        refreshDraftInvoices(); // Refresh the list of invoices
        setShowPopUp(false)
      })
      .catch(error => {
        toast.error('Error deleting the draft invoice.');
        console.error(error);
      });
  };

  const handleRowClick = (id) => {
    setSelectedItem(id);  // Correctly set the invoice ID
    setShowPopUp(true);    // Show the pop-up with the correct ID
  };

  const handlePreview = (id) => {
    // Find the draft invoice by ID from the filtered list
    const draftToPreview = filteredDraftInvoice.find(draft => draft.id === id);
    if (draftToPreview) {
      console.log("draftPreview", draftToPreview)
      setPreviewDraft(draftToPreview);  // Set the draft data to preview
      setShowPreview(true);  // Show the preview modal
    }
    setShowPopUp(false);
  };

  const handleEdit = async (id) => {
    try {
      // Fetch the invoice data by ID to check its status
      const response = await axios.get(`http://127.0.0.1:8000/api/draft-invoices/${id}/`);
      const invoice = response.data;  // Get the invoice data

      // Check if the invoice is finalized or cancelled
      if (invoice.invoice_status === 'finalized' || invoice.invoice_status === 'cancelled') {
        // Show a toast message if the invoice is finalized or cancelled
        toast.error('The draft invoice is already finalized or cancelled, cannot open');
      } else {
        // Set the invoice ID for the detail view
        setDraftInvoiceId(id);

        // Refresh the draft invoices list if needed
        refreshDraftInvoices();

        // Navigate to the invoice detail edit view
        setActiveSection('draft-edit');
        console.log(`Show details for draft invoice with ID: ${id}`);
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      toast.error('An error occurred while fetching the invoice data.');
    }
  };


  // Get current customers to display based on pagination
  const indexOfLastDraftInvoice = currentPage * itemsPerPage;
  const indexOfFirstDraftInvoice = indexOfLastDraftInvoice - itemsPerPage;
  const currentDraftInvoice = filteredDraftInvoice.slice(indexOfFirstDraftInvoice, indexOfLastDraftInvoice);

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

  const totalPages = Math.ceil(filteredDraftInvoice.length / itemsPerPage);

  return (
    <div className='flex flex-col'>
      <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
        <h1 style={{
          fontFamily: '"Outfit", sans-serif',  // Apply Google font
          fontWeight: 600,                    // Apply bold weight
          fontOpticalSizing: 'auto',           // Apply optical sizing
        }}
          className='text-blue-700 text-2xl p-2'>Draft Invoice Detials</h1>
        <div className='flex pr-2 gap-2'>
          <div className='flex justify-between bg-blue-700 w-80 rounded-md p-0.5 pl-1 p-4 h-10'>
            <div style={{ background: 'rgba(241,246,250,255)' }} className="flex rounded-lg w-76 pl-2 ">
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
        </div>
      </div>

      <div className="grid p-4">
        <div>
          {/* Filter Buttons */}
          <div className='flex justify-between items-center p-2 pl-4'>
            <div className="flex items-center gap-4">

              <button
                className={`p-2 w-24 rounded-full text-white ${filter === 'all' ? 'bg-indigo-600' : 'bg-gray-200'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`p-2 w-24 rounded-full text-white ${filter === 'draft' ? 'bg-blue-600' : 'bg-gray-200'}`}
                onClick={() => setFilter('draft')}
              >
                Draft
              </button>
              <button
                className={`p-2 w-24 rounded-full text-white ${filter === 'finalized' ? 'bg-green-600' : 'bg-gray-200'}`}
                onClick={() => setFilter('finalized')}
              >
                Finalized
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
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="py-1 mx-1 border border-blue-500 text-blue-500 rounded-xs disabled:bg-gray-400"><ChevronLeft /></button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2 ? (
                  <button key={pageNumber} onClick={() => paginate(pageNumber)} className={`px-2 py-1 mx-1 ${currentPage === pageNumber ? 'border border-blue-700 text-blue-500' : 'border-blue-500 text-blue-400'} rounded-xs`}>
                    {pageNumber}
                  </button>
                ) : null;
              })}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="py-1 mx-1 border border-blue-500 text-blue-500 rounded-xs disabled:bg-gray-400"><ChevronRight /></button>
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

          {/* Draft Invoices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 p-4">
            {currentDraftInvoice.length > 0 ? currentDraftInvoice.map(draftInvoice => (
              <div key={draftInvoice.id} onClick={() => handleRowClick(draftInvoice.id)} className="bg-gray-200 p-4 rounded-md shadow-md hover:bg-gray-300 cursor-pointer">
                <p className="text-sm font-medium text-gray-700  ">{draftInvoice.draft_number}</p>
                <p className="text-xs text-gray-500">{draftInvoice.created_at.split('T')[0]}</p>
                <p className="text-xs text-gray-500 mt-2">{draftInvoice.customer_name}</p>
              </div>
            )) : <div>No Drafts found for the selected filters.</div>}
          </div>
        </div>
      </div>

      {/* InvoiceActionPopUp: Show on row click */}
      {showPopUp && (
        <div className="fixed inset-0  flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-160 h-55">
            <div className="flex justify-between">
              <div className='flex flex-col gap-1'>
                <h1 className='text-blue-500 text-xl '>Draft Invoice Action</h1>
                <h3 className="text-md ">You want to perform actions to this draft-invoice { }</h3>
                <p>Customer Name</p>
              </div>
            </div>
            <div className="flex justify-center pt-8 items-end  gap-6">
              <button
                onClick={() => setShowPopUp(false)}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
              >
                <X />
              </button>
              <button
                onClick={() => handlePreview(selectedItem)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                <Eye />
              </button>
              <button
                onClick={() => handleEdit(selectedItem)}  // Pass the selected invoice ID here
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                <PencilLine />
              </button>
              <button
                onClick={() => handleDelete(selectedItem)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                <Trash2 />
              </button>

            </div>
          </div>
        </div>
      )}
      {/* Show Preview Modal */}
      {showPreview && previewDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-3/4">
            {/* Pass the previewDraft data as a prop */}
            <DraftInvoicePreview draft={previewDraft} onClose={() => setShowPreview(false)} />
          </div>
        </div>
      )}
    </div >
  );
}

export default DraftView;
