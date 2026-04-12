import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../api/authApi';
import { setUser, setInitialized, logout } from '../store/slices/authSlice';
import { LoadingSpinner } from '../components/common/Loading/Loading';

interface RootState {
    auth: {
        token: string | null;
        user: { email: string; role: string } | null;
        isInitialized: boolean;
    }
}

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { token, isInitialized } = useSelector((state: RootState) => state.auth);
    
    // ✅ Fix: Remove isInitialized from skip condition
    // We want to fetch user data if we have a token, regardless of initialization state
    const { data: userData, error, isLoading } = useGetMeQuery(undefined, {
        skip: !token, // Only skip if no token
    });
    
    useEffect(() => {
        if (!token) {
            // No token, mark as initialized
            dispatch(setInitialized());
            return;
        }
        
        if (userData) {
            // User data fetched successfully
            dispatch(setUser(userData));
            dispatch(setInitialized());
        }
        
        if (error) {
            // Token is invalid or expired
            console.error('Failed to fetch user data:', error);
            dispatch(logout());
            dispatch(setInitialized());
        }
    }, [token, userData, error, dispatch]);
    
    // ✅ Show loading only if we have token AND we're loading user data
    if (token && isLoading) {
        return <LoadingSpinner message="Initializing your session..." />;
    }
    
    // ✅ If we have token but no user data yet and not loading (shouldn't happen, but just in case)
    if (token && !userData && !isLoading && !isInitialized) {
        return <LoadingSpinner message="Loading your profile..." />;
    }
    
    return <>{children}</>;
};

export default AuthInitializer;