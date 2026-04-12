import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Lazy load components
const CustomerHome = React.lazy(() => import('../../../features/customer/pages/Home'));
const VendorHome = React.lazy(() => import('../../../features/vendor/pages/VendorHome'));
// const AdminHome = React.lazy(() => import('../../../features/admin/pages/Home'));
const AdminHome = React.lazy(() => import('../../../features/admin/pages/Home'));

// Role-based home page configuration
const HOME_PAGE_CONFIG = {
  VENDOR: {
    component: VendorHome,
    defaultRedirect: '/vendor/dashboard',
    title: 'Vendor Dashboard'
  },
  ADMIN: {
    component: AdminHome,
    defaultRedirect: '/admin/dashboard',
    title: 'Admin Dashboard'
  },
  CUSTOMER: {
    component: CustomerHome,
    defaultRedirect: '/dashboard',
    title: 'Customer Dashboard'
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  
  // Get user role
  const getUserRole = () => {
    if (!user) return 'CUSTOMER';
    
    // Handle different role formats
    const role = user.role || 
                 user.authorities?.[0]?.authority?.replace('ROLE_', '') || 
                 'CUSTOMER';
    
    return role.toUpperCase();
  };

  // Check if user should be redirected to their dashboard
  const shouldRedirectToDashboard = () => {
    // If user is authenticated and on the home page, maybe they want their dashboard?
    // This is optional - you can remove this if you want to always show the home page
    const path = window.location.pathname;
    
    if (isAuthenticated && path === '/') {
      const role = getUserRole();
      const config = HOME_PAGE_CONFIG[role as keyof typeof HOME_PAGE_CONFIG];
      
      // You can uncomment this if you want to redirect authenticated users to their dashboard
      return config ? config.defaultRedirect : '/dashboard';
    }
    
    return null;
  };

  // Loading component with animation
  const LoadingFallback = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">Loading your experience...</p>
      </div>
    </div>
  );

  // Error boundary fallback
  const ErrorFallback = ({ error }: { error: Error }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  // Check for redirect
  const redirectPath = shouldRedirectToDashboard();
  if (redirectPath) {
    // Using window.location for a full page reload if needed
    // Or use navigate for client-side routing
    useEffect(() => {
      navigate(redirectPath);
    }, []);
    return <LoadingFallback />;
  }

  // Get the appropriate home component based on role
  const getHomeComponent = () => {
    const role = getUserRole();
    const config = HOME_PAGE_CONFIG[role as keyof typeof HOME_PAGE_CONFIG];
    
    if (!config) {
      // Default to customer home if role not found
      return CustomerHome;
    }
    
    return config.component;
  };

  const HomeComponent = getHomeComponent();

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <HomeComponent />
    </React.Suspense>
  );
};

export default Home;