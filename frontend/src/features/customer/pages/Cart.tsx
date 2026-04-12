import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, useClearCartMutation } from '../../../services/api/cartApi';
import { usePlaceOrderMutation } from '../services/customerApi';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { data: cart, isLoading } = useGetCartQuery();
    const [updateQuantity] = useUpdateCartItemMutation();
    const [removeItem] = useRemoveCartItemMutation();
    const [clearCart] = useClearCartMutation();
    const [placeOrder, { isLoading: placingOrder }] = usePlaceOrderMutation();
    
    const [showCheckout, setShowCheckout] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        eventDate: '',
        eventAddress: '',
        eventType: 'Wedding',
        guestCount: 50,
    });

    const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
        if (newQuantity > 0) {
            await updateQuantity({ cartItemId, quantity: newQuantity });
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        await removeItem(cartItemId);
    };

    const handlePlaceOrder = async () => {
        if (!cart?.serviceId) return;
        
        try {
            const orderData = {
                cateringServiceId: cart.serviceId,
                items: cart.items.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                })),
                ...eventDetails,
                fromCart: true,
            };
            
            await placeOrder(orderData).unwrap();
            navigate('/orders');
        } catch (error) {
            alert('Failed to place order. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-4">Add some delicious items from our restaurants!</p>
                <button
                    onClick={() => navigate('/restaurants')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Browse Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            
            {cart.serviceName && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Ordering from:</p>
                    <p className="font-semibold text-lg">{cart.serviceName}</p>
                </div>
            )}

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 space-y-4">
                    {cart.items.map((item) => (
                        <div key={item.cartItemId} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.menuItemName}</h3>
                                <p className="text-gray-600">₹{item.price} each</p>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <p className="font-semibold w-20 text-right">₹{item.total}</p>
                                
                                <button
                                    onClick={() => handleRemoveItem(item.cartItemId)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-gray-50 p-6 border-t">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-600">Subtotal ({cart.totalItems} items)</p>
                            <p className="text-2xl font-bold text-gray-900">₹{cart.subtotal}</p>
                        </div>
                        <div className="space-x-3">
                            <button
                                onClick={() => clearCart()}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Clear Cart
                            </button>
                            <button
                                onClick={() => setShowCheckout(true)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Event Details</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Event Date</label>
                                <input
                                    type="date"
                                    value={eventDetails.eventDate}
                                    onChange={(e) => setEventDetails({...eventDetails, eventDate: e.target.value})}
                                    className="w-full border rounded-lg px-3 py-2"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Event Type</label>
                                <select
                                    value={eventDetails.eventType}
                                    onChange={(e) => setEventDetails({...eventDetails, eventType: e.target.value})}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option>Wedding</option>
                                    <option>Birthday</option>
                                    <option>Corporate</option>
                                    <option>Anniversary</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Guest Count</label>
                                <input
                                    type="number"
                                    value={eventDetails.guestCount}
                                    onChange={(e) => setEventDetails({...eventDetails, guestCount: parseInt(e.target.value)})}
                                    className="w-full border rounded-lg px-3 py-2"
                                    min={restaurant?.minOrderQuantity || 1}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Event Address</label>
                                <textarea
                                    value={eventDetails.eventAddress}
                                    onChange={(e) => setEventDetails({...eventDetails, eventAddress: e.target.value})}
                                    className="w-full border rounded-lg px-3 py-2"
                                    rows={3}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={placingOrder || !eventDetails.eventDate || !eventDetails.eventAddress}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {placingOrder ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;