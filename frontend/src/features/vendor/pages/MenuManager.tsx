import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';
import { Modal } from '../../../components/ui/Modal/Modal';
import { MenuItemForm } from '../components/MenuItemForm';
import { BulkMenuImport } from '../components/BulkMenuImport';
import {
  useGetMenuItemsQuery,
  useAddMenuItemMutation,
  useAddBulkMenuItemsMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} from '../services/vendorApi';
import { useGetVendorServicesQuery } from '../services/vendorApi';
import { MenuItemRequest, MenuItem, MenuCategory } from '../vendor.types';
import { toast } from 'react-hot-toast';

export const MenuManager: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const serviceIdNum = parseInt(serviceId || '0');

  const { data: services } = useGetVendorServicesQuery();
  const currentService = services?.find(s => s.serviceId === serviceIdNum);

  const { data: menuItems = [], isLoading, refetch } = useGetMenuItemsQuery(serviceIdNum, {
    skip: !serviceIdNum,
  });

  const [addMenuItem, { isLoading: isAdding }] = useAddMenuItemMutation();
  const [addBulkMenuItems, { isLoading: isBulkAdding }] = useAddBulkMenuItemsMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  // Group menu items by category
  const groupedMenuItems = React.useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    
    menuItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, [menuItems]);

  const categories = ['All', ...Object.keys(groupedMenuItems).sort()];

  const filteredItems = React.useMemo(() => {
    let items = menuItems;
    
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return items;
  }, [menuItems, selectedCategory, searchTerm]);

  const handleAddItem = async (data: MenuItemRequest) => {
    try {
      const response = await addMenuItem({
        serviceId: serviceIdNum,
        data,
      }).unwrap();
      toast.success(response.message || 'Menu item added successfully!');
      setIsAddModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add menu item');
    }
  };

  const handleBulkImport = async (data: { items: MenuItemRequest[] }) => {
    try {
      const response = await addBulkMenuItems({
        serviceId: serviceIdNum,
        data,
      }).unwrap();
      toast.success(response.message || `${data.items.length} items imported successfully!`);
      setIsBulkImportOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to import menu items');
    }
  };

  const handleUpdateItem = async (data: MenuItemRequest) => {
    if (!editingItem) return;
    
    try {
      const response = await updateMenuItem({
        menuItemId: editingItem.menuItemId,
        data,
      }).unwrap();
      toast.success(response.message || 'Menu item updated successfully!');
      setEditingItem(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update menu item');
    }
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    
    try {
      const response = await deleteMenuItem(item.menuItemId).unwrap();
      toast.success(response.message || 'Menu item deleted successfully!');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete menu item');
    }
  };

  if (!serviceIdNum) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a catering service first</p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/vendor/catering-services')}
        >
          Go to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/vendor/catering-services')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Menu Manager - {currentService?.serviceName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage menu items for this catering service
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Menu Item
            </Button>
            <Button variant="secondary" onClick={() => setIsBulkImportOpen(true)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Bulk Import
            </Button>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items Display */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.menuItemId} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600 ml-2">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => setEditingItem(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => handleDeleteItem(item)}
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your filters'
              : 'Get started by adding menu items to this service'}
          </p>
          {!searchTerm && selectedCategory === 'All' && (
            <div className="mt-6 flex justify-center space-x-3">
              <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                Add First Item
              </Button>
              <Button variant="secondary" onClick={() => setIsBulkImportOpen(true)}>
                Bulk Import
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Stats Summary */}
      {menuItems.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-2xl font-bold text-gray-900">{Object.keys(groupedMenuItems).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Average Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Price Range</p>
            <p className="text-2xl font-bold text-gray-900">
              ${Math.min(...menuItems.map(i => i.price)).toFixed(2)} - 
              ${Math.max(...menuItems.map(i => i.price)).toFixed(2)}
            </p>
          </Card>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Menu Item"
      >
        <div className="p-6">
          <MenuItemForm
            onSubmit={handleAddItem}
            isLoading={isAdding}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Menu Item"
      >
        <div className="p-6">
          <MenuItemForm
            initialData={editingItem || undefined}
            onSubmit={handleUpdateItem}
            isLoading={isUpdating}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        title="Bulk Import Menu Items"
        size="lg"
      >
        <div className="p-6">
          <BulkMenuImport
            onImport={handleBulkImport}
            isLoading={isBulkAdding}
            onCancel={() => setIsBulkImportOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
};