import React, { useState, useEffect } from 'react'
import { ChevronLeft, SquarePen } from 'lucide-react';
import axios from 'axios';

const PaymentDetailView = ({ setActiveSection, paymentId, setPaymentsData }) => {

    const [payment, setPayment] = useState(null);

    useEffect(() => {
        if (paymentId) {
            // Fetch payment data based on ID
            axios.get(`http://localhost:8000/api/payments/${paymentId}/`)
                .then(response => {
                    setPayment(response.data);  // Set the payment data
                    setPaymentsData(response.data);  // Pass the payment data to parent for editing
                })
                .catch(error => {
                    console.error('Error fetching payment details:', error);
                });
        }
    }, [paymentId, setPaymentsData]);

    if (!payment) {
        return <div>Loading...</div>; // Show loading until customer data is fetched
    }
    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('payment-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500">
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Payment Detail
                    </h1>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md m-4">

                {/* Product Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Invoice Number</label>
                        <p className="text-gray-800">{payment.invoice_number}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Customer Name</label>
                        <p className="text-gray-800">{payment.customer_name}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Bill Amount</label>
                        <p className="text-gray-800">{payment.bill_amount}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Amount Paid</label>
                        <p className="text-gray-800">{payment.amount_paid}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Balance Due</label>
                        <p className="text-gray-800">{payment.balance_due}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Online Amount</label>
                        <p className="text-gray-800">{payment.online_amount}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Cash Amount</label>
                        <p className="text-gray-800">{payment.cash_amount}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Paid At</label>
                        <p className="text-gray-800">{payment.paid_at}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Reference Number</label>
                        <p className="text-gray-800">{payment.reference_number}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Payment Mode</label>
                        <p className="text-gray-800">{payment.payment_mode}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Total Balance Amount</label>
                        <p className="text-gray-800">{payment.total_balance_amount}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Due Date</label>
                        <p className="text-gray-800">{payment.due_date}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Payment Status</label>
                        <p className="text-gray-800">{payment.payment_status}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Created at</label>
                        <p className="text-gray-800">{payment.created_at}</p>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default PaymentDetailView
