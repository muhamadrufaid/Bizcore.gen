import React, { useState, useEffect } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import { LayoutPanelLeft, Users, Gem, CircleAlert, ShoppingBag, Settings, Package2, Shredder, ReceiptIndianRupee, CreditCard } from 'lucide-react';
import axios from 'axios';

import CustomerSidebar from '../../pages/Customers/CustomerSidebar';
import ProductSidebar from '../../pages/Products/ProductSidebar';
import InvoiceSidebar from '../../pages/Invoices/InvoiceSidebar';
import PurchaseSidebar from '../../pages/Purchase/PurchaseSidebar';
import SettingSidebarView from '../../pages/Settings/SettingSidebarView';
import PaymentSidebar from '../../pages/Payment/PaymentSidebar';
import OverViewSidebar from '../../pages/OverView/OverViewSidebar';

import CustomerDashView from '../../pages/Customers/CustomerDashView';
import CustomersView from '../../pages/Customers/CustomersView';
import CustomerDetailView from '../../pages/Customers/CustomerDetailView';
import CustomerAddView from '../../pages/Customers/CustomerAddView';
import CustomerEditView from '../../pages/Customers/CustomerEditView';
import CustomerInvoiceAddView from '../../pages/Customers/CustomerInvoiceAddView';

import ProductAddView from '../../pages/Products/ProductAddView';
import ProductsView from '../../pages/Products/ProductsView';
import ProductDashView from '../../pages/Products/ProductDashView';
import ProductEditView from '../../pages/Products/ProductEditView';
import ProductDetailView from '../../pages/Products/ProductDetailView';

import CategoryView from '../../pages/Category/CategoryView';
import CategoryDashView from '../../pages/Category/CategoryDashView';
import CategoryEditView from '../../pages/Category/CategoryEditView';
import CategoryAddView from '../../pages/Category/CategoryAddView';
import CategoryDetailView from '../../pages/Category/CategoryDetailView';

import InvoiceView from '../../pages/Invoices/InvoiceView';
import InvoiceGeneratorView from '../../pages/Invoices/InvoiceGeneratorView';
import InvoiceDashView from '../../pages/Invoices/InvoiceDashView';
import InvoiceDetailView from '../../pages/Invoices/InvoiceDetailView';
import InvoiceFinalizeView from '../../pages/Invoices/InvoiceFinalizeView';
import InvoiceEditView from '../../pages/Invoices/InvoiceEditView';

import TaxSidebarView from '../../pages/Tax/TaxSidebarView';
import TaxView from '../../pages/Tax/TaxView';
import TaxEditView from '../../pages/Tax/TaxEditView';
import TaxDashView from '../../pages/Tax/TaxDashView';

import DraftView from '../../pages/DraftInvoice/DraftView';
import DraftEditView from '../../pages/DraftInvoice/DraftEditView';
import DraftDashView from '../../pages/DraftInvoice/DraftDashView';

import VendorView from '../../pages/Vendor/VendorView';
import VendorDashView from '../../pages/Vendor/VendorDashView';
import VendorAddView from '../../pages/Vendor/VendorAddView';
import VendorDetailView from '../../pages/Vendor/VendorDetailView';
import VendorEditView from '../../pages/Vendor/VendorEditView';

import PurchaseAddform from '../../pages/Purchase/PurchaseAddform';
import PurchaseView from '../../pages/Purchase/PurchaseView';
import PurchaseDetailView from '../../pages/Purchase/PurchaseDetailView';
import PurchaseEditView from '../../pages/Purchase/PurchaseEditView';
import PurchaseDashView from '../../pages/Purchase/PurchaseDashView';

import StaffView from '../../pages/Staff/StaffView';
import StaffAddView from '../../pages/Staff/StaffAddView';
import StaffDetailView from '../../pages/Staff/StaffDetailView';
import StaffEditView from '../../pages/Staff/StaffEditView';
import StaffDashView from '../../pages/Staff/StaffDashView';

import PaymentView from '../../pages/Payment/PaymentView';
import PaymentAddView from '../../pages/Payment/PaymentAddView';
import PaymentDashView from '../../pages/Payment/PaymentDashView';
import PaymentEditView from '../../pages/Payment/PaymentEditView';
import PaymentDetailView from '../../pages/Payment/PaymentDetailView';
import InvoicePaymentListView from '../../pages/Payment/InvoicePaymentListView';

