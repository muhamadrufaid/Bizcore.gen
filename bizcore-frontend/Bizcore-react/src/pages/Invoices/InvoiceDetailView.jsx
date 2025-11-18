import { ChevronLeft } from 'lucide-react';

const InvoiceDetailView = ({ setActiveSection }) => {

    return (
        <div className='flex flex-col'>
            {/* Header Section */}
            < div className="w-full h-14 flex items-center justify-between bg-white border-t border-gray-400" >
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('invoice-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Invoice Detail
                    </h1>
                </div>
                <div>
                    <button></button>
                </div>
            </div >
            <div className='m-2 bg-white p-2 rounded-md'>
                <div className='flex justify-between gap-2'>
                    <div className='flex flex-col gap-2 w-full '>
                        <div className='p-3 bg-gray-100 rounded-md'>
                            <div className='flex justify-between'>
                                <div>
                                    <table>
                                        <tr>
                                            <th className='text-left font-semibold'>Invoice No</th>
                                            <td className='pl-5'>INV-2025-0001</td>
                                        </tr>
                                        <tr >
                                            <th className='text-left font-semibold'>Customer</th>
                                            <td className='pl-5'>3</td>
                                        </tr>

                                        <tr>
                                            <th className='text-left font-semibold'>Invoice Date</th>
                                            <td className='pl-5'>10-10-25</td>
                                        </tr>
                                        <tr>
                                            <th className='text-left font-semibold'>Due Date</th>
                                            <td className='pl-5'>10-10-25</td>
                                        </tr>
                                        <tr>
                                            <th className='text-left font-semibold'>Invoice Status</th>
                                            <td className='pl-5'>Active</td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
                                    <table>
                                        <tr>
                                            <th className='text-left font-semibold'>Sub Total</th>
                                            <td className='pl-5'>0000</td>
                                        </tr>
                                        <tr >
                                            <th className='text-left font-semibold'>Total GST</th>
                                            <td className='pl-5'>00</td>
                                        </tr>

                                        <tr>
                                            <th className='text-left font-semibold'>Total CGST</th>
                                            <td className='pl-5'>0</td>
                                        </tr>
                                        <tr>
                                            <th className='text-left font-semibold'>Total SGST</th>
                                            <td className='pl-5'>0</td>
                                        </tr>

                                        <tr>
                                            <th className='text-left font-semibold'>Total IGST</th>
                                            <td className='pl-5'>0</td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
                                    <table>
                                        <tr>
                                            <th className='text-left font-semibold'>Total</th>
                                            <td className='pl-5'>0000</td>
                                        </tr>
                                        <tr >
                                            <th className='text-left font-semibold'>Round Off</th>
                                            <td className='pl-5'>0</td>
                                        </tr>

                                        <tr>
                                            <th className='text-left font-semibold'>Grand Total</th>
                                            <td className='pl-5'>0</td>
                                        </tr>
                                        <tr>
                                            <th className='text-left font-semibold'>Invoice Value</th>
                                            <td className='pl-5'>None</td>
                                        </tr>

                                        <tr>
                                            <th className='text-left font-semibold'>Transportation Mode</th>
                                            <td className='pl-5'>None</td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
                                    <table>
                                        <tr>
                                            <th className='text-left font-semibold'>Mode of Supply</th>
                                            <td className='pl-5'>Direct</td>
                                        </tr>
                                        <tr >
                                            <th className='text-left font-semibold'>Invoice Type</th>
                                            <td className='pl-5'>Individual</td>
                                        </tr>
                                        <tr >
                                            <th className='text-left font-semibold'>GST Type</th>
                                            <td className='pl-5'>CGST+SGST</td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
                                    <table>
                                        <tr >
                                            <th className='text-left font-semibold'>Created By</th>
                                            <td className='pl-5'>None</td>
                                        </tr>

                                        <tr>
                                            <th className='text-left font-semibold'>Updated By</th>
                                            <td className='pl-5'>None</td>
                                        </tr>
                                        <tr>
                                            <th className='text-left font-semibold'>Created At</th>
                                            <td className='pl-5'>None</td>
                                        </tr>

                                        <tr>
                                            <th className='text-left font-semibold'>Update At</th>
                                            <td className='pl-5'>None</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className=''>
                            <div className=''>
                                <table className='w-full'>
                                    <thead className='text-center text-sm text-gray-700'>
                                        <tr>
                                            <th className='p-2 px-3 border border-gray-500'>SI.No</th>
                                            <th className='p-2 px-3 border border-gray-500'>Product</th>
                                            <th className='p-2 px-3 border border-gray-500'>Code</th>
                                            <th className='p-2 px-3 border border-gray-500'>HSN/SAC</th>
                                            <th className='p-2 px-3 border border-gray-500'>Rate</th>
                                            <th className='p-2 px-3 border border-gray-500'>UOM</th>
                                            <th className='p-2 px-3 border border-gray-500'>Qty</th>
                                            <th className='p-2 px-3 border border-gray-500'>Spl-Disc</th>
                                            <th className='p-2 px-3 border border-gray-500'>Disc</th>
                                            <th className='p-2 px-3 border border-gray-500'>Net value</th>
                                            <th className='p-2 px-3 border border-gray-500'>GST %</th>
                                            <th className='p-2 px-3 border border-gray-500'>GST Amt</th>
                                            <th className='p-2 px-3 border border-gray-500'>CGST Amt</th>
                                            <th className='p-2 px-3 border border-gray-500'>SGST Amt</th>
                                            <th className='p-2 px-3 border border-gray-500'>IGST Amt</th>
                                            <th className='p-2 px-3 border border-gray-500'>Item Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className='border text-s border-gray-500 text-center text-gray-800'>
                                        <tr>
                                            <td className='p-2 border border-gray-500'>1</td>
                                            <td className='p-2 border border-gray-500'>Product name</td>
                                            <td className='p-2 border border-gray-500'>code</td>
                                            <td className='p-2 border border-gray-500'>hsn code</td>
                                            <td className='p-2 border border-gray-500'>xxx</td>
                                            <td className='p-2 border border-gray-500'>Nos</td>
                                            <td className='p-2 border border-gray-500'>x</td>
                                            <td className='p-2 border border-gray-500'>xxxx</td>
                                            <td className='p-2 border border-gray-500'>xxxx</td>
                                            <td className='p-2 border border-gray-500'>xxxxx</td>
                                            <td className='p-2 border border-gray-500'>18%</td>
                                            <td className='p-2 border border-gray-500'>xxxx</td>
                                            <td className='p-2 border border-gray-500'>xxxx</td>
                                            <td className='p-2 border border-gray-500'>xxxx</td>
                                            <td className='p-2 border border-gray-500'>xxxx</td>
                                            <td className='p-2 border border-gray-500'>xxxx</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* <div>
                        <div className='flex flex-col gap-2'>
                            <div className='px-8 py-1 bg-blue-400 text-center rounded-md hover:bg-blue-600'>
                                <button className='text-white text-sm font-semibold'>
                                    Show <br /> Customer
                                </button>
                            </div>
                            <div className='px-8 py-1 bg-blue-400 text-center rounded-md hover:bg-blue-600'>
                                <button className='text-white text-sm font-semibold'>
                                    Show <br /> Payment
                                </button>
                            </div>
                            <div className='px-8 py-1 bg-blue-400 text-center rounded-md hover:bg-blue-600'>
                                <button className='text-white text-sm font-semibold'>
                                    Show <br /> Delivery
                                </button>
                            </div>
                            <div className='px-1 py-1 bg-blue-400 text-center rounded-md hover:bg-blue-600'>
                                <button className='text-white text-sm font-semibold'>
                                    Show <br />Credit Note
                                </button>
                            </div>
                            <div className='px-1 text-center py-1 bg-blue-400 rounded-md hover:bg-blue-600'>
                                <button className='text-white text-sm font-semibold'>
                                    Show <br />Debit Note
                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default InvoiceDetailView
