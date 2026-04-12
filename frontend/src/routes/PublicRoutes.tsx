import React from 'react';
import { Route } from 'react-router-dom';

const Home = React.lazy(() => import('../components/common/Home/Home'));
const Restaurants = React.lazy(() => import('../features/customer/pages/Restaurants'));
const Menu = React.lazy(() => import('../features/customer/pages/Menu'));
const CateringServicesPage = React.lazy(() => import('../features/customer/pages/CateringServicesPage'));
const Login = React.lazy(() => import('../features/auth/pages/Login'));
const Register = React.lazy(() => import('../features/auth/pages/Register'));

export const PublicRoutes = () => {
    return (
        <>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<Menu />} />
            <Route path="/catering" element={<CateringServicesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </>
    );
};