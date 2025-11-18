import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, X, UserPen, Minimize2, Maximize2 } from 'lucide-react';
import CustomerInvoiceCreateView from './CustomerInvoiceCreateView';
import CustomerInvoiceEditView from './CustomerInvoiceEditView';
import CustomerCreditAddView from './CustomerCreditAddView';

const CustomerInvoiceAddView = ({ onCustomerSelect, closePopup }) => {

    const [filter, setFilter] = useState('all'); // Default filter to 'all'
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [isPopupCreateCustomer, setIsPopupCreateCustomer] = useState(false);
    const [isFullScreenCreateCustomer, setIsFullScreenCreateCustomer] = useState(false);
    const showPopupCreateCustomer = () => setIsPopupCreateCustomer(true);
    const closePopupCreateCustomer = () => setIsPopupCreateCustomer(false);
    const toggleFullScreenCreateCustomer = () => setIsFullScreenCreateCustomer((prev) => !prev);

    const [isPopupEditCustomer, setIsPopupEditCustomer] = useState(false);
    const [isFullScreenEditCustomer, setIsFullScreenEditCustomer] = useState(false);
    const showPopupEditCustomer = () => setIsPopupEditCustomer(true);
    const closePopupEditCustomer = () => setIsPopupEditCustomer(false);
    const toggleFullScreenEditCustomer = () => setIsFullScreenEditCustomer((prev) => !prev);

    const [isPopupCreditAdd, setIsPopupCreditAdd] = useState(false);
    const [isFullScreenCreditAdd, setIsFullScreenCreditAdd] = useState(false);
    const showPopupCreditAdd = () => setIsPopupCreditAdd(true);
    const closePopupCreditAdd = () => setIsPopupCreditAdd(false);
    const toggleFullScreenCreditAdd = () => setIsFullScreenCreditAdd((prev) => !prev);

    useEffect(() => {
        // Fetch data from Django backend
        axios.get('http://localhost:8000/api/customers/')
            .then(response => {
                setCustomers(response.data); // Set items in state
                setFilteredCustomers(response.data); // Initialize filtered list
            })
            .catch(error => {
                console.error('There was an error fetching the Customer Data!', error);
            });
    }, []);


    useEffect(() => {
        const searchLower = searchQuery?.toLowerCase() || ''; // Safely handle null/undefined for searchQuery

        const filtered = customers.filter(customer => {
            // Provide default empty strings if fields are missing (null or undefined)
            const name = customer.name ? customer.name.toLowerCase() : ''; // Safeguard for 'name'
            const phone = customer.phone ? customer.phone.toString().toLowerCase() : ''; // Safeguard for 'phone'
            const email = customer.email ? customer.email.toLowerCase() : ''; // Safeguard for 'email'
            const customerType = customer.customer_type ? customer.customer_type.toLowerCase() : ''; // Safeguard for 'customer_type'
            const status = customer.status ? customer.status.toLowerCase() : ''; // Safeguard for 'status'
            const createdAt = customer.created_at ? customer.created_at.toLowerCase() : ''; // Safeguard for 'created_at'

            return (
                name.includes(searchLower) ||
                phone.includes(searchLower) ||
                email.includes(searchLower) ||
                customerType.includes(searchLower) ||
                status.includes(searchLower) ||
                createdAt.includes(searchLower)
            );
        });

        setFilteredCustomers(filtered);
    }, [searchQuery, customers]);


    // Handle row click (select customer)
    const handleRowClick = (customer) => {

        setSelectedCustomer(customer); // Set the selected customer
        setSearchQuery(customer.phone); // Update search query with the selected customer's name
        onCustomerSelect(customer); // Pass the selected customer to the parent component

    };

    // Function to pass the selected customer data to the InvoiceView (to be defined in your routing)
    const handleAddToInvoice = () => {
        // Pass the selected customer to the parent and close the modal
        if (selectedCustomer) {
            console.log("Customer added to invoice:", selectedCustomer);
            closePopup(); // Close the modal after customer is added to invoice
        }
    };

    const handleCustomerCreation = (newCustomer) => {
        // Update customers state with the new customer
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);

        // Filter customers list again after adding the new customer
        setFilteredCustomers((prevFilteredCustomers) => [
            ...prevFilteredCustomers.filter((customer) => customer.id !== newCustomer.id),
            newCustomer
        ]);

        // Set the newly created customer
        setSelectedCustomer(newCustomer);
        setSearchQuery(newCustomer.phone); // Set the search query to the customer's phone

        // Pass the new customer to the parent component
        onCustomerSelect(newCustomer);  // Update the parent component with the selected customer (draftInvoiceData.customer)

        closePopupCreateCustomer(); // Close the popup after the customer is created
    };

    // Open the Edit Customer popup when the Edit button is clicked
    const handleEditCustomerClick = (customer) => {
        setSelectedCustomer(customer); // Set the customer to edit
        showPopupEditCustomer(); // Open the Edit Customer popup
    };

    const handleCustomerUpdate = (updatedCustomer) => {
        // Update the customers list with the updated customer
        const updatedCustomers = customers.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
        );
        setCustomers(updatedCustomers);

        // Update the selected customer
        setSelectedCustomer(updatedCustomer);

        // Update the draftInvoiceData with the new customer data
        onCustomerSelect(updatedCustomer);  // Ensure draftInvoiceData.customer is updated with the modified customer

        // Pass the updated customer to the parent component
        onCustomerSelect(updatedCustomer); // Update the parent component with the selected customer (draftInvoiceData.customer)
    };


    return (
        <div className='m-1'>

            <div className='flex flex-col bg-white rounded-xl'>
                <div className='flex pl-1 items-center'>
                    <h1 className='text-2xl pb-2 font-semibold text-blue-600'>Customer Search </h1>
                </div>
                <div className='flex bg-white rounded-lg pb-2'>
                    <div className='flex gap-4'>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold p-1">Customer Name</label>
                            <input
                                type="text"
                                name="name"
                                className="border border-gray-400 p-1 w-70 rounded-sm hover:border-blue-400"
                                value={selectedCustomer ? selectedCustomer.name : ''} // Set customer name
                                readOnly // Make the field read-only if a customer is selected

                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold p-1">Search by Phone or Email</label>
                            <input
                                type="text"
                                name="phone"
                                className="border border-gray-400 p-1 w-70 rounded-sm hover:border-blue-400"
                                placeholder="Search by Phone or Email"
                                value={selectedCustomer && !searchQuery ? selectedCustomer.phone : searchQuery}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchQuery(value); // Update search query
                                    if (value === '') {
                                        setSelectedCustomer(null); // Clear selected customer when phone field is cleared
                                    }
                                }}
                                onBlur={() => {
                                    if (!searchQuery) {
                                        setSelectedCustomer(null); // Reset when the user leaves the field with no input
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex items-center pt-8 p-2 gap-2'>
                        {selectedCustomer ? (
                            <>
                                {/* "Add to Invoice" button shows if a customer is selected */}
                                <button
                                    onClick={handleAddToInvoice} // Call handleAddToInvoice when "Add to Invoice"
                                    className='p-1 w-40 rounded-sm bg-blue-500 text-white hover:bg-blue-700'
                                >
                                    Add to Invoice
                                </button>

                                {/* "Use Credit" button will now only appear when a customer is selected */}
                                <button
                                    onClick={showPopupCreditAdd}
                                    className='p-1 w-24 rounded-sm bg-green-500 text-md text-white hover:bg-green-700'
                                >
                                    Use Credit
                                </button>
                            </>
                        ) : (
                            // "Add New Customer" button shows if no customer is selected
                            <button
                                className='p-1 w-40 rounded-sm bg-blue-500 text-white hover:bg-blue-700'
                                onClick={showPopupCreateCustomer}
                            >
                                Add New Customer
                            </button>
                        )}
                    </div>
                </div>
                <div className='w-full bg-gray-500 pl-2'>
                    <h1 className='text-white font-semibold '>
                        Dropdown Customer
                    </h1>
                </div>
                <div className="w-full bg-white rounded-lg shadow-sm max-h-60 overflow-y-auto mt-2 custom-scrollbar">
                    <table className="min-w-full table-auto">
                        <tbody className="flex flex-col gap-1">
                            {filteredCustomers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    onClick={() => handleRowClick(customer)}
                                    className="cursor-pointer hover:bg-gray-200"
                                >
                                    <td className="p-2 border-b flex items-center justify-between">
                                        {/* Customer Info */}
                                        <div className="flex gap-4 items-center">
                                            <User className="w-8 h-8 bg-gray-500 p-2 text-white rounded-full" />
                                            <h1 className="text-sm font-medium">{customer.name}</h1>
                                        </div>
                                        {/* Customer Details */}
                                        <div className="flex gap-2 text-sm">
                                            <p className='p-2 '>{customer.phone}</p>
                                            <p className='p-2'>{customer.email}</p>
                                            <p className='p-2'>Credit: <span className='text-green-600 text-md font-semibold'>{customer.credit_earned}</span></p>
                                            <p className='p-2'>{customer.customer_type}</p>
                                            <p className='p-2'>{customer.status}</p>
                                        </div>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEditCustomerClick(customer)}
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
                isPopupCreateCustomer && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenCreateCustomer ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenCreateCustomer}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenCreateCustomer ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupCreateCustomer}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <CustomerInvoiceCreateView onCustomerCreated={handleCustomerCreation} phone={searchQuery} />
                        </div>
                    </div>
                )
            }
            {
                isPopupEditCustomer && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenEditCustomer ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenEditCustomer}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenEditCustomer ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupEditCustomer}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <CustomerInvoiceEditView customer={selectedCustomer}
                                closePopup={closePopupEditCustomer}
                                onCustomerUpdated={handleCustomerUpdate}
                                setCustomers={setCustomers} />
                        </div>
                    </div>
                )
            }
            {
                isPopupCreditAdd && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenCreditAdd ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '800px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenCreditAdd}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenCreditAdd ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupCreditAdd}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <CustomerCreditAddView />
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default CustomerInvoiceAddView;
