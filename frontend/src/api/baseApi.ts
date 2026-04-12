import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { secureStorage } from '../utils/secureStorage';
import { logout } from '../store/slices/authSlice';
// import { logout } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    prepareHeaders: (headers) => {
        const token = secureStorage.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    },
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    if (result.error?.status === 401) {
        // Store current path for redirect after login
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            sessionStorage.setItem('redirect_after_login', currentPath);
        }
        
        // Dispatch logout action
        api.dispatch(logout());
    }
    
    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth', 'Cart', 'Orders', 'Menu', 'Services'],
    endpoints: () => ({}),
});