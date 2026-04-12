import React from 'react';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { CateringServiceResponse } from '../../vendor/vendor.types';
import { formatCurrency } from '../../../utils/validation';

interface CateringServiceCardProps {
  service: CateringServiceResponse;
  onOrder?: (service: CateringServiceResponse) => void;
}

export const CateringServiceCard: React.FC<CateringServiceCardProps> = ({
  service,
  onOrder,
}) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {service.serviceName}
          </h3>
          <span className="text-2xl font-bold text-green-600">
            {formatCurrency(service.pricePerPlate)}
            <span className="text-sm text-gray-500 font-normal">/plate</span>
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Minimum order: {service.minOrderQuantity} plates
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {service.vendorBusinessName}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onOrder?.(service)}
        >
          Order Now
        </Button>
      </div>
    </Card>
  );
};