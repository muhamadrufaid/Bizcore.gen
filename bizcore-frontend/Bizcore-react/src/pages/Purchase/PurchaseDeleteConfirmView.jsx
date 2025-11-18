import React from 'react';

const PurchaseDeleteConfirmView = ({ removeItem, closePopupDeleteConfirm, item }) => {
    return (
        <div className="fixed inset-0 bg-opacity-10 z-50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
                <h2 className="text-xl font-semibold text-gray-700">
                    Are you sure you want to delete this <br />
                    <span className="font-semibold text-blue-500">{item?.name}</span>
                    <span className="text-blue-500">?</span>
                </h2>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={closePopupDeleteConfirm}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            removeItem();  // Call the removeItem function when confirmed
                            closePopupDeleteConfirm();  // Close the popup
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDeleteConfirmView;
