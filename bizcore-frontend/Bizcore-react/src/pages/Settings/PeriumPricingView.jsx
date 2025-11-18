import React from 'react';
import { Check, CircleCheck, X, CircleX } from 'lucide-react';

const PeriumPricingView = () => {
    return (
        <div className='bg-gray-50 overflow-x-auto h-166 custom-scrollbar p-10'>
            <div className="bg-gray-50 flex flex-col justify-center items-center">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-semibold text-blue-600">BizCore Billing Web App Pricing</h1>
                    <p className="text-lg text-gray-600 mt-2">Choose the plan that suits your business needs</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {/* Standard Plan */}
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center border border-gray-200 hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold text-gray-800">Standard</h2>
                        <p className="text-lg text-gray-500 mt-1">Basic features included</p>

                        <div className="mt-4">
                            <span className="text-4xl font-bold text-blue-600">₹699</span>
                            <p className="text-sm text-gray-500">6 Months</p>
                        </div>

                        <div className="mt-4">
                            <span className="text-4xl font-bold text-blue-600">₹999</span>
                            <p className="text-sm text-gray-500">1 Year</p>
                        </div>

                        {/* Features */}

                        <ul className="mt-6 text-left text-gray-700 flex flex-col gap-1">
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Billing
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Real-Time Tax
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Inventory Auto Management
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Business Analytics (Single View)
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Invoice Template
                            </li>
                            <li className="flex items-center text-gray-400 line-through">
                                <span className="text-red-500 mr-2"><CircleX /></span> Estimate Bill
                            </li>
                            <li className="flex items-center text-gray-400 line-through">
                                <span className="text-red-500 mr-2"><CircleX /></span> Real-Time Monitoring
                            </li>
                            <li className="flex items-center text-gray-400 line-through">
                                <span className="text-red-500 mr-2"><CircleX /></span> Multiple Bank Add to Invoice Display
                            </li>
                            <li className="flex items-center text-gray-400 line-through">
                                <span className="text-red-500 mr-2"><CircleX /></span> Payment Tracking (Partial Payment)
                            </li>
                        </ul>


                        {/* Button */}
                        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Choose Plan</button>
                    </div>

                    {/* Gold Plan */}
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center border border-gray-200 hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold text-gray-800">Gold</h2>
                        <p className="text-lg text-gray-500 mt-1">Pro Features Included</p>

                        <div className="mt-4">
                            <span className="text-4xl font-bold text-yellow-500">₹799</span>
                            <p className="text-sm text-gray-500">6 Months</p>
                        </div>

                        <div className="mt-4">
                            <span className="text-4xl font-bold text-yellow-500">₹1199</span>
                            <p className="text-sm text-gray-500">1 Year</p>
                        </div>

                        {/* Features */}
                        <ul className="mt-6 text-left text-gray-700 flex flex-col gap-1">
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Billing
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Real-Time Tax
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Inventory Auto Management
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Business Analytics (Single View)
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Invoice Template
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Estimate Bill
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Real-Time Monitoring
                            </li>
                            <li className="flex items-center text-gray-400 line-through">
                                <span className="text-red-500 mr-2"><CircleX /></span> Multiple Bank Add to Invoice Display
                            </li>
                            <li className="flex items-center text-gray-400 line-through">
                                <span className="text-red-500 mr-2"><CircleX /></span> Payment Tracking (Partial Payment)
                            </li>
                        </ul>

                        {/* Button */}
                        <button className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">Choose Plan</button>
                    </div>

                    {/* Diamond Plan */}
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center border border-gray-200 hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold text-gray-800">Diamond</h2>
                        <p className="text-lg text-gray-500 mt-1">Advanced Features Included</p>

                        <div className="mt-4">
                            <span className="text-4xl font-bold text-pink-600">₹899</span>
                            <p className="text-sm text-gray-500">6 Months</p>
                        </div>

                        <div className="mt-4">
                            <span className="text-4xl font-bold text-pink-600">₹1249</span>
                            <p className="text-sm text-gray-500">1 Year</p>
                        </div>

                        {/* Features */}
                        <ul className="mt-6 text-left text-gray-700 flex flex-col gap-1">
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Billing
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Real-Time Tax
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Inventory Auto Management
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Business Analytics (Single View)
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Invoice Template
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Estimate Bill
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Real-Time Monitoring
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Multiple Bank Add to Invoice Display
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2"><CircleCheck /></span> Payment Tracking (Partial Payment)
                            </li>
                        </ul>

                        {/* Button */}
                        <button className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">Choose Plan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriumPricingView;
