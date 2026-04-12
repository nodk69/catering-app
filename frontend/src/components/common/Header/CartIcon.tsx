import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { toggleCartDrawer, setCartSummary } from '../../../store/slices/cartSlice';
// import { useGetCartQuery } from '../../../services/api/cartApi';
import { useGetCartQuery } from '../../../api/cartApi';
import { useRole } from '../../../hooks';

export const CartIcon: React.FC = () => {
    const dispatch = useDispatch();
    const { isCustomer } = useRole();
    const itemCount = useSelector((state: RootState) => state.cart.itemCount);
    
    const { data: cart } = useGetCartQuery(undefined, {
        skip: !isCustomer,
        pollingInterval: 30000,
    });

    useEffect(() => {
        if (cart) {
            dispatch(setCartSummary({
                itemCount: cart.totalItems,
                subtotal: cart.subtotal,
            }));
        }
    }, [cart, dispatch]);

    if (!isCustomer) return null;

    return (
        <button
            onClick={() => dispatch(toggleCartDrawer())}
            className="relative p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-xl transition"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
            </svg>
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </button>
    );
};