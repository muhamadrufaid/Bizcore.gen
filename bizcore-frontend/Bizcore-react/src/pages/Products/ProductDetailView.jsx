import React, { useState, useEffect } from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';
import axios from 'axios';

const ProductDetailView = ({ setActiveSection, productId, setProductData }) => {

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (productId) {
      // Fetch customer data based on ID
      axios.get(`http://localhost:8000/api/products/${productId}/`)
        .then(response => {
          setProduct(response.data);  // Set the customer data
          setProductData(response.data);  // Pass the customer data to parent for editing
        })
        .catch(error => {
          console.error('Error fetching product details:', error);
        });
    }
  }, [productId, setProductData]);

  if (!product) {
    return <div>Loading...</div>; // Show loading until customer data is fetched
  }

  return (

    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
        <div className='flex items-center'>
          <button
            onClick={() => setActiveSection('product-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Product Details
          </h1>
        </div>
        <div
          onClick={() => setActiveSection('product-edit')}
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
            <label className="text-gray-600 font-medium">Product Name</label>
            <p className="text-gray-800">{product.name}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">SKU Code</label>
            <p className="text-gray-800">{product.sku_code}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">HSN Code</label>
            <p className="text-gray-800">{product.hsn_sac_code}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Barcode</label>
            <p className="text-gray-800">{product.barcode}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Purchase Price</label>
            <p className="text-gray-800">{product.purchase_price}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Purchase GST</label>
            <p className="text-gray-800">{product.purchase_gst}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Retail Price</label>
            <p className="text-gray-800">{product.retail_price}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Wholesale Price</label>
            <p className="text-gray-800">{product.wholesale_price}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">MRP</label>
            <p className="text-gray-800">{product.mrp}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Unit of Measurement</label>
            <p className="text-gray-800">{product.unit_of_measurement}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Discount</label>
            <p className="text-gray-800">{product.discount}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">GST Rate</label>
            <p className="text-gray-800">{product.gst_rate}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Stock Quantity</label>
            <p className="text-gray-800">{product.stock_quantity}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Reorder Level</label>
            <p className="text-gray-800">{product.re_order_level}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Category</label>
            <p className="text-gray-800">{product.category_name}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Status</label>
            <p className="text-gray-800">{product.status}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Created At</label>
            <p className="text-gray-800">{product.created_at}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Last Updated</label>
            <p className="text-gray-800">{product.updated_at}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
