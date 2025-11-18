import React, { useState, useEffect } from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';
import axios from 'axios';

const CategoryDetailView = ({ setActiveSection, categoryId, setCategoryData }) => {

  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (categoryId) {
      // Fetch customer data based on ID
      axios.get(`http://localhost:8000/api/categories/${categoryId}/`)
        .then(response => {
          setCategory(response.data);  // Set the customer data
          setCategoryData(response.data);  // Pass the customer data to parent for editing
        })
        .catch(error => {
          console.error('Error fetching category details:', error);
        });
    }
  }, [categoryId, setCategoryData]);

  if (!category) {
    return <div>Loading...</div>; // Show loading until customer data is fetched
  }


  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400">
        <div className='flex items-center'>
          <button
            onClick={() => setActiveSection('category-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Category Detail
          </h1>
        </div>
        <div
          onClick={() => setActiveSection('category-edit')}
          className='flex items-center justify-center bg-blue-500 w-30  h-8 rounded-md hover:bg-blue-700 p-5'>
          <button
            className="flex gap-2 text-white"><SquarePen />
            <label className='text-white'>Edit </label>
          </button>
        </div>

      </div>
      <div className="bg-white p-6 rounded-lg shadow-md m-4">

        {/* Product Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Category Name</label>
            <p className="text-gray-800">{category.name}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Description</label>
            <p className="text-gray-800">{category.description}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Status</label>
            <p className="text-gray-800">{category.status}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Created at</label>
            <p className="text-gray-800">{category.created_at}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Updated at</label>
            <p className="text-gray-800">{category.updated_at}</p>
          </div>

        </div>
      </div>
    </div >
  )
}

export default CategoryDetailView
