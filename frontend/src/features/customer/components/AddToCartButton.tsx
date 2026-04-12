import React, { useState } from 'react';
import { useAddToCartMutation } from '../../../api/cartApi';
// import { useAddToCartMutation } from '../../services/api/cartApi';
import { useDispatch } from 'react-redux';
import { openCartDrawer } from '../../../store/slices/cartSlice';
// import { openCartDrawer } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

import { useRole } from '../../hooks/useRole';

interface AddToCartButtonProps {
    menuItemId: number;
    menuItemName: string;
    price: number;
    serviceId: number;
    className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    menuItemId,
    menuItemName,
    price,
    serviceId,
    className = '',
}) => {
    const [quantity, setQuantity] = useState(1);
    const [showQuantity, setShowQuantity] = useState(false);
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, isCustomer } = useRole();

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        if (!isCustomer) {
            alert('Only customers can add items to cart');
            return;
        }

        try {
            await addToCart({
                menuItemId,
                quantity,
                serviceId,
            }).unwrap();
            
            dispatch(openCartDrawer());
            setShowQuantity(false);
            setQuantity(1);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    return (
        <div className="relative">
            {!showQuantity ? (
                <button
                    onClick={() => setShowQuantity(true)}
                    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${className}`}
                >
                    Add to Cart - ₹{price}
                </button>
            ) : (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                        -
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                        +
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Adding...' : `Add ${quantity}`}
                    </button>
                    <button
                        onClick={() => setShowQuantity(false)}
                        className="px-2 py-2 text-gray-600 hover:text-gray-800"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};