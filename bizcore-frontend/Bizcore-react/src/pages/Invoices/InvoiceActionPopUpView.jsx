import React, { useState, useEffect } from 'react'
import { Eye, X, PenLine, Banknote } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const InvoiceActionPopUpView = ({ setActiveSection, invoice, refreshInvoices, setInvoiceId, closePopupActionView, handleInvoiceDataChange }) => {

    const [payments, setPayments] = useState([]);  // State to store the payments list
    const [loadingPayments, setLoadingPayments] = useState(false);  // State to track loading status

    // Fetch payments for the current invoice
    const fetchPayments = async () => {
        if (!invoice || !invoice.id) {
            console.error('Invalid invoice data');
            return;
        }

        setLoadingPayments(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/payments/?invoice=${invoice.id}`);
            setPayments(response.data);  // Store payments in the state
            console.log('Fetched payments:', response.data);
            // Collect the data you want to pass to the parent
            const dataToSend = {
                invoice_id: invoice.id,
                customer: invoice?.customer,  // Assuming `invoice.customer.id` exists
                customer_name: invoice?.customer_name,
                invoice_number: invoice.invoice_number,
                total_amount: invoice.grand_total,
                remaining_balance: invoice.remaining_balance,
                payments: response.data,  // Fetched payments
            };

            // Pass the data to the parent
            handleInvoiceDataChange(dataToSend);
            setActiveSection('payment-list')
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('An error occurred while fetching the payments.');
        } finally {

        }
    };

    const openInvoice = async () => {
        if (!invoice || !invoice.id) {
            console.error('Invalid invoice data');
            return;  // Prevent further execution if invoice is invalid
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/invoices/${invoice.id}/`);
            const invoiceData = response.data;
            setInvoiceId(invoice.id);
            refreshInvoices();
            setActiveSection('invoice-edit');
            console.log('Fetched invoice:', invoiceData);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            toast.error('An error occurred while fetching the invoice data.');
        }
    };

        const viewInvoice = async () => {
        if (!invoice || !invoice.id) {
            console.error('Invalid invoice data');
            return;  // Prevent further execution if invoice is invalid
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/invoices/${invoice.id}/`);
            const invoiceData = response.data;
            setInvoiceId(invoice.id);
            setActiveSection('invoice-final');
            console.log('Fetched invoice:', invoiceData);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            toast.error('An error occurred while fetching the invoice data.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">Invoice Actions</h1>
            <div className="mb-6">
                <p className="text-gray-700">You want to perform actions to this invoice <span className='text-blue-500'>{invoice?.invoice_number}</span></p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-15">
                <button
                    onClick={closePopupActionView}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                    <X />
                </button>
                <button
                    onClick={fetchPayments}  // Fetch payments on button click
                    className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                    <Banknote />
                </button>
                <button
                onClick={viewInvoice}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                    <Eye />
                </button>
                <button
                    onClick={openInvoice}
                    className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800">
                    <PenLine />
                </button>
            </div>
        </div>
    )
}

export default InvoiceActionPopUpView
