// src/utils/validation.ts

export interface ValidationError {
    field: string;
    message: string;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const sanitizeInput = (input: string): string => {
    return input.replace(/[<>'"]/g, '').trim();
};

export const validateRegisterForm = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!data.username || data.username.length < 3) {
        errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
    }
    
    if (!validateEmail(data.email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }
    
    if (!validatePassword(data.password)) {
        errors.push({ 
            field: 'password', 
            message: 'Password must be at least 6 characters' 
        });
    }
    
    if (!data.phone || data.phone.length < 10) {
        errors.push({ field: 'phone', message: 'Phone number must be at least 10 digits' });
    }
    
    if (!data.address || data.address.trim().length === 0) {
        errors.push({ field: 'address', message: 'Address is required' });
    }
    
    // Fixed: Check for 'VENDOR' not 'ROLE_VENDOR'
    if (data.role === 'VENDOR' && (!data.businessName || data.businessName.trim().length === 0)) {
        errors.push({ field: 'businessName', message: 'Business name is required for vendors' });
    }
    
    return errors;
};

export default {
    validateEmail,
    validatePassword,
    sanitizeInput,
    validateRegisterForm
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};