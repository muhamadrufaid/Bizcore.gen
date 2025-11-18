import React, { useState, useEffect } from 'react';
import { Search, CalendarX2, Trash2, CalendarRange, CirclePlus } from 'lucide-react';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import the necessary styles
import axios from 'axios';

const CategoryView = ({ setActiveSection, setCategoryId }) => {
  const [filter, setFilter] = useState('all'); // Default filter to 'all'
  const [showActions, setShowActions] = useState({}); // To keep track of which product's actions are visible
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for deletion

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    // Fetch data from Django backend
    axios.get('http://localhost:8000/api/categories/')
      .then(response => {
        setCategories(response.data); // Set items in state
        setFilteredCategories(response.data); // Initialize filtered list
      })
      .catch(error => {
        console.error('There was an error fetching the Categories Data!', error);
      });
  }, []);

  // Handle filter change
  useEffect(() => {
    filterCategories();
  }, [filter, categories, searchQuery]);

  const filterCategories = () => {
    let filtered = categories;

    // Filter by search query on name, sku_code, hsn_sac_code, or barcode
    if (searchQuery) {
      filtered = filtered.filter(category => {
        // Use optional chaining and nullish coalescing to prevent errors on null/undefined
        const name = category.name ? category.name.toLowerCase() : '';
        const description = category.description ? category.description.toLowerCase() : '';
        const createdAt = category.created_at ? category.created_at.toLowerCase() : '';

        return (
          name.includes(searchQuery.toLowerCase()) ||
          description.includes(searchQuery.toLowerCase()) ||
          createdAt.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredCategories(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);  // Set the selected date
    if (!date) {
      setFilteredCategories(categories);  // If no date is selected, show all customers
      return;
    }

    // Filter customers based on the selected date
    const filtered = categories.filter((category) => {
      const categoryDate = new Date(category.created_at);
      const selectedDateWithoutTime = new Date(date);
      selectedDateWithoutTime.setHours(0, 0, 0, 0); // Set the selected date to midnight to ignore time

      return categoryDate.toDateString() === selectedDateWithoutTime.toDateString();  // Compare date part only
    });

    setFilteredCategories(filtered);  // Update the filtered customers list
  };

  const handleClearDate = () => {
    setSelectedDate(null);  // Reset the selected date
    setFilteredCategories(categories);  // Reset the customer list
  };

  // Handle filter change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredCategories(categories); // Show all customers
    } else {
      setFilteredCategories(categories.filter(categories => categories.status === filter)); // Filter by status
    }
  }, [filter, categories]);

  const handleDelete = (id) => {
    setSelectedItem(id);  // Set the selected item to delete
    setShowModal(true);    // Show the confirmation modal
  }

  const confirmDelete = () => {
    axios.delete(`http://localhost:8000/api/categories/${selectedItem}/`)  // Call DELETE API
      .then(response => {
        console.log(`Category with ID ${selectedItem} deleted`);
        // Update the customers state by filtering out the deleted customer
        setCategories(categories.filter(categories => categories.id !== selectedItem));
        setFilteredCategories(filteredCategories.filter(categories => categories.id !== selectedItem)); // Update filtered list
        setShowModal(false); // Close the modal after successful deletion
      })
      .catch(error => {
        console.error('There was an error deleting the category!', error);
      });
  }

  const handleRowClick = (id) => {
    // Set the customer ID for detail view
    setCategoryId(id);
    // Navigate to customer detail view
    setActiveSection('category-detail');  // You should have a section for customer details
    console.log(`Show details for category with ID: ${id}`);
  }


  return (
    <div className='flex flex-col'>
      <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
        <h1 style={{
          fontFamily: '"Outfit", sans-serif',  // Apply Google font
          fontWeight: 600,                    // Apply bold weight
          fontOpticalSizing: 'auto',           // Apply optical sizing
        }}
          className='text-blue-700 text-2xl p-2'>Category Details</h1>
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
            onClick={() => setActiveSection('category-add')}
            className='flex items-center p-4 h-10 bg-blue-700 rounded-md hover:bg-blue-500'>
            <CirclePlus
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
            className={`p-2 w-24 rounded-full text-white ${filter === 'inactive' ? 'bg-red-600' : 'bg-gray-200'}`}
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </button>
          <h2 className="text-md text-gray-600 flex items-center justify-center font-semibold">
            {selectedDate ? `Selected Date: ${selectedDate.toLocaleDateString()}` : ''}
          </h2>
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
              <th className="p-3 text-center">Si.No</th>
              <th className="p-3 text-center">Category Name</th>
              <th className="p-3 text-center">Description</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <tr key={category.id}
                  onClick={() => handleRowClick(category.id)}
                  className="hover:bg-gray-100 transition-all duration-300 border-b border-gray-400 text-gray-700">
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3 text-center">{category.name}</td>
                  <td className="p-3 text-center">{category.description}</td>
                  <td className="p-3 text-center"><span
                    className={`flex justify-center rounded-3xl border ${category.status === 'active' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                      }`}
                  >
                    {category.status}
                  </span></td>
                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }}  // Stop row click propagation
                      className="text-red-400 hover:text-red-600">
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))) : (
              <td colSpan="5" className="p-3 text-center text-red-500 font-semibold">
                No category found for the selected filters.
              </td>
            )}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal for Deletion */}
      {
        showModal && (
          <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
              <h2 className="text-xl font-semibold text-gray-700">Are you sure you want to delete this Category?</h2>
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
        )
      }
    </div >
  )
}

export default CategoryView
