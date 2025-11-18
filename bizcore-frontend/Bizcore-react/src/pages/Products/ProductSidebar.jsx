import React from 'react'
import { Package, ChartPie, GripVertical } from 'lucide-react';


const ProductSidebar = ({ setActiveSection }) => {
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
                >Products Directory</h1>
            </div>
            <hr className='text-white w-full' />

            <div className='flex flex-col'>
                <div className='pb-20'>
                    <button
                        onClick={() => setActiveSection("product-view")}
                        className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                        <Package />
                        <h1
                            style={{
                                fontFamily: '"Zain", sans-serif',
                                fontWeight: 400,  // Fixed typo: "fontWeightt" to "fontWeight"
                                fontOpticalSizing: 'auto',
                                fontStyle: 'normal',
                            }}
                            className='text-white text-sm mt-1'
                        >
                            Products
                        </h1>
                    </button>
                    <button
                        onClick={() => setActiveSection("product-dash")}
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
                            Product Insights
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
                    >Categories Directory</h1>
                </div>
                <hr className='text-white w-full' />


                <button
                    onClick={() => setActiveSection("category-view")}
                    className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                    <GripVertical />
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,  // Fixed typo: "fontWeightt" to "fontWeight"
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'
                    >
                        Categories
                    </h1>
                </button>
            </div>
        </div>
    )
}

export default ProductSidebar
