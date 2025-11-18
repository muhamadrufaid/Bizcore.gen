import React, { useState, useEffect } from 'react'
import { User, UserPen, Minimize2, Maximize2, X } from 'lucide-react';
import CustomerInvoiceCreateView from './CustomerInvoiceCreateView';
import CustomerInvoiceEditView from './CustomerInvoiceEditView';
import CustomerCreditAddView from './CustomerCreditAddView';
import axios from 'axios';

const customersample = () => {

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

    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomerState] = useState(null);

    useEffect(() => {
        if (searchQuery.length > 2) {
            // Fetch customers from the backend based on search query
            axios.get(`http://localhost:8000/api/customers/`, { params: { search: searchQuery } })
                .then(response => {
                    setFilteredCustomers(response.data); // Assuming the backend returns an array of customers
                })
                .catch(error => {
                    console.error("Error fetching customers:", error);
                });
        } else {
            setFilteredCustomers([]); // Clear results when query is less than 3 characters
        }
    }, [searchQuery]);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomerState(customer);
        setSelectedCustomer(customer); // Pass selected customer to parent (InvoiceGeneratorView)
        setSearchQuery(''); // Clear search query
        setFilteredCustomers([]); // Clear filtered customers list
    };

    const handleAddToInvoice = () => {
        if (selectedCustomer) {
            console.log('Selected Customer for Invoice:', selectedCustomer);
        }
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
                                placeholder="Enter customer name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold p-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                className="border border-gray-400 p-1 w-70 rounded-sm hover:border-blue-400"
                                placeholder="Enter Phone"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                            />
                        </div>
                    </div>
                    <div className='flex items-center pt-8 p-2 gap-2'>

                        {selectedCustomer ? (
                            <button
                                onClick={handleAddToInvoice}
                                className='p-1 w-40 rounded-sm bg-blue-500 text-white hover:bg-blue-700'
                            >
                                Add Customer to Invoice
                            </button>
                        ) : (
                            <button
                                onClick={showPopupCreateCustomer}
                                className='p-1 w-40 rounded-sm bg-blue-500 text-white hover:bg-blue-700'
                            >
                                Add New Customer
                            </button>
                        )}

                        <button
                            onClick={showPopupCreditAdd}
                            className='p-1 w-40 rounded-sm bg-green-500 text-white hover:bg-green-700'>
                            Use Credit
                        </button>
                    </div>
                </div>
                <hr className='text-gray-500' />
                <div className='pt-1 pb-10'>
                    <h1 className='bg-gray-600 p-1 text-white'>Dropdown</h1>
                    {filteredCustomers.length > 0 && (
                        <div className='flex flex-col'>
                            {filteredCustomers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => handleSelectCustomer(customer)} // Select customer
                                    className='flex items-center w-full justify-between p-2 border-b border-gray-400'>
                                    <div className='flex'>
                                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-400'>
                                            <User className='text-white' />
                                        </div>
                                        <h1 className='p-2 font-semibold'>
                                            {customer.name}
                                        </h1>
                                    </div>
                                    <h2 className='p-2'>{customer.phone}</h2>
                                    <h2 className='p-2'>{customer.email}</h2>
                                    <h2 className='p-2 font-semibold'>{customer.credit_earned}</h2>
                                    <h2 className='p-2'>{customer.customer_type}</h2>
                                    <h2 className='p-2'>{customer.status}</h2>
                                    <div>
                                        <button
                                            onClick={showPopupEditCustomer}
                                            className='border px-6 border-blue-400 text-blue-400 p-2 rounded-md'>
                                            <UserPen />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            {isPopupCreateCustomer && (
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
                        <CustomerInvoiceCreateView />
                    </div>
                </div>
            )}
            {isPopupEditCustomer && (
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
                        <CustomerInvoiceEditView />
                    </div>
                </div>
            )}
            {isPopupCreditAdd && (
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
            )}
        </div>
    )
}


export default customersample
