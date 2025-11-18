import React, { useState, useEffect } from 'react';
import { PackagePlus, Funnel, Search, Trash2, FunnelX, CalendarX2, CalendarRange, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary style

const ProductsView = ({ setActiveSection, setProductId }) => {
  const [filter, setFilter] = useState('all'); // Default filter to 'all'
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const [selectedDate, setSelectedDate] = useState(null);
  const [showActions, setShowActions] = useState(false); // To toggle the funnel filter dropdown
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [categories, setCategories] = useState([]); // Categories to filter products by
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category for filtering

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    // Fetch data from Django backend for products
    axios.get('http://localhost:8000/api/products/')
      .then(response => {
        setProducts(response.data); // Set items in state
        setFilteredProducts(response.data); // Initialize filtered list
      })
      .catch(error => {
        console.error('There was an error fetching the Product Data!', error);
        setLoading(false);  // Stop loading if there's an error
      });

    // Fetch categories from Django backend
    axios.get('http://localhost:8000/api/categories/')
      .then(response => {
        setCategories(response.data); // Set categories in state
      })
      .catch(error => {
        console.error('There was an error fetching the Category Data!', error);
        setLoading(false);  // Stop loading if there's an error
      });
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filter, products, searchQuery, selectedCategory, selectedDate]);

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by status (active, inactive, etc.)
    if (filter !== 'all') {
      filtered = filtered.filter(product => product.status === filter);
    }

    // Filter by search query (name, sku_code, hsn_sac_code, barcode)
    if (searchQuery) {
      setCurrentPage(1); // Reset to first page when the filter changes
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.hsn_sac_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category_name === selectedCategory);
    }

    // Filter by selected date
    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(product =>
        new Date(product.created_at).toISOString().split('T')[0] === selectedDateString
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when the filter changes

  };

  const handleDateChange = (date) => {
    setCurrentPage(1); // Reset to first page when the filter changes
    setSelectedDate(date);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleDelete = (id) => {
    setSelectedItem(id);  // Set the selected item to delete
    setShowModal(true);    // Show the confirmation modal
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8000/api/products/${selectedItem}/`)  // Call DELETE API
      .then(response => {
        console.log(`Product with ID ${selectedItem} deleted`);
        // Update the products state by filtering out the deleted product
        setProducts(products.filter(product => product.id !== selectedItem));
        setFilteredProducts(filteredProducts.filter(product => product.id !== selectedItem)); // Update filtered list
        setShowModal(false); // Close the modal after successful deletion
      })
      .catch(error => {
        console.error('There was an error deleting the product!', error);
      });
  };

  const handleRowClick = (id) => {
    setProductId(id);
    // Navigate to product detail view
    setActiveSection('product-detail');
    console.log(`Show details for product with ID: ${id}`);
  };

  // Get current customers to display based on pagination
  const indexOfLastProducts = currentPage * itemsPerPage;
  const indexOfFirstProducts = indexOfLastProducts - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProducts, indexOfLastProducts);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);



  return (
    <div className='flex flex-col'>
      <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
        <h1 style={{
          fontFamily: '"Outfit", sans-serif',  // Apply Google font
          fontWeight: 600,                    // Apply bold weight
          fontOpticalSizing: 'auto',           // Apply optical sizing
        }}
          className='text-blue-700 text-2xl p-2'>Products Details</h1>
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
            onClick={() => setShowActions(!showActions)}
            className='flex justify-center items-center p-4 h-10 bg-blue-700 border-none rounded-md hover:bg-blue-500'>
            {showActions ? (
              <FunnelX className='text-white' /> // Show "X" when showActions is true (filter is active)
            ) : (
              <Funnel className='text-white' /> // Show "Funnel" when showActions is false (filter is inactive)
            )}
          </button>
          <button
            onClick={() => setActiveSection('product-add')}
            className='flex items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
            <PackagePlus className='text-white' />
          </button>
        </div>
      </div>

      {/* Category Filter Dropdown */}
      {showActions && (
        <div className="absolute top-28 right-5 md:w-80 sm:w-40 z-10 bg-white shadow-lg rounded-md p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold mb-2">Select Category</h3>
            <button
              onClick={() => {
                setShowActions(false);
                setSelectedCategory('');
              }}
              className="text-red-500 font-semibold hover:text-red-700">
              clear filter
            </button>
          </div>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            className="w-full p-2 border rounded-sm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
            <button
              className={`p-2 w-28 rounded-full text-white ${filter === 'out_of_stock' ? 'bg-indigo-600' : 'bg-gray-200'}`}
              onClick={() => setFilter('out_of_stock')}
            >
              Out Of Stock
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

          {/* this is category enable name display place and also click the icon FunnelX clear filter */}
          <div className='flex justify-center items-center pr-5'>
            {selectedCategory && !showActions && (
              <div className='flex justify-center items-center gap-2 p-4'>
                <FunnelX
                  onClick={() => {
                    setSelectedCategory('');
                    filterProducts(); // Reset category filter
                  }}
                  className='w-4 h-4' />
                <h1 className='font-semibold text-md'>Filter: <span className='text-green-400 hover:text-green-500'>{selectedCategory}</span> </h1>
              </div>
            )}
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
      </div>

      <div className='m-2 bg-white overflow-x-auto max-h-120 custom-scrollbar rounded-xl pb-5 custom-shadow-black'>
        <table className="bg-white w-full table-auto border-collapse rounded-lg">
          <thead className="sticky top-0 bg-white border-b border-gray-400 text-sm text-gray-600 rounded-xl">
            <tr>
              <th className="p-3 text-center">Si.No</th>
              <th className="p-3 text-center">Product Name</th>
              <th className="p-3 text-center">Sku Code</th>
              <th className="p-3 text-center">HSN/SAC Code</th>
              <th className="p-3 text-center">Barcode</th>
              <th className="p-3 text-center">Retail Price</th>
              <th className="p-3 text-center">Wholesale Price</th>
              <th className="p-3 text-center">Gst Rate %</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <tr
                  key={product.id}
                  onClick={() => handleRowClick(product.id)}
                  className="hover:bg-gray-100 transition-all duration-300 border-b border-gray-400 text-gray-700"
                >
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3 text-center">{product.name}</td>
                  <td className="p-3 text-center">{product.sku_code}</td>
                  <td className="p-3 text-center">{product.hsn_sac_code}</td>
                  <td className="p-3 text-center">{product.barcode}</td>
                  <td className="p-3 text-center">{product.retail_price}</td>
                  <td className="p-3 text-center">{product.wholesale_price}</td>
                  <td className="p-3 text-center">{product.gst_rate}</td>
                  <td className="p-3 text-center">{product.stock_quantity}</td>
                  <td className="p-3 text-center">{product.category_name}</td> {/* Category Name */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 flex justify-center items-center rounded-3xl border-2 
                        ${product.status === 'active' ? 'border-[transparent] bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text' : // Gradient border and text for active
                          product.status === 'inactive' ? 'border-[transparent] bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text' : // Gradient border and text for returned
                            product.status === 'out_of_stock' ? 'border-[transparent] bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text' : // Gradient border and text for amended

                              'border-gray-600 text-gray-600'}`} // Default gray color for unknown statuses
                    >
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} // Stop row click propagation
                      className="text-red-400 hover:text-red-600">
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))) : (
              <tr>
                <td colSpan="12" className="p-3 text-center text-red-500 font-semibold">
                  No products found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-700">Are you sure you want to delete this Product<br></br> <span className="font-semibold text-blue-500">{products.find(p => p.id === selectedItem)?.name}</span> <span className='text-blue-500' >?</span></h2>
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
  );
};

export default ProductsView;
