import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ProductDashView = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    active_products: 0,
    inactive_products: 0,
    out_of_stock_products: 0,
    category_stats: {}
  });

  // Function to generate a random color
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };


  // Fetch statistics data from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/product-category-stats/');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching product stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Pie chart data for product status
  const statusData = {
    labels: ['Active', 'Inactive', 'Out of Stock'],
    datasets: [
      {
        data: [
          stats.active_products,
          stats.inactive_products,
          stats.out_of_stock_products
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
      },
    ],
  };

  // Generate unique colors for product categories
  const categoryLabels = Object.keys(stats.category_stats);
  const categoryColors = categoryLabels.map(() => generateRandomColor());

  // Pie chart data for product categories
  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        data: Object.values(stats.category_stats),
        backgroundColor: categoryColors,  // Use the generated unique colors
        hoverBackgroundColor: categoryColors,
      },
    ],
  };


  return (
    <div>
      {/* Header Section */}
      <div className="w-full h-14 flex items-center bg-white border-t border-gray-400">
        <h1 className="text-2xl font-semibold text-blue-700 p-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
          Product Overview
        </h1>
      </div>

      <div className="p-6">
        {/* Product Stats Divs */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Total Products */}
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="font-semibold text-lg text-gray-700">Total Products</h2>
            <p className="text-3xl text-blue-600">{stats.total_products}</p>
          </div>
        </div>

        <div className='mt-8'>
          <div className='grid grid-cols-2 gap-6 overflow-y-auto h-[60vh] custom-scrollbar'>
          {/* Pie Chart Section: Product Status */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-xl text-gray-700 mb-4">Product Status</h2>
            {/* Resize the pie chart for a smaller, compact view */}
            <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
              <Pie data={statusData} />
            </div>
            <div className="flex justify-between items-center m-4">
              <span className="text-sm text-gray-600">Active: {stats.active_products}</span>
              <span className="text-sm text-gray-600">Inactive: {stats.inactive_products}</span>
              <span className="text-sm text-gray-600">Out Of Stock: {stats.out_of_stock_products}</span>
            </div>
          </div>

          {/* Pie Chart Section: Product Categories */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-xl text-gray-700 mb-4">Product Categories</h2>
            {/* Resize the pie chart for a smaller, compact view */}
            <div className="w-full sm:w-72 md:w-96 lg:w-80 mx-auto">
              <Pie data={categoryData} />
            </div>
             <div className="grid grid-cols-3 gap-2 m-4">
              {categoryLabels.map((category, index) => (
                <span key={category} className="text-sm text-gray-600">{category}: {stats.category_stats[category]}</span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDashView;
