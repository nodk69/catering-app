import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useGetVendorStatsQuery, 
  useGetVendorOrdersQuery,
  useGetVendorServicesQuery 
} from '../services/vendorApi';
// import { Card } from '../../../components/ui/Card/Card';
import Card from '../../../components/ui/Card/Card';
// import { Button } from '../../../components/ui/Button/Button';
import Button from '../../../components/ui/Button/Button';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Users, 
  Star,
  Calendar,
  ArrowUp,
  ArrowDown,
  Package,
  AlertCircle,
  ChevronRight,
  Plus,
  BarChart3,
  Menu as MenuIcon,
  Settings,
  Bell,
//   MoreVertical
} from 'lucide-react';

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, trend, color, subtitle }) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
    <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.replace('text', 'bg')}`}></div>
  </Card>
);

// Order Status Badge Component
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    PENDING: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      label: 'Pending',
      icon: <Clock className="w-3 h-3 mr-1" />
    },
    CONFIRMED: { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      label: 'Confirmed',
      icon: <CheckCircle className="w-3 h-3 mr-1" />
    },
    PREPARING: { 
      color: 'bg-purple-100 text-purple-800 border-purple-200', 
      label: 'Preparing',
      icon: <Package className="w-3 h-3 mr-1" />
    },
    READY: { 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
      label: 'Ready',
      icon: <CheckCircle className="w-3 h-3 mr-1" />
    },
    DELIVERED: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      label: 'Delivered',
      icon: <CheckCircle className="w-3 h-3 mr-1" />
    },
    CANCELLED: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      label: 'Cancelled',
      icon: <AlertCircle className="w-3 h-3 mr-1" />
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Main Dashboard Component
const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useGetVendorStatsQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetVendorOrdersQuery();
  const { data: services = [] } = useGetVendorServicesQuery();

  // Calculate metrics
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const activeOrders = orders.filter(o => ['CONFIRMED', 'PREPARING', 'READY'].includes(o.status));
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.orderDate);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const totalRevenue = orders.reduce((sum, order) => 
    order.status !== 'CANCELLED' ? sum + order.totalAmount : sum, 0
  );

  const averageOrderValue = orders.length > 0 
    ? totalRevenue / orders.filter(o => o.status !== 'CANCELLED').length 
    : 0;

  // Get upcoming events (orders in next 7 days)
  const upcomingEvents = orders
    .filter(o => {
      const eventDate = new Date(o.eventDate);
      const today = new Date();
      const nextWeek = new Date(today.setDate(today.getDate() + 7));
      return eventDate <= nextWeek && o.status !== 'CANCELLED';
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5);

  // Revenue chart data (mock - replace with real data)
  const revenueData = [
    { day: 'Mon', amount: 12500 },
    { day: 'Tue', amount: 15000 },
    { day: 'Wed', amount: 18000 },
    { day: 'Thu', amount: 14500 },
    { day: 'Fri', amount: 22000 },
    { day: 'Sat', amount: 28000 },
    { day: 'Sun', amount: 19500 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.amount));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedPeriod('today')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedPeriod === 'today'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedPeriod === 'week'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedPeriod === 'month'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {pendingOrders.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {pendingOrders.length > 0 ? (
                        pendingOrders.slice(0, 5).map(order => (
                          <div key={order.orderId} className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
                            <p className="text-sm font-medium text-gray-900">
                              New order from {order.customerName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Event: {new Date(order.eventDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-semibold text-indigo-600 mt-1">
                              ₹{order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-gray-500">No new notifications</p>
                      )}
                    </div>
                    {pendingOrders.length > 5 && (
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link 
                          to="/vendor/orders?status=PENDING" 
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          View all pending orders →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Vendor'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'V'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name || 'Vendor'}! 👋
                </h1>
                <p className="text-indigo-100 text-lg">
                  {pendingOrders.length > 0 
                    ? `You have ${pendingOrders.length} pending order${pendingOrders.length > 1 ? 's' : ''} waiting for confirmation`
                    : 'Everything looks great! Ready for new orders?'
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                  onClick={() => navigate('/vendor/catering-services')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Service
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-indigo-600"
                  onClick={() => navigate('/vendor/orders')}
                >
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            trend={12.5}
            color="text-green-600"
            subtitle="Lifetime earnings"
          />
          <StatsCard
            title="Total Orders"
            value={orders.length}
            icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
            trend={8.2}
            color="text-blue-600"
            subtitle={`${todayOrders.length} today`}
          />
          <StatsCard
            title="Active Orders"
            value={activeOrders.length}
            icon={<Package className="w-6 h-6 text-purple-600" />}
            color="text-purple-600"
            subtitle="In progress"
          />
          <StatsCard
            title="Average Order"
            value={`₹${averageOrderValue.toFixed(0).toLocaleString()}`}
            icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
            trend={-2.3}
            color="text-orange-600"
            subtitle="Per order"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Revenue Chart & Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                  <p className="text-sm text-gray-500">Last 7 days</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/vendor/analytics')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Detailed Analytics
                </Button>
              </div>
              
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end justify-between">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="relative w-full px-2">
                        <div 
                          className="bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500"
                          style={{ 
                            height: `${(data.amount / maxRevenue) * 200}px`,
                            minHeight: '4px'
                          }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs font-medium bg-gray-800 text-white px-2 py-1 rounded">
                              ₹{data.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 mt-2">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Services Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Services</h2>
                  <p className="text-sm text-gray-500">Active catering services</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/vendor/catering-services')}>
                  Manage Services
                </Button>
              </div>

              {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.slice(0, 4).map((service) => (
                    <div 
                      key={service.serviceId}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/vendor/catering-services/${service.serviceId}/menu`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{service.serviceName}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          service.available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {service.available ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-600">Price per plate</p>
                          <p className="text-lg font-semibold text-indigo-600">
                            ₹{service.pricePerPlate.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Min order</p>
                          <p className="font-medium text-gray-900">
                            {service.minOrderQuantity} guests
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Status: {service.approvalStatus || 'Pending'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium mb-1">No services yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Create your first catering service</p>
                  <Button variant="primary" onClick={() => navigate('/vendor/catering-services')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Service
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Upcoming Events & Recent Orders */}
          <div className="space-y-6">
            {/* Pending Orders Alert */}
            {pendingOrders.length > 0 && (
              <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 mb-1">
                      Pending Orders Need Attention
                    </h3>
                    <p className="text-sm text-orange-700 mb-3">
                      You have {pendingOrders.length} order{pendingOrders.length > 1 ? 's' : ''} waiting for confirmation
                    </p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate('/vendor/orders?status=PENDING')}
                    >
                      Review Orders
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Upcoming Events */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                  <p className="text-sm text-gray-500">Next 7 days</p>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div 
                      key={event.orderId}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/vendor/orders/${event.orderId}`)}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex flex-col items-center justify-center mr-3">
                        <span className="text-xs font-medium text-indigo-600">
                          {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-indigo-700">
                          {new Date(event.eventDate).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.items?.length || 0} items • {event.numberOfGuests || event.minOrderQuantity} guests
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{event.totalAmount.toLocaleString()}
                        </p>
                        <OrderStatusBadge status={event.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  No upcoming events this week
                </p>
              )}
            </Card>

            {/* Recent Orders */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-500">Latest 5 orders</p>
                </div>
                <Button variant="link" size="sm" onClick={() => navigate('/vendor/orders')}>
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {orders.slice(0, 5).length > 0 ? (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <div 
                      key={order.orderId}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      onClick={() => navigate(`/vendor/orders/${order.orderId}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {order.orderNumber || `#${order.orderId.slice(0, 8)}`}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-gray-600 truncate">{order.customerName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  No orders yet
                </p>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Order Completion Rate</span>
                    <span className="font-medium text-gray-900">
                      {orders.length > 0 
                        ? `${((orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: orders.length > 0 
                          ? `${(orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-medium text-gray-900">4.8 / 5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium text-gray-900">2.5 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;