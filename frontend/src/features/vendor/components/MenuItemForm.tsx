import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Card } from '../../../components/ui/Card/Card';
import { MenuItemRequest } from '../vendor.types';

interface MenuItemFormProps {
  initialData?: Partial<MenuItemRequest>;
  onSubmit: (data: MenuItemRequest) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

const MENU_CATEGORIES = [
  'Appetizers',
  'Main Course',
  'Side Dishes',
  'Desserts',
  'Beverages',
  'Salads',
  'Soups',
  'Bread',
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Gluten-Free',
];

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<MenuItemRequest>({
    name: initialData?.name || '',
    category: initialData?.category || 'Main Course',
    price: initialData?.price || 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MenuItemRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MenuItemRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (formData.price > 1000) {
      newErrors.price = 'Price seems too high. Please verify';
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    
    if (errors[name as keyof MenuItemRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="e.g., Grilled Salmon"
        disabled={isLoading}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.category ? 'border-red-500' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          disabled={isLoading}
          required
        >
          {MENU_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <Input
        label="Price ($)"
        name="price"
        type="number"
        step="0.01"
        min="0"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        placeholder="0.00"
        disabled={isLoading}
        required
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};