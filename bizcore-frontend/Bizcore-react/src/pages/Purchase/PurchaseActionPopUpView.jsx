import React, { useState, useEffect } from 'react'
import { Eye, X, PenLine, Banknote } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const PurchaseActionPopUpView = ({ setActiveSection, purchase, refreshPurchase, setPurchaseId, closePopupActionView }) => {

    const openInvoice = async () => {
        if (!purchase || !purchase.id) {
            console.error('Invalid purchase data');
            return;  // Prevent further execution if purchase is invalid
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/purchase/${purchase.id}/`);
            const purchaseData = response.data;
            setPurchaseId(purchase.id);
            refreshPurchase();
            setActiveSection('purchase-edit');
            console.log('Fetched purchase:', purchaseData);
        } catch (error) {
            console.error('Error fetching purchase data:', error);
            toast.error('An error occurred while fetching the purchase data.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">Purchase Actions</h1>
            <div className="mb-6">
                <p className="text-gray-700">You want to perform actions to this purchase <span className='text-blue-500'>{purchase?.invoice_number} <br /> {purchase?.vendor_name} </span></p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-15">
                <button
                    onClick={closePopupActionView}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                    <X />
                </button>
                <button
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

export default PurchaseActionPopUpView
