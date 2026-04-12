import React from 'react';
import { Route } from 'react-router-dom';

const AdminDashboard = React.lazy(() => import('../features/admin/pages/Dashboard'));

export const AdminRoutes = () => {
    return (
        <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </>
    );
};