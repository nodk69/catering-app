import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = 'Loading...', 
    size = 'md' 
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-indigo-600 mx-auto`}></div>
                {message && <p className="mt-4 text-gray-600">{message}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;