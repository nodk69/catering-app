import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const stats = [
        { label: 'Total Users', value: '1,234', icon: '👥', color: 'bg-blue-500' },
        { label: 'Total Vendors', value: '56', icon: '🏪', color: 'bg-green-500' },
        { label: 'Total Orders', value: '892', icon: '📦', color: 'bg-purple-500' },
        { label: 'Revenue', value: '₹4.2L', icon: '💰', color: 'bg-yellow-500' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <span className="text-3xl">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <span className="text-3xl mb-3 block">👥</span>
                    <h3 className="text-lg font-semibold mb-1">Manage Users</h3>
                    <p className="text-gray-600 text-sm">View and manage all users</p>
                </Link>
                
                <Link to="/admin/vendors" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <span className="text-3xl mb-3 block">🏪</span>
                    <h3 className="text-lg font-semibold mb-1">Vendor Approvals</h3>
                    <p className="text-gray-600 text-sm">Review and approve new vendors</p>
                </Link>
                
                <Link to="/admin/reports" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <span className="text-3xl mb-3 block">📊</span>
                    <h3 className="text-lg font-semibold mb-1">Reports</h3>
                    <p className="text-gray-600 text-sm">View analytics and reports</p>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center py-2 border-b last:border-b-0">
                            <span className="text-2xl mr-3">
                                {i % 3 === 0 ? '🆕' : i % 2 === 0 ? '✅' : '📦'}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm">
                                    {i % 3 === 0 ? 'New vendor registration' : 
                                     i % 2 === 0 ? 'Order completed' : 
                                     'New order placed'}
                                </p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;