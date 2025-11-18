import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, X, UserPen, Minimize2, Maximize2 } from 'lucide-react';
import PurchaseVendorCreateView from '../Vendor/PurchaseVendorCreateView';
import PurchaseVendorEditView from './PurchaseVendorEditView';


const PurchaseVendorAddView = ({ onVendorSelect, closePopup }) => {

    const [filter, setFilter] = useState('all'); // Default filter to 'all'
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);

    const [isPopupCreateVendor, setIsPopupCreateVendor] = useState(false);
    const [isFullScreenCreateVendor, setIsFullScreenCreateVendor] = useState(false);
    const showPopupCreateVendor = () => setIsPopupCreateVendor(true);
    const closePopupCreateVendor = () => setIsPopupCreateVendor(false);
    const toggleFullScreenCreateVendor = () => setIsFullScreenCreateVendor((prev) => !prev);

    const [isPopupEditVendor, setIsPopupEditVendor] = useState(false);
    const [isFullScreenEditVendor, setIsFullScreenEditVendor] = useState(false);
    const showPopupEditVendor = () => setIsPopupEditVendor(true);
    const closePopupEditVendor = () => setIsPopupEditVendor(false);
    const toggleFullScreenEditVendor = () => setIsFullScreenEditVendor((prev) => !prev);

    useEffect(() => {
        // Fetch data from Django backend
        axios.get('http://localhost:8000/api/vendors/')
            .then(response => {
                setVendors(response.data); // Set items in state
                setFilteredVendors(response.data); // Initialize filtered list
            })
            .catch(error => {
                console.error('There was an error fetching the Vendor Data!', error);
            });
    }, []);

    useEffect(() => {
        const searchLower = searchQuery?.toLowerCase() || ''; // Safely handle null/undefined for searchQuery

        const filtered = vendors.filter(vendor => {
            // Provide default empty strings if fields are missing (null or undefined)
            const companyName = vendor.company_name ? vendor.company_name.toLowerCase() : ''; // Safeguard for 'company_name'
            const phone = vendor.phone ? vendor.phone.toString().toLowerCase() : ''; // Safeguard for 'phone'
            const email = vendor.email ? vendor.email.toLowerCase() : ''; // Safeguard for 'email'
            const contactPerson = vendor.contact_person ? vendor.contact_person.toLowerCase() : ''; // Safeguard for 'contact_person'
            const createdAt = vendor.created_at ? vendor.created_at.toLowerCase() : ''; // Safeguard for 'created_at'
            const gstNumber = vendor.gst_number ? vendor.gst_number.toLowerCase() : ''; // Safeguard for 'gst_number'

            return (
                companyName.includes(searchLower) ||
                phone.includes(searchLower) ||
                email.includes(searchLower) ||
                contactPerson.includes(searchLower) ||
                createdAt.includes(searchLower) ||
                gstNumber.includes(searchLower)
            );
        });

        setFilteredVendors(filtered);
    }, [searchQuery, vendors]);


    // Handle row click (select vendor)
    const handleRowClick = (vendor) => {
        setSelectedVendor(vendor); // Set the selected vendor
        setSearchQuery(vendor.phone); // Update search query with the selected vendor's name
        onVendorSelect(vendor); // Pass the selected vendor to the parent component
    };

    // Function to pass the selected Vendor data to the InvoiceView (to be defined in your routing)
    const handleAddToInvoice = () => {
        // Pass the selected Vendor to the parent and close the modal
        if (selectedVendor) {
            console.log("Vendors added to invoice:", selectedVendor);
            closePopup(); // Close the modal after Vendor is added to invoice
        }
    };

    const handleVendorCreation = (newVendor) => {
        // Update customers state with the new customer
        setVendors((prevVendors) => [...prevVendors, newVendor]);

        // Filter customers list again after adding the new customer
        setFilteredVendors((prevFilteredVendors) => [
            ...prevFilteredVendors.filter((vendor) => vendor.id !== newVendor.id),
            newVendor
        ]);

        // Set the newly created customer
        setSelectedVendor(newVendor);
        setSearchQuery(newVendor.phone); // Set the search query to the customer's phone

        // Pass the new customer to the parent component
        onVendorSelect(newVendor);  // Update the parent component with the selected customer (draftInvoiceData.customer)

        closePopupCreateVendor(); // Close the popup after the customer is created
    };

    // Open the Edit Vendor popup when the Edit button is clicked
    const handleEditVendorClick = (vendor) => {
        setSelectedVendor(vendor); // Set the Vendor to edit
        showPopupEditVendor(); // Open the Edit Vendor popup
    };

    const handleVendorUpdate = (updatedVendor) => {
        // Update the Vendors list with the updated Vendor
        const updatedVendors = vendors.map((vendor) =>
            vendor.id === updatedVendor.id ? updatedVendor : vendor
        );
        setVendors(updatedVendors);

        // Update the selected Vendor
        setSelectedVendor(updatedVendor);

        // Update the draftInvoiceData with the new Vendor data
        onVendorSelect(updatedVendor);  // Ensure PurchaseData.Vendor is updated with the modified Vendor

        // Pass the updated customer to the parent component
        onVendorSelect(updatedVendor); // Update the parent component with the selected Vendor (PurchaseData.Vendor)
    };


    return (
        <div className='m-1'>

            <div className='flex flex-col bg-white rounded-xl'>
                <div className='flex pl-1 items-center'>
                    <h1 className='text-2xl pb-2 font-semibold text-blue-600'>Vendor Search </h1>
                </div>
                <div className='flex bg-white rounded-lg pb-2'>
                    <div className='flex gap-4'>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold p-1">Vendor Name</label>
                            <input
                                type="text"
                                name="name"
                                className="border border-gray-400 p-1 w-70 rounded-sm hover:border-blue-400"
                                value={selectedVendor ? selectedVendor.company_name : ''} // Set customer name
                                readOnly // Make the field read-only if a customer is selected

                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold p-1">Search by Phone or Name</label>
                            <input
                                type="text"
                                name="phone"
                                className="border border-gray-400 p-1 w-70 rounded-sm hover:border-blue-400"
                                placeholder="Search by Phone or Email"
                                value={selectedVendor && !searchQuery ? selectedVendor.company_name : searchQuery}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchQuery(value); // Update search query
                                    if (value === '') {
                                        setSelectedVendor(null); // Clear selected customer when phone field is cleared
                                    }
                                }}
                                onBlur={() => {
                                    if (!searchQuery) {
                                        setSelectedVendor(null); // Reset when the user leaves the field with no input
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex items-center pt-8 p-2 gap-2'>
                        {selectedVendor ? (
                            <>
                                {/* "Add to Invoice" button shows if a customer is selected */}
                                <button
                                    onClick={handleAddToInvoice} // Call handleAddToInvoice when "Add to Invoice"
                                    className='p-1 w-40 rounded-sm bg-blue-500 text-white hover:bg-blue-700'
                                >
                                    Add to Purchase
                                </button>
                            </>
                        ) : (
                            // "Add New Customer" button shows if no customer is selected
                            <button
                                className='p-1 w-40 rounded-sm bg-blue-500 text-white hover:bg-blue-700'
                                onClick={showPopupCreateVendor}
                            >
                                Add New Vendor
                            </button>
                        )}
                    </div>
                </div>
                <div className='w-full bg-gray-500 pl-2'>
                    <h1 className='text-white font-semibold '>
                        Dropdown Vendors
                    </h1>
                </div>
                <div className="w-full bg-white rounded-lg shadow-sm max-h-60 overflow-y-auto mt-2 custom-scrollbar">
                    <table className="min-w-full table-auto">
                        <tbody className="flex flex-col gap-1">
                            {filteredVendors.map((vendor, index) => (
                                <tr
                                    key={vendor.id}
                                    onClick={() => handleRowClick(vendor)}
                                    className="cursor-pointer hover:bg-gray-200"
                                >
                                    <td className="p-2 border-b flex items-center justify-between">
                                        {/* Customer Info */}
                                        <div className="flex gap-4 items-center">
                                            <User className="w-8 h-8 bg-gray-500 p-2 text-white rounded-full" />
                                            <h1 className="text-sm font-medium">{vendor.company_name}</h1>
                                        </div>
                                        {/* Customer Details */}
                                        <div className="flex gap-2 text-sm">
                                            <p className='p-2 '>{vendor.name}</p>
                                            <p className='p-2 '>{vendor.phone}</p>
                                            <p className='p-2'>{vendor.email}</p>
                                            <p className='p-2'>{vendor.status}</p>
                                        </div>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEditVendorClick(vendor)}
                                            className="text-blue-600 p-2"
                                        >
                                            <UserPen />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                isPopupCreateVendor && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenCreateVendor ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenCreateVendor}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenCreateVendor ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupCreateVendor}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <PurchaseVendorCreateView onVendorCreated={handleVendorCreation} phone={searchQuery} />
                        </div>
                    </div>
                )
            }
            {
                isPopupEditVendor && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenEditVendor ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenEditVendor}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenEditVendor ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupEditVendor}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <PurchaseVendorEditView vendor={selectedVendor}
                                closePopup={closePopupEditVendor}
                                onVendorUpdated={handleVendorUpdate}
                                setVendors={setVendors} />
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default PurchaseVendorAddView
