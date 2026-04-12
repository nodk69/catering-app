// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../../api/authApi';
import { setAuth, setUser } from '../../../store/slices/authSlice';
import { validateEmail } from '../../../utils/validation';

interface LoginFormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            const response = await login(formData).unwrap();
            
            if (response.token) {
                dispatch(setAuth({ token: response.token }));
                
                // Get user info after successful login
                try {
                    const userResponse = await fetch('http://localhost:8080/me', {
                        headers: {
                            'Authorization': `Bearer ${response.token}`
                        }
                    });
                    
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        dispatch(setUser(userData));
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
                
                // 🔥 THIS IS WHERE YOU ADD THE REDIRECT LOGIC 🔥
                // Check for saved redirect path (from 401 handler)
                const savedRedirect = sessionStorage.getItem('redirect_after_login');
                // Check for location state (from ProtectedRoute)
                const stateRedirect = (location.state as any)?.from?.pathname;
                
                // Priority: 1. Saved from 401, 2. Protected route redirect, 3. Dashboard
                const redirectPath = savedRedirect || stateRedirect || '/dashboard';
                
                // Clear the saved redirect
                if (savedRedirect) {
                    sessionStorage.removeItem('redirect_after_login');
                }
                
                // Navigate to the appropriate page
                navigate(redirectPath, { replace: true });
            }
        } catch (error: any) {
            setErrors({ 
                general: error.data?.message || 'Login failed. Please try again.' 
            });
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-700">{errors.general}</p>
                        </div>
                    )}
                    
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;