import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCustomerOrdersQuery } from '../services/customerApi';
import { useGetCartQuery } from '../../../api/cartApi';
import { useGetAllApprovedServicesQuery } from '../../vendor/services/vendorApi';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  Star,
  Heart,
  ArrowRight,
  Package,
  DollarSign,
  Bell,
  Settings,
  ChevronRight,
  Plus,
  Gift,
  Sparkles,
  Coffee,
  Utensils
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const { data: orders = [] } = useGetCustomerOrdersQuery();
  const { data: cart } = useGetCartQuery();
  const { data: services = [] } = useGetAllApprovedServicesQuery();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'orders' | 'favorites'>('overview');

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const recentOrders = orders.slice(0, 5);
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');
  
  const totalSpent = orders.reduce((sum, order) => 
    order.status !== 'CANCELLED' ? sum + order.totalAmount : sum, 0
  );

  const upcomingEvents = orders
    .filter(o => {
      const eventDate = new Date(o.eventDate);
      const today = new Date();
      return eventDate >= today && !['DELIVERED', 'CANCELLED'].includes(o.status);
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const recommendedServices = services
    .filter(() => Math.random() > 0.5)
    .slice(0, 4);

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      PENDING: <Clock className="w-5 h-5 text-yellow-500" />,
      CONFIRMED: <CheckCircle className="w-5 h-5 text-blue-500" />,
      PREPARING: <Package className="w-5 h-5 text-purple-500" />,
      READY: <CheckCircle className="w-5 h-5 text-green-500" />,
      DELIVERED: <CheckCircle className="w-5 h-5 text-gray-500" />,
      CANCELLED: <Clock className="w-5 h-5 text-red-500" />,
    };
    return icons[status] || <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      PREPARING: 'bg-purple-100 text-purple-800 border-purple-200',
      READY: 'bg-green-100 text-green-800 border-green-200',
      DELIVERED: 'bg-gray-100 text-gray-800 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || user?.email?.split('@')[0]}!</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {activeOrders.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {activeOrders.length > 0 
                  ? `You have ${activeOrders.length} active order${activeOrders.length > 1 ? 's' : ''}`
                  : 'Ready to plan your next event?'
                }
              </h2>
              <p className="text-indigo-100">
                {activeOrders.length > 0 
                  ? 'Track your orders and get real-time updates'
                  : 'Explore our curated selection of premium caterers'
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/catering')}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{cart?.totalItems || 0}</p>
            <p className="text-gray-600 text-sm">Items in Cart</p>
            {cart && cart.totalItems > 0 && (
              <button
                onClick={() => navigate('/cart')}
                className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center"
              >
                View Cart
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
            <p className="text-gray-600 text-sm">Active Orders</p>
            {activeOrders.length > 0 && (
              <button
                onClick={() => setSelectedTab('orders')}
                className="mt-3 text-green-600 text-sm font-medium hover:text-green-700 flex items-center"
              >
                Track Orders
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
            <p className="text-gray-600 text-sm">Completed Orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Total Spent</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { icon: <Utensils className="w-5 h-5" />, label: 'Browse Menu', path: '/catering', color: 'indigo' },
              { icon: <ShoppingBag className="w-5 h-5" />, label: 'View Cart', path: '/cart', color: 'green' },
              { icon: <Calendar className="w-5 h-5" />, label: 'My Orders', path: '/orders', color: 'blue' },
              { icon: <Heart className="w-5 h-5" />, label: 'Favorites', path: '/favorites', color: 'pink' },
              { icon: <Gift className="w-5 h-5" />, label: 'Offers', path: '/offers', color: 'orange' },
              { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/profile', color: 'gray' },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`p-4 bg-${action.color}-50 rounded-xl text-center hover:bg-${action.color}-100 transition-colors group`}
              >
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  <div className={`text-${action.color}-600`}>
                    {action.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                    <p className="text-sm text-gray-500">Your scheduled catering events</p>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.orderId}
                      className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/orders/${event.orderId}`)}
                    >
                      <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl flex flex-col items-center justify-center mr-4 shadow-sm">
                        <span className="text-xs font-medium text-indigo-600">
                          {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-indigo-700">
                          {new Date(event.eventDate).getDate()}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-semibold text-gray-900">{event.serviceName}</h4>
                          <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.guestCount || event.minOrderQuantity} guests
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.deliveryAddress || 'Address not provided'}
                          </span>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <p className="text-sm text-gray-500">Your latest catering orders</p>
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium text-gray-900">{order.serviceName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.eventDate).toLocaleDateString()} • {order.guestCount || order.minOrderQuantity} guests
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-gray-900 font-medium mb-1">No orders yet</h4>
                  <p className="text-gray-500 text-sm mb-4">Start exploring our catering services</p>
                  <button
                    onClick={() => navigate('/catering')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Browse Caterers
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recommendations & Tips */}
          <div className="space-y-8">
            {/* Recommended for You */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
                  <p className="text-sm text-gray-500">Based on your preferences</p>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>

              <div className="space-y-3">
                {recommendedServices.map((service) => (
                  <div
                    key={service.serviceId}
                    className="group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/catering/${service.serviceId}`)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{service.serviceName}</h4>
                        <p className="text-sm text-gray-500 truncate">{service.vendorBusinessName}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold text-indigo-600">
                            ₹{service.pricePerPlate}/plate
                          </span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-100 p-6">
              <div className="flex items-center mb-4">
                <Coffee className="w-5 h-5 text-amber-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Quick Tips</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Book at least 2 weeks in advance for best availability",
                  "Specify dietary restrictions when placing your order",
                  "Check out our seasonal specials for exclusive deals",
                  "Join our loyalty program to earn rewards"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <Gift className="w-8 h-8 mb-3" />
                <h4 className="text-xl font-bold mb-2">First Order Special!</h4>
                <p className="text-purple-100 mb-4">
                  Get 15% off on your first catering order. Use code:
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 mb-4 text-center">
                  <span className="text-2xl font-bold tracking-wider">WELCOME15</span>
                </div>
                <button
                  onClick={() => navigate('/catering')}
                  className="w-full py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Claim Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;