import React, { useState, useEffect } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registering Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DraftDashView = () => {
    const [stats, setStats] = useState({
        total_drafts: 0,
        total_draft_invoices: 0,
        total_finalized_invoices: 0,
        total_cancelled_invoices: 0,
        tax_status_unpaid: 0,
        tax_status_paid: 0,
        invoice_type_retailer: 0,
        invoice_type_wholesaler: 0,
        mode_of_supply_direct: 0,
        mode_of_supply_delivery: 0,
        transportation_mode_none: 0,
        transportation_mode_road: 0,
        transportation_mode_rail: 0,
        transportation_mode_air: 0,
        gst_type_cgst_sgst: 0,
        gst_type_igst: 0,
    });

    // Fetch vendor stats from the backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/draft-invoice-stats/');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching vendor stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Draft Invoice Status (Circular Bar Chart)
    const statusData = {
        labels: ['Draft', 'Finalized', 'Cancelled'],
        datasets: [
            {
                data: [stats.total_draft_invoices, stats.total_finalized_invoices, stats.total_cancelled_invoices],
                backgroundColor: ['#36A2EB', '#FFCD56', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FFCD56', '#FF6384'],
            },
        ],
    };

    // Tax Status (Pie Chart)
    const taxStatusData = {
        labels: ['Unpaid', 'Paid'],
        datasets: [
            {
                data: [stats.tax_status_unpaid, stats.tax_status_paid],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            },
        ],
    };

    // Invoice Type (Donut Bar Chart)
    const invoiceTypeData = {
        labels: ['Retail', 'Wholesale'],
        datasets: [
            {
                data: [stats.invoice_type_retailer, stats.invoice_type_wholesaler],
                backgroundColor: ['#4BC0C0', '#FFCD56'],
                hoverBackgroundColor: ['#4BC0C0', '#FFCD56'],
            },
        ],
    };

    // Mode of Supply (Pie Chart)
    const modeOfSupplyData = {
        labels: ['Direct', 'Delivery'],
        datasets: [
            {
                data: [stats.mode_of_supply_direct, stats.mode_of_supply_delivery],
                backgroundColor: ['#36A2EB', '#FF9F40'],
                hoverBackgroundColor: ['#36A2EB', '#FF9F40'],
            },
        ],
    };

    // Transportation Mode (Process Circle)
    const transportationModeData = {
        labels: ['None', 'Road', 'Rail', 'Air'],
        datasets: [
            {
                data: [stats.transportation_mode_none, stats.transportation_mode_road, stats.transportation_mode_rail, stats.transportation_mode_air],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCD56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCD56', '#4BC0C0'],
            },
        ],
    };

    // GST Type (Donut Bar Chart)
    const gstTypeData = {
        labels: ['CGST SGST', 'IGST'],
        datasets: [
            {
                data: [stats.gst_type_cgst_sgst, stats.gst_type_igst],
                backgroundColor: ['#FF9F40', '#FFCD56'],
                hoverBackgroundColor: ['#FF9F40', '#FFCD56'],
            },
        ],
    };

    return (
        <div>
            {/* Header Section */}
            <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
                <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Draft Invoice Overview
                </h1>
            </div>

            <div className="p-4">
                {/* Vendor Stats Divs */}
                <div className="grid grid-cols-1 pb-6">
                    {/* Total Vendors */}
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg text-gray-700">Total Draft Invoice</h2>
                        <p className="text-3xl text-blue-600">{stats.total_drafts}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto h-[60vh] custom-scrollbar">

                    {/* Circular Bar Chart for Draft Status */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">Invoice Status</h2>
                        <Doughnut data={statusData} />
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Draft: {stats.total_draft_invoices}</span>
                            <span className="text-sm text-gray-600">Finalized: {stats.total_finalized_invoices}</span>
                            <span className="text-sm text-gray-600">Cancelled: {stats.total_cancelled_invoices}</span>
                        </div>
                    </div>

                    {/* Pie Chart for Tax Status */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">Tax Status</h2>
                        <Pie data={taxStatusData} />

                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Unpaid: {stats.tax_status_unpaid}</span>
                            <span className="text-sm text-gray-600">Paid: {stats.tax_status_paid}</span>
                        </div>
                    </div>

                    {/* Donut Bar Chart for Invoice Type */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">Invoice Type</h2>
                        <Doughnut data={invoiceTypeData} />
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Retail: {stats.invoice_type_retailer}</span>
                            <span className="text-sm text-gray-600">Wholesale: {stats.invoice_type_wholesaler}</span>
                        </div>
                    </div>

                    {/* Pie Chart for Mode of Supply */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">Mode of Supply</h2>
                        <Pie data={modeOfSupplyData} />
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">Delivery: {stats.mode_of_supply_delivery}</span>
                            <span className="text-sm text-gray-600">Direct: {stats.mode_of_supply_direct}</span>
                        </div>
                    </div>

                    {/* Process Circle for Transportation Mode */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">Transportation Mode</h2>
                        <Doughnut data={transportationModeData} />
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">None: {stats.transportation_mode_none}</span>
                            <span className="text-sm text-gray-600">Road: {stats.transportation_mode_road}</span>
                            <span className="text-sm text-gray-600">Rail: {stats.transportation_mode_rail}</span>
                            <span className="text-sm text-gray-600">Air: {stats.transportation_mode_air}</span>
                        </div>
                    </div>

                    {/* Donut Bar Chart for GST Type */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-semibold text-xl text-gray-700 mb-4">GST Type</h2>
                        <Doughnut data={gstTypeData} />
                        <div className="flex justify-between m-4">
                            <span className="text-sm text-gray-600">CGST+SGST: {stats.gst_type_cgst_sgst}</span>
                            <span className="text-sm text-gray-600">IGST: {stats.gst_type_igst}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraftDashView;
