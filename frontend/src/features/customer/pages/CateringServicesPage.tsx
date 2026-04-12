import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllApprovedServicesQuery } from '../../vendor/services/vendorApi';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { CateringServiceResponse } from '../../vendor/vendor.types';

export const CateringServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<CateringServiceResponse | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');

  const { data: services = [], isLoading, error } = useGetAllApprovedServicesQuery();

  const filteredAndSortedServices = React.useMemo(() => {
    let filtered = services.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.vendorBusinessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return a.pricePerPlate - b.pricePerPlate;
      }
      return a.serviceName.localeCompare(b.serviceName);
    });
  }, [services, searchTerm, sortBy]);

  const handleOrderClick = (service: CateringServiceResponse) => {
    setSelectedService(service);
    setOrderQuantity(service.minOrderQuantity);
    setIsOrderModalOpen(true);
  };

  const handlePlaceOrder = () => {
    if (!selectedService) return;
    
    // Store order info in session storage or state management
    const orderData = {
      service: selectedService,
      quantity: orderQuantity,
      totalAmount: selectedService.pricePerPlate * orderQuantity,
    };
    
    sessionStorage.setItem('cateringOrder', JSON.stringify(orderData));
    setIsOrderModalOpen(false);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium">Failed to load services</h3>
        </div>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Catering Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Discover exceptional catering options for your special events. 
            From intimate gatherings to grand celebrations, find the perfect culinary experience.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name, description, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'name')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {filteredAndSortedServices.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              Showing {filteredAndSortedServices.length} catering {filteredAndSortedServices.length === 1 ? 'service' : 'services'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedServices.map((service) => (
                <Card key={service.serviceId} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {service.serviceName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {service.vendorBusinessName}
                      </p>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
                      {service.description}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Price per plate:</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${service.pricePerPlate.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Minimum order:</span>
                        <span className="font-medium text-gray-900">
                          {service.minOrderQuantity} plates
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      size="lg"
                      onClick={() => handleOrderClick(service)}
                    >
                      Order Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Check back later for new catering options'}
            </p>
          </Card>
        )}
      </div>

      {/* Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Place Catering Order"
      >
        {selectedService && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedService.serviceName}
              </h3>
              <p className="text-sm text-gray-500">
                by {selectedService.vendorBusinessName}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Plates
                </label>
                <Input
                  type="number"
                  min={selectedService.minOrderQuantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value) || selectedService.minOrderQuantity)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum order: {selectedService.minOrderQuantity} plates
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per plate:</span>
                    <span className="font-medium">${selectedService.pricePerPlate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{orderQuantity} plates</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ${(selectedService.pricePerPlate * orderQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setIsOrderModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handlePlaceOrder}
                disabled={orderQuantity < selectedService.minOrderQuantity}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};