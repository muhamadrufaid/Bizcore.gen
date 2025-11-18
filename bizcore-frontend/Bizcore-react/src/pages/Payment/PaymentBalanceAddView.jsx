import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PaymentBalanceAddView = ({ setActiveSection, customerId, customerName, invoiceId, grandTotals, remaining_balance, invoiceDetails, closePopupPayment }) => {
    const statusOptions = ['unpaid', 'paid', 'partial', 'reversed', 'failed'];
    const paymentModeOptions = ['cash', 'card', 'upi', 'bank', 'credit', 'wallet', 'hybrid'];

    const [amountPaid, setAmountPaid] = useState(0.00);
    const [paymentMode, setPaymentMode] = useState('cash');
    const [cashAmount, setCashAmount] = useState(0.00);
    const [onlineAmount, setOnlineAmount] = useState(0.00);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [balanceDue, setBalanceDue] = useState(remaining_balance || '');
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [dueDate, setDueDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (paymentMode === 'hybrid') {
            // For hybrid mode, set amount_paid as the sum of cash and online amounts.
            setAmountPaid(cashAmount + onlineAmount);
        } else {
            setAmountPaid(amountPaid);
        }

        // Calculate balance due
        const calculatedBalanceDue = remaining_balance - amountPaid;
        setBalanceDue(calculatedBalanceDue);

        // Set payment status based on amount paid and grand total
        if (amountPaid === remaining_balance) {
            setPaymentStatus('paid');
            setDueDate(new Date().toISOString().split('T')[0]);  // Set due date to today for fully paid
        } else if (amountPaid < remaining_balance && amountPaid > 0) {
            setPaymentStatus('partial');
            setDueDate('');  // No due date for unpaid payments, user can set it
        } else if (amountPaid === 0) {
            setPaymentStatus('unpaid');
            setDueDate('');  // No due date for unpaid payments, user can set it
        }

        // Validate amount paid is not negative and does not exceed bill amount
        if (amountPaid < 0) {
            setErrorMessage('Amount paid cannot be negative');
        } else if (amountPaid > remaining_balance) {
            setErrorMessage(`Amount paid cannot exceed the remaining balance`);
        } else {
            setErrorMessage('');
        }
    }, [amountPaid, cashAmount, onlineAmount, paymentMode, remaining_balance]);

    const handlePaymentSubmit = async () => {

        // Check if the due_date is set when the payment status is not "paid"
        if ((paymentStatus === 'partial' || paymentStatus === 'unpaid') && !dueDate) {
            toast.error('Please set a due date for partial or unpaid payments');
            return;
        }

        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        if (!customerId) {
            alert('Customer ID is missing.');
            return;
        }

        const paymentData = {
            invoice: invoiceId,
            customer: customerId,  // Ensure this is valid
            bill_amount: grandTotals,
            amount_paid: amountPaid,
            cash_amount: cashAmount,
            online_amount: onlineAmount,
            balance_due: balanceDue,
            payment_mode: paymentMode,
            payment_status: paymentStatus,
            reference_number: referenceNumber, // Should be dynamic or generated
            due_date: dueDate,  // Send due date along with payment data
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/payments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Payment successful:', responseData);
                toast.success('Payment is Successful')
                setActiveSection('invoice-view');
                closePopupPayment();

            } else {
                const errorData = await response.json();
                console.error('Error submitting payment:', errorData);
                alert(`Error submitting payment: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
            alert('There was an error submitting the payment.');
        }
    };

    return (
        <div>
            <div className='m-2'>
                <h1 className='font-semibold text-xl text-blue-500'>Payment Details</h1>
            </div>
            <div className='mt-2 flex justify-between'>
                <div className='mb-2'>
                    <div className='flex items-center pl-2'>
                        <h1 className='text-md font-semibold'>Invoice Number</h1>
                        <p className='pl-2'>:</p>
                        <p className='text-sm pl-1'>{invoiceDetails?.invoice_number}</p>
                    </div>
                    <div className='flex items-center pl-2'>
                        <h1 className='text-md font-semibold'>Customer</h1>
                        <p className='pl-2'>:</p>
                        <p className='text-sm pl-1'>{customerName || 'Customer name is not available'}</p>
                    </div>
                    <div className="flex pl-2">
                        <label className='text-md font-semibold'>Due Date</label>
                        <p className='pl-4'>:</p>
                        <input
                            type="date"
                            className="text-sm pl-1"
                            value={dueDate || ''}
                            onChange={(e) => setDueDate(e.target.value)} // User can change if unpaid
                            disabled={paymentStatus === 'paid'} // Disable if status is paid/partial
                        />
                    </div>
                </div>
                <div>
                    <div className='flex items-center pr-2'>
                        <h1 className='text-md font-semibold'>You have only <span className='text-red-400 font-bold'>₹{remaining_balance}</span> left to pay</h1>
                    </div>
                </div>
            </div>
            <div className='flex gap-10 p-4 bg-gray-200 mb-2 rounded-sm'>
                <div className='flex flex-col gap-1'>
                    <label className="text-gray-700 text-sm font-semibold">Payment Status</label>
                    <select
                        name="status"
                        className="border p-1 px-10 border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                        <option value="" >Select Payment Status</option>
                        {statusOptions.map((status, i) => (
                            <option key={i} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className="text-gray-700 text-sm font-semibold">Payment Mode</label>
                    <select
                        name="paymentMode"
                        className="border p-1 px-10 border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="" >Select Payment Mode</option>
                        {paymentModeOptions.map((mode, i) => (
                            <option key={i} value={mode}>{mode}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 text-sm font-semibold">Reference Number :</label>
                    <input
                        type="text"
                        className="border p-1 border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                        placeholder='Enter reference number'
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)} // Store as string
                    />
                </div>
            </div>

            <div className='flex flex-col gap-3 bg-red-100 items-end p-2'>
                <div className="flex items-center">
                    <label className="text-gray-700 text-sm font-semibold pr-2">Bill Amount :</label>
                    <input
                        type="text"
                        className="border p-1 pr-2 rounded-sm border-gray-400 text-right"
                        placeholder='0.00'
                        value={grandTotals}
                        readOnly
                    />
                </div>
                {paymentMode === 'hybrid' ? (
                    <div className="flex items-center">
                        <div className="flex flex-col pr-3">
                            <label className="text-gray-700 text-sm font-semibold pr-2">Cash Amount :</label>
                            <input
                                type="number"
                                className="border pr-2 rounded-sm border-gray-400 text-right"
                                placeholder='0.00'
                                value={cashAmount}
                                onChange={(e) => setCashAmount(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col pr-3">
                            <label className="text-gray-700 text-sm font-semibold pr-2">Online Amount :</label>
                            <input
                                type="text"
                                className="border pr-2 rounded-sm border-gray-400 text-right"
                                placeholder='0.00'
                                value={onlineAmount}
                                onChange={(e) => setOnlineAmount(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="text-gray-700 text-sm font-semibold pr-2">Amount Paid :</label>
                            <input
                                type="number"
                                className="border p-1 pr-2 rounded-sm border-gray-400 text-right"
                                placeholder='0.00'
                                value={onlineAmount + cashAmount}
                                onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
                                readOnly
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <label className="text-gray-700 text-sm font-semibold pr-2">Amount Paid :</label>
                        <input
                            type="number"
                            className="border p-1 pr-2 rounded-sm border-gray-400 text-right"
                            placeholder='0.00'
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
                        />
                    </div>
                )}
                <div className="flex items-center">
                    <label className="text-gray-700 text-sm font-semibold pr-2">Balance :</label>
                    <input
                        type="text"
                        className="border p-1 pr-2 rounded-sm border-gray-400 text-right"
                        placeholder='0.00'
                        value={balanceDue}
                        readOnly
                    />
                </div>
            </div>
            {errorMessage && <p className="text-red-500 pl-2">{errorMessage}</p>}
            <div className='mt-2 flex items-center justify-end'>
                <div className='flex p-1 gap-2'>
                    <button
                        onClick={handlePaymentSubmit}
                        className={`border px-6 py-2 rounded-md ${errorMessage ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-400'}`}
                        disabled={!!errorMessage}
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentBalanceAddView
