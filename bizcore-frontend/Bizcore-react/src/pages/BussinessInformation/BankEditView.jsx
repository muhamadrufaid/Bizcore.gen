import React, { useState, useEffect } from 'react';
import { ChevronLeft, SaveAll } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';


const BankEditView = ({ setActiveSection, bankData }) => {
    const [qrCodeImage, setQrCodeImage] = useState(null);  // State for QR code image
    const [qrCodePreview, setQrCodePreview] = useState(); // State for QR code preview

    const [formData, setFormData] = useState({
        bank_name: '',
        branch: '',
        ifsc_code: '',
        account_number: '',
        upi_id: '',
        qr_code: ''
    });

    useEffect(() => {
        if (bankData) {
            setFormData({
                bank_name: bankData?.bank_name || '',
                branch: bankData?.branch || '',
                ifsc_code: bankData?.ifsc_code || '',
                account_number: bankData?.account_number || '',
                upi_id: bankData?.upi_id || '',
                qr_code: bankData?.qr_code || '',
            });
            setQrCodePreview(bankData?.qr_code);  // Set the preview of the QR code if available
        }
    }, [bankData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if bankData is null or undefined
        if (!bankData || !bankData.id) {
            alert('Bank data is not available.');
            return;  // Exit the function if bankData is not available
        }

        const formDataToSend = new FormData();
        formDataToSend.append("bank_name", formData.bank_name);
        formDataToSend.append("branch", formData.branch);
        formDataToSend.append("ifsc_code", formData.ifsc_code);
        formDataToSend.append("account_number", formData.account_number);
        formDataToSend.append("upi_id", formData.upi_id);


        // Append QR code image if available
        if (qrCodeImage) {  // Assuming qrCodeImage is the state holding the QR code image
            formDataToSend.append('qr_code', qrCodeImage);
        }
        console.log(bankData); // Check what bankData contains

        try {
            const response = await axios.put(
                `http://localhost:8000/api/bank-details/${bankData.id}/`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Updated successfully", response.data);
            toast.success('Bank Updated Successfully')
            setActiveSection("bank-view");
        } catch (error) {
            console.error("Error updating bank:", error);
        }
    };

    // Handle QR code change
    const handleQrCodeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrCodeImage(file);
            const objectUrl = URL.createObjectURL(file);
            setQrCodePreview(objectUrl);  // Set preview for QR code
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
                        Edit Bank
                    </h1>
                </div>
                <div
                    onClick={handleSubmit}
                    className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <SaveAll className='w-5 h-5' />
                    <button className=''>
                        Save Changes
                    </button>
                </div>
            </div>

            <div className='m-4'>
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-between gap-8 bg-white p-4 rounded-md pb-6'>


                        <div className="flex flex-col w-full gap-2">
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">Bank Name</label>
                                <input
                                    type="text"
                                    id="bank_name"
                                    name="bank_name"
                                    value={formData.bank_name}  // Pre-fill with formData
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter bank name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">Branch</label>
                                <input
                                    type="text"
                                    id="branch"
                                    name="branch"
                                    value={formData.branch}  // Pre-fill with formData
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter branch"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">Account Number</label>
                                <input
                                    type="text"
                                    id="account_number"
                                    name="account_number"
                                    value={formData.account_number}  // Pre-fill with formData
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter account number"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">IFSC Code</label>
                                <input
                                    type="text"
                                    id="ifsc_code"
                                    name="ifsc_code"
                                    value={formData.ifsc_code}  // Pre-fill with formData
                                    onChange={handleChange}
                                    className="border p-2 rounded-sm border-gray-400 text-gray-600"
                                    placeholder="Enter ifsc code"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <div className="flex flex-col">
                                <label className="text-gray-600 pb-1 text-sm">UPI ID</label>
                                <input
                                    type="text"
                                    id="upi_id"
                                    name="upi_id"
                                    value={formData.upi_id}  // Pre-fill with formData
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
                                        onChange={handleQrCodeChange}
                                        className="border p-2 w-full h-40 rounded-sm border-gray-400"

                                    />
                                    {/* QR Code Preview */}
                                    {qrCodePreview && (
                                        <div className="p-5">
                                            <img
                                                src={qrCodePreview}
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

export default BankEditView
