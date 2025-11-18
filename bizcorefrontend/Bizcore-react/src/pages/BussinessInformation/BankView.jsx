import { Pencil, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BankView = ({ setActiveSection, setBankId, setBankData, bankId, setSelectedBank }) => {

    const [bankDetails, setBankDetails] = useState([]);
    const [bankdetail, setBankDetail] = useState(null);
    const [selectedBankId, setSelectedBankId] = useState(null);  // State for selected bank ID

    const [selectedBank, setSelectedBankState] = useState(null);

    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (bankId) {
            // Fetch customer data based on ID
            axios.get(`http://localhost:8000/api/bank-details/${bankId}/`)
                .then(response => {
                    setBankDetail(response.data);  // Set the customer data
                    setBankData(response.data);  // Pass the customer data to parent for editing
                })
                .catch(error => {
                    console.error('Error fetching bank details details:', error);
                });
        }
    }, [bankId, setBankData]);
    // After setting the selected bank
    useEffect(() => {
        if (selectedBank) {
            console.log(selectedBank); // Check if it's populated correctly
        }
    }, [selectedBank]);

    useEffect(() => {

        // Retrieve saved selected bank ID from localStorage
        const savedBankId = localStorage.getItem('selectedBankId');
        if (savedBankId) {
            setSelectedBankId(savedBankId);  // Set the saved bank ID
        }

        // Fetch data from backend
        axios.get('http://localhost:8000/api/bank-details/')
            .then(response => {
                setBankDetails(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching bank details:', error);
                setLoading(false);
            });
    }, []);

    const handleRowClick = (id) => {
        // Set the customer ID for detail view
        setBankId(id);
        // Navigate to customer detail view
        setActiveSection('bank-edit');  // You should have a section for customer details
        console.log(`Show details for bank with ID: ${id}`);
    }


    const handleRadioButtonChange = (bank) => {
        setSelectedBankState(bank);  // Update selected bank state
        setSelectedBank(bank);       // Pass selected bank to parent component (if needed)
    };


    // Loading state
    if (loading) {
        return <div>Loading...</div>;  // Display loading message while fetching data
    }

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Bank Details
                    </h1>
                </div>
                <div
                    onClick={() => setActiveSection('bank-add')}
                    className='flex items-center justify-center bg-blue-500  rounded-md hover:bg-blue-700 px-3 py-2'>
                    <button
                        className="flex gap-2 text-white">
                        <label className='text-white'><Plus /></label>
                    </button>
                </div>
            </div>

            <div className='m-4 bg-white p-4 overflow-x-auto max-h-140 custom-scrollbar rounded-xl pb-10 pt-10 custom-shadow-black'>
                <div className='flex justify-evenly  '>
                    <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-10'>
                        {/* Check if bankDetails is empty */}
                        {bankDetails.length === 0 ? (
                            <div className="flex justify-center items-center w-full p-4 bg-gray-100 rounded-lg">
                                <p className="text-gray-500">No bank details available.</p>
                            </div>
                        ) : (

                            bankDetails.map((bank) => (
                                <div key={bank.id}>
                                    <div
                                        className="flex justify-between items-center w-129 h-59 rounded-xl p-1 pr-2 pt-2 pb-2"
                                        style={{ background: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)' }}
                                    >
                                        <div className='flex items-center rounded-l-lg'>
                                            <div className='flex p-2'>
                                                <table className='flex flex-col gap-4 text-white'>
                                                    <tr>
                                                        <th className='pl-2 text-left font-semibold'>Bank Name</th>
                                                        <td className='pl-5 font-semibold'>{bank.bank_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='pl-2 text-left font-semibold'>Branch</th>
                                                        <td className='pl-5'>{bank.branch}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='pl-2 text-left font-semibold'>IFSC</th>
                                                        <td className='pl-5'>{bank.ifsc_code}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='pl-2 text-left font-semibold'>Acc No</th>
                                                        <td className='pl-5'>{bank.account_number}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='pl-2 text-left font-semibold'>UPI ID</th>
                                                        <td className='pl-5'>{bank.upi_id}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                        <div className='flex ml-6 items-center justify-center border border-white rounded-lg overflow-hidden w-35 h-35'>
                                            {bank.qr_code ? (
                                                <img
                                                    src={bank.qr_code} // ✅ NO /api here!
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <p className='text-white text-sm'>No QR code available</p>
                                            )}
                                        </div>
                                        <div className='flex p-2 items-end justify-center w-15 h-full rounded-lg'>
                                            <button
                                                onClick={() => handleRowClick(bank.id)}
                                                className='p-3 rounded-lg font-semibold bg-gray-100'>
                                                <Pencil />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Radio button for selecting this bank account */}
                                    <div className="flex justify-center pt-1 items-center space-x-2">
                                        <input
                                            type="radio"
                                            id={`bankRadio-${bank.id}`}
                                            name="invoiceOption"
                                            value="invoice"
                                            className="form-radio w-4 h-4 text-blue-600 peer"
                                            checked={selectedBank && selectedBank.id === bank.id}  // Check if this bank is selected
                                            onChange={() => handleRadioButtonChange(bank)}  // Update selected bank on radio change
                                        />
                                        <label className="text-sm">Select this bank account to invoice</label>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankView