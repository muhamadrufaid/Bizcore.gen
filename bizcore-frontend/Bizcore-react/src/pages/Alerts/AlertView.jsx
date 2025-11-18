import React, { useState, useEffect } from 'react';
import { Search, Funnel } from 'lucide-react';

const AlertView = () => {
    const [alerts, setAlerts] = useState([]);
    const [showStockAlerts, setShowStockAlerts] = useState(false); // State to toggle stock alerts
    const [showPaymentAlerts, setShowPaymentAlerts] = useState(true); // State to toggle payment alerts
    const [stockAlerts, setStockAlerts] = useState([]);
    const [paymentAlerts, setPaymentAlerts] = useState([]);

    useEffect(() => {
        // Fetch alerts from the Django backend
        const fetchAlerts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/alerts/');
                const data = await response.json();
                setAlerts(data.alerts);

                // Separate the alerts into stock and payment alerts
                const stock = data.alerts.filter(alert => alert.type === 'stock_alert');
                const payment = data.alerts.filter(alert => alert.type === 'payment_alert');

                setStockAlerts(stock);
                setPaymentAlerts(payment);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            }
        };

        fetchAlerts();
    }, []);

    // Show only stock alerts
    const handleStockAlertClick = () => {
        setShowStockAlerts(true);
        setShowPaymentAlerts(false); // Hide payment alerts
    };

    // Show only payment alerts
    const handlePaymentAlertClick = () => {
        setShowStockAlerts(false); // Hide stock alerts
        setShowPaymentAlerts(true);
    };

    // Determine which alerts to show based on the button click
    const alertsToDisplay = showStockAlerts ? stockAlerts : showPaymentAlerts ? paymentAlerts : [];

    return (
        <div className="flex flex-col overflow-hidden">
            <div className='w-full h-14 flex items-center justify-between bg-white border-t border-gray-400'>
                <h1 style={{
                    fontFamily: '"Outfit", sans-serif',  // Apply Google font
                    fontWeight: 600,                    // Apply bold weight
                    fontOpticalSizing: 'auto',           // Apply optical sizing
                }}
                    className='text-blue-700 text-2xl p-2'>Alerts</h1>

            </div>
            <div>
                <div className='p-4 pt-6'>
                    {/* Toggle buttons */}
                    <div className="text-white pb-6">
                        <button
                            onClick={handlePaymentAlertClick}
                            className={`py-2 px-4 rounded-full mr-2 ${showPaymentAlerts ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            Payment Alerts
                        </button>
                        <button
                            onClick={handleStockAlertClick}
                            className={`py-2 px-4 rounded-full   ${showStockAlerts ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            Stock Alerts
                        </button>

                    </div>

                    {/* Alerts List */}
                    <div className='overflow-x-auto max-h-125 custom-scrollbar'>
                        {alertsToDisplay.length > 0 ? (
                            alertsToDisplay.map((alert, index) => (
                                <div
                                    key={index}
                                    className={`flex mb-4 p-4 rounded-md  ${alert.type === 'stock_alert' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}
                                >
                                    {/* For stock alert */}
                                    {alert.type === 'stock_alert' ? (
                                        <div>
                                            <div className='flex gap-10 text-white'>
                                                <h3 className="font-semibold">{alert.product_name}</h3>
                                                <p className='text-white'>SKU Code: {alert.sku_code}</p>
                                            </div>
                                            <p className='text-white'>Stock : {alert.stock_quantity}</p>
                                            <p className="text-sm text-red-500 py-1 bg-white rounded-md text-center">Stock is running low. Please reorder!</p>
                                        </div>
                                    ) : (
                                        // For payment alert
                                        <div className='flex flex-col w-full gap-2'>
                                            <p className=''>Payment for Invoice <span className='font-semibold '>{alert.invoice_number}</span> is overdue! </p>
                                            <div className='flex items-center justify-between'>
                                                <p>Customer: {alert.customer_name}</p>
                                                <p className="text-sm text-gray-100">
                                                    Due Date: {new Date(alert.due_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <p className="text-lg font-bold ">Grand Total: <span className='text-yellow-300'>₹{alert.grand_total}</span></p>
                                                <p className="text-lg font-bold bg-white rounded-md px-2 text-red-500">Remaining Balance: ₹{alert.remaining_balance}</p>
                                            </div>

                                        </div>

                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No alerts</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AlertView;
