import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetVendorOrdersQuery, useUpdateOrderStatusMutation } from '../services/vendorApi';

const VendorOrders: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const { data: orders, isLoading } = useGetVendorOrdersQuery(
        statusFilter !== 'ALL' ? { status: statusFilter } : undefined
    );
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        await updateOrderStatus({ orderId, status: newStatus });
    };

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

    const getNextStatus = (currentStatus: string): string[] => {
        const transitions: Record<string, string[]> = {
            PENDING: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['PREPARING', 'CANCELLED'],
            PREPARING: ['READY', 'CANCELLED'],
            READY: ['DELIVERED'],
        };
        return transitions[currentStatus] || [];
    };

    const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                            statusFilter === status
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {status === 'ALL' ? 'All Orders' : status}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : !orders || orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-500 text-lg">No orders found</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr className="text-left text-sm text-gray-600">
                                    <th className="px-6 py-3">Order #</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Event Date</th>
                                    <th className="px-6 py-3">Event Type</th>
                                    <th className="px-6 py-3">Guests</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.orderId} className="border-b last:border-b-0 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p>{order.customerName}</p>
                                                <p className="text-sm text-gray-500">{order.customerEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{new Date(order.eventDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{order.eventType}</td>
                                        <td className="px-6 py-4">{order.guestCount}</td>
                                        <td className="px-6 py-4 font-semibold">₹{order.totalAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/vendor/orders/${order.orderId}`}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                                                >
                                                    View
                                                </Link>
                                                {getNextStatus(order.status).length > 0 && (
                                                    <select
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleStatusUpdate(order.orderId, e.target.value);
                                                            }
                                                        }}
                                                        className="text-sm border rounded px-2 py-1"
                                                        defaultValue=""
                                                    >
                                                        <option value="">Update</option>
                                                        {getNextStatus(order.status).map(status => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorOrders;