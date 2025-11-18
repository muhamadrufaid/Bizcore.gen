import React from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';


const PurchaseDetailView = ({ setActiveSection }) => {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
        <div className='flex items-center'>
          <button
            onClick={() => setActiveSection('purchase-view')}
            className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Purchase Detail
          </h1></div>
        <div
          onClick={() => setActiveSection('purchase-edit')}
          className='flex items-center justify-center bg-blue-500 w-30  h-8 rounded-md hover:bg-blue-700 p-5'>
          <button
            className="flex gap-2 text-white"><SquarePen />
            <label className='text-white'>Edit </label>
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md m-4">
        {/* Product Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-1">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Vendor</label>
            <p className="text-gray-800">ABC Trade Pvt Lmt</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Invoice Number</label>
            <p className="text-gray-800">SIS-02300</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Purchase Date</label>
            <p className="text-gray-800">10-10-25</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Sub Total</label>
            <p className="text-gray-800">0</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Total Tax</label>
            <p className="text-gray-800">0</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">discount</label>
            <p className="text-gray-800">₹0</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Grand Total</label>
            <p className="text-gray-800">0</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Amount Paid</label>
            <p className="text-gray-800">0</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Balance Due</label>
            <p className="text-gray-800">0</p>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Status</label>
            <p className="text-gray-800">Active</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Created at</label>
            <p className="text-gray-800">None</p>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Updated at</label>
            <p className="text-gray-800">None</p>
          </div>

        </div>
        <div>
          <div className='pt-6'>
            <table className="w-full">
              <thead className='border'>
                <tr>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>SI.No</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Product</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Unit Price</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>HSN/SAC</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>GST %</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Qty</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Rate</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Disc</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Sub Total</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Total Tax</th>
                  <th className='border px-4 py-2 border-gray-500 font-semibold'>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border px-2 py-2 border-gray-500'>1</td>
                  <td className='border px-2 py-2 border-gray-500'>Item 1</td>
                  <td className='border px-2 py-2 border-gray-500'>100</td>
                  <td className='border px-2 py-2 border-gray-500'>00988</td>
                  <td className='border px-2 py-2 border-gray-500'>18%</td>
                  <td className='border px-2 py-2 border-gray-500'>2</td>
                  <td className='border px-2 py-2 border-gray-500'>80</td>
                  <td className='border px-2 py-2 border-gray-500'>0</td>
                  <td className='border px-2 py-2 border-gray-500'>160</td>
                  <td className='border px-2 py-2 border-gray-500'>24</td>
                  <td className='border px-2 py-2 border-gray-500'>174</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='flex pt-6 justify-end'>
        </div>
      </div>
    </div>

  )
}

export default PurchaseDetailView