import StaffPaymentAddView from '../../pages/StaffPayments/StaffPaymentAddView';
import StaffPaymentDetailView from '../../pages/StaffPayments/StaffPaymentDetailView';
import StaffPaymentEditView from '../../pages/StaffPayments/StaffPaymentEditView';
import StaffPaymentView from '../../pages/StaffPayments/StaffPaymentView';

import BussinessAddform from '../../pages/BussinessInformation/BussinessAddform';
import BussinessProfileView from '../../pages/BussinessInformation/BussinessProfileView';
import About from '../../pages/Settings/About';
import PeriumPricingView from '../../pages/Settings/PeriumPricingView';

import BankView from '../../pages/BussinessInformation/BankView';
import BankAddView from '../../pages/BussinessInformation/BankAddView';
import BankEditView from '../../pages/BussinessInformation/BankEditView';

import InvoiceSettings from '../../pages/Settings/InvoiceSettings';
import OverView from '../../pages/OverView/OverView';
import AlertView from '../../pages/Alerts/AlertView';

import AdminProfileView from '../../pages/AdminDetails/AdminProfileView';
import AdminEditView from '../../pages/AdminDetails/AdminEditView';
import PassWordChangeView from '../../pages/AdminDetails/PassWordChangeView';
import PassWordForgotView from '../../pages/AdminDetails/PassWordForgotView';

const Main = () => {
    const [activeSidebar, setActiveSidebar] = useState(null);
    const [activeSection, setActiveSection] = useState('analytics-view');

    const [productId, setProductId] = useState(null)
    const [productData, setProductData] = useState(null)

    const [categoryId, setCategoryId] = useState(null)
    const [categoryData, setCategoryData] = useState(null)

    const [customerId, setCustomerId] = useState(null);  // Customer ID for details view
    const [customerData, setCustomerData] = useState(null);

    const [bankId, setBankId] = useState(null);
    const [bankData, setBankData] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);

    const [businessId, setBusinessId] = useState(null);
    const [businessData, setBusinessData] = useState(null)

    const [vendorId, setVendorId] = useState(null);
    const [vendorData, setVendorData] = useState(null)

    const [paymentId, setPaymentId] = useState(null);
    const [paymentsData, setPaymentsData] = useState(null)

    const [taxpaymentId, setTaxPaymentId] = useState(null);
    const [taxPaymentData, setTaxPaymentData] = useState(null)

    const [purchaseId, setPurchaseId] = useState(null);
    const [purchaseData, setPurchaseData] = useState(null)
    const [purchases, setPurchases] = useState([]);  // This state holds the list of purchase

    const [draftInvoiceId, setDraftInvoiceId] = useState(null);
    const [draftInvoiceData, setDraftInvoiceData] = useState(null)
    const [draftInvoices, setDraftInvoices] = useState([]);  // This state holds the list of draft invoices

    const [invoiceId, setInvoiceId] = useState(null);  // Customer ID for details view
    const [invoiceData, setInvoiceData] = useState([])
    const [invoices, setInvoices] = useState(null);


    useEffect(() => {
        console.log('draftInvoiceId:', draftInvoiceId); // Log the value of draftInvoiceId
        if (draftInvoiceId) {

            axios.get(`http://localhost:8000/api/draft-invoices/${draftInvoiceId}/`)
                .then(response => {
                    console.log('Response:', response.data); // Log the response data
                    setDraftInvoiceData(response.data); // Set data
                    refreshDraftInvoices();
                })
                .catch(error => {
                    console.error('Error fetching draft invoice data:', error);
                });
        }
    }, [draftInvoiceId]);

    // Fetch all draft invoices on initial load
    useEffect(() => {
        axios.get('http://localhost:8000/api/draft-invoices/')
            .then(response => {
                setDraftInvoices(response.data);
            })
            .catch(error => console.error('Error fetching draft invoices:', error));
    }, []);

    // Refresh draft invoices list
    const refreshDraftInvoices = () => {
        axios.get('http://localhost:8000/api/draft-invoices/')
            .then(response => {
                setDraftInvoices(response.data);
            })
            .catch(error => console.error('Error refreshing draft invoices:', error));
    };

    // invoice fetching setup

    useEffect(() => {
        console.log('InvoiceId:', invoiceId); // Log the value of draftInvoiceId
        if (invoiceId) {

            axios.get(`http://localhost:8000/api/invoices/${invoiceId}/`)
                .then(response => {
                    console.log('Response:', response.data); // Log the response data
                    setInvoiceData(response.data); // Set data
                    refreshInvoices();
                    refreshBusiness();
                })
                .catch(error => {
                    console.error('Error fetching invoice data:', error);
                });
        }
    }, [invoiceId]);

    // Fetch all draft invoices on initial load
    useEffect(() => {
        axios.get('http://localhost:8000/api/invoices/')
            .then(response => {
                setInvoices(response.data);
                refreshBusiness();
            })
            .catch(error => console.error('Error fetching invoices:', error));
    }, []);

    // Refresh draft invoices list
    const refreshInvoices = () => {
        axios.get('http://localhost:8000/api/invoices/')
            .then(response => {
                setInvoices(response.data);
                refreshBusiness();
            })
            .catch(error => console.error('Error refreshing invoices:', error));
    };

    useEffect(() => {
        console.log('Purchase Id:', purchaseId); // Log the value of draftInvoiceId
        if (purchaseId) {

            axios.get(`http://localhost:8000/api/purchase/${purchaseId}/`)
                .then(response => {
                    console.log('Response:', response.data); // Log the response data
                    setPurchaseData(response.data); // Set data
                    refreshPurchase();
                })
                .catch(error => {
                    console.error('Error fetching purchase data:', error);
                });
        }
    }, [purchaseId]);

    // Fetch all draft invoices on initial load
    useEffect(() => {
        axios.get('http://localhost:8000/api/purchase/')
            .then(response => {
                setPurchases(response.data);
                refreshPurchase();
            })
            .catch(error => console.error('Error fetching draft purchase:', error));
    }, []);

    // Refresh draft invoices list
    const refreshPurchase = () => {
        axios.get('http://localhost:8000/api/purchase/')
            .then(response => {
                setPurchases(response.data);
            })
            .catch(error => console.error('Error refreshing draft purchase:', error));
    };

    // Refresh draft invoices list
    const refreshBusiness = () => {
        axios.get('http://localhost:8000/api/brand-details/')
            .then(response => {
                setBusinessData(response.data);
            })
            .catch(error => console.error('Error refreshing brand-details purchase:', error));
    };


    useEffect(() => {
        axios.get('http://localhost:8000/api/brand-details/')
            .then(response => {
                console.log('Business data response:', response.data); // Check the response
                setBusinessData(response.data); // Ensure it contains the data you need
                refreshBusiness();
            })
            .catch(error => console.error('Error fetching business data:', error));
    }, []);

    useEffect(() => {
        console.log('Business Data:', businessData); // Check what is returned
    }, [businessData]); // Log when businessData changes

    // Function to handle section change (mainly to switch between DraftView and DraftEditView)
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    // Function to handle sidebar toggle
    const handleSidebarToggle = (sidebar) => {
        if (activeSidebar === sidebar) {
            setActiveSidebar(null); // Close the sidebar if it's already open
        } else {
            setActiveSidebar(sidebar); // Open the selected sidebar
        }
    };

    const [paymentData, setPaymentData] = useState(null);

    // Callback function to receive data from InvoiceActionPopUpView
    const handleInvoiceDataChange = (data) => {
        console.log('Received invoice data:', data);
        setPaymentData(data);  // Update the state with the received data
    };

    const handleInvoiceFinalDataChange = (data) => {
        setInvoices(data);  // Set invoice data
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header and Navbar */}
            <div className="flex justify-between items-center p-">
                <div>
                    <Header />
                </div>

                {/* Buttons Section */}
                <div className="flex justify-end w-full">
                    <Navbar setActiveSection={setActiveSection} />
                </div>
            </div>

            {/* This is Sidebar Icons */}
            <div className="flex flex-1">
                {/* Sidebar Icons */}
                <div className="">
                    <div style={{ backgroundColor: 'rgba(0, 7, 85, 1)' }} className="flex h-full">
                        <div className='flex flex-col items-center text-white p-1'>
                            {/* Each button with icon */}
                            <button
                                onClick={() => handleSidebarToggle('overview')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <LayoutPanelLeft />
                            </button>

                            <button
                                onClick={() => handleSidebarToggle('customer')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <Users />
                            </button>

                            <button
                                onClick={() => handleSidebarToggle('product')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <Package2 />
                            </button>

                            <button
                                onClick={() => handleSidebarToggle('invoice')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <Shredder />
                            </button>

                            <button
                                onClick={() => handleSidebarToggle('tax')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <ReceiptIndianRupee />
                            </button>
                            <button
                                onClick={() => handleSidebarToggle('purchase')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <ShoppingBag />
                            </button>
                            <button
                                onClick={() => handleSidebarToggle('payment')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <CreditCard />
                            </button>
                            <button
                                onClick={() => handleSidebarToggle('settings')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <Settings />
                            </button>
                            <button
                                onClick={() => setActiveSection('pricing-view')}
                                className="hover:bg-purple-500 p-3 rounded-lg mb-4 text-2xl">
                                <Gem />
                            </button>
                            <button
                                onClick={() => setActiveSection('about-view')}
                                className="hover:bg-purple-500 p-3 mt rounded-lg mb-4 text-2xl">
                                <div className="transform rotate-90">
                                    <CircleAlert />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar content */}
                <div style={{ backgroundColor: 'rgba(0, 7, 98, 1)' }} className="text-white">
                    <div className="relative">
                        {/* Sidebar content */}
                        {activeSidebar === 'customer' && <CustomerSidebar setActiveSection={setActiveSection} />}
                        {activeSidebar === 'product' && <ProductSidebar setActiveSection={setActiveSection} />}
                        {activeSidebar === 'invoice' && <InvoiceSidebar setActiveSection={setActiveSection} />}
                        {activeSidebar === 'tax' && <TaxSidebarView setActiveSection={setActiveSection} />}
                        {activeSidebar === 'purchase' && <PurchaseSidebar setActiveSection={setActiveSection} />}
                        {activeSidebar === 'settings' && <SettingSidebarView setActiveSection={setActiveSection} />}
                        {activeSidebar === 'payment' && <PaymentSidebar setActiveSection={setActiveSection} />}
                        {activeSidebar === 'user' && <UserSidebar setActiveSection={setActiveSection} />}
                        {activeSidebar === 'overview' && <OverViewSidebar setActiveSection={setActiveSection} />}
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ background: 'rgba(241,246,250,255)' }} className="flex-1">
                    {/* Conditionally render content inside Main */}

                    {activeSection === 'customer-view' && <CustomersView setActiveSection={setActiveSection} setCustomerId={setCustomerId} />}
                    {activeSection === 'customer-dash' && <CustomerDashView />}
                    {activeSection === 'customer-edit' && <CustomerEditView setActiveSection={setActiveSection} customerData={customerData} />}
                    {activeSection === 'customer-add' && <CustomerAddView setActiveSection={setActiveSection} />}
                    {activeSection === 'customer-detail' && <CustomerDetailView setActiveSection={setActiveSection} customerId={customerId} setCustomerData={setCustomerData} />}
                    {activeSection === 'customer-invoice-add' && <CustomerInvoiceAddView setActiveSection={setActiveSection} />}

                    {activeSection === 'product-view' && <ProductsView setActiveSection={setActiveSection} setProductId={setProductId} />}
                    {activeSection === 'product-dash' && <ProductDashView />}
                    {activeSection === 'product-edit' && <ProductEditView setActiveSection={setActiveSection} productData={productData} />}
                    {activeSection === 'product-add' && <ProductAddView setActiveSection={setActiveSection} />}
                    {activeSection === 'product-detail' && <ProductDetailView setActiveSection={setActiveSection} productId={productId} setProductData={setProductData} />}

                    {activeSection === 'category-view' && <CategoryView setActiveSection={setActiveSection} setCategoryId={setCategoryId} />}
                    {activeSection === 'category-dash' && <CategoryDashView />}
                    {activeSection === 'category-edit' && <CategoryEditView setActiveSection={setActiveSection} categoryData={categoryData} />}
                    {activeSection === 'category-add' && <CategoryAddView setActiveSection={setActiveSection} />}
                    {activeSection === 'category-detail' && <CategoryDetailView setActiveSection={setActiveSection} categoryId={categoryId} setCategoryData={setCategoryData} />}

                    {activeSection === 'invoice-view' && <InvoiceView setActiveSection={setActiveSection}
                        setInvoiceId={setInvoiceId}
                        invoices={invoices}
                        setInvoices={setInvoices}
                        refreshInvoices={refreshInvoices}
                        handleInvoiceDataChange={handleInvoiceDataChange}

                    />}

                    {activeSection === 'invoice-edit' && invoiceData && (
                        <InvoiceEditView setActiveSection={setActiveSection} invoiceData={invoiceData}
                            refreshInvoices={refreshInvoices}
                            setInvoiceData={setInvoiceData}
                            invoiceId={invoiceId} />
                    )}

                    {activeSection === 'invoice-form' && <InvoiceGeneratorView setActiveSection={setActiveSection} />}
                    {activeSection === 'invoice-dash' && <InvoiceDashView setActiveSection={setActiveSection} />}
                    {activeSection === 'invoice-detail' && <InvoiceDetailView setActiveSection={setActiveSection} />}
                    {activeSection === 'invoice-final' && <InvoiceFinalizeView setActiveSection={setActiveSection}
                        invoiceData={invoiceData}
                        businessData={businessData}
                        invoiceId={invoiceId}
                        setInvoiceData={setInvoiceData}
                        setActiveSidebar={setActiveSidebar}
                        selectedBank={selectedBank} />}

                    {activeSection === 'draft-view' && <DraftView setActiveSection={setActiveSection}
                        setDraftInvoiceId={setDraftInvoiceId}
                        draftInvoices={draftInvoices}
                        setDraftInvoices={setDraftInvoices}
                        refreshDraftInvoices={refreshDraftInvoices} />}

                    {activeSection === 'draft-edit' && draftInvoiceData && (
                        <DraftEditView setActiveSection={setActiveSection} draftInvoiceData={draftInvoiceData}
                            refreshDraftInvoices={refreshDraftInvoices}
                            setDraftInvoiceData={setDraftInvoiceData}
                            draftInvoiceId={draftInvoiceId}
                        />
                    )}
                    {activeSection === 'draft-dash' && <DraftDashView setActiveSection={setActiveSection} />}

                    {activeSection === 'purchase-form-add' && <PurchaseAddform setActiveSection={setActiveSection} />}
                    {activeSection === 'purchase-dash' && <PurchaseDashView setActiveSection={setActiveSection} />}
                    {activeSection === 'purchase-detail' && <PurchaseDetailView setActiveSection={setActiveSection} />}

                    {activeSection === 'purchase-view' && <PurchaseView setActiveSection={setActiveSection}
                        setPurchaseId={setPurchaseId}
                        purchases={purchases}
                        setPurchases={setPurchases}
                        refreshPurchase={refreshPurchase} />}

                    {activeSection === 'purchase-edit' && purchaseData && (
                        <PurchaseEditView setActiveSection={setActiveSection} purchaseData={purchaseData}
                            refreshPurchase={refreshPurchase}
                            setPurchaseData={setPurchaseData}
                            purchaseId={purchaseId}
                        />
                    )}

                    {activeSection === 'tax-view' && <TaxView setActiveSection={setActiveSection} setInvoiceId={setInvoiceId} invoiceData={invoiceData}
                        setInvoiceData={setInvoiceData}
                        refreshInvoices={refreshInvoices} />}
                    {activeSection === 'tax-edit' && <TaxEditView setActiveSection={setActiveSection} />}
                    {activeSection === 'tax-dash' && <TaxDashView setActiveSection={setActiveSection} />}

                    {activeSection === 'vendor-view' && <VendorView setActiveSection={setActiveSection} setVendorId={setVendorId} />}
                    {activeSection === 'vendor-edit' && <VendorEditView setActiveSection={setActiveSection} vendorData={vendorData} />}
                    {activeSection === 'vendor-detail' && <VendorDetailView setActiveSection={setActiveSection} vendorId={vendorId} setVendorData={setVendorData} />}
                    {activeSection === 'vendor-dash' && <VendorDashView setActiveSection={setActiveSection} />}
                    {activeSection === 'vendor-add' && <VendorAddView setActiveSection={setActiveSection} />}

                    {activeSection === 'staff-view' && <StaffView setActiveSection={setActiveSection} />}
                    {activeSection === 'staff-edit' && <StaffEditView setActiveSection={setActiveSection} />}
                    {activeSection === 'staff-detail' && <StaffDetailView setActiveSection={setActiveSection} />}
                    {activeSection === 'staff-add' && <StaffAddView setActiveSection={setActiveSection} />}
                    {activeSection === 'staff-dash' && <StaffDashView setActiveSection={setActiveSection} />}

                    {activeSection === 'payment-view' && <PaymentView setActiveSection={setActiveSection} setPaymentId={setPaymentId} />}
                    {activeSection === 'payment-add' && <PaymentAddView setActiveSection={setActiveSection} />}
                    {activeSection === 'payment-edit' && <PaymentEditView setActiveSection={setActiveSection} />}
                    {activeSection === 'payment-dash' && <PaymentDashView setActiveSection={setActiveSection} />}
                    {activeSection === 'payment-detail' && <PaymentDetailView setActiveSection={setActiveSection} paymentId={paymentId} setPaymentsData={setPaymentsData} />}
                    {activeSection === 'payment-list' && <InvoicePaymentListView setActiveSection={setActiveSection} paymentData={paymentData} />}

                    {activeSection === 'staffpayment-view' && <StaffPaymentView setActiveSection={setActiveSection} />}
                    {activeSection === 'staffpayment-detail' && <StaffPaymentDetailView setActiveSection={setActiveSection} />}
                    {activeSection === 'staffpayment-edit' && <StaffPaymentEditView setActiveSection={setActiveSection} />}
                    {activeSection === 'staffpayment-add' && <StaffPaymentAddView setActiveSection={setActiveSection} />}

                    {activeSection === 'bussiness-add' && <BussinessAddform setActiveSection={setActiveSection} businessId={businessId} refreshBusiness={refreshBusiness} businessData={businessData} />}
                    {activeSection === 'bussiness-profile' && <BussinessProfileView setActiveSection={setActiveSection} businessId={businessId}
                        setBusinessData={setBusinessData}
                        setBusinessId={setBusinessId}
                        businessData={businessData} />}

                    {activeSection === 'bank-view' && <BankView setActiveSection={setActiveSection} setBankId={setBankId}
                        setBankData={setBankData}
                        bankId={bankId}
                        setSelectedBank={setSelectedBank} />}
                    {activeSection === 'bank-add' && <BankAddView setActiveSection={setActiveSection} />}
                    {activeSection === 'bank-edit' && <BankEditView
                        setActiveSection={setActiveSection}
                        bankData={bankData}
                    />}

                    {activeSection === 'invoice-settings' && <InvoiceSettings setActiveSection={setActiveSection} />}

                    {activeSection === 'analytics-view' && <OverView setActiveSection={setActiveSection} />}
                    {activeSection === 'alert-view' && <AlertView setActiveSection={setActiveSection} />}
                    {activeSection === 'about-view' && <About setActiveSection={setActiveSection} />}
                    {activeSection === 'pricing-view' && <PeriumPricingView setActiveSection={setActiveSection} />}

                    {activeSection === 'admin-profile' && <AdminProfileView setActiveSection={setActiveSection} />}
                    {activeSection === 'admin-edit' && <AdminEditView setActiveSection={setActiveSection} />}
                    {activeSection === 'admin-password-change' && <PassWordChangeView setActiveSection={setActiveSection} />}
                    {activeSection === 'admin-password-forgot' && <PassWordForgotView setActiveSection={setActiveSection} />}

                    {!setActiveSection && <h1>Main Content</h1>}
                </div>
            </div>
        </div >
    );
};

export default Main;
