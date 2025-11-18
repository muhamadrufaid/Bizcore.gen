import React from 'react'

const InvoicePrintView = ({ closePrintModal, invoiceData }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center shadow-xl items-center z-50">
            <div className="flex flex-col bg-white p-6 rounded-lg w-120 h-75">
                <div><h2 className="text-2xl font-semibold text-gray-700 mb-6">Confirm Print</h2></div>
               <div className='flex'>
                 <div className='flex flex-col gap-2'>
                    <div className='flex text-black'>
                        <label className='font-semibold text-gray-600'>Invoice Number <span className='pl-2'>:</span></label>
                        <p className='text-gray-600 font-semibold pl-2'>{invoiceData?.invoice_number}</p>
                    </div>
                    <div className='flex text-black'>
                        <label className='font-semibold text-gray-600'>Customer Name <span className='pl-2'>:</span></label>
                        <p className='text-gray-600 font-semibold pl-2'>{invoiceData?.customer_name}</p>
                    </div>
                    <div className='flex text-black'>
                        <label className='font-semibold text-gray-600'>Grand Total <span className='pl-11'>:</span></label>
                        <p className='text-gray-600 font-semibold pl-2'>{invoiceData?.grand_total}</p>
                    </div>
                </div>
               </div>
               <div className='flex justify-end gap-2 mt-17'>
                <button
                    type="button"
                    onClick={closePrintModal}
                    className="bg-gray-300 px-4 text-gray-800 p-2 rounded-md hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={closePrintModal}
                    className="bg-blue-400 px-6 font-semibold text-white p-2 rounded-md hover:bg-blue-500"
                >
                    Print
                </button>
               </div>
            </div>
        </div>
    )
}

export default InvoicePrintView
