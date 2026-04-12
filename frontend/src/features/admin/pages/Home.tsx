import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  TrendingUp,
  Shield,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  Activity,
  DollarSign,
  Package,
  Clock
} from 'lucide-react';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  const stats = [
    { 
      label: 'Total Users', 
      value: '2,847', 
      icon: <Users className="w-6 h-6" />,
      trend: '+12.5%',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Active Vendors', 
      value: '156', 
      icon: <Store className="w-6 h-6" />,
      trend: '+8.2%',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Total Orders', 
      value: '5,234', 
      icon: <ShoppingBag className="w-6 h-6" />,
      trend: '+23.1%',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Revenue', 
      value: '₹1.2Cr', 
      icon: <DollarSign className="w-6 h-6" />,
      trend: '+18.7%',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const quickActions = [
    { label: 'Manage Users', icon: <Users />, path: '/admin/users', color: 'blue' },
    { label: 'Approve Vendors', icon: <Store />, path: '/admin/vendors', color: 'green' },
    { label: 'View Reports', icon: <BarChart3 />, path: '/admin/reports', color: 'purple' },
    { label: 'Settings', icon: <Settings />, path: '/admin/settings', color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <button
              onClick={() => navigate('/admin/settings')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center">
              <Shield className="w-12 h-12 text-white/30 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Admin Control Panel
                </h2>
                <p className="text-indigo-100">
                  Manage users, vendors, and monitor platform performance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl bg-opacity-10`}>
                  <div className="text-gray-700">
                    {stat.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">{stat.trend}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`p-4 bg-${action.color}-50 rounded-xl text-center hover:bg-${action.color}-100 transition-colors group`}
              >
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <div className={`text-${action.color}-600`}>
                    {action.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {[
                { action: 'New vendor registered', time: '5 minutes ago', type: 'vendor' },
                { action: 'Order #1234 completed', time: '15 minutes ago', type: 'order' },
                { action: 'New user signed up', time: '1 hour ago', type: 'user' },
                { action: 'Payment processed', time: '2 hours ago', type: 'payment' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {[
                { name: 'Gourmet Catering', type: 'Vendor', time: '2 hours ago' },
                { name: 'Spice Route Restaurant', type: 'Vendor', time: '5 hours ago' },
                { name: 'Sweet Delights Bakery', type: 'Vendor', time: '1 day ago' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.type} • {item.time}</p>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;