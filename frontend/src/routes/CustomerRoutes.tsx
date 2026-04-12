import React from 'react';
import { Route } from 'react-router-dom';

const Dashboard = React.lazy(() => import('../features/customer/pages/Dashboard'));
const Cart = React.lazy(() => import('../features/customer/pages/Cart'));
const Orders = React.lazy(() => import('../features/customer/pages/Orders'));
// const Profile = React.lazy(() => import('../features/customer/pages/Profile'));

export const CustomerRoutes = () => {
    return (
        <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<Orders />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
        </>
    );
};