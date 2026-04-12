import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Props {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

interface AuthState {
    auth: {
        token: string | null;
        user: { email: string; role: string } | null;
        isInitialized: boolean;
    }
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
    const { token, user, isInitialized } = useSelector((state: AuthState) => state.auth);
    const location = useLocation();

    // ✅ Show loading while auth is initializing
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Initializing...</p>
                </div>
            </div>
        );
    }

    // ✅ No token = not authenticated
    if (!token) {
        // Save the location they tried to access for redirect after login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // ✅ Token exists but user data still loading
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    // ✅ Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role?.replace('ROLE_', '') || 'CUSTOMER';
        
        if (!allowedRoles.includes(userRole)) {
            // Redirect to appropriate dashboard based on role
            const redirectPath = getDefaultRouteForRole(userRole);
            return <Navigate to={redirectPath} replace />;
        }
    }

    // ✅ Support both Outlet (for route nesting) and children (for direct wrapping)
    return children ? <>{children}</> : <Outlet />;
};

// Helper function to get default route based on role
const getDefaultRouteForRole = (role: string): string => {
    const roleRoutes: Record<string, string> = {
        'ADMIN': '/admin/dashboard',
        'VENDOR': '/vendor/dashboard',
        'CUSTOMER': '/dashboard',
    };
    
    return roleRoutes[role] || '/';
};

export default ProtectedRoute;