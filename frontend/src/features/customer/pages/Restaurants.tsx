import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRestaurantsQuery } from '../services/customerApi';

const Restaurants: React.FC = () => {
    const { data: restaurants, isLoading } = useGetRestaurantsQuery();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRestaurants = restaurants?.filter(r => 
        r.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.vendorBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
                <p className="text-gray-600">{restaurants?.length || 0} restaurants available</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search restaurants or cuisines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg
                    className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Restaurant Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-4">
                            <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                            <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : filteredRestaurants?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No restaurants found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants?.map((restaurant) => (
                        <Link
                            key={restaurant.serviceId}
                            to={`/restaurant/${restaurant.serviceId}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            <div className="h-40 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                                <span className="text-4xl">🍽️</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-1">{restaurant.serviceName}</h3>
                                <p className="text-gray-600 text-sm mb-2">{restaurant.vendorBusinessName}</p>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{restaurant.description}</p>
                                <div className="flex items-center justify-between pt-3 border-t">
                                    <span className="text-indigo-600 font-semibold">
                                        ₹{restaurant.pricePerPlate}/plate
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Min {restaurant.minOrderQuantity} guests
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Restaurants;