import { useState, useEffect } from 'react';
import { BadgePlus, Funnel, Trash2, SquarePen, Eye, CalendarRange, CalendarX2, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import PurchaseActionPopUpView from './PurchaseActionPopUpView';
import axios from 'axios';

const PurchaseView = ({ setActiveSection, setPurchaseId, purchases, setPurchases, refreshPurchase }) => {

  const [filter, setFilter] = useState('all'); // Default filter to 'all'
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion
  const [showActions, setShowActions] = useState({});
  const [selectedPurchase, setSelectedPurchase] = useState(null);  // Selected invoice state

  const [filteredPurchase, setFilteredPurchase] = useState(purchases); // State to store filtered purchase list

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const [isPopupDeleteConfirm, setIsPopupDeleteConfirm] = useState(false); // State to control popup visibility
  const [isPopupActionView, setIsPopupActionView] = useState(false); // State to control popup visibility
  const closePopupActionView = () => setIsPopupActionView(false);
  const showPopupAction = () => setIsPopupActionView(true);

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    // Fetch data from Django backend
    axios.get('http://localhost:8000/api/purchase/')
      .then(response => {
        setPurchases(response.data); // Set items in state
        setFilteredPurchase(response.data); // Initialize filtered list
        refreshPurchase();
      })
      .catch(error => {
        console.error('There was an error fetching the Purchase Data!', error);
        setLoading(false);  // Stop loading if there's an error
      });
  }, []);

  // Handle filter change
  useEffect(() => {
    filterPurchases();
  }, [filter, purchases, searchQuery]);

  const filterPurchases = () => {
    let filtered = purchases;

    // Filter by status (active, inactive, etc.)
    if (filter !== 'all') {
      filtered = filtered.filter(purchase => purchase.status === filter);
    }

    // Filter by search query on name, sku_code, hsn_sac_code, or barcode
    if (searchQuery) {
      setCurrentPage(1); // Reset to first page when the filter changes
      filtered = filtered.filter(purchase => {
        // Use optional chaining and nullish coalescing to prevent errors on null/undefined
        const invoice_number = purchase.invoice_number ? purchase.invoice_number.toLowerCase() : '';
        const purchase_date = purchase.purchase_date ? purchase.purchase_date.toLowerCase() : '';
        const grand_total = purchase.grand_total ? purchase.grand_total.toLowerCase() : '';
        const vendor_name = purchase.vendor_name ? purchase.vendor_name.toLowerCase() : '';
        const createdAt = purchase.created_at ? purchase.created_at.toLowerCase() : '';

        return (
          invoice_number.includes(searchQuery.toLowerCase()) ||
          purchase_date.includes(searchQuery.toLowerCase()) ||
          grand_total.includes(searchQuery.toLowerCase()) ||
          vendor_name.includes(searchQuery.toLowerCase()) ||
          createdAt.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredPurchase(filtered);
    setCurrentPage(1); // Reset to first page when the filter changes
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);  // Set the selected date
    if (!date) {
      setFilteredPurchase(purchases);  // If no date is selected, show all invoices
      return;
    }

    // Filter invoices based on the selected date
    const filtered = purchases.filter((purchase) => {
      const PurchaseDate = new Date(purchase.purchase_date);
      setCurrentPage(1); // Reset to first page when the filter changes
      const selectedDateWithoutTime = new Date(date);
      selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

      return PurchaseDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
    });

    setFilteredPurchase(filtered);  // Update the filtered invoices list
  };

  const handleClearDate = () => {
    setSelectedDate(null);  // Reset the selected date
    setFilteredPurchase(purchases);  // Reset the customer list
  };

  const handleRowClick = (id) => {
    // Find the selected purchase object by ID
    const selected = purchases.find(purchase => purchase.id === id);
    setSelectedPurchase(selected);  // Store the entire purchase object
    setIsPopupActionView(true);  // Open the popup
    console.log('selected purchase', selected); // Log the entire purchase object
  };

  // Get current customers to display based on pagination
  const indexOfLastPurchase = currentPage * itemsPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - itemsPerPage;
  const currentPurchase = filteredPurchase.slice(indexOfFirstPurchase, indexOfLastPurchase);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPurchase.length / itemsPerPage);


  return (
    <div className='flex flex-col'>
      <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
        <h1 style={{
          fontFamily: '"Outfit", sans-serif',  // Apply Google font
          fontWeight: 600,                    // Apply bold weight
          fontOpticalSizing: 'auto',           // Apply optical sizing
        }}
          className='text-blue-700 text-2xl p-2'>Purchase Details</h1>
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
            onClick={() => setActiveSection('purchase-form-add')}
            className='flex items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
            <BadgePlus
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
              className={`p-2 w-24 rounded-full text-white ${filter === 'paid' ? 'bg-green-600' : 'bg-gray-200'}`}
              onClick={() => setFilter('paid')}
            >
              Paid
            </button>
            <button
              className={`p-2 w-24 rounded-full text-white ${filter === 'partial' ? 'bg-purple-600' : 'bg-gray-200'}`}
              onClick={() => setFilter('partial')}
            >
              Partial
            </button>
            <button
              className={`p-2 w-24 rounded-full text-white ${filter === 'pending' ? 'bg-red-600' : 'bg-gray-200'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
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
                  placeholderText='Select Purcahse Date'
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
                <th className="p-3 text-center">Vendor</th>
                <th className="p-3 text-center">Invoice Number</th>
                <th className="p-3 text-center">Purchase Date</th>
                <th className="p-3 text-center">Sub Total</th>
                <th className="p-3 text-center">Discount</th>
                <th className="p-3 text-center">Total Tax</th>
                <th className="p-3 text-center">Grand Total</th>
                <th className="p-3 text-center">Amount Paid</th>
                <th className="p-3 text-center">Balance Due</th>
                <th className="p-3 text-center">Status</th>
                {/* <th className="p-3 text-center">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {currentPurchase && currentPurchase.length > 0 ? (
                currentPurchase.map((purchase, index) => (
                  <tr key={purchase.id}
                    onClick={() => handleRowClick(purchase.id)}
                    className="hover:bg-gray-100 transition-all duration-300 border-b text-sm border-gray-400 text-gray-700">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{purchase.vendor_name}</td>
                    <td className="p-3 text-center">{purchase.invoice_number}</td>
                    <td className="p-3 text-center">{purchase.purchase_date}</td>
                    <td className="p-3 text-center">{purchase.subtotal}</td>
                    <td className="p-3 text-center">{purchase.discount}</td>
                    <td className="p-3 text-center">{purchase.total_tax}</td>
                    <td className="p-3 text-center">{purchase.grand_total}</td>
                    <td className="p-3 text-center">{purchase.amount_paid}</td>
                    <td className="p-3 text-center">{purchase.balance_due}</td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`px-1 flex justify-center rounded-md border 
                              ${purchase.status === 'paid' ? 'bg-green-400 font-semibold border-green-500 text-white shadow-md' : // Green border for paid
                            purchase.status === 'partial' ? 'bg-purple-400 font-semibold border-purple-500 text-white shadow-md' : // Blue border for partial
                              purchase.status === 'pending' ? 'bg-red-400 font-semibold border-red-500 text-white shadow-lg' : ''}`}
                      >
                        {/* Display the status as Paid, Partial, Unpaid */}
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {/* <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(purchase.id); }}  // Stop row click propagation
                        className="text-red-400 hover:text-red-600">
                        <Trash2 />
                      </button> */}
                    </td>
                  </tr>
                ))) : (
                <td colSpan="11" className="p-3 text-center text-red-500 font-semibold">
                  No Purchase found for the selected filters.
                </td>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Popup Section */}
      {
        isPopupActionView && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
            <div className="bg-white p-4 rounded-lg shadow-xl w-3/4"
              style={{ maxWidth: '700px' }}>
              {/* Back Button */}

              <PurchaseActionPopUpView purchase={selectedPurchase}
                refreshPurchase={refreshPurchase}
                setPurchaseId={setPurchaseId}
                setActiveSection={setActiveSection}
                closePopupActionView={closePopupActionView} />
            </div>
          </div>
        )
      }
    </div>
  )
}

export default PurchaseView
