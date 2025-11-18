import { useState, useEffect } from 'react';
import { ShieldBan, SquarePen } from 'lucide-react';
import axios from 'axios';

const BussinessProfileView = ({ setActiveSection, setBusinessId, setBusinessData, businessId, businessData }) => {

    const [brandDetails, setBrandDetails] = useState([]);
    const [branddetail, setBrandDetail] = useState(null);

    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (businessId) {
            // Fetch customer data based on ID
            axios.get(`http://localhost:8000/api/brand-details/${businessId}/`)
                .then(response => {
                    setBrandDetail(response.data);  // Set the customer data
                    setBusinessData(response.data);  // Pass the customer data to parent for editing
                })
                .catch(error => {
                    console.error('Error fetching brand details details:', error);
                });
        }
    }, [businessId, setBusinessData]);


    useEffect(() => {
        // Fetch data from Django backend
        axios.get('http://localhost:8000/api/brand-details/')
            .then(response => {
                setBrandDetails(response.data); // Set items in state
                setLoading(false);  // Stop loading when data is fetched
            })
            .catch(error => {
                console.error('There was an error fetching the brand Data!', error);
                setLoading(false);  // Stop loading if there's an error
            });
    }, []);

    const handleRowClick = (id, brand) => {
        // Set the business ID to be edited
        setBusinessId(id);
        // Pass the business details to the parent for editing
        setBusinessData(brand);
        // Switch to the 'business-add' section to edit the business details
        setActiveSection('bussiness-add');
        console.log(`Show details for business with ID: ${id}`);
    }

    const handleActionClick = () => {
        // Simulate clicking the "Edit" button by triggering handleRowClick
        const brand = brandDetails[0];  // or find the brand dynamically based on some logic
        handleRowClick(brand.id, brand);  // Programmatically call the row click
    };


    // Loading state
    if (loading) {
        return <div>Loading...</div>;  // Display loading message while fetching data
    }

    return (
        <div className="flex flex-col overflow-hidden" >
            {/* Header Section */}
            < div className="w-full h-14 flex items-center justify-between p-2 bg-white border-t border-gray-400" >
                <div className='flex items-center'>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Bussiness Profile
                    </h1>
                </div>
                <div
                    onClick={handleActionClick}
                    className='flex items-center justify-center bg-blue-500 w-30 h-8 rounded-md hover:bg-blue-700 p-5'>
                    <button
                        className="flex gap-2 text-white"><SquarePen />
                        <label className='text-white'>Edit</label>
                    </button>
                </div>

            </div  >
            {brandDetails.map((brand) => (
                <div key={brand.id}>
                    <div className='flex flex-col'>
                        <div className='h-50' style={{ background: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)' }}>
                            <div className='flex justify-end p-4'>
                                <h1 className='text-white font-semibold decoration-cyan-600 '>BizCore.</h1>
                            </div>
                        </div>
                        <div className='absolute bg-white flex flex-col top-60 flex ml-10 p-2 rounded-md'>
                            <div className='bg-gray-200 p-10 rounded-md'>
                                <div className='flex w-45 text-white h-45 overflow-hidden items-center justify-center ' >
                                    {brand.logo ? (
                                        <img
                                            src={`${brand.logo}`} // ✅ NO /api here!
                                            className="object-cover"
                                        />
                                    ) : (
                                        <p className='text-white text-sm'>No Logo</p>
                                    )}
                                </div>
                            </div>
                            <div className='p-2 pb-4'>
                                <div className='flex items-center flex-col justify-center '>
                                    <h1 className='max-w-50 font-semibold text-center  text-lg pb-2'>
                                        {brand.company_name || 'Company Name'}
                                    </h1>
                                    <p className='max-w-55 font-semibold bg-green-500 text-white p-1 w-full text-center'>{brand.company_caption || 'Company Caption'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='ml-80 flex justify-between pt-8 pb-8 bg-white shadow-xl p-6 mr-6 mt-4 bg-whit rounded-sm'>
                        <div className=''>
                            <table className='flex flex-col gap-4'>
                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-8'>Website</th>
                                    <td className='border p-1  w-80 border-gray-300 text-gray-700'>{brand.website_name || 'Website Name'}</td>
                                </tr>

                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-13'>Email</th>
                                    <td className='border p-1 w-80 border-gray-300 text-gray-700'>{brand.business_email || 'Email'}</td>
                                </tr>

                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-18'>Tel</th>
                                    <td className='border p-1 w-80 border-gray-300 text-gray-700'>{brand.telephone || 'Telephone Number'}</td>
                                </tr>

                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-11'>Phone</th>
                                    <td className='border p-1 w-80 border-gray-300 text-gray-700'>{brand.mobile_number || 'Phone Number'}</td>
                                </tr>
                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-4'>Whatsapp <br /> Number</th>
                                    <td className='border p-1 w-80 border-gray-300 text-gray-700'>{brand.whatsapp_number || 'Whats App Number'}</td>
                                </tr>
                            </table>
                        </div>
                        <div>
                            <table className='flex flex-col gap-4'>
                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-9'>GSTIN</th>
                                    <td className='border p-1  w-80 border-gray-300 text-gray-700'>{brand.gst_in_number || 'GST Number'}</td>
                                </tr>

                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-13'>PAN</th>
                                    <td className='border p-1 w-80 border-gray-300 text-gray-700'>{brand.business_pan_number || 'Pan Number'}</td>
                                </tr>

                                <tr className='flex items-center gap-2'>
                                    <th className='font-semibold pr-12'> Type</th>
                                    <td className='border p-1 w-80 border-gray-300 text-gray-700'>{brand.business_type || 'Business Type'}</td>
                                </tr>

                                <tr className='flex gap-2'>
                                    <th className='font-semibold pr-6'>Address</th>
                                    <td className='border p-1 w-80 h-30 border-gray-300 text-gray-700'>{brand.address || 'Address Details'} <br />
                                        {brand.city} <br /> {brand.state_name},{brand.pincode}

                                    </td>
                                </tr>
                            </table>
                            <button onClick={() => handleRowClick(brand.id, brand)}></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BussinessProfileView
