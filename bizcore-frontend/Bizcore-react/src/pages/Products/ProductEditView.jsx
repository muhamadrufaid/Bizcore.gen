import React, { useState, useEffect } from 'react';
import { ChevronLeft, SaveAll } from 'lucide-react';
import axios from "axios";

const ProductEditView = ({ setActiveSection, productData }) => {
  // Sample choices for select fields
  const statusOptions = ['active', 'inactive', 'out_of_stock'];
  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const unitOptions = [
    "pcs",
    "nos",
    "kg",
    "g",
    "ton",
    "litre",
    "ml",
    "m",
    "cm",
    "inch",
    "session",
    "package",
  ];

  const gstOptions = [
    "0",
    "1.5",
    "3",
    "5",
    "6",
    "7.5",
    "12",
    "18",
    "28",
    "40",
    "Nil rated",
    "exempt",
    "non-gst",
  ];


  const [formData, setFormData] = useState({
    name: productData?.name || '',
    sku_code: productData?.sku_code || '',
    barcode: productData?.barcode || '',
    purchase_price: productData?.purchase_price || '',
    retail_price: productData?.retail_price || '',
    wholesale_price: productData?.wholesale_price || '',
    mrp: productData?.mrp || '',
    unit_of_measurement: productData?.unit_of_measurement || 'pcs',
    discount: productData?.discount || '',
    gst_rate: productData?.gst_rate || 0,
    purchase_gst: productData?.purchase_gst || 'nil',
    stock_quantity: productData?.stock_quantity || '',
    re_order_level: productData?.re_order_level || '',
    category: productData?.category || '',
    status: productData?.status || 'active',
    hsn_sac_code: productData?.hsn_sac_code || '',

  });

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData?.name || '',
        sku_code: productData?.sku_code || '',
        barcode: productData?.barcode || '',
        purchase_price: productData?.purchase_price || '',
        retail_price: productData?.retail_price || '',
        wholesale_price: productData?.wholesale_price || '',
        mrp: productData?.mrp || '',
        unit_of_measurement: productData?.unit_of_measurement || 'pcs',
        discount: productData?.discount || '',
        gst_rate: productData?.gst_rate || 0,
        purchase_gst: productData?.purchase_gst || 'nil',
        stock_quantity: productData?.stock_quantity || '',
        re_order_level: productData?.re_order_level || '',
        category: productData?.category || '',
        status: productData?.status || 'active',
        hsn_sac_code: productData?.hsn_sac_code || '',
      });
    }
  }, [productData]);

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

    axios.put(`http://localhost:8000/api/products/${productData.id}/`, formData)
      .then(response => {
        console.log("Product updated successfully", response.data);
        setActiveSection('product-view');
      })
      .catch(error => {
        if (error.response) {
          console.error('Error updating prod0uct:', error.response.data);
          alert(`Error: ${error.response.data}`);
        }
      });
  };

  return (
    <div className="flex flex-col overflow-hidden" >
      {/* Header Section */}
      < div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400" >
        <div className='flex items-center'>
          <button
            onClick={() => setActiveSection('product-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
          >
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Product Edit
          </h1>
        </div>
        <div
          onClick={handleSubmit}
          className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
          <SaveAll className='w-5 h-5' />
          <button type="submit">
            Save Changes
          </button>
        </div>
      </div >

      <div className="bg-white p-6 rounded-lg shadow-md m-4">
        <form>
          {/* Dynamic product rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter product name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">SKU Code</label>
              <input
                type="text"
                id="sku_code"
                name="sku_code"
                value={formData.sku_code}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter SKU code"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">HSN Code</label>
              <input
                type="text"
                id="hsn_sac_code"
                name="hsn_sac_code"
                value={formData.hsn_sac_code}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter HSN code"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Barcode</label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter barcode"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Purchase Price</label>
              <input
                type="text"
                id="purchase_price"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter purchase price"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Purchase Gst</label>
              <select
                id="purchase_gst"
                name="purchase_gst"
                value={formData.purchase_gst}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
              >
                <option value="">Select gst</option>
                {gstOptions.map((gst, i) => (
                  <option key={i} value={gst}>{gst}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Retail Price</label>
              <input
                type="text"
                id="retail_price"
                name="retail_price"
                value={formData.retail_price}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter retail price"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Wholesale Price</label>
              <input
                type="text"
                id="wholesale_price"
                name="wholesale_price"
                value={formData.wholesale_price}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter wholesale price"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">MRP</label>
              <input
                type="text"
                id="mrp"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter MRP"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Unit of Measurement</label>
              <select
                id="unit_of_measurement"
                name="unit_of_measurement"
                value={formData.unit_of_measurement}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
              >
                <option value="">Select Unit</option>
                {unitOptions.map((unit, i) => (
                  <option key={i} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Discount</label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter discount"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">GST Rate</label>
              <select
                type="text"
                id="gst_rate"
                name="gst_rate"
                value={formData.gst_rate}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
              >
                <option value="">Select GST Rate</option>
                {gstOptions.map((gst, i) => (
                  <option key={i} value={gst}>{gst}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Stock Quantity</label>
              <input
                type="text"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter stock quantity"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Reorder Level</label>
              <input
                type="text"
                id="re_order_level"
                name="re_order_level"
                value={formData.re_order_level}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
                placeholder="Enter reorder level"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Category</label>
              <select
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 rounded-sm border-gray-400 text-gray-800"
              >
                <option value="">Select Category</option>
                {categories.map((category, i) => (
                  <option key={i} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm pb-1">Status</label>
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
    </div >
  );
};

export default ProductEditView;
