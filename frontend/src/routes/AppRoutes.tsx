import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // ✅ Add Link import
import ProtectedRoute from '../components/common/ProtectedRoute';
import { MainLayout } from '../components/common/Layout/MainLayout';
import { ROLES } from '../utils/constants/roles';
import { PublicRoutes } from './PublicRoutes';
import { CustomerRoutes } from './CustomerRoutes';
import { VendorRoutes } from './VendorRoutes';
import { AdminRoutes } from './AdminRoutes';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes - Accessible to everyone */}
            <Route element={<MainLayout />}>
                {PublicRoutes()}
            </Route>

            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    {CustomerRoutes()}
                </Route>
            </Route>

            {/* Protected Vendor Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.VENDOR]} />}>
                <Route element={<MainLayout />}>
                    {VendorRoutes()}
                </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route element={<MainLayout />}>
                    {AdminRoutes()}
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={
                <MainLayout>
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                            <p className="text-xl text-gray-600 mb-8">Page not found</p>
                            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </MainLayout>
            } />
        </Routes>
    );
};

export default AppRoutes;