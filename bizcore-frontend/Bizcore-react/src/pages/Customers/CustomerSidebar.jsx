import React from 'react'
import { BookUser, ChartPie } from 'lucide-react';
import { useState } from 'react';

const CustomerSidebar = ({ setActiveSection }) => {

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
                >Customers Directory</h1>
            </div>
            <hr className='text-white w-full' />


            <div className='flex flex-col pb-20'>
                <button
                    onClick={() => setActiveSection('customer-view')}
                    className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                    <BookUser />
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,  // Fixed typo: "fontWeightt" to "fontWeight"
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'
                    >
                        Customers
                    </h1>
                </button>
                <button
                    onClick={() => setActiveSection('customer-dash')}
                    className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                    <ChartPie />
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,  // Fixed typo: "fontWeightt" to "fontWeight"
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'
                    >
                        Customer Insights
                    </h1>
                </button>

            </div>
            <div className='flex items-center custom-bottom-shadow p-1'>
                <h1
                    style={{
                        fontFamily: '"Zain", sans-serif',
                        fontWeightt: 800,
                        fontOpticalSizing: 'auto',
                        fontStyle: 'normal',
                    }}
                    className='text-white text-md ml-1'
                >Vendor Directory</h1>
            </div>
            <hr className='text-white w-full' />
            <div className='flex flex-col pb-20'>
                <button
                    onClick={() => setActiveSection('vendor-view')}
                    className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                    <BookUser />
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,  // Fixed typo: "fontWeightt" to "fontWeight"
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'
                    >
                        Vendors
                    </h1>
                </button>
                <button
                    onClick={() => setActiveSection('vendor-dash')}
                    className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                    <ChartPie />
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,  // Fixed typo: "fontWeightt" to "fontWeight"
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'
                    >
                        Vendor Insights
                    </h1>
                </button>

            </div>

        </div>
    )
}

export default CustomerSidebar
