import React, { useState, useEffect } from 'react';
import { Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, Tooltip, Legend, ArcElement, Title } from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Registering the necessary components for Chart.js
ChartJS.register(
  RadialLinearScale, // Registering the radialLinear scale for radar charts
  Tooltip,
  Legend,
  ArcElement,
  Title
);

const InvoiceDashView = () => {
  const [stats, setStats] = useState({
    total_invoice: 0,
    total_active_invoices: 0,
    total_returned_invoices: 0,
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
    payment_status_unpaid: 0,
    payment_status_paid: 0,
    payment_status_partial: 0,
    total_input_tax: 0,
    total_output_tax: 0,
    total_payable_tax: 0,
  });

  // Fetch statistics data from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/invoice-stats/');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Status chart (Circular Bar Chart for status)
  const statusData = {
    labels: ['Active', 'Returned', 'Cancelled'],
    datasets: [
      {
        data: [stats.total_active_invoices, stats.total_cancelled_invoices, stats.total_returned_invoices],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
      },
    ],
  };

  // Tax Status chart (Pie Chart for tax status)
  const taxStatusData = {
    labels: ['Unpaid', 'Paid'],
    datasets: [
      {
        data: [stats.tax_status_unpaid, stats.tax_status_paid],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Payment Status chart (Pie Chart for tax status)
  const paymentStatusData = {
    labels: ['Unpaid', 'Paid', 'partial'],
    datasets: [
      {
        data: [stats.payment_status_unpaid, stats.payment_status_paid, stats.payment_status_partial],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
      },
    ],
  };

  // Invoice Type chart (Donut Chart for invoice type)
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

  // Mode of Supply chart (Pie Chart for mode of supply)
  const modeOfSupplyData = {
    labels: ['Direct', 'Delivery'],
    datasets: [
      {
        data: [stats.mode_of_supply_direct, stats.mode_of_supply_delivery],
        backgroundColor: ['#36A2EB', '#FFCD56'],
        hoverBackgroundColor: ['#36A2EB', '#FFCD56'],
      },
    ],
  };

  // Transportation Mode chart (Process Circle for transportation mode)
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

  // GST Type chart (Donut Chart for gst type)
  const gstTypeData = {
    labels: ['CGST SGST', 'IGST'],
    datasets: [
      {
        data: [stats.gst_type_cgst_sgst, stats.gst_type_igst],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div>
      <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
        <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
          Invoice Overview
        </h1>
      </div>

      <div className="m-6">

        {/* Vendor Stats Divs */}
        <div className="grid grid-cols-4 gap-6">
          {/* Total Vendors */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total  Invoice</h2>
            <p className="text-3xl text-blue-600">{stats.total_invoice}</p>
          </div>
          {/* Total Vendors */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Input Paid</h2>
            <p className="text-3xl text-red-500">{stats.total_input_tax}</p>
          </div>
          {/* Total Vendors */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Output Credited</h2>
            <p className="text-3xl text-green-500">{stats.total_output_tax}</p>
          </div>
          {/* Total Vendors */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Payable Tax</h2>
            <p className="text-3xl font-semibold text-yellow-600">{stats.total_payable_tax}</p>
          </div>
        </div>

        <div className='mt-6'>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-[60vh] custom-scrollbar">
            {/* Status Chart */}
            <div className=" bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Invoice Status</h2>
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Doughnut data={statusData} />
                <div className="flex justify-between m-4">
                  <span className="text-sm text-gray-600">Active: {stats.total_active_invoices}</span>
                  <span className="text-sm text-gray-600">Returned: {stats.total_returned_invoices}</span>
                  <span className="text-sm text-gray-600">Cancelled: {stats.total_cancelled_invoices}</span>
                </div>
              </div>
            </div>

            {/* Tax Status Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Tax Status</h2>
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Pie data={taxStatusData} />
                <div className="flex justify-between m-4">
                  <span className="text-sm text-gray-600">Unpaid: {stats.tax_status_unpaid}</span>
                  <span className="text-sm text-gray-600">Paid: {stats.tax_status_paid}</span>
                </div>
              </div>
            </div>

            {/* Invoice Type Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Invoice Type</h2>
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Doughnut data={invoiceTypeData} />
                <div className="flex justify-between m-4">
                  <span className="text-sm text-gray-600">Retail: {stats.invoice_type_retailer}</span>
                  <span className="text-sm text-gray-600">Wholesale: {stats.invoice_type_wholesaler}</span>
                </div>
              </div>
            </div>

            {/* Mode of Supply Chart */}
            <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Mode of Supply</h2>
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Pie data={modeOfSupplyData} />
                <div className="flex justify-between m-4">
                  <span className="text-sm text-gray-600">Direct: {stats.mode_of_supply_direct}</span>
                  <span className="text-sm text-gray-600">Delivery: {stats.mode_of_supply_delivery}</span>
                </div>
              </div>
            </div>

            {/* Transportation Mode Chart */}
            <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Transportation Mode</h2>
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <PolarArea data={transportationModeData} />
                <div className="flex justify-between m-4">
                  <span className="text-sm text-gray-600">None: {stats.transportation_mode_none}</span>
                  <span className="text-sm text-gray-600">Road: {stats.transportation_mode_road}</span>
                  <span className="text-sm text-gray-600">Rail: {stats.transportation_mode_rail}</span>
                  <span className="text-sm text-gray-600">Air: {stats.transportation_mode_air}</span>
                </div>
              </div>
            </div>

            {/* GST Type Chart */}
            <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">GST Type</h2>
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Doughnut data={gstTypeData} />
                <div className="flex justify-between m-4">
                  <span className="text-sm text-gray-600">CGST+SGST: {stats.gst_type_cgst_sgst}</span>
                  <span className="text-sm text-gray-600">IGST: {stats.gst_type_igst}</span>
                </div>
              </div>
            </div>

            {/* Tax Status Chart */}
            <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Payment Status</h2>
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Pie data={paymentStatusData} />
                <div className="flex justify-between m-4">
                  <span className="text-sm text-gray-600">Unpaid: {stats.payment_status_unpaid}</span>
                  <span className="text-sm text-gray-600">Paid: {stats.payment_status_paid}</span>
                  <span className="text-sm text-gray-600">Partial: {stats.payment_status_partial}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashView;
