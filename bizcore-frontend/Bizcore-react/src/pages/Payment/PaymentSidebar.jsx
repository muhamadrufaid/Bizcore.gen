import React from 'react'
import { IndianRupee, ChartPie } from 'lucide-react';

const PaymentSidebar = ({ setActiveSection }) => {
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
                >Payment Directory</h1>
            </div>
            <hr className='text-white w-full' />


            <div className='flex flex-col pb-20'>
                <button
                    onClick={() => setActiveSection('payment-view')}
                    className="flex items-center space-x-2 p-2 pl-2 text-lg hover:bg-gray-400 w-full"> {/* flex ensures inline layout */}
                    <IndianRupee />
                    <h1
                        style={{
                            fontFamily: '"Zain", sans-serif',
                            fontWeight: 400,  // Fixed typo: "fontWeightt" to "fontWeight"
                            fontOpticalSizing: 'auto',
                            fontStyle: 'normal',
                        }}
                        className='text-white text-sm mt-1'
                    >
                        Payment
                    </h1>
                </button>
                <button
                    onClick={() => setActiveSection('payment-dash')}
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
                        Payment Insight
                    </h1>
                </button>
            </div>
        </div>
    )
}

export default PaymentSidebar
