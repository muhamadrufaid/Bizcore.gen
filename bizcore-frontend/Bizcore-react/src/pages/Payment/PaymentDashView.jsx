import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentDashView = () => {
    const [stats, setStats] = useState({
        payment_status_unpaid: 0,
        payment_status_paid: 0,
        payment_status_partial: 0,
        payment_status_reversed: 0,
        payment_status_failed: 0,

        payment_mode_cash: 0,
        payment_mode_card: 0,
        payment_mode_upi: 0,
        payment_mode_bank: 0,
        payment_mode_wallet: 0,
        payment_mode_hybrid: 0,
        payment_mode_credit: 0,

        cash_total: 0,
        card_total: 0,
        upi_total: 0,
        bank_total: 0,
        credit_total: 0,
        wallet_total: 0,
        hybrid_total: 0,

        paid_total: 0,
        unpaid_total: 0,
        partial_total: 0,
        reversed_total: 0,
        failed_total: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/payment-stats/');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching payment stats:", error);
            }
        };
        fetchStats();
    }, []);

    // Data for payment mode Pie chart
    const paymentModeData = {
        labels: ['Cash', 'Card', 'Bank', 'Wallet', 'Credit', 'Hybrid', 'UPI'],
        datasets: [
            {
                data: [stats.payment_mode_cash,
                stats.payment_mode_card,
                stats.payment_mode_wallet,
                stats.payment_mode_bank,
                stats.payment_mode_credit,
                stats.payment_mode_upi,
                stats.payment_mode_hybrid],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56', '#4BC0C0', '#FF9F40', '#C9CBCF', '#D4AF37'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCD56', '#4BC0C0', '#FF9F40', '#C9CBCF', '#D4AF37'],
            },
        ],
    };

    // Data for payment status Pie chart
    const paymentStatusData = {
        labels: ['Paid', 'Unpaid', 'Partial', 'Reversed', 'Failed'],
        datasets: [
            {
                data: [stats.payment_status_failed,
                stats.payment_status_paid,
                stats.payment_status_partial,
                stats.payment_status_reversed,
                stats.payment_status_unpaid],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56', '#4BC0C0', '#FF9F40'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCD56', '#4BC0C0', '#FF9F40'],
            },
        ],
    };

    return (
        <div>
            {/* Header Section */}
            <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
                <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Payment Overview
                </h1>
            </div>

            <div className="p-6">
                {/* Payment Stats Divs */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-6 ">
                    {/* Total Payment */}
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg text-gray-700">Total Paid</h2>
                        <p className="text-3xl text-blue-600">{stats.paid_total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg text-gray-700">Total Partial</h2>
                        <p className="text-3xl text-blue-600">{stats.partial_total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg text-gray-700">Total Unpaid</h2>
                        <p className="text-3xl text-blue-600">{stats.unpaid_total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg text-gray-700">Total Reversed</h2>
                        <p className="text-3xl text-blue-600">{stats.reversed_total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg text-gray-700">Total Failed</h2>
                        <p className="text-3xl text-blue-600">{stats.failed_total}</p>
                    </div>

                </div>

                <div className="grid mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 overflow-y-auto h-[60vh] custom-scrollbar">
                    {/* Payment Mode Pie Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">Payment Mode</h2>
                        <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                            <Pie data={paymentModeData} />
                        </div>
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Cash : {stats.payment_mode_cash}</span>
                            <span className="text-sm text-gray-600">Card : {stats.payment_mode_card}</span>
                            <span className="text-sm text-gray-600">Hybrid : {stats.payment_mode_hybrid}</span>
                            <span className="text-sm text-gray-600">Wallet : {stats.payment_mode_wallet}</span>
                        </div>
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Bank : {stats.payment_mode_bank}</span>
                            <span className="text-sm text-gray-600">Credit : {stats.payment_mode_credit}</span>
                            <span className="text-sm text-gray-600">Upi : {stats.payment_mode_upi}</span>
                        </div>
                    </div>

                    {/* Payment Status Pie Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">Payment Status</h2>
                        <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                            <Pie data={paymentStatusData} />
                        </div>
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Paid : {stats.payment_status_paid}</span>
                            <span className="text-sm text-gray-600">Unpaid : {stats.payment_status_unpaid}</span>
                            <span className="text-sm text-gray-600">Partial : {stats.payment_status_partial}</span>

                        </div>
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Reversed: {stats.payment_status_reversed}</span>
                            <span className="text-sm text-gray-600">Failed : {stats.payment_status_failed}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PaymentDashView;
