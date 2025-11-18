import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import axios from 'axios';

const CategoryAddView = ({ setActiveSection }) => {

  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(categoryData);  // Log the data to check it

    axios.post('http://localhost:8000/api/categories/', categoryData)
      .then(response => {
        console.log('Category created:', response.data);
        // Optionally, navigate to the customer list after successful creation
        setActiveSection('category-view');
      })
      .catch(error => {
        console.error('There was an error creating the category:', error);
        console.log(error.response.data);  // Log the error response to get more details
      });
  };



  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
        <div className='flex items-center'>
          <button
            onClick={() => setActiveSection('category-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
          >
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            New Category
          </h1>
        </div>
        <div
          onClick={handleSubmit}
          className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
          <Save className='w-5 h-5' />
          <button className=''>
            Save Category
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md m-4">
        <form>
          <div className="grid grid-cols-2 md:grid-cols-3 sm:grid-cols-1 gap-4 ">
            <div className="flex flex-col">
              <label className="text-gray-700">Category Name</label>
              <input
                type="text"
                name="name"
                value={categoryData.name}
                onChange={handleChange}
                className="border p-2 rounded-md"
                placeholder="Enter category name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={categoryData.description}
                onChange={handleChange}
                className="border p-2 rounded-md"
                placeholder="Enter description"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryAddView
