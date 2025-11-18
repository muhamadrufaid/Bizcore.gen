import React, { useEffect, useState, useMemo } from 'react';
import { User, X, CirclePlus, Save, Minimize2, Maximize2, HardDriveUpload } from 'lucide-react';
import GstDelcarationTable from '../Invoices/GstDelcarationTable';
import CustomerInvoiceAddView from '../Customers/CustomerInvoiceAddView';
import InvoiceDeliveryEditView from './InvoiceDeliveryEditView';
import DraftConfirmationView from '../DraftInvoice/DraftConfirmationView';
import InvoiceCustomerView from '../Customers/InvoiceCustomerView';
import DraftDeleteConfirmView from '../DraftInvoice/DraftDeleteConfirmView';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvoiceEditView = ({ setActiveSection, invoiceData, refreshInvoices, setInvoiceData, invoiceId }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(invoiceData?.customer || null);

    const clearSelectedCustomer = () => {
        setSelectedCustomer(null); // Clear the selected customer
        setDeliveryDetails({}); // Clear the delivery details as well
    };

    const handleCustomerSelect = (selectedCustomer) => {
        // Assuming draftInvoiceData is in the parent component
        setInvoiceData({
            ...invoiceData,
            customer: selectedCustomer,  // Update the customer in the invoice
        });
    };

    const [itemToDelete, setItemToDelete] = useState(null); // Store item to delete
    const [items, setItems] = useState(invoiceData?.items || []);

    const [subTotal, setSubTotal] = useState(0);
    const [totalGST, setTotalGST] = useState(0);
    const [creditApplied, setCreditApplied] = useState(0); // Assuming 0 credit by default
    const [total, setTotal] = useState(0);
    const [roundOff, setRoundOff] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [dueDate, setDueDate] = useState(invoiceData?.due_date || '')

    const invoicetypeOptions = ['individual', 'bussiness'];
    const gstOptions = ['cgst_sgst', 'igst'];
    const transportModeOptions = ['none', 'road', 'air', 'sea'];
    const modeOfSupplyOptions = ['direct', 'delivery'];

    // State for invoice fields
    const [gstType, setGstType] = useState(invoiceData.gst_type);
    const [invoiceType, setInvoiceType] = useState(invoiceData?.invoice_type || 'individual');
    const [transportMode, setTransportMode] = useState(invoiceData?.transportation_mode || 'none');
    const [modeOfSupply, setModeOfSupply] = useState(invoiceData?.mode_of_supply || 'direct');

    const [isPopupTableTax, setIsPopupTableTax] = useState(false); // State to control popup visibility
    const [isFullScreenTax, setIsFullScreenTax] = useState(false);

    const [isPopupDeleteConfirm, setIsPopupDeleteConfirm] = useState(false); // State to control popup visibility

    const [isPopupCustomerAdd, setIsPopupCustomerAdd] = useState(false); // State to control popup visibility
    const [isFullScreenCustomer, setIsFullScreenCustomer] = useState(false);

    const [isPopupCustomerView, setIsPopupCustomerView] = useState(false); // State to control popup visibility
    const [isFullScreenCustomerView, setIsFullScreenCustomerView] = useState(false);

    const [isPopupConfirmationView, setIsPopupConfirmationView] = useState(false); // State to control popup visibility

    const [isPopupDeliveryAdd, setIsPopupDeliveryAdd] = useState(false); // State to control popup visibility
    const [isFullScreenDelivery, setIsFullScreenDelivery] = useState(false);

    // Close the popup
    const closePopupCustomer = () => setIsPopupCustomerAdd(false);
    const closePopupTax = () => setIsPopupTableTax(false);
    const closePopupDelivery = () => setIsPopupDeliveryAdd(false);
    const closePopupCustomerView = () => setIsPopupCustomerView(false);
    const closePopupConfirmationView = () => setIsPopupConfirmationView(false);

    // Open the popup
    const showPopupTax = () => setIsPopupTableTax(true);
    const showPopupCustomer = () => setIsPopupCustomerAdd(true);
    const showPopupDelivery = () => setIsPopupDeliveryAdd(true);

    // Open the popup
    const showPopupCustomerView = () => {
        if (!selectedCustomer) {
            toast.error("There is No Selected Customer"); // Show toast notification if no customer selected
            return;
        }
        setIsPopupCustomerView(true);
    };

    // Toggle full screen mode
    const toggleFullScreenTax = () => setIsFullScreenTax((prev) => !prev);
    const toggleFullScreenCustomer = () => setIsFullScreenCustomer((prev) => !prev);
    const toggleFullScreenDelivery = () => setIsFullScreenDelivery((prev) => !prev);
    const toggleFullScreenCustomerView = () => setIsFullScreenCustomerView((prev) => !prev);

    const [deliveryDetails, setDeliveryDetails] = useState(invoiceData?.delivery || {});  // Set initial delivery details from draftInvoiceData if available

    const handleDeliveryDetailsChange = (data) => {
        setDeliveryDetails(data);  // Update the delivery details in the parent state
    };
    const [allProducts, setAllProducts] = useState([]); // State to store all products

    // Ensure dates are in correct format
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString().split('T')[0] : null;
    const formattedDispatchedAt = deliveryDetails?.dispatched_at ? new Date(deliveryDetails.dispatched_at).toISOString().split('T')[0] : null;
    const formattedDeliveredAt = deliveryDetails?.delivered_at ? new Date(deliveryDetails.delivered_at).toISOString().split('T')[0] : null;

    const updateInvoice = async () => {
        if (!selectedCustomer || !selectedCustomer.id) {
            toast.error("Please select a customer.");
            return;
        }

        // Check for any item with qty <= 0
        const invalidItem = items.find(item => parseFloat(item.qty) <= 0);
        if (invalidItem) {
            toast.error("Re-check the quantity fields, quantity can't be zero or negative.");
            return;
        }

        // Check if any existing item has a quantity greater than the available stock
        const invalidStockItem = items.find(item => {
            const product = allProducts.find(p => p.id === item.product); // Fetch product details based on ID
            if (product) {
                const originalItem = invoiceData.items.find(existingItem => existingItem.product === item.product);
                const qtyDifference = item.qty - (originalItem ? originalItem.qty : 0); // Calculate the difference
                return (qtyDifference > 0 && item.qty > product.stock_quantity); // If qty increases, check stock
            }
            return false; // For new items, no stock check
        });

        if (invalidStockItem) {
            const product = allProducts.find(p => p.id === invalidStockItem.product);
            toast.error(`Not enough stock for ${product.name}. Available stock: ${product.stock_quantity}`);
            return; // Prevent the PUT request from being sent if stock is invalid
        }

        // Filter out empty rows (those without a selected product)
        const nonEmptyItems = items.filter(item => item.product !== '');
        if (nonEmptyItems.length === 0) {
            toast.error("Please add at least one product to the invoice.");
            return;
        }

        const { delivery_address, city, state, pincode } = deliveryDetails;
        if (modeOfSupply === 'delivery' && (!delivery_address || !city || !state || !pincode)) {
            toast.error("Delivery details are incomplete. Please provide all required fields: Address, City, State, and Pincode.");
            return;
        }

        // Proceed with updating the invoice only if the previous checks pass
        try {
            const updatedItems = items.map(item => {
                const gstData = calculateItemGST(item); // Recalculate GST for the item
                return {
                    ...item,
                    gstAmount: gstData.gstAmount,
                    cgstAmount: gstData.cgstAmount,
                    sgstAmount: gstData.sgstAmount,
                    igstAmount: gstData.igstAmount,
                    cgstPercentage: gstData.cgstPercentage,
                    sgstPercentage: gstData.sgstPercentage,
                    igstPercentage: gstData.igstPercentage,
                };
            });

            const invoicesData = {
                id: invoiceData.id,
                items: updatedItems,
                gst_type: gstType,
                invoice_type: invoiceType,
                transportation_mode: transportMode,
                mode_of_supply: modeOfSupply,
                customer: selectedCustomer.id,
                invoice_status: 'active',
                tax_status: 'unpaid',
                ...(formattedDueDate && { due_date: formattedDueDate }),
                delivery: modeOfSupply === 'delivery' ? {
                    delivery_address: deliveryDetails.delivery_address,
                    city: deliveryDetails.city,
                    state: deliveryDetails.state,
                    pincode: deliveryDetails.pincode,
                    landmark: deliveryDetails.landmark || '',
                    status: deliveryDetails.status || '',
                    assigned_to: deliveryDetails.assigned_to || '',
                    transporter_name: deliveryDetails.transporter_name || '',
                    transporter_gst_in: deliveryDetails.transporter_gst_in || '',
                    vehicle_number: deliveryDetails.vehicle_number || '',
                    dispatched_at: deliveryDetails.formattedDispatchedAt,
                    delivery_notes: deliveryDetails.delivery_notes || '',
                    delivered_at: deliveryDetails.formattedDeliveredAt,
                } : {}
            };

            const response = await axios.put(
                `http://127.0.0.1:8000/api/invoices/${invoiceData.id}/`,
                invoicesData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                const updatedInvoice = await axios.get(`http://127.0.0.1:8000/api/invoices/${invoiceData.id}/`);
                setInvoiceData(updatedInvoice.data);
                setActiveSection('invoice-view')
                refreshInvoices();

                toast.success('Invoice Updated Successfully!');
            } else {
                toast.error('Failed to update the invoice');
            }
        } catch (error) {
            // Log the entire error response for debugging
            console.error('Error while updating invoice:', error.response || error.message);

            if (error.response) {
                // Log the entire error response to inspect its structure
                console.log('Error response data:', error.response.data);

                // Check if the error message is in an array and has a detailed structure
                if (Array.isArray(error.response.data)) {
                    let errorMessage = error.response.data[0]; // Assume the message is in the first element
                    if (errorMessage) {
                        const match = errorMessage.match(/string='([^']+)'/);  // Matches the content inside 'string='...
                        if (match && match[1]) {
                            errorMessage = match[1];
                        }
                        toast.error(`Failed to update invoice: ${errorMessage}`);
                    }
                } else if (typeof error.response.data === 'object') {
                    // If the error is an object, try to extract the specific error message
                    let errorMessage = error.response.data.detail || 'Unknown error';
                    toast.error(`Failed to update invoice: ${errorMessage}`);
                } else {
                    // If the response data isn't in a specific format, show the raw data
                    toast.error(`Failed to update invoice: ${error.response.data}`);
                }
            } else {
                // If the error does not contain a response, show a general error message
                toast.error(`Failed to update invoice: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        // If selectedCustomer is just an ID, fetch the full customer object.
        if (selectedCustomer && typeof selectedCustomer === 'number') {
            const fetchCustomer = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/customers/${selectedCustomer}/`);
                    setSelectedCustomer(response.data); // Set the full customer object
                } catch (error) {
                    console.error('Error fetching customer:', error);
                }
            };
            fetchCustomer();
        }
    }, [selectedCustomer]);  // Re-run when selectedCustomer changes

    // Add a new row
    const addItem = () => {
        setItems([
            ...items,
            {
                product: '',
                code: '',
                hsn: '',
                rate: '',
                uom: '',
                qty: 1,
                disc: '',
                spl_disc: 0,
                net_value: '',
                gst_rate: '',
                gst_amount: '',
                total: '',
                searchQuery: '', // Added per row search query
                filteredProducts: [], // Added per row filtered products
                isDropdownVisible: false, // Added per row to control dropdown visibility
                isNew: true,
            },
        ])
        refreshInvoices();  // Call the function passed from the parent
    };


    const fetchAllProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products/');
            setAllProducts(response.data); // Store all products in the state
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchAllProducts(); // Fetch products when the component mounts
    }, []);


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

    const [notification, setNotification] = useState('');
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
            name: product.name,
            code: product.sku_code,
            hsn_sac: product.hsn_sac_code,
            rate: parseFloat(product.retail_price),
            uom: product.unit_of_measurement,
            discount: parseFloat(product.discount),
            gst_percentage: parseFloat(product.gst_rate),
            quantity: 1,
            stock_quantity: product.stock_quantity, // Store the stock quantity for validation
            searchQuery: product.name,
            isDropdownVisible: false,
        };

        setItems(updatedItems);

        console.log('Selected product details:', {
            id: product.id,
            name: product.name,
            sku_code: product.sku_code,
            hsn_sac_code: product.hsn_sac_code,
            rate: product.retail_price,
            uom: product.unit_of_measurement,
            discount: product.discount,
            gst_percentage: product.gst_rate,
        });

    };

    const handleInputChange = (e, index, field) => {
        const updatedItems = [...items];  // Create a copy of the current items array
        const updatedItem = updatedItems[index];

        updatedItem[field] = e.target.value;

        if (field === 'qty') {
            const qty = parseFloat(e.target.value) || 0;

            // Check if the qty exceeds the stock_quantity
            if (qty > updatedItem.stock_quantity) {
                toast.error(`Not enough stock for ${updatedItem.name}. Available stock: ${updatedItem.stock_quantity}`);
                updatedItem.qty = updatedItem.stock_quantity;  // Reset to the available stock quantity
            }

            // If qty is NaN or less than 1, reset to 1 and show a notification
            if (isNaN(qty) || qty < 1) {
                toast.error("Product quantity can't be less than 1");
                updatedItems[index].qty = 1;  // Reset to 1 if invalid input            
            } else {
                setNotification('');  // Clear notification if input is valid
            }

            // Update the quantity in the items array
            updatedItems[index].quantity = qty;
        }

        // Handle 'special_discount' (spl_disc) change similarly
        else if (field === 'spl_disc') {
            const splDisc = parseFloat(e.target.value);  // Parse the special discount as a float
            updatedItems[index].special_discount = splDisc;  // Update special discount field
        }

        // Update the state immediately
        setItems(updatedItems);
        // Trigger total recalculation after quantity or special discount change
        updateTotals(index); // Directly update totals after quantity or discount change
    };


    const updateTotals = (index) => {
        const updatedItems = [...items];  // Create a copy of the items array
        const item = updatedItems[index]; // Get the current item being updated

        // Ensure default values for calculations
        const rate = parseFloat(item.rate) || 0;
        const qty = item.quantity || 0;
        const splDisc = parseFloat(item.special_discount) || 0;
        const disc = parseFloat(item.discount) || 0;
        const gstRate = parseFloat(item.gst_percentage) || 0;

        // Recalculate the values
        const netValue = (rate * qty) - (disc * qty) - splDisc;  // Net value = (Rate * Qty) - Disc - Spl Disc
        const gstAmount = (netValue * gstRate) / 100;   // GST amount = Net Value * GST rate
        const total = netValue + gstAmount;  // Total = Net Value + GST Amount

        // Check if the values have changed before updating state
        const hasChanges = item.net_value !== netValue.toFixed(2) ||
            item.gst_amount !== gstAmount.toFixed(2) ||
            item.item_total !== total.toFixed(2);

        if (hasChanges) {
            // Update the item with new calculated values
            updatedItems[index] = {
                ...item,
                net_value: netValue.toFixed(2),   // Update net value (formatted to 2 decimal places)
                gst_amount: gstAmount.toFixed(2), // Update GST amount
                item_total: total.toFixed(2)           // Update total (formatted to 2 decimal places)
            };

            // Update the items array state only if the values have changed
            setItems(updatedItems);
            calculateItemGST(updatedItems);
        }
    };

    const openDeletePopup = (item, index) => {
        if (item.isNew) {
            // Directly remove the row if it's a new item (no backend call needed)
            removeRow(index);
        } else {
            // For existing items, show the confirmation popup
            setItemToDelete(item);
            setIsPopupDeleteConfirm(true);
        }
    };

    // Remove row
    const removeRow = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        refreshInvoices();  // Call the function passed from the parent
    };

    // Function to check if the row is empty
    const isEmptyRow = (item) => {
        return !item.name || item.net_value === 0; // Customize this check according to your needs
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
                await axios.delete(`http://127.0.0.1:8000/api/invoices/${invoiceData.id}/delete-item/${item.id}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }

            // Remove the item from the state
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);  // Update the items state

            // Refresh the  invoices list
            refreshInvoices();
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


    // Handle focus on the input field to show the dropdown
    const handleFocus = (index) => {
        const updatedItems = [...items];
        updatedItems[index].isDropdownVisible = true;
        setItems(updatedItems);
    };
    // Memoize the dependency array
    const memoizedDependencies = useMemo(() => {
        return items.map(item => ({
            product: item.product,
            qty: item.qty,
            rate: item.rate,
            gst_rate: item.gst_rate,
        }));
    }, [items]);

    // useEffect to update totals based on the memoized dependencies
    useEffect(() => {
        memoizedDependencies.forEach((item, index) => {
            if (item.product && item.qty && item.rate) {
                updateTotals(index);
            }
        });
    }, [memoizedDependencies]);

    useEffect(() => {

        if (items && items.length > 0) {
            updateInvoiceTotals();
        }
    }, [items, creditApplied]);

    const updateInvoiceTotals = () => {
        let calculatedSubTotal = 0;
        let calculatedTotalGST = 0;

        // Loop through the items to calculate the subTotal and totalGST
        items.forEach(item => {
            if (item.net_value) {
                calculatedSubTotal += parseFloat(item.net_value);
            }
            if (item.gst_amount) {
                calculatedTotalGST += parseFloat(item.gst_amount);
            }
        });

        // Set the subTotal and totalGST state
        setSubTotal(calculatedSubTotal);
        setTotalGST(calculatedTotalGST);

        // Calculate total = subTotal + totalGST - creditApplied
        const calculatedTotal = calculatedSubTotal + calculatedTotalGST - creditApplied;

        setTotal(calculatedTotal)

        // Round off the total to the nearest two decimal places
        const roundedTotal = Math.round(calculatedTotal); // Round to the nearest integer

        // Calculate roundOff as the difference between calculatedTotal and roundedTotal
        const roundOff = (calculatedTotal - roundedTotal).toFixed(2); // This will be 0.18 in this case

        // Set the roundOff and grandTotal state
        setRoundOff(roundOff); // This will show the difference (e.g., 0.19)
        setGrandTotal(roundedTotal); // This will show the grand total rounded down to two decimal places (e.g., 108330.00)
    };

    const [gstBreakdown, setGstBreakdown] = useState({
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
    });

    // GST Calculation Function (Memoized with useCallback)
    const calculateItemGST = (item) => {
        const netValue = parseFloat(item.net_value) || 0;
        const gstRate = parseFloat(item.gst_percentage) || 0;
        const gstAmount = (netValue * gstRate) / 100;

        let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;
        let cgstPercentage = 0, sgstPercentage = 0, igstPercentage = 0;

        if (gstType === "cgst_sgst") {
            cgstAmount = gstAmount / 2;
            sgstAmount = gstAmount / 2;
            cgstPercentage = gstRate / 2;
            sgstPercentage = gstRate / 2;
            igstAmount = 0;
            igstPercentage = 0;
        } else if (gstType === "igst") {
            igstAmount = gstAmount;
            igstPercentage = gstRate;
            cgstAmount = 0;
            sgstAmount = 0;
            cgstPercentage = 0;
            sgstPercentage = 0;
        }

        return {
            gstAmount,
            cgstAmount,
            sgstAmount,
            igstAmount,
            cgstPercentage,
            sgstPercentage,
            igstPercentage,
        };
    };

    // ✅ UPDATE GST BREAKDOWN WHEN ITEMS CHANGE (SUM TOTALS)
    const updateGSTBreakdown = () => {
        const breakdown = {
            cgst: 0,
            sgst: 0,
            igst: 0,
            totalTax: 0,
        };

        items.forEach((item) => {
            const { gstAmount, cgstAmount, sgstAmount, igstAmount } = calculateItemGST(item);

            // Accumulate GST totals
            breakdown.cgst += cgstAmount;
            breakdown.sgst += sgstAmount;
            breakdown.igst += igstAmount;
            breakdown.totalTax += gstAmount;
        });

        setGstBreakdown(breakdown); // Update state with GST totals
    };

    const handleGSTTypeChange = (e) => {
        const newGSTType = e.target.value;
        setGstType(newGSTType); // Update the GST type

        // Recalculate GST breakdown and update items based on the new GST type
        updateGSTBreakdown(); // This will recalculate the breakdown when gstType changes
        updateItemGST(); // This will recalculate GST for each item when gstType changes
    };

    useEffect(() => {
        // Recalculate the GST breakdown and item-wise GST when gstType changes
        updateGSTBreakdown(); // Update the breakdown totals
        updateItemGST(); // Recalculate individual item GST values
    }, [gstType]); // This runs whenever gstType is updated

    useEffect(() => {
        updateGSTBreakdown();
    }, [items]); // This effect runs whenever the items change


    const updateItemGST = () => {
        const updatedItems = items.map(item => {
            const gstData = calculateItemGST(item); // Recalculate GST for each item

            return {
                ...item,
                gstAmount: parseFloat(gstData.gstAmount), // Ensure it's a float
                cgstAmount: parseFloat(gstData.cgstAmount),
                sgstAmount: parseFloat(gstData.sgstAmount),
                igstAmount: parseFloat(gstData.igstAmount),
                cgstPercentage: parseFloat(gstData.cgstPercentage),
                sgstPercentage: parseFloat(gstData.sgstPercentage),
                igstPercentage: parseFloat(gstData.igstPercentage),
            };
        });

        setItems(updatedItems); // Update the items with the new GST values
    };


    // Map items to gstItems for displaying
    const gstItems = items.map((item) => {
        const { gstAmount, cgstAmount, sgstAmount, igstAmount, cgstPercentage, sgstPercentage, igstPercentage } = calculateItemGST(item);

        const gstData = {
            hsn: item.hsn_sac, // Ensure this is available in your item
            qty: item.quantity, // Ensure this is the correct field for quantity
            taxableValue: item.net_value, // Ensure net_value is correct
            totalTax: gstAmount, // Total GST for the item

            // Add calculated GST details based on gstType
            cgstPercentage: gstType === 'cgst_sgst' ? cgstPercentage : 0,
            cgstAmount: gstType === 'cgst_sgst' ? cgstAmount : 0,
            sgstPercentage: gstType === 'cgst_sgst' ? sgstPercentage : 0,
            sgstAmount: gstType === 'cgst_sgst' ? sgstAmount : 0,

            igstPercentage: gstType === 'igst' ? igstPercentage : 0,
            igstAmount: gstType === 'igst' ? igstAmount : 0
        };

        return gstData;
    });

    // When the draftInvoiceData changes, update the state
    useEffect(() => {
        setSelectedCustomer(invoiceData?.customer);
        setItems(invoiceData?.items);
    }, [invoiceData]);

    if (!invoiceData || !invoiceData.items) {
        return <div>Loading...</div>;  // Show loading message if data is missing
    }

    useEffect(() => {
        if (invoiceData?.items) {
            setItems(invoiceData.items); // Update state when draftInvoiceData is available
        }
    }, [invoiceData]);


    return (
        <div className=''>
            <div className="w-full h-14 flex items-center justify-between bg-white border-t border-gray-400">
                <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    INVOICE EDIT
                </h1>

                <div className='flex p-2 gap-2'>
                    {notification && <div className="notification">{notification}</div>}
                    <div
                        onClick={updateInvoice}
                        className='flex justify-center items-center gap-2 px-6 py-2 font-semibold text-md text-white border border-blue-400 bg-blue-400 rounded-lg hover:border-blue-600 hover:bg-blue-700 '>
                        <HardDriveUpload className='w-5 h-5' />
                        <button className=''>
                            Generate Invoice
                        </button>
                    </div>
                </div>
            </div>

            <div className='m-2 max-h-[calc(100vh-17vh)] overflow-y-auto custom-scrollbar'>
                <div className='flex'>
                    <div className='flex flex-col bg-white p-2 w-full rounded-lg'>
                        <div className='flex justify-between items-center bg-gray-200 rounded-lg p-1 w-full'>
                            <div className='flex flex-col '>
                                <div className='flex flex-col p-1 pl-4'>
                                    <h1 className='text-md font-semibold'>Invoice Number</h1>
                                    <p className='text-sm'>{invoiceData?.invoice_number}</p>
                                </div>
                                <div className='flex pl-4'>
                                    <h1 className='text-md font-semibold'>Invoice Date</h1>
                                    <p className='pl-2'>:</p>
                                    <p className='text-sm pl-1'>{invoiceData.invoice_date}</p>
                                </div>
                                <div className="flex pl-4">
                                    <label className='text-md font-semibold'>Due Date</label>
                                    <p className='pl-4'>:</p>
                                    <input
                                        type="date"
                                        className="text-sm pl-1"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col text-end p-2 pr-4'>
                                <h1 className='font-semibold'>Billed to</h1>
                                {selectedCustomer ? (
                                    <>
                                        <h1 className='text-md'>{selectedCustomer.name || invoiceData?.customer_name}</h1>
                                        <h1 className='text-md'>
                                            {selectedCustomer.billing_address ? selectedCustomer.billing_address : ''}
                                        </h1>
                                        <h1 className='text-md'>
                                            {selectedCustomer.city ? selectedCustomer.city : ''},
                                            {selectedCustomer.pincode ? selectedCustomer.pincode : ''}
                                        </h1>
                                    </>
                                ) : (
                                    <p className='text-sm text-gray-500'>No customer selected</p>
                                )}
                            </div>
                        </div>
                        <div className='flex items-center gap-6 pl-4 pr-6 justify-between border border-gray-300 rounded-lg mt-2 p-2'>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 text-sm font-semibold">Staff Details</label>
                                {/* <select
                                    name="staff"
                                    className="border border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                                    value={staff} // Bind to state
                                    onChange={(e) => setStaff(e.target.value)} // Update state on change
                                >
                                    {staffOptions.map((staff, i) => (
                                        <option className='' key={i} value={staff}>{staff}</option>
                                    ))}
                                </select> */}
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 text-sm font-semibold">Invoice Type</label>
                                <select
                                    name="invoice_type"
                                    className="border border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                                    value={invoiceType} // Bind to state
                                    disabled
                                    onChange={(e) => setInvoiceType(e.target.value)} // Update state on change
                                >
                                    {invoicetypeOptions.map((invoice_type, i) => (
                                        <option className='' key={i} value={invoice_type}>{invoice_type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 text-sm font-semibold">GST Type</label>
                                <select
                                    name="gst_option"
                                    className="border border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                                    value={gstType} // Bind to state
                                    onChange={(e) => { setGstType(e.target.value); }}
                                >
                                    {
                                        gstOptions.map((gst_option, i) => (
                                            <option className='' key={i} value={gst_option}>{gst_option}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 text-sm font-semibold">Mode of Supply</label>
                                <select
                                    name="mode_of_supply"
                                    className="border border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                                    value={modeOfSupply} // Bind to state
                                    onChange={(e) => setModeOfSupply(e.target.value)} // Update state on change
                                >
                                    {modeOfSupplyOptions.map((mode_of_supply, i) => (
                                        <option className='' key={i} value={mode_of_supply}>{mode_of_supply}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 text-sm font-semibold">Transportation Mode</label>
                                <select
                                    name="transport_mode"
                                    className="border border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                                    value={transportMode} // Bind to state
                                    onChange={(e) => setTransportMode(e.target.value)} // Update state on change
                                >
                                    {transportModeOptions.map((transport_mode, i) => (
                                        <option className='' key={i} value={transport_mode}>{transport_mode}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className='flex justify-between items-center p-1'>
                                <div>
                                    <h1 className="font-semibold">Item Details</h1>
                                </div>
                                {modeOfSupply === 'delivery' && (
                                    <div
                                        onClick={showPopupDelivery}
                                        className='flex items-center text-blue-500 p-1 rounded-md px-2 py-1 hover:text-blue-300'>
                                        <button>Add Delivery Details</button>
                                    </div>
                                )}
                            </div>
                            {/* Table */}
                            <div className='overflow-x-auto max-h-71 custom-scrollbar-itemtable h-99 '>
                                <table className="w-full table-auto border-collapse">
                                    <thead className='sticky top-0 border-b border-t border-gray-300 text-sm text-gray-700'>
                                        <tr className="bg-white">
                                            <th className="text-start pl-2">Product</th>
                                            <th className="text-center ">Code</th>
                                            <th className="text-center ">HSN</th>
                                            <th className="text-center px-1">Rate</th>
                                            <th className="text-center px-1">UOM</th>
                                            <th className="text-center px-1">Qty</th>
                                            <th className="text-center px-1">Disc</th>
                                            <th className="text-center px-1">Spl-Disc</th>
                                            <th className="text-center px-1">Net Value</th>
                                            <th className="text-center px-1">GST%</th>
                                            <th className="text-center px-1">GST Amt</th>
                                            <th className="text-center px-1">Total</th>
                                            <th className="text-center px-1"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="p-1 pt-2 relative w-45">
                                                    <input
                                                        type="text"
                                                        value={item.searchQuery || item.name}
                                                        disabled={!!item.name} // Disable if item.name exists
                                                        onChange={(e) => {
                                                            handleInputChange(e, index, 'searchQuery');
                                                            fetchProducts(e.target.value, index); // Fetch products for the current row
                                                        }}
                                                        onFocus={() => handleFocus(index)} // Show dropdown on focus
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Search Product"
                                                    />
                                                    {item.isDropdownVisible && item.filteredProducts.length > 0 && (
                                                        <div className="absolute top-2 w-80 left-45 bg-white border border-gray-300 z-10">
                                                            <ul className="max-h-40 overflow-auto">
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
                                                        value={item.code}
                                                        onChange={(e) => handleInputChange(e, index, 'code')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Code"
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-1 pt-2 w-15">
                                                    <input
                                                        type="text"
                                                        value={item.hsn_sac}
                                                        onChange={(e) => handleInputChange(e, index, 'hsn')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="HSN"
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-1 pt-2">
                                                    <input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) => handleInputChange(e, index, 'rate')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Rate"
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-1 pt-2 w-15">
                                                    <input
                                                        type="text"
                                                        value={item.uom}
                                                        onChange={(e) => handleInputChange(e, index, 'uom')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="UOM"
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-1 pt-2 w-15">
                                                    <input
                                                        type="number"
                                                        value={item.quantity || 1}
                                                        onChange={(e) => handleInputChange(e, index, 'qty')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Qty"
                                                        onBlur={() => updateTotals(index)} // Update totals when quantity changes
                                                    />
                                                </td>
                                                <td className="p-1 pt-2 w-20">
                                                    <input
                                                        type="number"
                                                        value={item.discount || 0.00}
                                                        onChange={(e) => handleInputChange(e, index, 'disc')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Disc"
                                                        onBlur={() => updateTotals(index)}
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-1 pt-2 w-15">
                                                    <input
                                                        type="number"
                                                        value={item.special_discount || 0.00}
                                                        onChange={(e) => handleInputChange(e, index, 'spl_disc')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Special Discount"
                                                        onBlur={() => updateTotals(index)} // Update totals when special discount changes
                                                    />
                                                </td>
                                                <td className="p-1 pt-2">
                                                    <input
                                                        type="text"
                                                        value={item.net_value}
                                                        onChange={(e) => handleInputChange(e, index, 'net_value')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Net Value"
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-1 pt-2 w-15">
                                                    <input
                                                        type="number"
                                                        value={item.gst_percentage}
                                                        onChange={(e) => handleInputChange(e, index, 'gst_rate')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="GST %"
                                                        onBlur={() => updateTotals(index)} // Update totals when GST rate changes
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-1 pt-2">
                                                    <input
                                                        type="text"
                                                        value={item.gst_amount}
                                                        onChange={(e) => handleInputChange(e, index, 'gst_amount')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="GST Amt"
                                                        disabled
                                                    />
                                                </td>
                                                <td className="p-1 pt-2">
                                                    <input
                                                        type="text"
                                                        value={item.item_total}
                                                        onChange={(e) => handleInputChange(e, index, 'total')}
                                                        className="w-full p-1 border border-gray-300"
                                                        placeholder="Total"
                                                        disabled
                                                    />
                                                </td>
                                                <td className="p-1 pt-2">
                                                    <button
                                                        type="button"
                                                        className="text-red-500"
                                                        onClick={() => openDeletePopup(item, index)}
                                                    >
                                                        <X className='w-5 h-5' />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Add Row Button */}
                            <div className="flex mt-4">
                                <div
                                    onClick={addItem}
                                    className='flex justify-center gap-2 text-blue-400  px-4 py-2 rounded-md hover:text-blue-800'>
                                    <CirclePlus />
                                    <button>
                                        Add New Row
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* customer details */}
                    <div className='flex flex-col ml-2 w-1/4'>
                        <div className=''>
                            <div className='flex flex-col bg-white p-4 rounded-lg'>
                                <h1 className='font-semibold text-md'>Client Details</h1>
                                <div
                                    onClick={showPopupCustomerView}
                                    className='flex items-center justify-start p-2 mb-1 hover:bg-gray-300 rounded-xl'>
                                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-400'><User className='text-white' /></div>
                                    <div className='flex flex-col justify-center items-start'>
                                        {selectedCustomer ? (
                                            <>
                                                <h1 className='pl-2 font-semibold text-sm w-50'>{selectedCustomer.name || invoiceData?.customer_name}</h1>
                                                <p className='pl-2 text-sm'>{selectedCustomer.phone || invoiceData?.phone_number}</p>
                                            </>
                                        ) : (
                                            <p className='pl-3 font-semibold text-red-500'>No customer selected</p>
                                        )}
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    {!selectedCustomer ? (
                                        <button
                                            onClick={showPopupCustomer}
                                            className='border w-full border-blue-500 rounded-lg p-1 shadow-sm'
                                        >
                                            <h2 className='text-blue-500 font-semibold'>Add Customer</h2>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                clearSelectedCustomer();
                                                showPopupCustomer(); // Show the customer selection popup
                                            }}
                                            className='border w-full border-blue-500 rounded-lg p-1 shadow-sm'
                                        >
                                            <h2 className='text-blue-500 font-semibold'>Change Customer</h2>
                                        </button>
                                    )}
                                    {selectedCustomer && (
                                        <button
                                            onClick={clearSelectedCustomer}
                                            className='border w-10 border-red-500 rounded-lg text-red-500 p-1 shadow-sm'
                                        >
                                            <X />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* INVOICE DETAILS DIV */}
                        <div className='flex flex-col gap-2 mt-2 min-h-99 bg-white rounded-lg p-4'>

                            <div className='flex flex-col gap-1'>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm font-semibold ">Sub Total :</label>
                                    <input
                                        type="text"
                                        className="border pr-2 rounded-sm border-gray-400 text-right"
                                        placeholder='0.00'
                                        value={subTotal.toFixed(2)} // Display the subTotal
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm font-semibold ">Total GST :</label>
                                    <input
                                        type="text"
                                        className="border pr-2 rounded-sm border-gray-400 text-right"
                                        placeholder='0.00'
                                        value={totalGST.toFixed(2)} // Display the total GST
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm font-semibold ">Credit Applied :</label>
                                    <input
                                        type="text"
                                        className="border pr-2 rounded-sm border-gray-400 text-right"
                                        placeholder='0.00'
                                        value={creditApplied.toFixed(2)} // Display the applied credit
                                        onChange={(e) => setCreditApplied(parseFloat(e.target.value) || 0)} // Allow credit input from user
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm font-semibold ">Total :</label>
                                    <input
                                        type="text"
                                        className="border pr-2 rounded-sm border-gray-400 text-right"
                                        placeholder='0.00'
                                        value={total.toFixed(2)} // Display the total before rounding
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm font-semibold ">Round off :</label>
                                    <input
                                        type="text"
                                        className="border pr-2 rounded-sm border-gray-400 text-right"
                                        placeholder='0.00'
                                        value={roundOff} // Display the round off
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm font-semibold ">Grand Total :</label>
                                    <input
                                        type="text"
                                        className="border p-1 pr-2 rounded-sm border-gray-400 text-right"
                                        placeholder='0.00'
                                        value={grandTotal.toFixed(2)} // Use `toFixed(2)` to display two decimal places
                                        disabled
                                    />
                                </div>
                            </div>
                            {/* GST Declaration button */}

                            <div className='flex justify-center w-full'>
                                <table className='border'>
                                    <thead className='border w-full text-sm text-center text-gray-600 border-gray-400'>
                                        <tr>
                                            {gstType === 'cgst_sgst' ? (
                                                <>
                                                    <th className="p-1 border border-gray-400">CGST</th>
                                                    <th className="p-1 border border-gray-400">SGST</th>
                                                </>
                                            ) : (
                                                <th className="p-1 border border-gray-400">IGST</th>
                                            )}
                                            <th className="p-1 border border-gray-400">Total Tax</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center text-gray-600'>
                                        <tr>
                                            {gstType === 'cgst_sgst' ? (
                                                <>
                                                    <td className="px-1 border border-gray-400">
                                                        {gstBreakdown.cgst.toFixed(2)}
                                                    </td>
                                                    <td className="px-1 border border-gray-400">
                                                        {gstBreakdown.sgst.toFixed(2)}
                                                    </td>
                                                </>
                                            ) : (
                                                <td className="px-1 border border-gray-400">
                                                    {gstBreakdown.igst.toFixed(2)}
                                                </td>
                                            )}
                                            <td className="px-1 border border-gray-400">
                                                {gstBreakdown.totalTax.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='flex items-center justify-center '>
                                <button
                                    onClick={showPopupTax}
                                    className='rounded-md border-blue-400 text-blue-400 hover:text-blue-600 hover:border-blue-600'>
                                    Show Declaration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup Section */}
            {
                isPopupTableTax && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-6 rounded-lg shadow-xl w-3/4 ${isFullScreenTax ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenTax}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenTax ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupTax}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <GstDelcarationTable gstItems={gstItems} gstType={gstType} subTotal={subTotal} />
                        </div>
                    </div>
                )
            }
            {/* Popup Section */}
            {
                isPopupCustomerAdd && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenCustomer ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenCustomer}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenCustomer ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupCustomer}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <CustomerInvoiceAddView
                                onCustomerSelect={setSelectedCustomer}
                                closePopup={closePopupCustomer} />
                        </div>
                    </div>
                )
            }
            {/* Popup Section */}
            {
                isPopupDeliveryAdd && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenDelivery ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenDelivery}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenDelivery ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupDelivery}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <InvoiceDeliveryEditView setActiveSection={setActiveSection}
                                deliveryData={invoiceData.delivery || deliveryDetails || {}}  // Pass the existing delivery data
                                onDeliveryDetailsChange={handleDeliveryDetailsChange}  // Handle changes to delivery details
                                closePopup={closePopupDelivery}
                                selectedCustomer={selectedCustomer}
                            />
                        </div>
                    </div>
                )
            }
            {/* Popup Section */}
            {
                isPopupCustomerView && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className={`bg-white p-4 rounded-lg shadow-xl w-3/4 ${isFullScreenCustomerView ? 'w-full h-full' : ''}`}
                            style={{ maxWidth: '1200px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={toggleFullScreenCustomerView}
                                    className="text-blue-600 font-semibold border rounded-md p-1"
                                >
                                    {isFullScreenCustomerView ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}

                                </button>
                                <button
                                    onClick={closePopupCustomerView}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <InvoiceCustomerView
                                selectedCustomer={selectedCustomer}
                                closePopup={closePopupCustomerView} />
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
                            <DraftDeleteConfirmView
                                removeItem={() => removeItem(items.indexOf(itemToDelete))}
                                closePopupDeleteConfirm={() => setIsPopupDeleteConfirm(false)}
                                item={itemToDelete} // Pass the item to delete
                            />
                        </div>
                    </div>
                )
            }
            {/* Popup Section */}
            {
                isPopupConfirmationView && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                        <div className="bg-white p-4 rounded-lg shadow-xl w-3/4"
                            style={{ maxWidth: '700px' }}>
                            {/* Back Button */}
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={closePopupConfirmationView}
                                    className="text-blue-600 font-semibold border rounded-md p-1">
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <DraftConfirmationView setActiveSection={setActiveSection} closePopupConfirmationView={closePopupConfirmationView}
                                invoiceId={invoiceId} />
                        </div>
                    </div>
                )
            }
        </div >

    )
}


export default InvoiceEditView
