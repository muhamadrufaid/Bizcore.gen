// GstDelcarationTable.js
import React from 'react';

const GstDelcarationTable = ({ gstItems, gstType, subTotal }) => {
    // Calculate the totals for CGST, SGST, Total Tax, and Total Net Value
    const totals = gstItems.reduce(
        (acc, item) => {
            acc.cgst += item.cgstAmount;
            acc.sgst += item.sgstAmount;
            acc.igst += item.igstAmount;
            acc.totalTax += item.totalTax;
            acc.totalNetValue += item.taxableValue; // Accumulate Total Net Value here
            return acc;
        },
        { cgst: 0, sgst: 0, igst: 0, totalTax: 0, totalNetValue: 0 } // Initialize totalNetValue to 0
    );

    // Ensure totals.totalNetValue is a valid number and is not NaN
    const totalNetValue = isNaN(totals.totalNetValue) ? 0 : totals.totalNetValue;

    return (
        <div className="p-4">
            <h2 className="font-semibold text-xl">TAX Declaration</h2>
            <table className="border-collapse w-full border mt-2">
                <thead>
                    <tr>
                        <th rowSpan={2} className="text-center p-1 border">HSN/SAC</th>
                        <th rowSpan={2} className="text-center p-1 border">Qty</th>
                        <th rowSpan={2} className="text-center p-1 border">Taxable Value</th>

                        {/* Head 2 with sub-heads */}
                        {gstType === 'cgst_sgst' ? (
                            <>
                                <th colSpan={2} className="text-center p-1 border">CGST</th>
                                <th colSpan={2} className="text-center p-1 border">SGST</th>
                            </>
                        ) : gstType === 'igst' ? (
                            <th colSpan={2} className="text-center p-1 border">IGST</th>
                        ) : null}

                        <th rowSpan={2} className="text-center p-1 border">Total Tax Amount</th>
                    </tr>
                    <tr>
                        {gstType === 'cgst_sgst' && (
                            <>
                                <th className="text-center p-1 border">%</th>
                                <th className="text-center p-1 border">Amount</th>
                                <th className="text-center p-1 border">%</th>
                                <th className="text-center p-1 border">Amount</th>
                            </>
                        )}
                        {gstType === 'igst' && (
                            <>
                                <th className="text-center p-1 border">%</th>
                                <th className="text-center p-1 border">Amount</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {/* Loop through gstItems and display each row dynamically */}
                    {gstItems.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center p-1 border">{item.hsn}</td>
                            <td className="text-center p-1 border">{item.qty}</td>
                            <td className="text-center p-1 border">{item.taxableValue}</td>

                            {/* Conditional rendering of CGST and SGST */}
                            {gstType === 'cgst_sgst' && (
                                <>
                                    <td className="text-center p-1 border">{item.cgstPercentage}%</td>
                                    <td className="text-center p-1 border">{item.cgstAmount.toFixed(2)}</td>
                                    <td className="text-center p-1 border">{item.sgstPercentage}%</td>
                                    <td className="text-center p-1 border">{item.sgstAmount.toFixed(2)}</td>
                                </>
                            )}

                            {/* Conditional rendering of IGST */}
                            {gstType === 'igst' && (
                                <>
                                    <td className="text-center p-1 border">{item.igstPercentage}%</td>
                                    <td className="text-center p-1 border">{item.igstAmount.toFixed(2)}</td>
                                </>
                            )}

                            <td className="text-center p-1 border">{item.totalTax.toFixed(2)}</td>
                        </tr>
                    ))}
     
                    {/* Total Row */}
                    <tr className="bg-gray-200">
                        <td className="text-center p-1 border">Total</td>
                        <td className="text-center p-1 border"></td>
                        <td className="text-center p-1 border">{subTotal.toFixed(2)}</td>

                        {/* Display CGST and SGST totals */}
                        {gstType === 'cgst_sgst' && (
                            <>
                                <td className="text-center p-1 border"></td>
                                <td className="text-center p-1 border">{totals.cgst.toFixed(2)}</td>
                                <td className="text-center p-1 border"></td>
                                <td className="text-center p-1 border">{totals.sgst.toFixed(2)}</td>
                            </>
                        )}

                        {/* Display IGST totals */}
                        {gstType === 'igst' && (
                            <>
                                <td className="text-center p-1 border"></td>
                                <td className="text-center p-1 border">{totals.igst.toFixed(2)}</td>
                            </>
                        )}

                        <td className="text-center p-1 border">{totals.totalTax.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GstDelcarationTable;
