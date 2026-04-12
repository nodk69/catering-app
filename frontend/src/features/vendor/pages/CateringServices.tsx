import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';
import { Modal } from '../../../components/ui/Modal/Modal';
import { CateringServiceForm } from '../components/CateringServiceForm';
import {
  useCreateCateringServiceMutation,
  useGetVendorServicesQuery,
  useDeleteCateringServiceMutation,
  useToggleServiceAvailabilityMutation,
} from '../services/vendorApi';
import type { CreateCateringServiceRequest, CateringServiceResponse } from '../vendor.types';
import { toast } from 'react-hot-toast';

export const CateringServices: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<CateringServiceResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: services = [], isLoading, refetch } = useGetVendorServicesQuery();
  const [createService, { isLoading: isCreating }] = useCreateCateringServiceMutation();
  const [deleteService] = useDeleteCateringServiceMutation();
  const [toggleAvailability] = useToggleServiceAvailabilityMutation();

  const handleCreateService = async (data: CreateCateringServiceRequest) => {
    try {
      const response = await createService(data).unwrap();
      toast.success(response.message || 'Service created successfully!');
      setIsCreateModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create service');
      console.error('Failed to create service:', error);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;
    
    try {
      const response = await deleteService(selectedService.serviceId).unwrap();
      toast.success(response.message || 'Service deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedService(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete service');
      console.error('Failed to delete service:', error);
    }
  };

  const handleToggleAvailability = async (service: CateringServiceResponse) => {
    try {
      const response = await toggleAvailability({
        id: service.serviceId,
        available: !service.available,
      }).unwrap();
      toast.success(response.message || `Service ${!service.available ? 'activated' : 'deactivated'} successfully!`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update availability');
      console.error('Failed to toggle availability:', error);
    }
  };

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      APPROVED: { color: 'green', label: 'Approved' },
      PENDING: { color: 'yellow', label: 'Pending Approval' },
      REJECTED: { color: 'red', label: 'Rejected' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'gray', label: status || 'Unknown' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catering Services</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your catering services and offerings
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Service
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.serviceId} className="hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.serviceName}
                    </h3>
                    {getStatusBadge(service.approvalStatus)}
                  </div>
                  <div className="relative ml-2">
                    <button
                      onClick={() => handleToggleAvailability(service)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        service.available ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className="sr-only">
                        {service.available ? 'Deactivate' : 'Activate'} service
                      </span>
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          service.available ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price per plate:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${service.pricePerPlate.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Min. order:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {service.minOrderQuantity} plates
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/vendor/catering-services/${service.serviceId}/menu`)}
                  >
                    Manage Menu
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/vendor/catering-services/edit/${service.serviceId}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedService(service);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'Get started by creating a new catering service'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Service
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Create Service Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Catering Service"
        size="lg"
      >
        <CateringServiceForm
          onSubmit={handleCreateService}
          isLoading={isCreating}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedService(null);
        }}
        title="Delete Catering Service"
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Delete Service
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete "{selectedService?.serviceName}"? 
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedService(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteService}>
              Delete Service
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};