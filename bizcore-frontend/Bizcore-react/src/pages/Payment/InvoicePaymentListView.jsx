import React, { useState, useEffect } from 'react';
import { ChevronLeft, BanknoteArrowUp, BanknoteArrowDown, Minimize2, Maximize2, X } from 'lucide-react';
import PaymentBalanceAddView from './PaymentBalanceAddView';

const InvoicePaymentListView = ({ setActiveSection, paymentData, refreshPayments }) => {
    // Check if paymentData is valid and contains a valid payments array
    const payments = Array.isArray(paymentData?.payments) ? paymentData.payments : [];

    const [isPopupPaymentAdd, setIsPopupPaymentAdd] = useState(false); // State to control popup visibility
    const [isFullScreenPayment, setIsFullScreenPayment] = useState(false);

    // Function to close the payment popup
    const closePopupPayment = () => setIsPopupPaymentAdd(false);

    // Function to toggle fullscreen mode for the payment popup
    const toggleFullScreenPayment = () => setIsFullScreenPayment((prev) => !prev);

    // Extract the necessary information from paymentData
    const { invoice_id, invoice_number, customer, total_amount, customer_name, remaining_balance } = paymentData;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,  // 24-hour format
        }).replace(',', ''); // Remove the comma after the date
    };

    // Update payments list when a new payment is made
    const handleNewPayment = (newPayment) => {
        setUpdatedPayments((prevPayments) => [...prevPayments, newPayment]);
    };

    if (!paymentData) {
        return <div>Loading...</div>;  // Show loading message if data is missing
    }

    useEffect(() => {

    }, [paymentData]);

    return (

        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between bg-white border-t border-gray-400 pr-2">
                <div className='flex items-center justify-center'>
                    <button
                        onClick={() => setActiveSection('invoice-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Payment List
                    </h1>
                </div>

                <div
                    onClick={remaining_balance > 0 ? () => setIsPopupPaymentAdd(true) : undefined} // Disable onClick when remaining_balance <= 0
                    className={`flex justify-center items-center gap-2 px-6 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600
                    ${remaining_balance <= 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}`}
                >
                    {remaining_balance <= 0 ? (
                        <BanknoteArrowDown className="w-5 h-5 opacity-50" /> // Disable icon when remaining_balance <= 0
                    ) : (
                        <BanknoteArrowUp className="w-5 h-5" />
                    )}
                    <button
                        disabled={remaining_balance <= 0} // Disable the button if remaining_balance is 0 or less
                        className={`${remaining_balance <= 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}`}
                    >
                        Pay Balance
                    </button>
                </div>


            </div>
            <div>
                <div className="mb-6 bg-gray-200 m-2 rounded-md">
                    <div className='flex'>
                        <div className='pl-6 p-2'>
                            <strong>Invoice Number:</strong> {invoice_number}<br />
                            <strong>Customer Name:</strong> {customer_name}<br />
                        </div>
                        <div className='pl-10 p-2'>
                            <strong>Current Grand Total:</strong> {total_amount}<br />
                            <strong>Remaining Balance:</strong> <span className="text-red-500 font-semibold">₹{remaining_balance}</span>
                        </div>
                    </div>
                </div>
                <div className='bg-gray-200 h-full pb-6 p-1 m-2 rounded-sm overflow-x-auto max-h-120 custom-scrollbar'>
                    <h3 className="sticky top-0 overflow-hidden text-xl bg-gray-500 text-white font-semibold pl-4">Payments List</h3>
                    {/* Payment Details Container */}
                    <div className="space-y-4 m-4 ">
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <div key={payment.id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                    <div className="grid md:grid-cols-4 gap-6 p-1">
                                        <div><strong>Payment Status:</strong> {payment.payment_status}</div>
                                        <div><strong>Reference Number:</strong> {payment.reference_number}</div>
                                        <div><strong>Payment Mode:</strong> {payment.payment_mode}</div>
                                        <div><strong>Bill Amount:</strong> <span className='text-blue-500 font-semibold pl-2'>₹{payment.bill_amount}</span></div>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-6 p-1">
                                        <div><strong>Payment Date:</strong> {formatDate(payment.paid_at)}</div>
                                        <div><strong>Due Date:</strong> {payment.due_date}</div>
                                        <div><strong>Cash Amount:</strong> ₹{payment.cash_amount}</div>
                                        <div><strong>Amount Paid:</strong><span className='text-green-500 font-semibold pl-2' >₹{payment.amount_paid}</span></div>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-6 p-1">
                                        <div></div>
                                        <div><strong></strong></div>
                                        <div><strong>Online Amount:</strong>₹{payment.online_amount}</div>
                                        <div><strong>Balance Due:</strong> <span className='text-red-500 font-semibold pl-2'>₹{payment.balance_due}</span></div>
                                    </div>
                                </div>
                            ))) : (
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <h1 className='text-center text-red-400 font-semibold'>
                                    There is no payments in this related invoice.
                                </h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Popup Section */}
            {
                isPopupPaymentAdd && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenPayment ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenPayment}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenPayment ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}
                                </button>
                                <button
                                    onClick={closePopupPayment}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <PaymentBalanceAddView
                                customerId={customer}
                                customerName={customer_name}
                                invoiceId={invoice_id}
                                invoiceDetails={paymentData}  // Pass the entire invoice data (you can customize it)
                                grandTotals={total_amount}
                                remaining_balance={remaining_balance}
                                closePopupPayment={closePopupPayment}
                                handleNewPayment={handleNewPayment} // Pass the callback function
                                refreshPayments={refreshPayments}
                                setActiveSection={setActiveSection}
                            />
                        </div>
                    </div>
                )
            }
        </div>

    );
};

export default InvoicePaymentListView;
