import React from 'react'
import { X } from 'lucide-react';

const CustomerCreditAddView = () => {
  return (
    <div>
      <div className='flex pl-20'>
        <h1 className='font-semibold text-xl p-4 text-blue-500'>Credit Applying</h1>
      </div>
      <div className='m-6 flex flex-col items-center'>
        <div className=''>
          <div className='flex justify-center items-center'>
            <div className='flex items-center justify-center gap-4'>
              <div className="flex flex-col">
                <label className="text-gray-600 pb-1 font-semibold text-sm">Credit Total</label>
                <input
                  type="text"
                  name="name"
                  className="border p-2 rounded-sm w-80 border-gray-400 text-gray-600"
                  placeholder="00"
                />
              </div>
              <div className="flex mt-5">
                <input
                  type="checkbox"
                  id="useCustomerAddress"
                  className="mr-2 w-5 h-5"
                />
              </div>

            </div>
          </div>

          <div className='flex mt-2'>
            <div className='flex'>
              <div className="flex flex-col">
                <label className="text-gray-600 pb-1 font-semibold text-sm">Enter Credit Amount </label>
                <input
                  type="text"
                  name="name"
                  className="border p-2 rounded-sm w-80 border-gray-400 text-gray-600"
                  placeholder="Enter withdraw amount"
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-center m-6'>
          <button className='border border-blue-700 px-6 py-2 rounded-md text-blue-700 hover:border-blue-400 hover:text-blue-400'>
            Apply Credit
          </button>
        </div>

      </div>
    </div>
  )
}

export default CustomerCreditAddView
