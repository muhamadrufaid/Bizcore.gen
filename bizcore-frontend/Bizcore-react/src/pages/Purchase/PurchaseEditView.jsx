import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, X, CirclePlus, Save, Minimize2, Maximize2, } from 'lucide-react';
import axios from 'axios';
import PurchaseVendorAddView from './PurchaseVendorAddView';
import PurchaseDeleteConfirmView from './PurchaseDeleteConfirmView';
import { toast } from 'react-toastify';

const PurchaseEditView = ({ setActiveSection, purchaseData, refreshPurchase, setPurchaseData, purchaseId }) => {

    const [selectedVendor, setSelectedVendor] = useState(purchaseData?.vendor || null);
    const clearSelectedVendor = () => {
        setSelectedVendor(null); // Clear the selected customer
    };

    const [isPopupVendorAdd, setIsPopupVendorAdd] = useState(false); // State to control popup visibility
    const [isFullScreenVendor, setIsFullScreenVendor] = useState(false);
    const closePopupVendor = () => setIsPopupVendorAdd(false);
    const showPopupVendor = () => setIsPopupVendorAdd(true);
    const toggleFullScreenVendor = () => setIsFullScreenCustomer((prev) => !prev);

    const [isPopupDeleteConfirm, setIsPopupDeleteConfirm] = useState(false); // State to control popup visibility

    const StatusOptions = ['paid', 'partial', 'pending'];

    const [itemToDelete, setItemToDelete] = useState(null); // Store item to delete
    const [items, setItems] = useState(purchaseData?.items || []);

    const [invoiceNumber, setInvoiceNumber] = useState(purchaseData?.invoice_number || '');
    const [purchaseDate, setPurchaseDate] = useState(purchaseData?.purchase_date || '');
    const [subTotal, setSubTotal] = useState(purchaseData?.subtotal || 0);
    const [totalTax, setTotalTax] = useState(purchaseData?.total_tax || 0);
    const [grandTotal, setGrandTotal] = useState(purchaseData?.grand_total || 0);
    const [amountPaid, setAmountPaid] = useState(purchaseData?.amount_paid || 0);
    const [purchaseDiscount, setPurchaseDiscount] = useState(purchaseData?.discount || 0);
    const [balanceDue, setBalanceDue] = useState(purchaseData?.balance_due || 0);
    const [status, setStatus] = useState(purchaseData?.status || 'pending')

    const handleVendorSelect = (selectedVendor) => {
        // Assuming draftInvoiceData is in the parent component
        setPurchaseData({
            ...purchaseData,
            vendor: selectedVendor,  // Update the customer in the draft invoice
        });
    };

    // Function to calculate the status
    const calculateStatus = () => {
        if (grandTotal === amountPaid) {
            setStatus('paid');
        } else if (grandTotal < amountPaid) {
            setStatus('partial');
        } else if (amountPaid === 0) {
            setStatus('pending');
        }
    };

    useEffect(() => {
        calculateStatus();  // Recalculate status whenever grandTotal or amountPaid changes
    }, [grandTotal, amountPaid]);


    const addItem = () => {
        setItems([
            ...items,
            {
                product: '',
                unit_price: '',
                hsn_sac: '',
                gst_percentage: '',
                quantity: '',
                discount: '',
                rate: '',
                sub_total: '',
                total_tax: '',
                total: '',
                searchQuery: '', // Added per row search query
                filteredProducts: [], // Added per row filtered products
                isDropdownVisible: false, // Added per row to control dropdown visibility
            },
        ]);
    };

    useEffect(() => {
        if (purchaseData) {
            setSubTotal(purchaseData.subtotal);
            setTotalTax(purchaseData.total_tax);
            setGrandTotal(purchaseData.grand_total);
            setPurchaseDiscount(purchaseData.discount);
            setBalanceDue(purchaseData.balance_due);
        }
    }, [purchaseData]);

    useEffect(() => {
        console.log(purchaseData); // Log to see if the data is correct
    }, [purchaseData]);


    const roundToTwoDecimals = (num) => {
        return Math.round(num * 100) / 100;
    };

    const updatePurchase = async () => {
        // Validate that a vendor is selected
        if (!selectedVendor || !selectedVendor.id) {
            toast.error("Please select a vendor.");
            return;
        }

        if (!purchaseDate) {
            toast.error("Purchase Date field is missing.");
            return;
        }

        if (!invoiceNumber) {
            toast.error("Bill number is missing.");
            return;
        }

        if (!grandTotal) {
            toast.error("Grand total field is missing.");
            return;

        } if (!amountPaid) {
            toast.error("Amount paid field is missing.");
            return;
        }

        // Check if at least one item is present
        const hasValidItem = items.some(item =>
            item.product && item.quantity && item.unit_cost // Ensure necessary fields are filled
        );

        if (!hasValidItem) {
            toast.error('Please add at least one item to the purchase.');
            return; // Prevent submission if no valid items
        }

        // Prepare the purchase data with items and related details
        const updatedItems = items.map(item => ({
            id: item.id, // Include item ID for updates
            product: item.product,
            unit_cost: item.unit_cost,
            hsn_sac: item.hsn_sac,
            gst_percentage: item.gst_percentage,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
            total_cost: item.total_cost,
            total_tax: roundToTwoDecimals(item.total_tax),
            item_total: item.item_total,
        }));

        const purchaseDataPayload = {
            id: purchaseData.id,
            vendor: selectedVendor.id,
            invoice_number: invoiceNumber,  // Invoice number
            purchase_date: purchaseDate,  // Purchase date
            discount: purchaseDiscount,
            amount_paid: amountPaid,
            grand_total: roundToTwoDecimals(grandTotal),
            total_tax: roundToTwoDecimals(totalTax),
            subtotal: roundToTwoDecimals(subTotal),
            status: status,
            balance_due: roundToTwoDecimals(balanceDue),
            items: updatedItems,  // Include updated items data
        };

        // Log the purchase data being sent
        console.log("Updating purchase with data:", purchaseDataPayload);

        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/purchase/${purchaseData.id}/`,
                purchaseDataPayload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Log the response
            console.log("Update response:", response);

            if (response.status === 200) {
                const updatedPurchase = await axios.get(`http://127.0.0.1:8000/api/purchase/${purchaseData.id}/`);
                setPurchaseData(updatedPurchase.data);
                console.log("Updated purchase data:", updatedPurchase.data);
                refreshPurchase();  // Refresh the purchase list
                setActiveSection('purchase-view')
                toast.success('Purchase Updated Successfully!');
                console.log("Updated purchase data:", response.data);
            } else {
                toast.error('Failed to update the purchase');
            }
        } catch (error) {
            if (error.response) {
                console.error("Server error:", error.response.data);
                toast.error(`Server error: ${error.response.data.message || error.response.data.detail || 'An error occurred'}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("No response from server.");
            } else {
                console.error("Error in setup:", error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        // If selectedCustomer is just an ID, fetch the full vendor object.
        if (selectedVendor && typeof selectedVendor === 'number') {
            const fetchVendor = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/vendors/${selectedVendor}/`);
                    setSelectedVendor(response.data); // Set the full customer object
                } catch (error) {
                    console.error('Error fetching vendor:', error);
                }
            };
            fetchVendor();
        }
    }, [selectedVendor]);  // Re-run when selectedVendor changes


    const fetchProducts = (searchQuery, index) => {
        if (searchQuery.length > 2 || searchQuery.length === 0) {
            axios.get(`http://localhost:8000/api/products/?search=${searchQuery}`)
                .then(response => {
                    const updatedItems = [...items];
                    const allProducts = response.data;

                    // If the searchQuery is empty, display all products
                    let filteredProducts = allProducts;

                    // If there's a searchQuery, filter products
                    if (searchQuery.length > 0) {
                        filteredProducts = allProducts.filter(product => {
                            const query = searchQuery.toLowerCase();
                            return (
                                product.name.toLowerCase().includes(query) ||
                                product.sku_code.toLowerCase().includes(query) ||
                                product.hsn_sac_code.toLowerCase().includes(query)
                            );
                        });
                    }

                    // Sort filtered products, prioritize exact matches at the top
                    filteredProducts.sort((a, b) => {
                        const matchA = (a.name.toLowerCase() === searchQuery.toLowerCase()) ||
                            (a.sku_code.toLowerCase() === searchQuery.toLowerCase()) ||
                            (a.hsn_sac_code.toLowerCase() === searchQuery.toLowerCase());
                        const matchB = (b.name.toLowerCase() === searchQuery.toLowerCase()) ||
                            (b.sku_code.toLowerCase() === searchQuery.toLowerCase()) ||
                            (b.hsn_sac_code.toLowerCase() === searchQuery.toLowerCase());

                        if (matchA && !matchB) return -1;
                        if (!matchA && matchB) return 1;
                        return 0;
                    });

                    // Update the filtered products list for the current row
                    updatedItems[index].filteredProducts = filteredProducts;
                    setItems(updatedItems);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        }
    };



    // Handle product selection from the dropdown
    const handleProductSelect = (product, index) => {
        const updatedItems = [...items];

        // Check if the product is already added in any row
        const isProductAdded = items.some(item => item.product === product.id);
        if (isProductAdded) {
            toast.error('This product is already added');
            return;
        }

        updatedItems[index] = {
            ...updatedItems[index],
            product: product.id,
            hsn_sac: product.hsn_sac_code,
            rate: product.purchase_price,
            gst_percentage: product.purchase_gst,
            searchQuery: product.name, // Set the product name in searchQuery
            isDropdownVisible: false, // Hide dropdown after selection
        };
        setItems(updatedItems);

        console.log('Selected product details:', {
            id: product.id,
            name: product.name,
            hsn_sac_code: product.hsn_sac_code,
        });

    };

    const calculateItemValues = (item) => {

        const subTotal = item.rate * item.quantity - item.discount;
        const totalTax = subTotal * (item.gst_percentage / 100);
        const total = subTotal + totalTax;

        return {
            ...item,
            total_cost: subTotal,
            total_tax: totalTax,
            item_total: total,
        };
    };


    // useEffect hook to handle recalculation of item-level values when items state changes
    useEffect(() => {
        let updatedItems = [...items];
        let itemsUpdated = false;

        // Calculate and update item-level values only if necessary
        updatedItems = updatedItems.map((item, index) => {
            const updatedItem = calculateItemValues(item);
            if (JSON.stringify(updatedItem) !== JSON.stringify(item)) {
                itemsUpdated = true;
                return updatedItem;
            }
            return item;
        });

        // Only update state if there was a change
        if (itemsUpdated) {
            setItems(updatedItems);
        }

        // Recalculate purchase-level values if items changed
        if (itemsUpdated) {
            recalculatePurchaseValues();
        }

    }, [items, , purchaseDiscount, amountPaid, grandTotal, subTotal, totalTax]); // Run only when items change

    // Handle Amount Paid Change
    const handleAmountPaidChange = (e) => {
        const value = e.target.value.trim(); // Clean up input
        // Clean up the value: allow only numbers and one decimal point
        const cleanedValue = value.replace(/[^0-9.]/g, '');

        // Parse the cleaned value as a float
        const numericValue = parseFloat(cleanedValue);

        if (!isNaN(numericValue)) {
            setAmountPaid(numericValue); // Set the cleaned number value
        } else {
            setAmountPaid(''); // Clear if invalid input
        }
    };

    // Handle Discount Change
    const handleDiscountChange = (e) => {
        const value = e.target.value.trim(); // Clean up input
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')); // Remove non-numeric characters except for the dot

        if (!isNaN(numericValue)) {
            setPurchaseDiscount(numericValue); // Set the cleaned number value
        } else {
            setPurchaseDiscount(''); // Clear if invalid input
        }
    };

    // Recalculate purchase-level values
    const recalculatePurchaseValues = () => {
        // Calculate totalSubTotal, totalTax, and totalItemTotal
        const totalSubTotal = items.reduce((acc, item) => acc + (item.total_cost || 0), 0);  // Sum of all item subtotals
        const totalTax = items.reduce((acc, item) => acc + (item.total_tax || 0), 0);        // Sum of all item taxes
        const totalItemTotal = totalSubTotal + totalTax;


        // Calculate grandTotal by applying discount
        const grandTotal = totalItemTotal - (purchaseDiscount || 0);

        // Debugging the intermediate calculations
        console.log("Subtotal:", totalSubTotal);
        console.log("Total Tax:", totalTax);
        console.log("Purchase Discount:", purchaseDiscount);
        console.log("Grand Total (calculated):", grandTotal);

        // Calculate balanceDue (grandTotal - amountPaid)
        const balanceDue = grandTotal - (amountPaid || 0);

        console.log("Amount Paid:", amountPaid);
        console.log("Balance Due (calculated):", balanceDue);

        // Set state for the recalculated values
        setSubTotal(totalSubTotal);
        setTotalTax(totalTax);
        setGrandTotal(grandTotal);
        setBalanceDue(balanceDue);
    };


    useEffect(() => {
        recalculatePurchaseValues();  // Recalculate when items or amounts change
    }, [items, amountPaid, purchaseDiscount, subTotal, totalTax]);


    // Function to open the delete confirmation popup or directly delete the row if empty
    const openDeletePopup = (item, index) => {
        if (isEmptyRow(item)) {
            removeRow(index); // Directly remove if the row is empty
        } else {
            setItemToDelete(item); // Set item to delete
            setIsPopupDeleteConfirm(true); // Show confirmation popup
        }
    };

    // Remove row
    const removeRow = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);

        refreshPurchase();  // Call the function passed from the parent
    };

    // Function to check if the row is empty
    const isEmptyRow = (item) => {
        return !item.product_name || item.item_total === 0; // Customize this check according to your needs
    };

    // Function to close the delete confirmation popup
    const closePopupDeleteConfirm = () => {
        setIsPopupDeleteConfirm(false); // Close confirmation popup
        setItemToDelete(null); // Clear item to delete
    };

    // Function to handle item deletion from the backend and state
    const removeItem = async (index) => {
        const item = items[index]; // Get item to remove

        if (!item) return; // Ensure item exists

        try {
            // Make API call to delete the item from the backend (if not empty)
            if (!isEmptyRow(item)) {
                await axios.delete(`http://127.0.0.1:8000/api/purchase/${purchaseData.id}/delete-item/${item.id}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }

            // Remove the item from the state
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);  // Update the items state

            // Refresh the draft invoices list
            refreshPurchase();
            toast.success('Item deleted successfully!')
            setIsPopupDeleteConfirm(false); // Close the popup after deletion (if any)
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('The Selected Item Already Removed!')
            setIsPopupDeleteConfirm(false); // Close the popup in case of error
        } finally {
            setIsPopupDeleteConfirm(false); // Close confirmation popup
            setItemToDelete(null); // Clear item to delete
        }
    };

    const handleFocus = (index) => {
        const updatedItems = [...items];
        updatedItems[index].isDropdownVisible = true; // Show the dropdown
        setItems(updatedItems);
    };

    const handleInputChange = (e, index, field) => {
        const updatedItems = [...items];
        updatedItems[index][field] = e.target.value; // Update the field with the new value
        setItems(updatedItems); // Update state with recalculated values
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between bg-white border-t border-gray-400 pr-2">
                <div className='flex items-center justify-center'>
                    <button
                        onClick={() => setActiveSection('purchase-view')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Edit Purchase
                    </h1>
                </div>

                <div
                    onClick={updatePurchase}
                    className='flex justify-center items-center gap-2 px-6 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <Save className='w-5 h-5' />
                    <button className='' >
                        Save Purchase
                    </button>
                </div>

            </div>

            <div className='m-2 bg-white p-2 rounded-md'>
                <div>
                    <h1 className='font-semibold text-lg'>Purchase Details</h1>
                </div>
                <div className='grid grid-cols-4 pb-4 gap-4'>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">Invoice Number</label>
                        <input
                            type="text"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            placeholder="Enter invoice/bill number"
                            value={invoiceNumber} // Bind to state
                            onChange={(e) => setInvoiceNumber(e.target.value)} // Update state on change
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">purchase date</label>
                        <input
                            type="date"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)} // Update state on change
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">Sub Total</label>
                        <input
                            type="text"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            placeholder="Enter sub total "
                            value={subTotal}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">Discount</label>
                        <input
                            type="text"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            placeholder="Enter discount"
                            value={purchaseDiscount || 0}
                            onChange={(e) => handleDiscountChange(e)}  // Call the function on change
                            inputMode="numeric"  // Ensures number-only input
                            pattern="[0-9]*"  // Mobile numeric keypad for decimal numbers
                        />
                    </div>
                </div>
                <div className='grid grid-cols-4 gap-4 pb-4'>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">Total Tax</label>
                        <input
                            type="text"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            placeholder="Enter total tax"
                            value={totalTax}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">Grand Total</label>
                        <input
                            type="text"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            placeholder="Enter grand total"
                            value={grandTotal}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">Amount Paid</label>
                        <input
                            type="text"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            placeholder="Enter amount paid"
                            value={amountPaid}
                            onChange={(e) => handleAmountPaidChange(e)}  // Call the function on change
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-1 text-sm">Balance Due</label>
                        <input
                            type="text"
                            className="border p-1 rounded-sm border-gray-400 text-gray-600"
                            placeholder="Enter balance due"
                            value={balanceDue}
                            readOnly
                        />
                    </div>
                </div>
                <div className='bg-gray-100 flex justify-between items-center p-2'>
                    <div className='flex justify-center items-start'>
                        {selectedVendor ? (
                            <>
                                <h1 className='pl-2 font-semibold text-sm w-70'>Name : {selectedVendor.company_name}</h1>
                                <p className='pl-2 text-sm'>Contact Person : {selectedVendor.contact_person}</p>
                                <p className='pl-10 text-sm'>Phone : {selectedVendor.phone}</p>
                            </>
                        ) : (
                            <p className='pl-3 font-semibold text-red-500'>No Vendor selected</p>
                        )}
                    </div>
                    <div className='flex'>
                        <div className='flex gap-2'>
                            {!selectedVendor ? (
                                <button
                                    onClick={showPopupVendor}
                                    className='border w-full border-blue-500 rounded-lg p-1 shadow-sm'
                                >
                                    <h2 className='text-blue-500 px-6 font-semibold'>Add Vendor</h2>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        clearSelectedVendor();
                                        showPopupVendor(); // Show the customer selection popup
                                    }}
                                    className='border w-full border-blue-500 rounded-lg p-1 shadow-sm'
                                >
                                    <h2 className='text-blue-500 font-semibold'>Change Vendor</h2>
                                </button>
                            )}
                            {selectedVendor && (
                                <button
                                    onClick={clearSelectedVendor}
                                    className='border w-10 border-red-500 rounded-lg text-red-500 p-1 shadow-sm'
                                >
                                    <X />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
                <div className='mt-4'>
                    <div className='overflow-x-auto max-h-65 custom-scrollbar-itemtable h-99'>
                        <table className="w-full table-auto border-collapse">
                            <thead className='sticky top-0 border-b border-t border-gray-300 text-sm text-gray-700'>
                                <tr className="bg-white">
                                    <th className="text-start p-1 pl-2">Product</th>
                                    <th className="text-center p-1">Unit Price</th>
                                    <th className="text-center p-1">Rate</th>
                                    <th className="text-center p-1">Hsn/Sac</th>
                                    <th className="text-center p-1">Gst %</th>
                                    <th className="text-center p-1">Quantity</th>
                                    <th className="text-center p-1">Discount</th>
                                    <th className="text-center p-1">Sub Total</th>
                                    <th className="text-center p-1">Total Tax</th>
                                    <th className="text-center p-1">Total</th>
                                    <th className="text-center p-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="p-1 pt-2 w-45 relative">
                                            <input
                                                type="text"
                                                value={item.searchQuery || item.product_name}
                                                disabled={!!item.product_name} // Disable if item.name exists
                                                onChange={(e) => {
                                                    handleInputChange(e, index, 'searchQuery');
                                                    fetchProducts(e.target.value, index); // Fetch products for the current row
                                                }}
                                                onFocus={() => handleFocus(index)} // Show dropdown on focus
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Enter Product"
                                            />
                                            {item.isDropdownVisible && item.filteredProducts.length > 0 && (
                                                <div className="absolute top-2 w-80 left-45 bg-white border border-gray-300 z-10">
                                                    <ul className="max-h-40 overflow-auto custom-scroll">
                                                        {item.filteredProducts.map((product, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                                onClick={() => handleProductSelect(product, index)}
                                                            >
                                                                {product.name} ({product.sku_code})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-1 pt-2">
                                            <input
                                                type="text"
                                                value={item.unit_cost}
                                                onChange={(e) => handleInputChange(e, index, 'unit_cost')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Unit_price"
                                            />
                                        </td>
                                        <td className="p-1 pt-2">
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => handleInputChange(e, index, 'rate')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Rate"
                                            />
                                        </td>
                                        <td className="p-1 pt-2">
                                            <input
                                                type="text"
                                                value={item.hsn_sac}
                                                onChange={(e) => handleInputChange(e, index, 'hsn_sac')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="HSN/SAC"
                                            />
                                        </td>
                                        <td className="p-1 pt-2">
                                            <input
                                                type="number"
                                                value={item.gst_percentage}
                                                onChange={(e) => handleInputChange(e, index, 'gst_percentage')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Gst %"
                                            />
                                        </td>
                                        <td className="p-1 pt-2 w-1">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleInputChange(e, index, 'quantity')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Qty"
                                            />
                                        </td>

                                        <td className="p-1 pt-2">
                                            <input
                                                type="number"
                                                value={item.discount}
                                                onChange={(e) => handleInputChange(e, index, 'discount')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Discount"
                                            />
                                        </td>
                                        <td className="p-1 pt-2">
                                            <input
                                                type="number"
                                                value={item.total_cost}
                                                onChange={(e) => handleInputChange(e, index, 'total_cost')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Sub Total"
                                                readOnly
                                            />
                                        </td>
                                        <td className="p-1 pt-2">
                                            <input
                                                type="number"
                                                value={item.total_tax}
                                                className="w-full p-1 border border-gray-300"
                                                onChange={(e) => handleInputChange(e, index, 'total_tax')}
                                                placeholder="Total Tax"
                                                readOnly
                                            />
                                        </td>
                                        <td className="p-1 pt-2">
                                            <input
                                                type="number"
                                                value={item.item_total}
                                                onChange={(e) => handleInputChange(e, index, 'item_total')}
                                                className="w-full p-1 border border-gray-300"
                                                placeholder="Total"
                                                readOnly
                                            />
                                        </td>
                                        <td className="p-1 pt-3 text-center">
                                            <button
                                                onClick={() => openDeletePopup(item, index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex mt-4">
                        <div
                            onClick={addItem}
                            className='flex justify-center gap-2 text-blue-400  px-4 py-2 rounded-md hover:text-blue-800'>
                            <CirclePlus />
                            <button className="">
                                Add New Row
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup Section */}
            {
                isPopupVendorAdd && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenVendor ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenVendor}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenVendor ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupVendor}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <PurchaseVendorAddView
                                onVendorSelect={setSelectedVendor}
                                closePopup={closePopupVendor} />
                        </div>
                    </div>
                )
            }
            {/* Popup Section */}
            {
                isPopupDeleteConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className="bg-white p-4 rounded-lg shadow-xl w-3/4"
                            style={{ maxWidth: '700px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={closePopupDeleteConfirm}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <PurchaseDeleteConfirmView
                                removeItem={() => removeItem(items.indexOf(itemToDelete))}
                                closePopupDeleteConfirm={() => setIsPopupDeleteConfirm(false)}
                                item={itemToDelete} // Pass the item to delete
                            />
                        </div>
                    </div>
                )
            }
        </div>

    )
}


export default PurchaseEditView
