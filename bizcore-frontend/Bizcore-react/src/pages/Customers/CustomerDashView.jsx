import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChevronLeft } from 'lucide-react';

// Register the required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerDashView = () => {

  const [stats, setStats] = useState({
    total_customers: 0,
    active_customers: 0,
    inactive_customers: 0,
    individual_customers: 0,
    business_customers: 0,
  });


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/customer-stats/');

        if (!response.ok) {
          console.error("Error fetching stats:", response.statusText);
          return;
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching customer stats:", error);
      }
    };
    fetchStats();
  }, []);


  // Pie chart data for product status
  const statusData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [
          stats.active_customers,
          stats.inactive_customers,
        ],
        backgroundColor: ['#e6b113cf', '#FF6384'],
        hoverBackgroundColor: ['#e6b113cf', '#FF6384'],
      },
    ],
  };

  // Pie chart data for product status
  const customerTypeData = {
    labels: ['Individual', 'Business'],
    datasets: [
      {
        data: [
          stats.individual_customers,
          stats.business_customers,
        ],
        backgroundColor: ['#5aff28d1', '#728e15ff'],
        hoverBackgroundColor: ['#5aff28d1', '#728e15ff'],
      },
    ],
  };

  return (
    <div>
      {/* Header Section */}
      <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
        <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
          Customer Overview
        </h1>
      </div>

      <div className="p-6">
        {/* Customer Stats Divs */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Total Customers */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Customers</h2>
            <p className="text-3xl text-blue-600">{stats.total_customers}</p>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className='mt-6'>
          <div className='grid grid-cols-2 gap-4 overflow-y-auto h-[60vh] custom-scrollbar'>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Customer Status</h2>

              {/* Resize the pie chart for a smaller, compact view */}
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Pie data={statusData} />
              </div>
              {/* Active and Inactive count on top */}
              <div className="flex justify-between m-4">
                <span className="text-sm text-gray-600">Active: {stats.active_customers}</span>
                <span className="text-sm text-gray-600">Inactive: {stats.inactive_customers}</span>
              </div>
            </div>

            {/* Second Pie Chart Section: Individual vs Business */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-xl text-gray-700 mb-4">Customers types</h2>

              {/* Resize the pie chart for a smaller, compact view */}
              <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
                <Pie data={customerTypeData} />
              </div>
              {/* Business and Individual count on top */}
              <div className="flex justify-between m-4">
                <span className="text-sm text-gray-600">Business: {stats.business_customers}</span>
                <span className="text-sm text-gray-600">Individual: {stats.individual_customers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashView;
