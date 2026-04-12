import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
// import { useLogoutMutation } from '../../../services/api/authApi';
import { useLogoutMutation } from '../../../api/authApi';
import { logout as logoutAction } from '../../../store/slices/authSlice';
import { CartIcon } from './CartIcon';
import type { RootState } from '../../../store';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const { isCustomer, isVendor, isAdmin, role } = useRole();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
    
    // Debug: Check auth state
    const authState = useSelector((state: RootState) => state.auth);
    console.log('Header Auth State:', { isAuthenticated, token: !!authState.token, user: !!authState.user });
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            dispatch(logoutAction());
            navigate('/');
            setIsProfileDropdownOpen(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', showAlways: true },
        { name: 'Restaurants', path: '/restaurants', showAlways: true },
        { name: 'Dashboard', path: '/dashboard', showWhen: isCustomer },
        { name: 'My Orders', path: '/orders', showWhen: isCustomer },
        { name: 'Vendor Dashboard', path: '/vendor/dashboard', showWhen: isVendor },
        { name: 'Menu Manager', path: '/vendor/menu', showWhen: isVendor },
        { name: 'Vendor Orders', path: '/vendor/orders', showWhen: isVendor },
        { name: 'Admin Panel', path: '/admin/dashboard', showWhen: isAdmin },
    ].filter(link => link.showAlways || link.showWhen);

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const getRoleBadge = () => {
        const badges: Record<string, { text: string; color: string; gradient: string }> = {
            ROLE_CUSTOMER: { 
                text: 'Customer', 
                color: 'bg-blue-100 text-blue-800',
                gradient: 'from-blue-500 to-cyan-500'
            },
            ROLE_VENDOR: { 
                text: 'Vendor', 
                color: 'bg-green-100 text-green-800',
                gradient: 'from-green-500 to-emerald-500'
            },
            ROLE_ADMIN: { 
                text: 'Admin', 
                color: 'bg-purple-100 text-purple-800',
                gradient: 'from-purple-500 to-pink-500'
            },
        };
        return role ? badges[role] : null;
    };

    const roleBadge = getRoleBadge();
    const userInitial = user?.email?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U';
    const userDisplayName = user?.email?.split('@')[0] || user?.username || 'User';

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
        }`}>
            {/* Top Bar */}
            <div className="hidden lg:block border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-8 text-sm">
                        <div className="flex items-center space-x-6 text-gray-500">
                            <a href="tel:+18001234567" className="flex items-center hover:text-indigo-600 transition">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +1 (800) 123-4567
                            </a>
                            <a href="mailto:support@foodcatering.com" className="flex items-center hover:text-indigo-600 transition">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.828 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                support@foodcatering.com
                            </a>
                        </div>
                        <div className="flex items-center space-x-4">
                            {!isAuthenticated && (
                                <>
                                    <Link to="/vendor/register" className="text-gray-500 hover:text-indigo-600 transition">
                                        🏪 Become a Vendor
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                </>
                            )}
                            <Link to="/help" className="text-gray-500 hover:text-indigo-600 transition">
                                ❓ Help Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all ${
                            roleBadge 
                                ? `bg-gradient-to-br ${roleBadge.gradient}` 
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        }`}>
                            <span className="text-white text-xl">🍽️</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                FoodCatering
                            </span>
                            <span className="text-[10px] text-gray-500 -mt-0.5 tracking-wider">PREMIUM CATERING</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 rounded-lg font-medium transition-all ${
                                    isActive(link.path)
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-1">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-xl transition"
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Cart Icon */}
                        {isCustomer && <CartIcon />}

                        {/* Auth Section */}
                        {!isAuthenticated ? (
                            <div className="flex items-center space-x-2 ml-1">
                                <Link
                                    to="/login"
                                    className="hidden sm:inline-block px-4 py-2.5 text-gray-700 hover:text-indigo-600 font-medium transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium transition-all shadow-md hover:shadow-lg"
                                >
                                    Get Started ✨
                                </Link>
                            </div>
                        ) : (
                            <div className="relative ml-1" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    aria-label="User menu"
                                    aria-expanded={isProfileDropdownOpen}
                                >
                                    <div className="relative">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
                                            roleBadge 
                                                ? `bg-gradient-to-br ${roleBadge.gradient}` 
                                                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        }`}>
                                            <span className="text-white font-semibold text-sm">
                                                {userInitial}
                                            </span>
                                        </div>
                                        {roleBadge && (
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${roleBadge.color.split(' ')[0]} border-2 border-white rounded-full`} />
                                        )}
                                    </div>
                                    <div className="hidden lg:flex flex-col items-start">
                                        <span className="text-sm font-semibold text-gray-800 leading-tight max-w-[120px] truncate">
                                            {userDisplayName}
                                        </span>
                                        {roleBadge && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${roleBadge.color} font-medium`}>
                                                {roleBadge.text}
                                            </span>
                                        )}
                                    </div>
                                    <svg
                                        className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform ${
                                            isProfileDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* User Info */}
                                        <div className={`px-5 py-4 bg-gradient-to-r ${
                                            roleBadge ? roleBadge.gradient.replace('500', '50').replace('600', '50') : 'from-indigo-50 to-purple-50'
                                        } border-b border-gray-100`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                                                    roleBadge ? `bg-gradient-to-br ${roleBadge.gradient}` : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                                }`}>
                                                    <span className="text-white font-bold text-lg">{userInitial}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {userDisplayName}
                                                    </p>
                                                    <p className="text-xs text-gray-600 truncate">
                                                        {user?.email}
                                                    </p>
                                                    {roleBadge && (
                                                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${roleBadge.color} font-medium mt-1`}>
                                                            {roleBadge.text}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation Links */}
                                        <div className="py-2">
                                            {isCustomer && (
                                                <>
                                                    <DropdownLink to="/dashboard" icon="🏠" onClick={() => setIsProfileDropdownOpen(false)}>Dashboard</DropdownLink>
                                                    <DropdownLink to="/orders" icon="📋" onClick={() => setIsProfileDropdownOpen(false)}>My Orders</DropdownLink>
                                                    <DropdownLink to="/cart" icon="🛒" onClick={() => setIsProfileDropdownOpen(false)}>
                                                        Cart
                                                        <CartBadge />
                                                    </DropdownLink>
                                                    <DropdownLink to="/favorites" icon="❤️" onClick={() => setIsProfileDropdownOpen(false)}>Favorites</DropdownLink>
                                                </>
                                            )}
                                            
                                            {isVendor && (
                                                <>
                                                    <DropdownLink to="/vendor/dashboard" icon="📊" onClick={() => setIsProfileDropdownOpen(false)}>Dashboard</DropdownLink>
                                                    <DropdownLink to="/vendor/menu" icon="🍽️" onClick={() => setIsProfileDropdownOpen(false)}>Menu Manager</DropdownLink>
                                                    <DropdownLink to="/vendor/orders" icon="📦" onClick={() => setIsProfileDropdownOpen(false)}>Orders</DropdownLink>
                                                    <DropdownLink to="/vendor/analytics" icon="📈" onClick={() => setIsProfileDropdownOpen(false)}>Analytics</DropdownLink>
                                                </>
                                            )}
                                            
                                            {isAdmin && (
                                                <>
                                                    <DropdownLink to="/admin/dashboard" icon="👑" onClick={() => setIsProfileDropdownOpen(false)}>Admin Dashboard</DropdownLink>
                                                    <DropdownLink to="/admin/users" icon="👥" onClick={() => setIsProfileDropdownOpen(false)}>Manage Users</DropdownLink>
                                                    <DropdownLink to="/admin/vendors" icon="🏪" onClick={() => setIsProfileDropdownOpen(false)}>Vendor Approvals</DropdownLink>
                                                    <DropdownLink to="/admin/reports" icon="📊" onClick={() => setIsProfileDropdownOpen(false)}>Reports</DropdownLink>
                                                </>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-100 py-2">
                                            <DropdownLink to="/profile" icon="⚙️" onClick={() => setIsProfileDropdownOpen(false)}>Settings</DropdownLink>
                                            <DropdownLink to="/help" icon="❓" onClick={() => setIsProfileDropdownOpen(false)}>Help & Support</DropdownLink>
                                        </div>

                                        <div className="border-t border-gray-100 py-2">
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="w-full flex items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                            >
                                                <span className="w-6 text-center mr-3">🚪</span>
                                                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {isSearchOpen && (
                    <div className="py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="🔍 Search for restaurants, cuisines, or dishes..."
                                className="w-full px-5 py-3.5 pl-12 pr-28 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md">
                                Search
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition ${
                                        isActive(link.path)
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

// Cart Badge Component
const CartBadge: React.FC = () => {
    const itemCount = useSelector((state: RootState) => state.cart.itemCount);
    if (itemCount === 0) return null;
    return (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {itemCount}
        </span>
    );
};

// Dropdown Link Component
interface DropdownLinkProps {
    to: string;
    icon: string;
    onClick: () => void;
    children: React.ReactNode;
}

const DropdownLink: React.FC<DropdownLinkProps> = ({ to, icon, onClick, children }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
    >
        <span className="w-6 text-center mr-3 text-base">{icon}</span>
        <span className="flex-1">{children}</span>
    </Link>
);