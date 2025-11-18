import React, { useState, useEffect } from 'react';

const DraftDeliveryAddView = ({ onDeliveryDetailsChange, closePopup, deliveryData, selectedCustomer }) => {
  const [delivery, setDelivery] = useState({
    delivery_address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    status: 'pending',
    assigned_to: '',
    transporter_name: '',
    transporter_gst_in: '',
    vehicle_number: '',
    delivery_notes: '',
    dispatched_at: '',
    delivered_at: ''
  });

  const [useCustomerAddress, setUseCustomerAddress] = useState(false); // Track checkbox state

  // Reset delivery details when the selected customer changes
  useEffect(() => {
    if (selectedCustomer) {
      setDelivery({
        delivery_address: selectedCustomer.billing_address || '',
        city: selectedCustomer.city || '',
        state: selectedCustomer.state || '',
        pincode: selectedCustomer.pincode || '',
        landmark: '',
        status: 'pending',
        assigned_to: '',
        transporter_name: '',
        transporter_gst_in: '',
        vehicle_number: '',
        delivery_notes: '',
        dispatched_at: '',
        delivered_at: ''
      });
    } else {
      // Reset delivery details when customer is cleared
      setDelivery({
        delivery_address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        status: 'pending',
        assigned_to: '',
        transporter_name: '',
        transporter_gst_in: '',
        vehicle_number: '',
        delivery_notes: '',
        dispatched_at: '',
        delivered_at: ''
      });
    }
  }, [selectedCustomer]); // This effect will run whenever the selectedCustomer changes

  // Update the state when deliveryData is passed as a prop
  useEffect(() => {
    if (deliveryData) {
      setDelivery({
        ...deliveryData
      });
    }
  }, [deliveryData]);


  // Handle checkbox state change
  const handleCheckboxChange = () => {
    setUseCustomerAddress(prevState => {
      const newState = !prevState;

      if (newState) {
        // If checkbox is checked, populate address fields from the selected customer
        if (selectedCustomer) {
          setDelivery((prevDelivery) => ({
            ...prevDelivery,
            delivery_address: selectedCustomer.billing_address || '',
            city: selectedCustomer.city || '',
            state: selectedCustomer.state || '',
            pincode: selectedCustomer.pincode || ''
          }));
        }
      } else {
        // If checkbox is unchecked, clear the customer address fields
        setDelivery((prevDelivery) => ({
          ...prevDelivery,
          delivery_address: '',
          city: '',
          state: '',
          pincode: ''
        }));
      }

      return newState;  // Update the checkbox state
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDelivery((prevState) => ({
      ...prevState,
      [name]: value || '',  // Set to empty string if value is undefined or null
    }));
    onDeliveryDetailsChange({ ...delivery, [name]: value }); // Pass updated delivery to parent
  };


  // Save delivery details and close the popup
  const handleSave = () => {

    const { delivery_address, city, state, pincode } = delivery;
    // Validate required fields
    if (!delivery_address || !city || !state || !pincode) {
      toast.error("Delivery details are incomplete. Please provide all required fields: Address, City, State, and Pincode.");
      return;
    }
    // Pass the delivery data to the parent
    onDeliveryDetailsChange(delivery);
    console.log('Delivery Details:', delivery);
    closePopup();
  };

  return (
    <div className="m-4">
      <div className="flex flex-col">
        <h1 className="pl-6 text-blue-400 text-xl font-semibold">Delivery Details</h1>
      </div>
      <form className="p-6 bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Name, Phone, Email, Address */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="delivery_address" className="text-gray-600 pb-1 text-sm">Address</label>
              <input
                type="text"
                name="delivery_address"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter address"
                value={delivery.delivery_address || ''}
                onChange={handleInputChange}
                disabled={useCustomerAddress} // Disable if checkbox is checked
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="text-gray-600 pb-1 text-sm">City</label>
              <input
                type="text"
                name="city"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter city"
                value={delivery.city}
                onChange={handleInputChange}
                disabled={useCustomerAddress} // Disable if checkbox is checked
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="state" className="text-gray-600 pb-1 text-sm">State</label>
              <input
                type="text"
                name="state"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter state"
                value={delivery.state}
                onChange={handleInputChange}
                disabled={useCustomerAddress} // Disable if checkbox is checked
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 pb-1 text-sm">Pincode</label>
              <input
                type="text"
                name="pincode"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter Pincode"
                value={delivery.pincode}
                onChange={handleInputChange}
                disabled={useCustomerAddress} // Disable if checkbox is checked
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 pb-1 text-sm">Landmark</label>
              <input
                type="text"
                name="landmark"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter Landmark"
                value={delivery.landmark}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-600 pb-1 text-sm">Transporter Name</label>
              <input
                type="text"
                name="transporter_name"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter Transporter name"
                value={delivery.transporter_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 pb-1 text-sm">Transporter GST ID</label>
              <input
                type="text"
                name="transporter_gst_in"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter GST ID"
                value={delivery.transporter_gst_in}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 pb-1 text-sm">Vehicle No</label>
              <input
                type="text"
                name="vehicle_number"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter Vehicle No"
                value={delivery.vehicle_number}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 pb-1 text-sm">Dispatched at</label>
              {/* Dispatched at field logic */}
              <input
                type="date"
                name="dispatched_at"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter dispatched date"
                value={delivery.dispatched_at}
                onChange={handleInputChange}

              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 pb-1 text-sm">Delivered at</label>
              <input
                type="date"
                name="delivered_at"
                className="border p-1 rounded-sm border-gray-400 text-gray-600"
                placeholder="Enter delivered date"
                value={delivery.delivered_at}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
          <div className="flex flex-col">
            <label className="text-gray-600 pb-1 text-sm">Delivery Note</label>
            <input
              type="text"
              name="delivery_notes"
              className="border p-1 rounded-sm border-gray-400 text-gray-600"
              placeholder="Enter delivery notes"
              value={delivery.delivery_notes}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 pb-1 text-sm">Assigned to</label>
            <input
              type="text"
              name="assigned_to"
              className="border p-1 rounded-sm border-gray-400 text-gray-600"
              placeholder="Enter assigned to"
              value={delivery.assigned_to}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <input
              type="checkbox"
              id="useCustomerAddress"
              className="mr-2 w-4 h-4"
              checked={useCustomerAddress}
              onChange={handleCheckboxChange} // Handle checkbox toggle
            />
            <label htmlFor="useCustomerAddress" className="text-sm text-gray-700">
              Use Customer Address
            </label>
          </div>
          <button
            type="button"
            className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-600"
            onClick={handleSave} // Call handleSave when the button is clicked
          >
            Save All
          </button>
        </div>
      </form>
    </div>
  );
};

export default DraftDeliveryAddView;
