import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRestaurantByIdQuery, useGetMenuByServiceQuery } from '../services/customerApi';
import { AddToCartButton } from '../components/AddToCartButton';

const Menu: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const serviceId = parseInt(id || '0');
    
    const { data: restaurant, isLoading: loadingRestaurant } = useGetRestaurantByIdQuery(serviceId);
    const { data: menuItems, isLoading: loadingMenu } = useGetMenuByServiceQuery(serviceId);
    
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...new Set(menuItems?.map(item => item.category) || [])];
    
    const filteredItems = selectedCategory === 'All' 
        ? menuItems 
        : menuItems?.filter(item => item.category === selectedCategory);

    if (loadingRestaurant || loadingMenu) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Restaurant not found</p>
                <button onClick={() => navigate('/restaurants')} className="mt-4 text-indigo-600">
                    Back to Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Restaurant Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <button
                    onClick={() => navigate('/restaurants')}
                    className="text-indigo-600 mb-4 flex items-center hover:text-indigo-800"
                >
                    ← Back to Restaurants
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.serviceName}</h1>
                <p className="text-gray-600 mb-2">{restaurant.vendorBusinessName}</p>
                <p className="text-gray-500">{restaurant.description}</p>
                <div className="mt-4 flex items-center space-x-6">
                    <div>
                        <span className="text-sm text-gray-500">Price per plate</span>
                        <p className="text-xl font-semibold text-indigo-600">₹{restaurant.pricePerPlate}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Minimum order</span>
                        <p className="text-lg">{restaurant.minOrderQuantity} guests</p>
                    </div>
                </div>
            </div>

            {/* Menu Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                            selectedCategory === category
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Menu Items */}
            {filteredItems?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No menu items available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItems?.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    {!item.isAvailable && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                            Unavailable
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm mb-1">{item.category}</p>
                                <p className="text-indigo-600 font-semibold">₹{item.price}</p>
                            </div>
                            {item.isAvailable && (
                                <AddToCartButton
                                    menuItemId={item.id}
                                    menuItemName={item.name}
                                    price={item.price}
                                    serviceId={serviceId}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;