import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, CirclePlus, Save, Minimize2, Maximize2, } from 'lucide-react';
import axios from 'axios'; // Make sure axios is installed
import PurchaseVendorAddView from './PurchaseVendorAddView';
import { toast } from 'react-toastify';

const PurchaseAddform = ({ setActiveSection }) => {

  const [selectedVendor, setSelectedVendor] = useState(null);
  const clearSelectedVendor = () => {
    setSelectedVendor(null); // Clear the selected customer
  };

  const [items, setItems] = useState([
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
      searchQuery: '',
      filteredProducts: [],
      isDropdownVisible: false,
    },
  ]);

  const [isPopupVendorAdd, setIsPopupVendorAdd] = useState(false); // State to control popup visibility
  const [isFullScreenVendor, setIsFullScreenVendor] = useState(false);
  const closePopupVendor = () => setIsPopupVendorAdd(false);
  const showPopupVendor = () => setIsPopupVendorAdd(true);
  const toggleFullScreenVendor = () => setIsFullScreenCustomer((prev) => !prev);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [purchaseDiscount, setPurchaseDiscount] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);

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

  const handleFocus = (index) => {
    const updatedItems = [...items];
    updatedItems[index].isDropdownVisible = true; // Show the dropdown
    setItems(updatedItems);
  };

  const handleInputChange = (e, index, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = e.target.value;
    setItems(updatedItems);
    calculateItemValues(index); // Recalculate values when input changes
  };


  const roundToTwoDecimals = (num) => {
    return Math.round(num * 100) / 100;
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  // Submit form data
  const savePurchase = async () => {
    // Validate that a vendor is selected
    if (!selectedVendor || !selectedVendor.id) {
      toast.error("Please select a vendor.");
      return;
    }

    if (!invoiceNumber) {
      toast.error("Bill number is missing.");
      return;
    }

    if (!purchaseDate) {
      toast.error("Purchase Date field is missing.");
      return;
    }

    if (!grandTotal) {
      toast.error("Grand total field is missing.");
      return;

    } if (!amountPaid) {
      toast.error("Amount paid field is missing.");
      return;
    }

    if (grandTotal === 0 || isNaN(grandTotal)) {
      toast.error("Grand total is invalid.");
      return; // Prevent submitting if grandTotal is invalid
    }

    // Check if at least one item is present
    const hasValidItem = items.some(item =>
      item.product && item.quantity && item.rate // Ensure necessary fields are filled
    );

    if (!hasValidItem) {
      toast.error('Please add at least one item to the purchase.');
      return; // Prevent submission if no valid items
    }

    const purchaseData = {
      vendor: selectedVendor.id,
      invoice_number: invoiceNumber,  // Make sure this is taken from an input or assigned
      purchase_date: purchaseDate,  // Use the `purchaseDate` state here
      discount: purchaseDiscount,  // Take this from the input field
      grand_total: roundToTwoDecimals(grandTotal), // Ensure no more than 2 decimals
      total_tax: roundToTwoDecimals(totalTax), // Round the total_tax to 2 decimals
      subtotal: roundToTwoDecimals(subTotal), // Round the subtotal to 2 decimals
      balance_due: roundToTwoDecimals(balanceDue), // Round balance due
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        hsn_sac: item.hsn_sac,
        rate: item.rate,
        discount: item.discount,
        total_cost: roundToTwoDecimals(item.total_cost), // Round item total_cost
        gst_percentage: item.gst_percentage,
        total_tax: roundToTwoDecimals(item.total_tax), // Round item total_tax
        item_total: roundToTwoDecimals(item.item_total), // Round item total
      })),
    };

    try {
      console.log('Grand Total:', grandTotal);  // Log to check the value

      const response = await axios.post('http://127.0.0.1:8000/api/purchase/', purchaseData);
      console.log('Purchase created', response.data);
      toast.success('Purchase saved successfully!');
      console.log('Purchase data:', purchaseData);
      setActiveSection('purchase-view')
    } catch (error) {
      console.error('Error creating purchase', error);
      toast.error('Failed to save purchase. Please try again!');
    }
  };

  // Handle product selection
  const handleProductSelect = (product, index) => {
    const updatedItems = [...items];

    // Check if the product is already added in any row
    const isProductAdded = items.some(item => item.product === product.id);
    if (isProductAdded) {
      toast.error('This product is already added');
      return;
    }

    // Update the current item with the selected product's name and hsn_sac
    updatedItems[index] = {
      ...updatedItems[index],
      product: product.id,  // Set product ID
      hsn_sac: product.hsn_sac_code,  // Set HSN/SAC code
      rate: product.purchase_price,
      gst_percentage: product.purchase_gst,
      searchQuery: product.name,  // Set product name in searchQuery field
      isDropdownVisible: false,  // Hide dropdown after selection
    };

    // Update items state only if there is a change
    setItems(updatedItems);
  };

  // Calculate item-level values
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

  }, [items]); // Run only when items change

  // Handle Amount Paid Change
  const handleAmountPaidChange = (e) => {
    let value = e.target.value.trim();

    // Clean up the value: allow only numbers and one decimal point
    const cleanedValue = value.replace(/[^0-9.]/g, '');

    // Parse the cleaned value as a float
    const numericValue = parseFloat(cleanedValue);

    // Check if numericValue is a valid number and update the state accordingly
    if (!isNaN(numericValue)) {
      setAmountPaid(numericValue); // Store the numeric value (decimal)
    } else {
      setAmountPaid(''); // Optionally clear the value if input is invalid
    }
  };

  // Handle Discount Change
  const handleDiscountChange = (e) => {
    const value = e.target.value.trim(); // Clean up input
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')); // Remove non-numeric characters except for the dot

    if (!isNaN(numericValue)) {
      setPurchaseDiscount(numericValue); // Set the cleaned number value
    } else {
      setPurchaseDiscount(0); // Clear if invalid input
    }
  };

  // Recalculate purchase-level values
  const recalculatePurchaseValues = () => {
    // Calculate totalSubTotal, totalTax, and totalItemTotal
    const totalSubTotal = items.reduce((acc, item) => acc + item.total_cost, 0);
    const totalTax = items.reduce((acc, item) => acc + item.total_tax, 0);
    const totalItemTotal = items.reduce((acc, item) => acc + item.item_total, 0);


    // Calculate grandTotal by applying discount
    const grandTotal = totalItemTotal - (purchaseDiscount || 0);

    // Calculate balanceDue (grandTotal - amountPaid)
    const balanceDue = grandTotal - (amountPaid || 0);

    // Set state for the recalculated values
    setSubTotal(totalSubTotal);
    setTotalTax(totalTax);
    setGrandTotal(grandTotal);
    setBalanceDue(balanceDue);
  };

  // useEffect to recalculate whenever either amountPaid or purchaseDiscount changes
  useEffect(() => {
    recalculatePurchaseValues(); // Recalculate when either of these values change
  }, [amountPaid, purchaseDiscount, items]); // Dependencies to recalculate based on any of these values


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
            New Purchase
          </h1>
        </div>

        <div
          onClick={savePurchase}
          className='flex justify-center items-center gap-2 px-6 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
          <Save className='w-5 h-5' />
          <button className='' >
            Save Purchase
          </button>
        </div>

      </div>

      <div className='m-2 bg-white p-2'>
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
                        value={item.searchQuery}
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
                        placeholder="Unit price"
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
                        onChange={(e) => handleInputChange(e, index, 'total')}
                        className="w-full p-1 border border-gray-300"
                        placeholder="Total"
                        readOnly
                      />
                    </td>
                    <td className="p-1 pt-3 text-center">
                      <button
                        onClick={() => removeItem(index)}
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
    </div>

  )
}

export default PurchaseAddform
