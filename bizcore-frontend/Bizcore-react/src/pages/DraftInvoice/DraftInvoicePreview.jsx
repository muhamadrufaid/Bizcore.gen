import React from 'react';
import { X, Download } from 'lucide-react';


const DraftInvoicePreview = ({ draft, onClose }) => {

    // Function to format numbers as currency
    const formatCurrency = (amount) => {
        return parseFloat(amount).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
    };

    return (
        <div className="w-full">
            <div className='flex justify-between items-center pb-2'>
                <h2 className="text-xl font-semibold">Preview</h2>
                <button
                    className="flex items-center border px-1 py-1 rounded-md text-blue-300 border-blue-300 hover:border-blue-500 hover:text-blue-500"
                    onClick={onClose}
                >
                    <X />
                </button>
            </div>
            <div className='flex justify-between  border-t border-r border-l px-2'>
                <p>THIS IS NOT ORIGINAL INVOICE</p>
                <h1 className='font-semibold text-center'>INVOICE-ESTIMATE</h1>

            </div>

            <div className='flex flex-col border overflow-auto custom-scroll' style={{ maxHeight: '520px' }}>
                <div className='flex border-b'>
                    <div className="pb-2 border-r">
                        <h1 className='w-full border-b text-center px-2 '>Customer Detials</h1>
                        <p className='w-80 px-2 pt-1'> <span className='font-semibold'>Name</span><span className='pl-15'>{draft.customer_name}</span></p>
                        <p className='w-80 px-2'> <span className='font-semibold'>Address</span><span className='pl-11'>{draft.customer_address}</span></p>
                        <p className='w-80 px-2'> <span className='font-semibold'></span><span className='pl-25'>{draft.customer_city},{draft.customer_pincode}</span></p>
                        <p className='w-80 px-2'> <span className='font-semibold'>Phone</span><span className='pl-14'>{draft.phone_number}</span></p>
                        <p className='w-80 px-2'> <span className='font-semibold'>GSTIN</span><span className='pl-14'>{draft.gst_in}</span></p>
                        <p className='w-80 px-2'> <span className='font-semibold'>State</span><span className='pl-16'>{draft.state}</span></p>
                    </div>
                    <div className="flex flex-col gap-1 pb-2 w-110 p-2">
                        <p>Draft No <span className='font-semibold pl-28'>{draft.draft_number}</span></p>
                        <p>ModeOfSupply<span className='pl-17'>{draft.mode_of_supply.charAt(0).toUpperCase() + draft.mode_of_supply.slice(1)}</span></p>
                        <p>ModeOfTransport <span className='pl-11'>{draft.transportation_mode.charAt(0).toUpperCase() + draft.transportation_mode.slice(1)}</span></p>
                        {draft.delivery ? (
                            <div className='flex flex-col gap-1'>
                                <p>Transpoter <span className='pl-24'>{draft.delivery.transporter_name}</span></p>
                                <p>Transport GSTIN <span className='pl-14'>{draft.delivery.transporter_gst_in}</span></p>
                                <p>Assigned <span className='pl-27'>{draft.delivery.assigned_to || 'None'}</span></p>
                            </div>
                        ) : (
                            <p>No delivery details</p>
                        )}

                    </div>
                    <div className="flex flex-col gap-1 pb-6 p-2 pl-20">
                        <p>Draft Date <span className='font-semibold pl-13'>{draft.draft_date}</span></p>
                        <p>Due Date<span className='pl-18'>{draft.due_date}</span></p>
                        <p>GST TYPE <span className='pl-15'>{draft.gst_type.toUpperCase()}</span></p>
                    </div>
                </div>

                {/* Display items in a table */}
                <h3 className="text-lg font-semibold mb-2 pl-2">Items</h3>
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left">Product Name</th>
                            <th className="px-4 py-2 text-left">HSN/SAC</th>
                            <th className="px-4 py-2 text-left">Rate</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Net Value</th>
                            <th className="px-4 py-2 text-left">GST</th>
                            <th className="px-4 py-2 text-left">Taxable Value</th>
                            <th className="px-4 py-2 text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {draft.items && draft.items.length > 0 ? (
                            draft.items.map((item, index) => (
                                <tr key={item.id} className="border-b">
                                    <td className="px-4 py-2">{item.product_name}</td>
                                    <td className="px-4 py-2">{item.hsn_sac}</td>
                                    <td className="px-4 py-2">{item.rate}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">{item.net_value}</td>
                                    <td className="px-4 py-2">{item.gst_percentage}</td>
                                    <td className="px-4 py-2">{formatCurrency(item.gst_amount)}</td>
                                    <td className="px-4 py-2">{formatCurrency(item.item_total)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-2 text-center">No items found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <div className='flex justify-between items-end'>
                        <div className='p-2'>
                            <div className='border'>
                                <p className=' text-gray-700 font-semibold border-b px-2'>Grand Total in Words</p>
                                <p className='text-gray-800 font-semibold px-2 py-1'> {draft.invoice_value.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1 p-2'>
                            <p className='border px-2 py-1'>Sub Total <span className='pl-15'>{formatCurrency(draft.sub_total)}</span></p>
                            <p className='border px-2 py-1'>Tax Total <span className='pl-16'>{formatCurrency(draft.total_gst)}</span></p>
                            <p className='border px-2 py-1'>Total <span className='pl-23'>{formatCurrency(draft.total)}</span></p>
                            <p className='border px-2 py-1'>Round Off <span className='pl-13'>{formatCurrency(draft.round_off)}</span></p>
                            <p className='border px-2 py-1'>Grand Total <span className='pl-11'>{formatCurrency(draft.grand_total)}</span></p></div>
                    </div>
                </div>
            </div>

            <div className='flex justify-center pt-2 '>
                <button className='flex justify-center items-center px-4 py-2 rounded-lg gap-1 border text-blue-400 border-blue-400 hover:text-white hover:bg-blue-400 '>
                    <Download /> Download
                </button>
            </div>
        </div>
    );
};

export default DraftInvoicePreview;
