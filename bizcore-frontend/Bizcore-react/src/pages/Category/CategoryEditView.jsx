import React, { useState, useEffect } from 'react'
import { ChevronLeft, SaveAll } from 'lucide-react';
import axios from 'axios';

const CategoryEditView = ({ setActiveSection, categoryData }) => {
    const statusOptions = ['active', 'inactive'];


    const [formData, setFormData] = useState({
        name: categoryData?.name || '',
        description: categoryData?.description || '',
        status: categoryData?.status || 'active',
    });

    useEffect(() => {
        if (categoryData) {
            setFormData({
                name: categoryData?.name || '',
                description: categoryData?.description || '',
                status: categoryData?.status || 'active',
            });
        }
    }, [categoryData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData); // Log the entire form data

        axios.put(`http://localhost:8000/api/categories/${categoryData.id}/`, formData)
            .then(response => {
                console.log("Category updated successfully", response.data);
                setActiveSection('category-view');
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error updating category:', error.response.data);
                    alert(`Error: ${error.response.data}`);
                }
            });
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center pr-2 justify-between bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('category-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Category Edit
                    </h1>
                </div>

                <div
                    onClick={handleSubmit}
                    className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <SaveAll className='w-5 h-5' />
                    <button className=''>
                        Save Changes
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
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border p-2 rounded-sm text-gray-600 border-gray-600"
                                placeholder="Enter category name"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="border p-2 rounded-sm text-gray-600 border-gray-600"
                                placeholder="Enter description"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700">Status</label>
                            <select
                                type="text"
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map((status, i) => (
                                    <option key={i} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CategoryEditView
