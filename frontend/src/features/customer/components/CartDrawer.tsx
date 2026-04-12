import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { RootState } from '../../../store';
// import { RootState } from '../../../store';
import { closeCartDrawer } from '../../../store/slices/cartSlice';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '../../../api/cartApi';


interface RootState {
    cart: {
        isCartOpen: boolean;
        itemCount: number;
        subtotal: number;
    };
    auth: {
        token: string | null;
        user: { email: string; role: string } | null;
    };
}

export const CartDrawer: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isCartOpen = useSelector((state: RootState) => state.cart.isCartOpen);
    
    const { data: cart } = useGetCartQuery(undefined, { skip: !isCartOpen });
    const [updateQuantity] = useUpdateCartItemMutation();
    const [removeItem] = useRemoveCartItemMutation();

    const handleViewCart = () => {
        dispatch(closeCartDrawer());
        navigate('/cart');
    };

    const handleCheckout = () => {
        dispatch(closeCartDrawer());
        navigate('/cart');
    };

    if (!isCartOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => dispatch(closeCartDrawer())} />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Your Cart</h2>
                    <button onClick={() => dispatch(closeCartDrawer())} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {!cart || cart.items.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.cartItemId} className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <p className="font-medium">{item.menuItemName}</p>
                                        <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity - 1 })}
                                            className="w-7 h-7 bg-gray-200 rounded-full"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity + 1 })}
                                            className="w-7 h-7 bg-gray-200 rounded-full"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.cartItemId)}
                                            className="ml-2 text-red-500"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart && cart.items.length > 0 && (
                    <div className="border-t p-4">
                        <div className="flex justify-between mb-4">
                            <span className="font-semibold">Total:</span>
                            <span className="font-semibold">₹{cart.subtotal}</span>
                        </div>
                        <button onClick={handleViewCart} className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            View Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};