import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Card } from '../../../components/ui/Card/Card';
import type { CreateCateringServiceRequest } from '../vendor.types';

interface CateringServiceFormProps {
  initialData?: Partial<CreateCateringServiceRequest>;
  onSubmit: (data: CreateCateringServiceRequest) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const CateringServiceForm: React.FC<CateringServiceFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateCateringServiceRequest>({
    serviceName: initialData?.serviceName || '',
    description: initialData?.description || '',
    pricePerPlate: initialData?.pricePerPlate || 0,
    minOrderQuantity: initialData?.minOrderQuantity || 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateCateringServiceRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateCateringServiceRequest, string>> = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    } else if (formData.serviceName.length < 3) {
      newErrors.serviceName = 'Service name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.pricePerPlate <= 0) {
      newErrors.pricePerPlate = 'Price must be greater than 0';
    } else if (formData.pricePerPlate > 10000) {
      newErrors.pricePerPlate = 'Price seems too high. Please verify';
    }

    if (formData.minOrderQuantity < 1) {
      newErrors.minOrderQuantity = 'Minimum order quantity must be at least 1';
    } else if (formData.minOrderQuantity > 10000) {
      newErrors.minOrderQuantity = 'Maximum 10000 plates per order';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CreateCateringServiceRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Catering Service' : 'Create New Catering Service'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to {initialData ? 'update' : 'create'} your catering service.
          </p>
        </div>

        <div className="space-y-6">
          {/* Service Name */}
          <div>
            <Input
              label="Service Name"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              error={errors.serviceName}
              placeholder="e.g., Premium Wedding Catering"
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Choose a descriptive name that highlights your service
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`
                w-full px-3 py-2 border rounded-lg shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${errors.description ? 'border-red-500' : 'border-gray-300'}
                ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                transition-colors duration-200
              `}
              placeholder="Describe your catering service in detail. Include information about:&#10;• Types of cuisine offered&#10;• Service style (buffet, plated, family-style)&#10;• Special features or unique offerings&#10;• Experience and expertise"
              disabled={isLoading}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum 10 characters. Be specific to attract the right customers.
            </p>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Price Per Plate ($)"
                name="pricePerPlate"
                type="number"
                step="0.01"
                min="0"
                max="10000"
                value={formData.pricePerPlate}
                onChange={handleChange}
                error={errors.pricePerPlate}
                placeholder="0.00"
                disabled={isLoading}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Set a competitive price per person
              </p>
            </div>

            <div>
              <Input
                label="Minimum Order Quantity"
                name="minOrderQuantity"
                type="number"
                min="1"
                max="10000"
                value={formData.minOrderQuantity}
                onChange={handleChange}
                error={errors.minOrderQuantity}
                placeholder="1"
                disabled={isLoading}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum number of plates/guests per order
              </p>
            </div>
          </div>

          {/* Price Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Price Preview</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum order ({formData.minOrderQuantity} plates):</span>
                <span className="font-medium">
                  ${(formData.pricePerPlate * formData.minOrderQuantity).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">100 plates:</span>
                <span className="font-medium">
                  ${(formData.pricePerPlate * 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">500 plates:</span>
                <span className="font-medium">
                  ${(formData.pricePerPlate * 500).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel || (() => window.history.back())}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {initialData ? 'Updating...' : 'Creating...'}
              </span>
            ) : initialData ? (
              'Update Service'
            ) : (
              'Create Service'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};