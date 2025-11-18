import React, { useState } from 'react'
import { ChartNoAxesCombined, ChevronDown, ChartPie } from 'lucide-react';

const OverViewSidebar = ({ setActiveSection }) => {

    const [isInsightsOpen, setIsInsightsViewOpen] = useState(false); // State for toggling the dropdown

    const toggleInsightsView = () => {
        setIsInsightsViewOpen(!isInsightsOpen); // Toggle the visibility of Add and Edit buttons
    };

    return (
        <div className='w-46'>
            <div className='flex items-center custom-bottom-shadow p-1'>
                <h1
                    style={{
                        fontFamily: '"Zain", sans-serif',
                        fontWeightt: 800,
                        fontOpticalSizing: 'auto',
                        fontStyle: 'normal',
                    }}
                    className='text-white text-md ml-1'
                >OverView</h1>
            </div>
            <hr className='text-white w-full' />


            <div className='flex flex-col pb-20'>
                <button
                    onClick={() => setActiveSection('analytics-view')}
                    className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                    <ChartNoAxesCombined />
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400, 
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'
                    >
                        Analytics
                    </h1>
                </button>
                <button
                    onClick={toggleInsightsView}
                    className="flex items-center justify-between space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full">
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'>
                        Insights
                    </h1>
                    <ChevronDown />
                </button>

                {/* Additional buttons under Staff Account */}
                {isInsightsOpen && (
                    <div className="flex flex-col text-sm bg-blue-900">
                        <button
                            onClick={() => setActiveSection("product-dash")}
                            className="flex items-center gap-2 p-3 text-white hover:bg-gray-400 w-full">
                            Product
                        </button>
                        <button
                            onClick={() => setActiveSection("purchase-dash")}
                            className="flex items-center gap-2 p-3 text-white p-2 hover:bg-gray-400 w-full">
                            Purchase
                        </button>
                        <button
                            onClick={() => setActiveSection("vendor-dash")}
                            className="flex items-center gap-2 p-3 text-white p-2 hover:bg-gray-400 w-full">
                            Vendor
                        </button>
                        <button
                            onClick={() => setActiveSection("customer-dash")}
                            className="flex items-center gap-2 p-3 text-white p-2 hover:bg-gray-400 w-full">
                            Customer
                        </button>
                        <button
                            onClick={() => setActiveSection("invoice-dash")}
                            className="flex items-center gap-2 p-3 text-white p-2 hover:bg-gray-400 w-full">
                            Sales
                        </button>
                         <button
                            onClick={() => setActiveSection("tax-dash")}
                            className="flex items-center gap-2 p-3 text-white p-2 hover:bg-gray-400 w-full">
                            Taxation
                        </button>
                        <button
                            onClick={() => setActiveSection("payment-dash")}
                            className="flex items-center gap-2 p-3 text-white p-2 hover:bg-gray-400 w-full">
                            Transaction
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OverViewSidebar
