import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl">🍽️</span>
                            <span className="text-xl font-bold">FoodCatering</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Delicious catering for every occasion. Making your events memorable with exceptional food and service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                            <li><Link to="/restaurants" className="hover:text-white transition">Restaurants</Link></li>
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* For Customers */}
                    <div>
                        <h3 className="font-semibold mb-4">For Customers</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/register" className="hover:text-white transition">Sign Up</Link></li>
                            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* For Vendors */}
                    <div>
                        <h3 className="font-semibold mb-4">For Vendors</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/vendor/register" className="hover:text-white transition">Partner With Us</Link></li>
                            <li><Link to="/vendor/login" className="hover:text-white transition">Vendor Login</Link></li>
                            <li><Link to="/vendor/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} FoodCatering. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};