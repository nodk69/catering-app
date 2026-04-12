import React from 'react';
import { Route } from 'react-router-dom';

const VendorHome = React.lazy(() => import('../features/vendor/pages/VendorHome'));
const VendorDashboard = React.lazy(() => import('../features/vendor/pages/VendorDashboard'));
const MenuManager = React.lazy(() => import('../features/vendor/pages/MenuManager'));
const VendorOrders = React.lazy(() => import('../features/vendor/pages/Orders'));
const CateringServices = React.lazy(() => import('../features/vendor/pages/CateringServices'));
const Analytics = React.lazy(() => import('../features/vendor/pages/Analytics'));

export const VendorRoutes = () => {
    return (
        <>
            <Route path="/vendor" element={<VendorHome />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/menu" element={<MenuManager />} />
            <Route path="/vendor/catering-services/:serviceId/menu" element={<MenuManager />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/orders/:orderId" element={<VendorOrders />} />
            <Route path="/vendor/catering-services" element={<CateringServices />} />
            <Route path="/vendor/catering-services/edit/:serviceId" element={<CateringServices />} />
            <Route path="/vendor/analytics" element={<Analytics />} />
        </>
    );
};