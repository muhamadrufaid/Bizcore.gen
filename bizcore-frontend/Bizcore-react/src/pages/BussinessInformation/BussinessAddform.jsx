import React, { useState, useEffect } from 'react';
import { SaveAll, ChevronLeft } from 'lucide-react';
import axios from 'axios';


const BussinessAddform = ({ setActiveSection, businessData }) => {
    const [logo, setLogo] = useState(null);  // State for image
    const [logoPreview, setLogoPreview] = useState(null); // State for logo preview
    const [businessType, setBusinessType] = useState(''); // State for business type selection
    const [formData, setFormData] = useState({
        company_name: '',
        company_caption: '',
        telephone: '',
        mobile_number: '',
        whatsapp_number: '',
        business_email: '',
        business_type: 'retail',
        website_name: '',
        business_pan_number: '',
        gst_in_number: '',
        address: '',
        city: '',
        state_name: '',
        pincode: '',
        logo: ''
    });

    useEffect(() => {
        if (businessData) {
            setFormData({
                company_name: businessData?.company_name || '',
                company_caption: businessData?.company_caption || '',
                telephone: businessData?.telephone || '',
                mobile_number: businessData?.mobile_number || '',
                whatsapp_number: businessData?.whatsapp_number || '',
                business_email: businessData?.business_email || '',
                website_name: businessData?.website_name || '',
                business_pan_number: businessData?.business_pan_number || '',
                gst_in_number: businessData?.gst_in_number || '',
                address: businessData?.address || '',
                city: businessData?.city || '',
                state_name: businessData?.state_name || '',
                pincode: businessData?.pincode || '',
                logo: businessData?.logo || '',
            });
            setLogoPreview(businessData?.logo);
            setBusinessType(businessData?.business_type)
        }
    }, [businessData]);


    // Handle input change for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if bankData is null or undefined
        if (!businessData || !businessData.id) {
            alert('Brand details is not available.');
            return;  // Exit the function if bankData is not available
        }

        const formDataToSend = new FormData();
        formDataToSend.append("company_name", formData.company_name);
        formDataToSend.append("company_caption", formData.company_caption);
        formDataToSend.append("telephone", formData.telephone);
        formDataToSend.append("mobile_number", formData.mobile_number);
        formDataToSend.append("whatsapp_number", formData.whatsapp_number);
        formDataToSend.append("business_email", formData.business_email);
        formDataToSend.append("website_name", formData.website_name);
        formDataToSend.append("gst_in_number", formData.gst_in_number);
        formDataToSend.append("business_pan_number", formData.business_pan_number);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("state_name", formData.state_name);
        formDataToSend.append("pincode", formData.pincode);


        // Append logo image if available
        if (logo) {  // Assuming logo is the state holding the logo image
            formDataToSend.append('logo', logo);
        }
        console.log(businessData); // Check what businessData contains

        if (businessType) {  // Assuming logo is the state holding the business type
            formDataToSend.append('business_type', businessType);
        }
        console.log(businessData); // Check what businessData contains


        try {
            const response = await axios.put(
                `http://localhost:8000/api/brand-details/${businessData.id}/`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Updated successfully", response.data);
            setActiveSection("bussiness-profile");
            refreshBusiness();
        } catch (error) {
            console.error("Error updating bank:", error);
        }
    };


    // Handle logo change
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const objectUrl = URL.createObjectURL(file);
            setLogoPreview(objectUrl);  // Set the preview URL for the logo
        }
    };

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="w-full h-14 flex items-center justify-between pr-2 bg-white border-t border-gray-400">
                <div className='flex items-center'>
                    <button
                        onClick={() => setActiveSection('bussiness-profile')}
                        className="flex items-center justify-center h-10 m-2 p-2 bg-blue-700 rounded-md hover:bg-blue-500"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-semibold text-blue-700 p-1" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Edit Profile
                    </h1>
                </div>
                <div
                    onClick={handleSubmit}
                    className='flex justify-center items-center gap-2 px-4 py-2 font-semibold text-md text-white border bg-blue-400 rounded-lg hover:bg-blue-600'>
                    <SaveAll className='w-5 h-5' />
                    <button className=''>
                        Save Changes
                    </button>
                </div>
            </div>

            <div className='m-4 pl-2 pr-2 bg-white rounded-md overflow-x-auto max-h-140 custom-scrollbar '>
                {/* Contact and Business Type Fields */}
                <div className='grid grid-cols-3 gap-4 pt-4'>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Brand Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-400'
                            placeholder='Enter Bussiness name'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Brand Caption</label>
                        <input
                            type="text"
                            name="company_caption"
                            value={formData.company_caption}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter sub heading Eg:Hardware Distribution'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Bussiness Type</label>
                        <select
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className='border p-2 rounded-sm border-gray-500'
                        >
                            <option value="retail">Retail</option>
                            <option value="wholesale">Wholesale</option>
                            <option value="wholesale_retail">Retail and Wholesale</option>
                        </select>
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Telephone Number</label>
                        <input
                            type="number"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter telephone number'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Mobile Number</label>
                        <input
                            type="number"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter mobile number'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Whats App</label>
                        <input
                            type="number"
                            name="whatsapp_number"
                            value={formData.whatsapp_number}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter whats app'
                        />
                    </div>

                </div>

                {/* GSTIN, PAN, Email Fields */}
                <div className='grid grid-cols-3 gap-4 pt-4'>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Email</label>
                        <input
                            type="text"
                            name="business_email"
                            value={formData.business_email}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter email address'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Website Name</label>
                        <input
                            type="text"
                            name="website_name"
                            value={formData.website_name}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter email address'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>GSTIN</label>
                        <input
                            type="text"
                            name="gst_in_number"
                            value={formData.gst_in_number}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter gstin number'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>PAN Number</label>
                        <input
                            type="number"
                            name="business_pan_number"
                            value={formData.business_pan_number}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter pan number'
                        />
                    </div>

                </div>

                {/* Address and Location Fields */}
                <div className='grid grid-cols-4 gap-6 pt-4'>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter address '
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter city '
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>State</label>
                        <input
                            type="text"
                            name="state_name"
                            value={formData.state_name}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter state'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='pb-1 font-semibold pl-1'>Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className='border p-2 rounded-sm border-gray-500'
                            placeholder='Enter pincode '
                        />
                    </div>
                </div>

                {/* Logo Image Upload Field */}
                <div className='flex pb-4 pt-4'>
                    <div className='flex flex-col'>
                        <label className='pb-1 font-semibold pl-1'>Upload Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className='border p-2 w-99 h-40 rounded-sm border-gray-500'
                        />
                    </div>
                    {/* Logo Preview */}
                    {logoPreview && (
                        <div className='p-6 mt-3'>
                            <img
                                src={logoPreview}
                                alt="Logo Preview"
                                className="w-45 h-45 object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BussinessAddform;
