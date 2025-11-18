import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const VendorDashView = () => {
  const [stats, setStats] = useState({
    total_vendors: 0,
    active_vendors: 0,
    inactive_vendors: 0,
  });

  // Fetch vendor stats from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/vendor-stats/');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching vendor stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Pie chart data for vendor status (Active vs Inactive)
  const statusData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [stats.active_vendors, stats.inactive_vendors],
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
          Vendor Overview
        </h1>
      </div>

      <div className="p-6">
        {/* Vendor Stats Divs */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 ">
          {/* Total Vendors */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Vendors</h2>
            <p className="text-3xl text-blue-600">{stats.total_vendors}</p>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className='mt-8'>
          <div className="grid grid-cols-1 gap-4 overflow-y-auto h-[60vh] custom-scrollbar">
            {/* Active vs Inactive Vendors */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Active vs Inactive Vendors</h2>

              {/* Resize the pie chart for a smaller, compact view */}
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Pie data={statusData} />
              </div>
              {/* Active and Inactive count on top */}
              <div className="flex justify-between m-4">
                <span className="text-sm text-gray-600">Active: {stats.active_vendors}</span>
                <span className="text-sm text-gray-600">Inactive: {stats.inactive_vendors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashView;
