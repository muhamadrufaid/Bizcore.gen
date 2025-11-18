import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PurchaseDashView = () => {
  const [stats, setStats] = useState({
    pending_count: 0,
    partial_count: 0,
    paid_count: 0,
    grand_total_sum: 0,
    amount_paid_sum: 0,
    balance_due_sum: 0,
  });

  useEffect(() => {status
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/purchase-stats/');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching purchase stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Data for purchase status Doughnut chart
  const purchaseStatusData = {
    labels: ['Paid', 'Partial', 'Pending'],
    datasets: [
      {
        data: [stats.paid_count, stats.partial_count, stats.pending_count],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
      },
    ],
  };


  return (
    <div>
      {/* Header Section */}
      <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
        <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
          Purchase Overview
        </h1>
      </div>

      <div className="p-6">
        {/* Vendor Stats Divs */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Total Vendors */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Purchase Total</h2>
            <p className="text-3xl text-blue-600">{stats.grand_total_sum}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Amount Paid</h2>
            <p className="text-3xl text-green-600">{stats.amount_paid_sum}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Balance Due</h2>
            <p className="text-3xl text-red-600">{stats.balance_due_sum}</p>
          </div>
        </div>

        {/* Tax Status Doughnut Chart */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md overflow-y-auto h-[60vh] custom-scrollbar">
          <h2 className="font-semibold text-xl text-gray-700 mb-4"></h2>
          <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
            <Pie data={purchaseStatusData} />
          </div>
          {/* Display the sum of payable taxes */}
          <div className="flex justify-between m-4">
            <span className="text-sm text-gray-600">Paid : {stats.paid_count}</span>
            <span className="text-sm text-gray-600">Pending : {stats.pending_count}</span>
            <span className="text-sm text-gray-600">Partial : {stats.partial_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDashView;
