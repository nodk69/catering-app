import React from 'react';
import { Link } from 'react-router-dom';
import { useGetCustomerOrdersQuery, useCancelOrderMutation } from '../services/customerApi';

const Orders: React.FC = () => {
    const { data: orders, isLoading } = useGetCustomerOrdersQuery();
    const [cancelOrder] = useCancelOrderMutation();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-blue-100 text-blue-800',
            PREPARING: 'bg-purple-100 text-purple-800',
            READY: 'bg-green-100 text-green-800',
            DELIVERED: 'bg-gray-100 text-gray-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleCancelOrder = async (orderId: number) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            await cancelOrder(orderId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-4">Start exploring restaurants to place your first order!</p>
                <Link
                    to="/restaurants"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-block"
                >
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                                <h3 className="font-semibold text-lg">{order.serviceName}</h3>
                                <p className="text-gray-600">{order.eventType} • {order.guestCount} guests</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(order.eventDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <p className="text-xl font-bold text-gray-900 mt-2">₹{order.totalAmount}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                            <p className="text-sm text-gray-500">
                                Ordered on {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                            <div className="space-x-3">
                                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                    <button
                                        onClick={() => handleCancelOrder(order.orderId)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                <Link
                                    to={`/orders/${order.orderId}`}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;