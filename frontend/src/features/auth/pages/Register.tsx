// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../api/authApi';
import type { UserRole } from '../../../types/auth';
import { validateRegisterForm } from '../../../utils/validation';
import type { ValidationError } from '../../../utils/validation';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    role: UserRole;
    businessName: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();
    
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'CUSTOMER',  // Keep as CUSTOMER without ROLE_ prefix
        businessName: ''
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>('');
    
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const validationErrors = validateRegisterForm(formData);
        
        validationErrors.forEach((error: ValidationError) => {
            newErrors[error.field] = error.message;
        });
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');
        
        if (!validateForm()) {
            return;
        }
        
        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData).unwrap();
            
            navigate('/login', { 
                state: { message: 'Registration successful! Please login.' } 
            });
        } catch (error: any) {
            setGeneralError(error.data?.message || 'Registration failed. Please try again.');
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {generalError && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-700">{generalError}</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                                    errors.username ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 6 characters
                            </p>
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                                    errors.phone ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows={2}
                                required
                                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                                    errors.address ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.address}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Account Type
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                <option value="CUSTOMER">Customer</option>  {/* Fixed: Removed ROLE_ prefix */}
                                <option value="VENDOR">Vendor</option>      {/* Fixed: Removed ROLE_ prefix */}
                            </select>
                        </div>
                        
                        {formData.role === 'VENDOR' && (  // Fixed: Check for 'VENDOR' not 'ROLE_VENDOR'
                            <div>
                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                                    Business Name
                                </label>
                                <input
                                    id="businessName"
                                    name="businessName"
                                    type="text"
                                    required
                                    className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                                        errors.businessName ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {errors.businessName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating account...' : 'Register'}
                        </button>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;