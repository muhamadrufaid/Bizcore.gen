import React, { useState, useRef, useEffect } from 'react'
import { Printer, Send, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';  // Import jsPDF
import InvoiceShareNumberAddView from './InvoiceShareNumberAddView';
import InvoicePrintView from './InvoicePrintView';
import html2canvas from 'html2canvas';

const InvoiceFinalizeView = ({ invoiceData, invoiceId, setActiveSidebar, businessData, selectedBank }) => {

  const {
    customer_name, customer_address, customer_city, customer_pincode, phone_number, gst_in, state, delivery, invoice_number, invoice_date,
    due_date, items, total_gst, sub_total, transportation_mode, grand_total, total_cgst, total_igst, total_sgst, total, round_off, mode_of_supply,
    gst_type, invoice_value
  } = invoiceData || {}; // Destructuring invoice data

  const {
    company_name,
    company_caption,
    telephone,
    mobile_number,
    business_email,
    whatsapp_number,
    website_name,
    gst_in_number,
    business_pan_number,
    address,
    city,
    state_name,
    pincode,
    logo,
  } = businessData[0] || {}; // Access the first item in the array

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  useEffect(() => {
    if (selectedBank) {
      console.log(selectedBank); // Check if selected bank data exists
    }
  }, [selectedBank]);


  // Function to open the modal
  const openPrintModal = () => {
    setIsPrintOpen(true);
  };

  // Function to close the modal
  const closePrintModal = () => {
    setIsPrintOpen(false);
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const printRef = React.useRef(null);

  const handleDownloadPdf = async () => {

    const element = printRef.current;


    if (!element) {
      return;
    }


    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,  // Ensures images, fonts are loaded correctly.
      scrollX: 0,     // Fix scroll position if any issue
      scrollY: 0,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProperties.height * pdfWidth / imgProperties.width)


    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoice_number}.pdf`)

  };


  return (
    <div

      className='flex flex-col '>
      <div className='flex flex-col'>
        <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
          <div>
            <h1 style={{
              fontFamily: '"Outfit", sans-serif',  // Apply Google font
              fontWeight: 600,                    // Apply bold weight
              fontOpticalSizing: 'auto',           // Apply optical sizing
            }}
              className='text-blue-700 text-2xl p-2'>Finalized Invoice</h1>
          </div>
          <div className='flex p-4 gap-2'>
            <div className='flex justify-center items-center'>
              <button
                onClick={openModal}
                className='gap-2 px-4 py-2 font-semibold text-md text-white border border-blue-400 bg-blue-400 rounded-md hover:border-blue-600 hover:bg-blue-700 '>
                <Send className='w-5 h-5' />
              </button>
            </div>
            <div
              className='flex justify-center items-center'
              onClick={handleDownloadPdf} >
              <button className='gap-2 px-4 py-2 font-semibold text-md text-white border border-blue-400 bg-blue-400 rounded-md hover:border-blue-600 hover:bg-blue-700 '>
                <Download className='w-5 h-5' />
              </button>
            </div>
            <div
              onClick={openPrintModal}
              className='flex justify-center items-center gap-2 px-6 py-2 font-semibold text-md text-white bg-blue-400 rounded-md hover:bg-blue-700 '>
              <Printer className='w-5 h-5' />
              <button className=''>
                Print
              </button>
            </div>

          </div>
        </div>
      </div>
      <div className='m-4 max-h-[calc(99vh-18vh)] overflow-y-auto custom-scrollbar p-'>
        <div
          ref={printRef}
          className=''>

          <div className='bg-white p-3'>
            <div className='flex py-2 p-2'>
              <div className='flex flex-col w-full pr-4'>
                <h1 className='font-bold text-2xl mb-4 text-gray-700'>{company_name}</h1>
                <p className='bg-gray-200 font-semibold pb-4 px-2 '>{company_caption}</p>

                <div className='flex justify-between pt-1'>
                  <div className='text-left font-semibold '>
                    <p>{address}</p>
                    <p>{city}</p>
                    <p>{state_name}, {pincode}</p>
                  </div>
                  <div className='text-right font-semibold'>
                    <p>Phone : {mobile_number}</p>
                    <p>Email : {business_email}</p>
                    <p>Web : {website_name} </p>
                  </div>
                </div>
              </div>
              <div className='h-40 w-50'>
                {logo ? (
                  <img
                    src={`${logo}`}
                    className="object-cover"
                  />
                ) : (
                  <p className='text-white text-sm'>No Logo</p>
                )}
              </div>
            </div>
            <div class="min-w-full mx-auto bg-white rounded-sm border ">
              <div class="flex justify-between items-center border-b px-2">
                <div class="text-sm font-semibold mb-4">
                  GST Number: <span class="font-normal ">{gst_in_number}</span>
                </div>
                <div class="text-center text-xl font-bold  mb-4 uppercase">
                  TAX INVOICE
                </div>
                <div class="text-sm font-semibold mb-4 text-right">
                  ORIGINAL FOR RECIPIENT
                </div>
              </div>

              <div class="grid grid-cols-4">
                <div class="border-r border-b pb-2 ">
                  <div className='flex flex-col  justify-center'>
                    <h3 class="text-sm font-semibold text-center py-2 px-2 border-b pb-4">Customer Details</h3>
                    <div className='px-4 py-2'>
                      <tr className='text-left'>
                        <th className='font-normal'>M/S</th>
                        <td className='font-semibold'>{customer_name}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>Address</th>
                        <td className='w-180'>{customer_address}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='pr-15 font-normal'>City</th>
                        <td className='w-180'>{customer_city}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>Pincode</th>
                        <td className='w-180'>{customer_pincode}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>State</th>
                        <td className='w-180'>{state}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>Phone No</th>
                        <td className='w-180'>{phone_number}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>GST No</th>
                        <td className='w-180'>{gst_in}</td>
                      </tr>
                    </div>
                  </div>
                </div>

                <div class="border-r border-b pb-2">
                  <div className='flex flex-col  justify-center'>
                    <h3 class="text-sm font-semibold text-center py-2 px-2 border-b pb-4">Delivery Details</h3>
                    <div className='px-4 py-1'>

                      <tr className='text-left'>
                        <th className='font-normal pr-10'>Address</th>
                        <td><span className='font-semibold w-170'>{delivery?.delivery_address || "None"},{delivery?.city || "None"},<br></br>{delivery?.State || "None"},{delivery?.pincode || "None"}</span></td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal '>Landmark</th>
                        <td className='w-180'>{delivery?.landmark || "None"}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>Transpoter</th>
                        <td className='w-180'>{delivery?.transporter_name || "None"}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>Gst No</th>
                        <td className='w-180'>{delivery?.transporter_gst_in || "None"}</td>
                      </tr>
                      <tr className='text-left'>
                        <th className='font-normal'>Notes</th>
                        <td className='w-180'>{delivery?.delivery_notes || "None"}</td>
                      </tr>
                    </div>
                  </div>
                </div>

                <div class="border-b">
                  <h3 class="text-md font-semibold py-2 pl-2 px-1p border-b pb-4">Invoice Number </h3>
                  <div className='px-4 py-1'>
                    <p>ModeOfSupply <span className='pl-13'>{mode_of_supply ? mode_of_supply.toUpperCase() : 'N/A'}</span></p>
                    <p>ModeOfTransport <span className='pl-9'>{transportation_mode ? transportation_mode.toUpperCase() : 'N/A'}</span></p>
                    <p>GST Type<span className='pl-25'>{gst_type ? gst_type.toUpperCase() : 'N/A'}</span></p>
                  </div>
                </div>

                <div class="border-b ">
                  <h3 class="text-md font-bold py-2 text-start border-b pb-4 ">{invoice_number}</h3>
                  <p>Invoice Date<span className='pl-13'>{invoice_date}</span></p>
                  <p>Due Date<span className='pl-18'>{due_date}</span></p>
                </div>
              </div>

              <div className='mt-4 pb-2'>
                <table className="border-collapse w-full ">
                  <thead className='text-gray-800'>
                    <tr>
                      {/* Head 1 (single, no sub-head, so rowspan=2) */}
                      <th rowSpan={2} className="text-center p-1 border-t border-b ">SI.No</th>
                      <th rowSpan={2} className="text-center p-1 border">Item Description</th>
                      <th rowSpan={2} className="text-center p-1 border">HSN</th>
                      <th rowSpan={2} className="text-center p-1 border">Qty</th>
                      <th rowSpan={2} className="text-center p-1 border">Rate</th>
                      <th rowSpan={2} className="text-center p-1 border">Disc</th>
                      <th rowSpan={2} className="text-center p-1 border">Spl-Disc</th>
                      <th rowSpan={2} className="text-center p-1 border">Net Value</th>
                      <th rowSpan={2} className="text-center p-1 border">GST</th>
                      <th rowSpan={2} className="text-center p-1 border">Total Tax</th>

                      {/* Head 2 with sub-heads */}
                      <th colSpan={2} className="text-center p-1 border">CGST</th>
                      <th colSpan={2} className="text-center p-1 border">SGST</th>
                      <th colSpan={2} className="text-center p-1 border">SGST</th>
                      <th rowSpan={2} className="text-center p-1 border-t border-b">Total</th>
                    </tr>
                    <tr>
                      {/* Sub-headers only for head 2 */}
                      <th className="text-center p-1 border">%</th>
                      <th className="text-center p-1 border">Amt</th>
                      <th className="text-center p-1 border">%</th>
                      <th className="text-center p-1 border">Amt</th>
                      <th className="text-center p-1 border">%</th>
                      <th className="text-center p-1 border">Amt</th>
                    </tr>
                  </thead>
                  <tbody className='text-gray-900'>
                    {/* Dynamically render rows from items */}
                    {items && items.length > 0 ? (
                      items.map((item, index) => (
                        <tr key={index} className=''>
                          <td className="text-center p-1 border-r pb-4">{index + 1}</td>
                          <td className="text-center p-1 border-r pb-4">{item.name}</td>
                          <td className="text-center p-1 border-r pb-4">{item.hsn_sac}</td>
                          <td className="text-center p-1 border-r pb-4">{item.quantity}{item.uom}</td>
                          <td className="text-center p-1 border-r pb-4">{item.rate}</td>
                          <td className="text-center p-1 border-r pb-4">{item.discount}</td>
                          <td className="text-center p-1 border-r pb-4">{item.special_discount}</td>
                          <td className="text-center p-1 border-r pb-4">{item.net_value}</td>
                          <td className="text-center p-1 border-r pb-4">
                            {Number(item.gst_percentage) % 1 === 0
                              ? `${Math.round(item.gst_percentage)}%`
                              : `${item.gst_percentage}%`}
                          </td>
                          <td className="text-center p-1 border-r pb-4">{item.gst_amount}</td>
                          <td className="text-center p-1 border-r pb-4">
                            {Number(item.cgst_percentage) % 1 === 0
                              ? `${Math.round(item.cgst_percentage)}%`
                              : `${item.cgst_percentage}%`}
                          </td>
                          <td className="text-center p-1 border-r pb-4 ">{item.cgst_amount}</td>
                          <td className="text-center p-1 border-r pb-4">
                            {Number(item.sgst_percentage) % 1 === 0
                              ? `${Math.round(item.sgst_percentage)}%`
                              : `${item.sgst_percentage}%`}
                          </td>
                          <td className="text-center p-1 border-r pb-4 ">{item.sgst_amount}</td>
                          <td className="text-center p-1 border-r pb-4">
                            {Number(item.igst_percentage) % 1 === 0
                              ? `${Math.round(item.igst_percentage)}%`
                              : `${item.igst_percentage}%`}
                          </td>
                          <td className="text-center p-1 border-r pb-4 ">{item.igst_amount}</td>
                          <td className="text-center p-1 pb-4 ">{item.item_total}</td>
                        </tr>

                      ))
                    ) : (
                      <tr>
                        <td colSpan="16" className="text-center p-1 border">No items found</td>
                      </tr>
                    )}
                    <tr className='text-center bg-gray-200'>
                      <td className="p-1 border-t border-b "></td>
                      <td className="p-1 border-r border-b border-t pb-4">Total</td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border font-semibold"></td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border pb-4">{sub_total}</td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border font-semibold pb-4">{total_gst}</td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border pb-4">{total_cgst}</td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border pb-4">{total_sgst}</td>
                      <td className="p-1 border"></td>
                      <td className="p-1 border pb-4">{total_igst}</td>
                      <td className="p-1 border-t border-b font-semibold pb-4">{total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='flex border-t'>
                <div className='w-1/2'>

                  <div className='flex flex-col border-b justify-center'>
                    <label className='text-md text-center border-b pb-4 font-semibold'>Total in words</label>
                    <p className='text-sm text-gray-900 px-20 py-2 font-semibold pb-4'>  {invoice_value ? invoice_value.toUpperCase() : 'N/A'}</p>
                  </div>

                  <div className='flex flex-col'>
                    <div className='flex flex-col pb-5'>
                      <div className='flex flex-col border-b'>
                        <label className='text-center font-semibold pb-4 '>Bank Details</label>
                      </div>
                      {selectedBank && (
                        <div className='flex justify-between items-center text-gray-900 p-4'>

                          <table>
                            <tr>
                              <th className='pl-2 text-left font-semibold'>Name</th>
                              <td className='pl-10 text-left'>{selectedBank.bank_name}</td>
                            </tr>
                            <tr>
                              <th className='pl-2 text-left font-semibold'>Branch</th>
                              <td className='pl-10 text-left'> {selectedBank.branch}</td>
                            </tr>
                            <tr>
                              <th className='pl-2 text-left font-semibold'>Acc_Number</th>
                              <td className='pl-10 text-left'>{selectedBank.account_number}</td>
                            </tr>
                            <tr>
                              <th className='pl-2 text-left font-semibold'>IFSC</th>
                              <td className='pl-10 text-left'>{selectedBank.ifsc_code}</td>
                            </tr>
                            <tr>
                              <th className='pl-2 pt-4 text-left font-semibold'>UPI ID</th>
                              <td className='pl-10 pt-4 text-left'>{selectedBank.upi_id}</td>
                            </tr>
                          </table>

                          <div className='flex flex-col pr-10'>
                            <div className='w-35 h-30 bg-gray-400 flex items-center'>
                              <img
                                src={`${selectedBank.qr_code}`} // ✅ NO /api here!
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <label className='text-center font-semibold'>Pay Using UPI</label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className='flex flex-col border-t text-gray-900'>
                      <div className='flex flex-col border-b'>
                        <h1 className='text-center text-gray-900 font-semibold pb-4'>Terms and Conditions</h1>
                      </div>
                      <div className='px-2 py-2 border-b pb-4'>
                        Subject to {state_name} Junction. <br />
                        Our Responsibility Ceases as soon as goods leave our Premises. <br />
                        Goods once sold will not be taken back. <br />
                        Delivery Ex-Premises.
                      </div>
                      <div className='p-2 pb-8'>
                        Customer Signature
                      </div>
                    </div>
                  </div>

                </div>

                <div className='w-1/2 border-l'>
                  <div className="flex flex-col text-gray-900">
                    <table className="table-auto w-full ">
                      <tbody>
                        <tr className='border-b '>
                          <td className="px-4 py-1 pb-4 font-semibold text-left">Net Amount</td>
                          <td className="px-4 py-1 pb-4 text-right">{sub_total}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className="px-4 py-1 pb-4 font-semibold text-left">Total Tax Amount</td>
                          <td className="px-4 py-1 pb-4 text-right">{total_gst}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className="px-4 py-1 pb-4 font-semibold text-left">Total Amount After Tax</td>
                          <td className="px-4 py-1 pb-4 text-right">{total}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className="px-4 py-1 pb-4 font-semibold text-left">Credit Applied</td>
                          <td className="px-4 py-1 pb-4 text-right">00.00</td>
                        </tr>
                        <tr className='border-b'>
                          <td className="px-4 py-1 pb-4 font-semibold text-left">Round Off</td>
                          <td className="px-4 py-1 pb-4 text-right">{round_off}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className="px-4 py-2 pb-4 font-semibold text-left">Grand Total</td>
                          <td className="px-4 py-2 pb-4 text-right font-bold">{grand_total}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className='flex flex-col p-2 border-b text-gray-900 pb-4'>
                    <p className='text-center'>Certified that the particulars given above are true and correct.</p>
                    <h1 className='text-center pt-1 font-semibold'>{company_name}</h1>
                  </div>

                  <div className='flex justify-center pt-17 pb-17 border-b text-gray-900'>
                    <label className='font-semibold text-center'>
                      This is a computer-generated invoice <br /> no signature required.
                    </label>
                  </div>
                  <div className='flex flex-col pt-2 text-gray-900 pb-4'>
                    <h1 className='text-center font-bold text-md'>Authorised Signatory</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <InvoiceShareNumberAddView closeModal={closeModal} />}
      {isPrintOpen && <InvoicePrintView closePrintModal={closePrintModal} invoiceData={invoiceData} />}
    </div >

  )
}
export default InvoiceFinalizeView
