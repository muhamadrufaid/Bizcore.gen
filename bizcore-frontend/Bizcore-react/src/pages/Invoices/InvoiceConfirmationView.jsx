import React, { useState, useEffect } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import axios from 'axios';
import PaymentInvoiceAddView from '../Payment/PaymentInvoiceAddView';
import { toast } from 'react-toastify';

const InvoiceConfirmationView = ({ draftInvoiceId, setActiveSection, closePopupConfirmationView }) => {
    const [finalizedInvoice, setFinalizedInvoice] = useState(null);  // State to store finalized invoice details
    const [isPopupPaymentAdd, setIsPopupPaymentAdd] = useState(false); // State to control popup visibility
    const [isFullScreenPayment, setIsFullScreenPayment] = useState(false);

    // Function to handle finalizing the invoice and making the API call
    const handleFinalize = async () => {
        try {
            // Make the API request to finalize the draft invoice
            const response = await axios.post(`http://localhost:8000/api/draft-invoices/${draftInvoiceId}/finalize/`);

            // Set the finalized invoice data
            setFinalizedInvoice(response.data);
            console.log('Finalizing invoice successfully', response.data);
            toast.success('Invoice is Confirmed Successfully');

        } catch (error) {
            console.error('Error finalizing invoice:', error);
            toast.error('There was an error finalizing the invoice. Check and Please try again!');
        }
    };

    // Function to handle saving the draft
    const handleSaveDraft = () => {
        setActiveSection('draft-view');  // Switch to the draft view
    };

    // Trigger popup visibility when finalizedInvoice is set
    useEffect(() => {
        if (finalizedInvoice) {
            setIsPopupPaymentAdd(true); // Open payment popup after invoice finalization
        }
    }, [finalizedInvoice]);  // This effect will run when finalizedInvoice is updated

    // Function to close the payment popup
    const closePopupPayment = () => setIsPopupPaymentAdd(false);

    // Function to toggle fullscreen mode for the payment popup
    const toggleFullScreenPayment = () => setIsFullScreenPayment((prev) => !prev);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">Invoice Confirmation</h1>

            {/* Your Invoice Summary or Information Section Here */}
            <div className="mb-6">
                <p className="text-gray-700">Please review the invoice details before proceeding: <span className='text-blue-500 hover:underline'>Show Preview</span></p>
                {/* Add Invoice details here */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
                {/* Save as Draft Button */}
                <button
                    onClick={handleSaveDraft}
                    className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600">
                    Save as Draft
                </button>

                {/* Confirm and Proceed to Payment Button */}
                <button
                    onClick={handleFinalize}
                    className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-800">
                    Confirm and Proceed to Payment
                </button>
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
                            <PaymentInvoiceAddView
                                invoiceId={finalizedInvoice?.id} // Pass the finalized invoice ID
                                customerId={finalizedInvoice?.customer}  // Pass the customer ID
                                customerName={finalizedInvoice?.customer_name}
                                invoiceDetails={finalizedInvoice} // Pass full invoice details
                                closePopupPayment={closePopupPayment}
                                closePopupConfirmationView={closePopupConfirmationView}

                            />
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default InvoiceConfirmationView;
