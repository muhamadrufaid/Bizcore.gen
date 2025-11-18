import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaxDashView = () => {
  const [stats, setStats] = useState({
    tax_status_paid: 0,
    tax_status_unpaid: 0,
    tax_status_paid_sum: 0,
    tax_status_unpaid_sum: 0,
    total_input_tax: 0,
    total_output_tax: 0,
    total_payable_tax: 0,
  });

  // Fetch statistics data from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tax-stats/');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching tax status stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Doughnut chart data for tax status (Paid vs Unpaid)
  const taxStatusData = {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        data: [stats.tax_status_paid, stats.tax_status_unpaid],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      {/* Header Section */}
      <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
        <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
          Tax Overview
        </h1>
      </div>

      <div className="p-6">
        {/* Vendor Stats Divs */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Total Vendors */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Payable Tax</h2>
            <p className="text-3xl text-blue-600">{stats.total_payable_tax}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Tax Paid</h2>
            <p className="text-3xl text-green-600">{stats.tax_status_paid_sum}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Tax Unpaid</h2>
            <p className="text-3xl text-red-600">{stats.tax_status_unpaid_sum}</p>
          </div>
        </div>

        {/* Tax Status Doughnut Chart */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md overflow-y-auto h-[60vh] custom-scrollbar">
          <h2 className="font-semibold text-xl text-gray-700 mb-4">Tax Status (Paid vs Unpaid)</h2>
          <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
            <Doughnut data={taxStatusData} />
          </div>
          {/* Display the sum of payable taxes */}
          <div className="flex justify-between m-4">
            <span className="text-sm text-gray-600">Paid : {stats.tax_status_paid}</span>
            <span className="text-sm text-gray-600">Unpaid : {stats.tax_status_unpaid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDashView;
