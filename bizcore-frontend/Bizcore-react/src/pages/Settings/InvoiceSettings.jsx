import React, { useState } from 'react';
import { SaveAll } from 'lucide-react';


const InvoiceSettings = ({ }) => {

    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center pr-2 justify-between bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <h1 className="text-2xl pl-2 font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Invoice Settings
                    </h1>
                </div>
                <div className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <SaveAll className='w-5 h-5' />
                    <button className=''>
                        Save Changes
                    </button>
                </div>
            </div>

            <div className='m-4 '>
                <div className='flex flex-col gap-2 p-4 rounded-lg bg-white overflow-x-auto max-h-140  custom-scrollbar'>
                    <div className='flex flex-col gap-2 '>
                        <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                            {/* Label for Print Option */}
                            <label htmlFor="printOption" className="text-sm font-medium">
                                Print Option
                            </label>

                            {/* Toggle Switch */}
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="mr-2 text-sm">{isChecked ? 'On' : 'Off'}</span>
                                <input
                                    type="checkbox"
                                    id="printOption"
                                    checked={isChecked}
                                    onChange={handleToggle}
                                    className="toggle-checkbox hidden"
                                />
                                <span className="toggle-label w-10 h-4 bg-gray-500 rounded-full  inline-block relative">
                                    <span
                                        className={`dot absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isChecked ? 'translate-x-6' : ''}`}
                                    ></span>
                                </span>
                            </label>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                            {/* Label for Print Option */}
                            <label htmlFor="printOption" className="text-sm font-medium">
                                Share Via Whats App
                            </label>

                            {/* Toggle Switch */}
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="mr-2 text-sm">{isChecked ? 'On' : 'Off'}</span>
                                <input
                                    type="checkbox"
                                    id="printOption"
                                    checked={isChecked}
                                    onChange={handleToggle}
                                    className="toggle-checkbox hidden"
                                />
                                <span className="toggle-label w-10 h-4 bg-gray-500 rounded-full  inline-block relative">
                                    <span
                                        className={`dot absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isChecked ? 'translate-x-6' : ''}`}
                                    ></span>
                                </span>
                            </label>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                            {/* Label for Print Option */}
                            <label htmlFor="printOption" className="text-sm font-medium">
                                Share Via Email
                            </label>

                            {/* Toggle Switch */}
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="mr-2 text-sm">{isChecked ? 'On' : 'Off'}</span>
                                <input
                                    type="checkbox"
                                    id="printOption"
                                    checked={isChecked}
                                    onChange={handleToggle}
                                    className="toggle-checkbox hidden"
                                />
                                <span className="toggle-label w-10 h-4 bg-gray-500 rounded-full  inline-block relative">
                                    <span
                                        className={`dot absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isChecked ? 'translate-x-6' : ''}`}
                                    ></span>
                                </span>
                            </label>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                            {/* Label for Print Option */}
                            <label htmlFor="printOption" className="text-sm font-medium">
                                Invoice GSTIN
                            </label>

                            {/* Toggle Switch */}
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="mr-2 text-sm">{isChecked ? 'On' : 'Off'}</span>
                                <input
                                    type="checkbox"
                                    id="printOption"
                                    checked={isChecked}
                                    onChange={handleToggle}
                                    className="toggle-checkbox hidden"
                                />
                                <span className="toggle-label w-10 h-4 bg-gray-500 rounded-full  inline-block relative">
                                    <span
                                        className={`dot absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isChecked ? 'translate-x-6' : ''}`}
                                    ></span>
                                </span>
                            </label>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                            {/* Label for Print Option */}
                            <label htmlFor="printOption" className="text-sm font-medium">
                                Invoice PAN
                            </label>

                            {/* Toggle Switch */}
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="mr-2 text-sm">{isChecked ? 'On' : 'Off'}</span>
                                <input
                                    type="checkbox"
                                    id="printOption"
                                    checked={isChecked}
                                    onChange={handleToggle}
                                    className="toggle-checkbox hidden"
                                />
                                <span className="toggle-label w-10 h-4 bg-gray-500 rounded-full  inline-block relative">
                                    <span
                                        className={`dot absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isChecked ? 'translate-x-6' : ''}`}
                                    ></span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className='flex items-center justify-between border border-gray-300 p-3 rounded-md'>
                        <div className='flex '>
                            <p className='font-semibold'>Bank Name : None <span className='pl-10'>Acc No: None</span></p>
                        </div>
                        <button className='bg-blue-400 px-4 py-1 rounded-md text-white'>
                            Select Bank
                        </button>
                        <button className='bg-blue-400 px-4 py-1 rounded-md text-white'>
                            Change Bank
                        </button>
                    </div>
                    <div className='p-1 '>
                        <div className='flex flex-col pb-2'>
                            <label className='text-md pl-1 pb-1 font-semibold'>Instructions</label>
                            <textarea
                                type="text"
                                className='p-4 border border-gray-300  text-gray-600 rounded-md hover:border-gray-600'
                                placeholder='Enter instructions here'
                                rows="2"
                            />
                        </div>
                        <div className='flex flex-col pb-2'>
                            <label className='text-md pl-1 pb-1 font-semibold'>Terms and Conditions</label>
                            <textarea
                                className='p-4 border border-gray-300 text-gray-600 rounded-md hover:border-gray-600'
                                placeholder='Enter terms and conditions here'
                                rows="5" // You can adjust the number of rows as needed
                            />
                        </div>
                        <div className='flex justify-between gap-10'>
                            <div className='flex flex-col w-full'>
                                <div className='flex flex-col'>
                                    <label className='text-md pl-1 pb-1 font-semibold'>Digital Signature</label>
                                    <p className='border border-gray-300 rounded-md h-45 p-2'>Upload Signature here</p>
                                </div>
                                <div className="flex justify-center pt-1 items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="invoiceRadio"
                                        name="invoiceOption"
                                        value="invoice"
                                        className="form-radio w-4 h-4 text-blue-600"
                                    />
                                    <label className="text-sm">Select this as digital sign</label>
                                </div>
                            </div>
                            <div className='flex items-center pt-5'>
                                <p className='text-center text-lg font-semibold'>OR</p>
                            </div>
                            <div className='flex flex-col w-full'>
                                <div className='flex flex-col'>
                                    <label className='text-md pl-1 pb-1 font-semibold'>Digital Signature As</label>
                                    <p className='border border-gray-300 rounded-md h-45 p-2'>This is computer generated bill no signature needed</p>
                                </div>
                                <div className="flex justify-center pt-1 items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="invoiceRadio"
                                        name="invoiceOption"
                                        value="invoice"
                                        className="form-radio w-4 h-4 text-blue-600"
                                    />
                                    <label className="text-sm">Select this as digital sign</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceSettings

