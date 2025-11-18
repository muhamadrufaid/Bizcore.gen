import React, { useState } from 'react'
import CustomerSidebar from '../../pages/Customers/CustomerSidebar'
import ProductSidebar from '../../pages/Products/ProductSidebar'
import CategorySidebar from '../../pages/Category/CategorySidebar';
import TaxSidebarView from '../../pages/Tax/TaxSidebarView';
import PurchaseSidebar from '../../pages/Purchase/PurchaseSidebar';
import SettingSidebarView from '../../pages/Settings/SettingSidebarView';
import PaymentSidebar from '../../pages/Payment/PaymentSidebar';
import OverViewSidebar from '../../pages/OverView/OverViewSidebar';

const Sidebar = ({ activeSidebar }) => {

  return (
    <div className="relative">
      {/* Sidebar content */}
      <div
        style={{ backgroundColor: 'rgba(0, 7, 99, 1)' }}
        className={`text-white`}
      >
        {/* Conditionally render the active sidebar */}
        {activeSidebar === 'customer' && <CustomerSidebar />}
        {activeSidebar === 'product' && <ProductSidebar />}
        {activeSidebar === 'category' && <CategorySidebar />}
        {activeSidebar === 'tax' && <TaxSidebarView />}
        {activeSidebar === 'purchase' && <PurchaseSidebar />}
        {activeSidebar === 'settings' && <SettingSidebarView />}
        {activeSidebar === 'payment' && <PaymentSidebar />}
        {activeSidebar === 'overview' && <OverViewSidebar />}

      </div>
    </div>
  );
};

export default Sidebar;
