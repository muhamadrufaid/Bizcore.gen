import React, { useEffect, useState, useMemo } from 'react';
import { User, X, CirclePlus, Save, Minimize2, Maximize2, HardDriveUpload } from 'lucide-react';
import GstDelcarationTable from './GstDelcarationTable';
import CustomerInvoiceAddView from '../Customers/CustomerInvoiceAddView';
import InvoiceDeliveryAdd from './InvoiceDeliveryAdd';
import InvoiceCustomerView from '../Customers/InvoiceCustomerView';
import InvoiceConfirmationView from './InvoiceConfirmationView';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvoiceGeneratorView = ({ setActiveSection }) => {

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const clearSelectedCustomer = () => {
    setSelectedCustomer(null); // Clear the selected customer
    setDeliveryDetails({}); // Clear the delivery details as well
  };
  const [draftInvoiceId, setDraftInvoiceId] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState({});
  const [allProducts, setAllProducts] = useState([]); // State to store all products

  const invoicetypeOptions = ['individual', 'bussiness'];
  const gstOptions = ['cgst_sgst', 'igst'];
  const transportModeOptions = ['none', 'road', 'air', 'sea'];
  const modeOfSupplyOptions = ['direct', 'delivery'];
  const staffOptions = ['simon', 'kerah', 'mithali'];

  const [subTotal, setSubTotal] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [creditApplied, setCreditApplied] = useState(0); // Assuming 0 credit by default
  const [total, setTotal] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [dueDate, setDueDate] = useState('')

  // State for invoice fields
  const [invoiceType, setInvoiceType] = useState('individual'); // Default value
  const [gstType, setGstType] = useState('cgst_sgst'); // Default value
  const [transportMode, setTransportMode] = useState('none'); // Default value
  const [modeOfSupply, setModeOfSupply] = useState('direct'); // Default value
  const [staff, setStaff] = useState(staffOptions[0]); // Default to first staff option

  const [isPopupTableTax, setIsPopupTableTax] = useState(false); // State to control popup visibility
  const [isFullScreenTax, setIsFullScreenTax] = useState(false);

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
  const showPopupConfirmationView = () => setIsPopupConfirmationView(true);
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


  const handleDeliveryDetailsChange = (data) => {
    setDeliveryDetails(data); // Save the data in the parent state
  };

  const saveInvoice = async () => {
    if (!selectedCustomer || !selectedCustomer.id) {
      toast.error("Please select a customer.");
      return;
    }

    // Filter out empty rows (those without a selected product)
    const nonEmptyItems = items.filter(item => item.product !== '');

    if (nonEmptyItems.length === 0) {
      toast.error("Please add at least one product to the invoice.");
      return;
    }

    // Check for any item with qty <= 0
    const invalidItem = items.find(item => parseFloat(item.qty) <= 0);
    if (invalidItem) {
      toast.error("Re-check the quantity fields, quantity can't be zero or negative.");
      return;
    }

    // Check if any item has quantity greater than the available stock
    const invalidStockItem = items.find(item => {
      const product = allProducts.find(p => p.id === item.product); // Fetch product details based on ID
      return product && item.qty > product.stock_quantity; // Check if qty exceeds stock
    });

    if (invalidStockItem) {
      const product = allProducts.find(p => p.id === invalidStockItem.product);
      toast.error(`Not enough stock for ${product.name}. Available stock: ${product.stock_quantity}`);
      return;
    }

    const { delivery_address, city, state, pincode } = deliveryDetails;
    if (modeOfSupply === 'delivery' && (!delivery_address || !city || !state || !pincode)) {
      toast.error("Delivery details are incomplete. Please provide all required fields: Address, City, State, and Pincode.");
      return;
    }

    const draftInvoiceData = {
      customer: selectedCustomer.id, // Ensure this is the correct customer ID
      invoice_type: invoiceType.trim(),  // Remove any extra spaces or quotes
      gst_type: gstType.trim(),          // Remove any extra spaces or quotes
      transportation_mode: transportMode.trim(),  // Remove any extra spaces or quotes
      mode_of_supply: modeOfSupply.trim(), // Remove any extra spaces or quotes
      tax_status: 'unpaid',
      ...(dueDate && { due_date: dueDate }),
      items: items.map(item => ({
        product: item.product, // Ensure this is the correct product ID
        quantity: parseFloat(item.qty) || 1, // Ensure quantity is a number
        special_discount: parseFloat(item.spl_disc) || 0, // Ensure special discount is a number
        discount: parseFloat(item.disc) || 0, // Ensure discount is a number
        net_value: parseFloat(item.net_value) || 0, // Ensure net value is a number
        gst_rate: parseFloat(item.gst_rate) || 0, // Ensure GST rate is a number
        gst_amount: parseFloat(item.gst_amount) || 0, // Ensure GST amount is a number
        total: parseFloat(item.total) || 0, // Ensure total is a number
      })),
      delivery: modeOfSupply === 'delivery' ? { // Only include delivery details if modeOfSupply is 'delivery'
        delivery_address: deliveryDetails.delivery_address,
        city: deliveryDetails.city,
        state: deliveryDetails.state,
        pincode: deliveryDetails.pincode,
        landmark: deliveryDetails.landmark,
        status: deliveryDetails.status,
        assigned_to: deliveryDetails.assigned_to,
        transporter_name: deliveryDetails.transporter_name,
        transporter_gst_in: deliveryDetails.transporter_gst_in,
        vehicle_number: deliveryDetails.vehicle_number,
        delivery_notes: deliveryDetails.delivery_notes,
        dispatched_at: deliveryDetails.dispatched_at, // Optional
        delivered_at: deliveryDetails.delivered_at,  // Optional
      } : {}
    };

    console.log('Draft Invoice Data:', draftInvoiceData);  // Log this for debugging

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/draft-invoices/', draftInvoiceData);
      console.log('Invoice saved successfully:', response.data);
      toast.success('Draft Invoice saved successfully!');
      setDraftInvoiceId(response.data.id); // Assuming the response contains the draft invoice ID

      setSelectedCustomer(null);
      setItems([{
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
        searchQuery: '',
        filteredProducts: [],
        isDropdownVisible: false,
      }]); // Add one default empty row after reset

      setDeliveryDetails({});
      return true;
    } catch (error) {
      if (error.response) {
        toast.error('Please remove the Empty Fields!');
        console.error('Error response from API:', error.response.data);
      } else {
        toast.error('Please remove the Empty Fields!');
        console.error('Unknown error:', error);
        alert('An unknown error occurred.');
      }
    }
  };

  const [items, setItems] = useState([
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
      searchQuery: '',
      filteredProducts: [],
      isDropdownVisible: false,
    },
  ]);

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
      },
    ]);
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

  const handleInputChange = (e, index, field) => {
    const updatedItems = [...items];
    const updatedItem = updatedItems[index];

    updatedItem[field] = e.target.value;

    // Validate quantity, it can't be less than 1
    if (field === 'qty') {
      const qty = parseFloat(e.target.value) || 0;

      // Check if the qty exceeds the stock_quantity
      if (qty > updatedItem.stock_quantity) {
        toast.error(`Not enough stock for ${updatedItem.searchQuery}! Available stock: ${updatedItem.stock_quantity}`);
        updatedItem.qty = updatedItem.stock_quantity; // Reset to the available stock quantity
      }

      if (qty < 1) {
        toast.error("Product quantity can't be less than 1");
        updatedItems[index].qty = 1;  // Reset to 1 if invalid input
      }
    }

    // Ensure numeric fields are parsed correctly
    if (field === 'qty' || field === 'disc' || field === 'gst_rate') {
      updatedItems[index][field] = parseFloat(e.target.value) || 0;
      updateTotals(index); // Recalculate totals when relevant fields change
    }

    setItems(updatedItems);
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
      code: product.sku_code,
      hsn: product.hsn_sac_code,
      rate: product.retail_price,
      uom: product.unit_of_measurement,
      disc: product.discount,
      gst_rate: product.gst_rate,
      qty: 1, // Set qty to 1 when a product is selected
      stock_quantity: product.stock_quantity, // Store the stock quantity for validation
      searchQuery: product.name, // Set the product name in searchQuery
      isDropdownVisible: false, // Hide dropdown after selection
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
      gst_rate: product.gst_rate,
    });

  };

  const updateTotals = (index) => {
    const updatedItems = [...items]; // Create a copy to maintain immutability
    const item = updatedItems[index];

    // Recalculate net value, GST amount, and total only if necessary
    const netValue = parseFloat(item.rate) * parseFloat(item.qty) - parseFloat(item.spl_disc) - parseFloat(item.disc);
    const gstAmount = netValue * (parseFloat(item.gst_rate) / 100);
    const total = netValue + gstAmount;

    // Check if the values have changed before updating state
    const hasChanges =
      item.net_value !== netValue.toFixed(2) ||
      item.gst_amount !== gstAmount.toFixed(2) ||
      item.total !== total.toFixed(2);

    if (hasChanges) {
      // Update the values in the row
      updatedItems[index] = {
        ...item,
        net_value: netValue.toFixed(2),
        gst_amount: gstAmount.toFixed(2),
        total: total.toFixed(2),
      };

      // Set the updated items state only if values have changed
      setItems(updatedItems);
    }
  };

  // Remove row
  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
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
    totalTax: 0
  });

  // Function to calculate GST for an item
  const calculateItemGST = (item) => {
    const gstAmount = (item.net_value * item.gst_rate) / 100;
    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;
    const igstAmount = gstAmount

    return {
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      cgstPercentage: item.gst_rate / 2,
      sgstPercentage: item.gst_rate / 2,
      igstPercentage: item.gst_rate
    };
  };

  // Prepare the data to pass to the GST Declaration Table
  const gstItems = items.map(item => {
    // Calculate the GST amounts and percentages
    const { gstAmount, cgstAmount, sgstAmount, igstAmount, cgstPercentage, sgstPercentage, igstPercentage } = calculateItemGST(item);

    // Conditionally set the amounts based on gstType
    const gstData = {
      hsn: item.hsn,
      qty: item.qty,
      taxableValue: item.net_value,
      totalTax: gstAmount,
    };

    if (gstType === 'cgst_sgst') {
      // If GST type is 'cgst_sgst', set CGST and SGST values
      gstData.cgstPercentage = cgstPercentage;
      gstData.cgstAmount = cgstAmount;
      gstData.sgstPercentage = sgstPercentage;
      gstData.sgstAmount = sgstAmount;

      // Set IGST to 0 for cgst_sgst type
      gstData.igstAmount = 0;
      gstData.igstPercentage = 0;
    } else if (gstType === 'igst') {
      // If GST type is 'igst', set IGST values
      gstData.igstPercentage = igstPercentage;
      gstData.igstAmount = igstAmount;

      // Set CGST and SGST to 0 for igst type
      gstData.cgstAmount = 0;
      gstData.cgstPercentage = 0;
      gstData.sgstAmount = 0;
      gstData.sgstPercentage = 0;
    }

    return gstData;
  });

  // Update GST Breakdown for all items
  const updateGSTBreakdown = () => {
    const breakdown = {
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalTax: 0
    };

    items.forEach(item => {
      const { gstAmount, cgstAmount, sgstAmount, igstAmount } = calculateItemGST(item);

      // Accumulate GST totals
      breakdown.cgst += cgstAmount;
      breakdown.sgst += sgstAmount;
      breakdown.igst += igstAmount;
      breakdown.totalTax += gstAmount;
    });

    setGstBreakdown(breakdown); // Update state with GST totals
  };

  // Recalculate GST Breakdown when items change
  useEffect(() => {
    if (items.length > 0) {
      updateGSTBreakdown(); // Update the GST breakdown whenever items change
    }
  }, [items]); // Run whenever `items` changes

  const handleSaveDraft = async () => {
    const isSuccess = await saveInvoice();  // Wait for the result of saveInvoice()

    if (isSuccess) {
      showPopupConfirmationView();  // Show the confirmation popup if the invoice is saved
    } else {
      toast.error('Error saving the invoice. Please try again.');  // Show error toast if saving fails
    }
  };
  return (
    <div className=''>
      <div className="w-full h-14 flex items-center justify-between bg-white border-t border-gray-400">
        <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
          BILLING FORM
        </h1>

        <div className='flex p-2 gap-2'>
          <div
            onClick={saveInvoice}
            className='flex justify-center items-center gap-2 px-6 py-2 font-semibold text-md text-blue-400 border border-blue-400 rounded-lg hover:border-blue-600 hover:text-blue-700 '>
            <Save className='w-5 h-5' />
            <button className=''>
              Save as Draft
            </button>
          </div>
          <div
            onClick={handleSaveDraft}
            className='flex justify-center items-center gap-2 px-6 py-2 font-semibold text-md text-white border border-blue-400 bg-blue-400 rounded-lg hover:border-blue-600 hover:bg-blue-700 '>
            <HardDriveUpload className='w-5 h-5' />
            <button className=''>
              Generate Invoice
            </button>
          </div>
        </div>
      </div>

      <div className='m-2 max-h-[calc(100vh-18vh)] overflow-y-auto custom-scrollbar'>
        <div className='flex'>
          <div className='flex flex-col bg-white p-2 w-full rounded-lg'>
            <div className='flex justify-between items-center bg-gray-200 rounded-lg p-1 w-full'>
              <div className='flex flex-col '>
                <div className='flex flex-col p-1 pl-4'>
                  <h1 className='text-md font-semibold'>Draft Number</h1>
                  <p className='text-sm'>None</p>
                </div>
                <div className='flex pl-4'>
                  <h1 className='text-md font-semibold'>Draft Date</h1>
                  <p className='pl-2'>:</p>
                  <p className='text-sm pl-1'>None</p>
                </div>
                <div className="flex pl-4">
                  <label className='text-md font-semibold'>Due Date</label>
                  <p className='pl-4'>:</p>
                  <input
                    type="date"
                    className="text-sm pl-1"
                    value={dueDate || ''}
                    onChange={(e) => setDueDate(e.target.value)} // User can change if unpaid
                  />
                </div>
              </div>
              <div className='flex flex-col text-end p-2 pr-4'>
                <h1 className='font-semibold'>Billed to</h1>
                {selectedCustomer ? (
                  <>
                    <h1 className='text-md'>{selectedCustomer.name}</h1>
                    <h1 className='text-md'>{selectedCustomer.billing_address}</h1>
                    <h1 className='text-md'>{selectedCustomer.city}  {selectedCustomer.pincode}</h1>
                  </>
                ) : (
                  <p className='text-sm text-gray-500'>No customer selected</p>
                )}
              </div>
            </div>
            <div className='flex items-center gap-6 pl-4 pr-6 justify-between border border-gray-300 rounded-lg mt-2 p-2'>
              <div className="flex flex-col w-full">
                <label className="text-gray-700 text-sm font-semibold">Staff Details</label>
                <select
                  name="staff"
                  className="border border-gray-400 rounded-sm text-gray-600 hover:bg-gray-100"
                  value={staff} // Bind to state
                  onChange={(e) => setStaff(e.target.value)} // Update state on change
                >
                  {staffOptions.map((staff, i) => (
                    <option className='' key={i} value={staff}>{staff}</option>
                  ))}
                </select>
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
                  onChange={(e) => setGstType(e.target.value)} // Update state on change
                >
                  {gstOptions.map((gst_option, i) => (
                    <option className='' key={i} value={gst_option}>{gst_option}</option>
                  ))}
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
                            value={item.searchQuery}
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
                          />
                        </td>
                        <td className="p-1 pt-2 w-15">
                          <input
                            type="text"
                            value={item.hsn}
                            onChange={(e) => handleInputChange(e, index, 'hsn')}
                            className="w-full p-1 border border-gray-300"
                            placeholder="HSN"
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
                        <td className="p-1 pt-2 w-15">
                          <input
                            type="text"
                            value={item.uom}
                            onChange={(e) => handleInputChange(e, index, 'uom')}
                            className="w-full p-1 border border-gray-300"
                            placeholder="UOM"
                          />
                        </td>
                        <td className="p-1 pt-2 w-15">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleInputChange(e, index, 'qty')}
                            className="w-full p-1 border border-gray-300"
                            placeholder="Qty"
                            onBlur={() => updateTotals(index)} // Update totals when quantity changes
                          />
                        </td>
                        <td className="p-1 pt-2 w-20">
                          <input
                            type="number"
                            value={item.disc}
                            onChange={(e) => handleInputChange(e, index, 'disc')}
                            className="w-full p-1 border border-gray-300"
                            placeholder="Disc"
                            onBlur={() => updateTotals(index)} // Update totals when discount changes
                          />
                        </td>
                        <td className="p-1 pt-2 w-15">
                          <input
                            type="number"
                            value={item.spl_disc}
                            onChange={(e) => handleInputChange(e, index, 'spl_disc')}
                            className="w-full p-1 border border-gray-300"
                            placeholder="Spl Disc"
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
                            disabled
                          />
                        </td>
                        <td className="p-1 pt-2 w-15">
                          <input
                            type="number"
                            value={item.gst_rate}
                            onChange={(e) => handleInputChange(e, index, 'gst_rate')}
                            className="w-full p-1 border border-gray-300"
                            placeholder="GST %"
                            onBlur={() => updateTotals(index)} // Update totals when GST rate changes
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
                            value={item.total}
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
                            onClick={() => removeItem(index)}
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
                        <h1 className='pl-2 font-semibold text-sm w-50'>{selectedCustomer.name}</h1>
                        <p className='pl-2 text-sm'>{selectedCustomer.phone}</p>
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

              <div className='flex mt-1 justify-center w-full'>
                <table className='border'>
                  <thead className='border w-full text-sm text-center text-gray-600 border-gray-400'>
                    <tr>
                      {gstType === 'cgst_sgst' ? (
                        <>
                          <th className="px-1 border border-gray-400">CGST</th>
                          <th className="px-1 border border-gray-400">SGST</th>
                        </>
                      ) : (
                        <th className="px-1 border border-gray-400">IGST</th>
                      )}
                      <th className="px-1 border border-gray-400">Total Tax</th>
                    </tr>
                  </thead>
                  <tbody className='text-center text-gray-600'>
                    <tr>
                      {gstType === 'cgst_sgst' ? (
                        <>
                          <td className="px-1 border border-gray-400">{gstBreakdown.cgst.toFixed(2)}</td>
                          <td className="px-1 border border-gray-400">{gstBreakdown.sgst.toFixed(2)}</td>
                        </>
                      ) : (
                        <td className="px-1 border border-gray-400">{gstBreakdown.igst.toFixed(2)}</td>
                      )}
                      <td className="px-1 border border-gray-400">{gstBreakdown.totalTax.toFixed(2)}</td>
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
              <InvoiceDeliveryAdd setActiveSection={setActiveSection}
                closePopup={closePopupDelivery}
                onDeliveryDetailsChange={handleDeliveryDetailsChange}
                deliveryData={deliveryDetails}
                selectedCustomer={selectedCustomer} />
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
              <InvoiceConfirmationView setActiveSection={setActiveSection} closePopupConfirmationView={closePopupConfirmationView}
                draftInvoiceId={draftInvoiceId} />
            </div>
          </div>
        )
      }
    </div >

  )
}

export default InvoiceGeneratorView
