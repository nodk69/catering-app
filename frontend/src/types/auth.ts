// src/types/auth.ts

export type UserRole = 'VENDOR' | 'CUSTOMER' | 'ADMIN';

export interface LoginResponse {
    message: string;
    token: string;
}

export interface UserMeResponse {
    email: string;
    role: string;  // Changed from UserRole to string to match backend
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: UserRole;
    businessName?: string;
}

// Add these additional types that might be needed
export interface ApiError {
    message: string;
    status?: number;
}

export interface AuthState {
    token: string | null;
    user: UserMeResponse | null;
    isInitialized: boolean;
}