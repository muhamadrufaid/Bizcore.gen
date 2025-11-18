import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import axios from 'axios';
import 'react-circular-progressbar/dist/styles.css';
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, BarElement, Title, Tooltip, Legend, ArcElement, Colors } from 'chart.js';

ChartJS.register(CategoryScale, RadialLinearScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const OverView = () => {
    const [stats, setStats] = useState({
        total_invoice_count: 0,
        total_purchase_amount: 0,
        total_sales_amount: 0,
        total_customer_count: 0,
        total_vendor_count: 0,
        total_product_count: 0,
        tax_paid_total: 0,
        tax_unpaid_total: 0,
        interstate_total_count: 0,
        total_payable_tax: 0,
        intrastate_total_count: 0,
        total_purchase_amount_paid: 0,
        total_purchase_balance_due: 0,
    });

    // Fetch vendor stats from the backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/all-analytics-stats/');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching vendor stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Mock Data for the Bar Chart (Static Data)
    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Month labels
        datasets: [
            {
                label: 'Total Sales Amount',
                data: [50, 100, 150, 200, 250, 300], // Mock sales data
                backgroundColor: 'rgba(85, 139, 255, 0.6)', // Modern Blue
                borderColor: '#5577FF', // Blue border
                borderWidth: 1,
            },
            {
                label: 'Total Purchase Amount',
                data: [30, 60, 90, 120, 150, 180], // Mock purchase data
                backgroundColor: 'rgba(0, 191, 165, 0.6)', // Aqua Green
                borderColor: '#00BFA5', // Aqua Green border
                borderWidth: 1,
            },
        ],
    };

    // Transportation Mode chart (Process Circle for transportation mode)
    const salesData = {
        labels: ['Purchase', 'Sales'],
        datasets: [
            {
                data: [stats.total_purchase_amount, stats.total_sales_amount],
                backgroundColor: ['#FFB74D', '#4DD0E1'], // Warm Yellow and Light Teal
                hoverBackgroundColor: ['#FFB74D', '#4DD0E1'],
            },
        ],
    };

    const purchaseData = {
        labels: ['Total', 'Paid', 'Balance'],
        datasets: [
            {
                data: [stats.total_purchase_amount, stats.total_purchase_amount_paid, stats.total_purchase_balance_due],
                backgroundColor: ['#64B5F6', '#FF7043', '#81C784'], // Soft Blue, Red-Orange, Green
                hoverBackgroundColor: ['#64B5F6', '#FF7043', '#81C784'],
            },
        ],
    };

    const statusData = {
        labels: ['Interstate', 'Intrastate'],
        datasets: [
            {
                data: [stats.interstate_total_count, stats.intrastate_total_count],
                backgroundColor: ['#FF6F61', '#66BB6A'], // Coral, Mint Green
                borderColor: ['#fff', '#fff'],
                borderWidth: 2,
            },
        ],
    };

    const taxData = {
        labels: ['Paid', 'Unpaid', 'Payable Tax'],
        datasets: [
            {
                data: [stats.tax_paid_total, stats.tax_unpaid_total, stats.total_payable_tax],
                backgroundColor: ['#81C784', '#EF5350', '#64B5F6'], // Green, Red, Blue
                borderColor: ['#fff', '#fff', '#fff'],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div>
            <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
                <h1 className="text-2xl font-semibold text-indigo-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Overview
                </h1>
            </div>
            <div className='m-2'>
                <div className="grid grid-cols-8 gap-6 p-4">
                    {/* Top Section: Counts */}
                    <div className="col-span-2 flex flex-col items-center bg-gradient-to-r from-indigo-500 to-teal-500 p-6 rounded-lg">
                        <h3 className="text-white">Total Invoice Count</h3>
                        <p className="text-3xl text-white">{stats.total_invoice_count}</p>
                    </div>
                    <div className="col-span-2 flex flex-col items-center bg-gradient-to-r from-indigo-500 to-teal-500 p-6 rounded-lg">
                        <h3 className="text-white">Total Customer Count</h3>
                        <p className="text-3xl text-white">{stats.total_customer_count}</p>
                    </div>
                    <div className="col-span-2 flex flex-col items-center bg-gradient-to-r from-indigo-500 to-teal-500 p-6 rounded-lg">
                        <h3 className="text-white">Total Vendor Count</h3>
                        <p className="text-3xl text-white">{stats.total_vendor_count}</p>
                    </div>
                    <div className="col-span-2 flex flex-col items-center bg-gradient-to-r from-indigo-500 to-teal-500 p-6 rounded-lg">
                        <h3 className="text-white">Total Product Count</h3>
                        <p className="text-3xl text-white">{stats.total_product_count}</p>
                    </div>
                </div>

                <div className='overflow-y-auto h-112 custom-scrollbar'>
                    <div className='flex justify-between p-4'>
                        {/* Static Bar Chart */}
                        <div className="w-[700px]">
                            <Bar
                                data={barData}  // Using the mock bar chart data
                                options={{
                                    responsive: true,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Sales vs Purchase',
                                        },
                                    },
                                }}
                            />
                        </div>

                        {/* Pie and Doughnut Charts */}
                        <div className="grid grid-cols-2 gap-6 pl-3">
                            <div className="flex flex-col justify-center items-center bg-cyan-500 rounded-lg p-4 space-y-4">
                                <h4 className="text-white text-xl">GST Status</h4>
                                <Pie data={statusData} />
                                <div className="flex text-white">
                                    <div className='flex gap-2 text-center'>
                                        <p><strong>Interstate</strong> {stats.interstate_total_count}</p>
                                        <p><strong>IntraState</strong> {stats.intrastate_total_count}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center bg-green-500 rounded-lg p-4 space-y-4">
                                <h4 className="text-white text-xl">Tax Status</h4>
                                <Doughnut data={taxData} />
                                <div className="flex text-white">
                                    <div className='flex gap-2 text-center'>
                                        <p><strong>Paid</strong> ₹{stats.tax_paid_total}</p>
                                        <p><strong>Unpaid</strong> ₹{stats.tax_unpaid_total}</p>
                                        <p><strong>Payable</strong> ₹{stats.total_payable_tax}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between w-full gap-6 p-4'>
                        <div className="bg-white p-4 rounded-lg w-full shadow-lg">
                            <h2 className="font-semibold text-xl text-gray-800 mb-4">Sales Vs Purchase</h2>
                            <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                                <PolarArea data={salesData} />
                                <div className="flex justify-between m-4">
                                    <span className="text-sm text-gray-700">Sales: ₹{stats.total_sales_amount}</span>
                                    <span className="text-sm text-gray-700">Purchase: ₹{stats.total_purchase_amount}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg w-full shadow-lg">
                            <h2 className="font-semibold text-xl text-gray-800 mb-4">Purchase Status</h2>
                            <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                                <Doughnut data={purchaseData} />
                                <div className="flex justify-between m-4">
                                    <span className="text-sm text-gray-700">Total: ₹{stats.total_purchase_amount}</span>
                                    <span className="text-sm text-gray-700">Paid: ₹{stats.total_purchase_amount_paid}</span>
                                    <span className="text-sm text-gray-700">Balance: ₹{stats.total_purchase_balance_due}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OverView;
