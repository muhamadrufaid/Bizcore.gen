import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';


const BankAddView = ({ setActiveSection }) => {
    const [logo, setLogo] = useState(null);  // State for image
    const [logoPreview, setLogoPreview] = useState(null); // State for logo preview

    // Step 1: Set up state for form data
    const [bankData, setBankData] = useState({
        bank_name: '',
        branch: '',
        ifsc_code: '',
        account_number: '',
        upi_id: '',
        qr_code: '',
    });

    // Step 2: Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBankData({ ...bankData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Step 3: Validate required fields before submitting
        if (!bankData.bank_name || !bankData.branch) {
            toast.error('Please fill in both the Bank Name and Branch.');
            return;  // Prevent form submission if fields are missing
        }

        if (!bankData.ifsc_code || !bankData.account_number) {
            toast.error('Please fill in both the IFSC Code and Account Number.');
            return;  // Prevent form submission if fields are missing
        }

        // Step 4: Prepare FormData for submission (including the QR code image)
        const formDataToSend = new FormData();

        // Append the form fields to the FormData object
        formDataToSend.append('bank_name', bankData.bank_name);
        formDataToSend.append('branch', bankData.branch);
        formDataToSend.append('ifsc_code', bankData.ifsc_code);
        formDataToSend.append('account_number', bankData.account_number);
        formDataToSend.append('upi_id', bankData.upi_id);  // Optional field

        // Append the QR code (logo) if it's available
        if (logo) {
            formDataToSend.append('qr_code', logo);
        }

        // Step 5: Send the POST request with FormData
        axios.post('http://localhost:8000/api/bank-details/', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Ensure content type is correct for file upload
            },
        })
            .then((response) => {
                console.log('Bank created:', response.data);
                toast.success('Bank created successfully!');
                setActiveSection('bank-view');  // Navigate back to bank view after successful submission
            })
            .catch((error) => {
                console.error('There was an error creating the bank:', error);
                toast.error('There was an error creating the bank.');
            });
    };

    // Handle logo change
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const objectUrl = URL.createObjectURL(file);
            setLogoPreview(objectUrl);  // Set the preview URL for the logo
        }
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('bank-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        New Bank
                    </h1>
                </div>
                <div
                    onClick={handleSubmit}
                    className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <Save className='w-5 h-5' />
                    <button className=''>
                        Save Bank
                    </button>
                </div>
            </div>

            <div className='m-4'>
                <form className="p-6 pb-10 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className='flex justify-between gap-8 bg-white p-4 rounded-md pb-6'>
                        <div className="flex flex-col w-full gap-2">
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">Bank Name</label>
                                <input
                                    type="text"
                                    name="bank_name"
                                    value={bankData.bank_name}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter bank name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">Branch</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={bankData.branch}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter branch"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">Account Number</label>
                                <input
                                    type="text"
                                    name="account_number"
                                    value={bankData.account_number}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter account number"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifsc_code"
                                    value={bankData.ifsc_code}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter ifsc code"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-2 ">
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">UPI ID</label>
                                <input
                                    type="text"
                                    name="upi_id"
                                    value={bankData.upi_id}
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="sample: bankname@okhdfc"
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-gray-600 font-semibold text-sm">Upload QR Code</label>
                                <div className='flex justify-center items-center '>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="border p-2 w-full h-40 rounded-sm border-gray-400"

                                    />
                                    {/* QR Code Preview */}
                                    {logoPreview && (
                                        <div className="p-5">
                                            <img
                                                src={logoPreview}
                                                alt="QR Code Preview"
                                                className="h-59 w-59 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BankAddView
