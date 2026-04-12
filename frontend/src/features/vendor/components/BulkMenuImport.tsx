import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';
import { MenuItemRequest, BulkMenuItemRequest } from '../vendor.types';
import * as XLSX from 'xlsx';

interface BulkMenuImportProps {
  onImport: (data: BulkMenuItemRequest) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const BulkMenuImport: React.FC<BulkMenuImportProps> = ({
  onImport,
  isLoading = false,
  onCancel,
}) => {
  const [previewData, setPreviewData] = useState<MenuItemRequest[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Validate and transform data
        const menuItems: MenuItemRequest[] = jsonData.map((row, index) => {
          if (!row.name || !row.category || row.price === undefined) {
            throw new Error(`Row ${index + 2}: Missing required fields (name, category, price)`);
          }

          const price = parseFloat(row.price);
          if (isNaN(price) || price <= 0) {
            throw new Error(`Row ${index + 2}: Invalid price value`);
          }

          return {
            name: row.name.trim(),
            category: row.category.trim(),
            price: price,
          };
        });

        setPreviewData(menuItems);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to parse file');
        setPreviewData([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      setError('No valid data to import');
      return;
    }

    await onImport({ items: previewData });
  };

  const downloadTemplate = () => {
    const template = [
      ['name', 'category', 'price'],
      ['Grilled Salmon', 'Main Course', '25.99'],
      ['Caesar Salad', 'Salads', '12.50'],
      ['Chocolate Cake', 'Desserts', '8.99'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Menu Items');
    XLSX.writeFile(wb, 'menu_items_template.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Download the template and fill in your menu items</li>
          <li>Required columns: name, category, price</li>
          <li>Maximum 100 items per import</li>
          <li>Supported formats: .xlsx, .xls, .csv</li>
        </ul>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="secondary" onClick={downloadTemplate}>
          Download Template
        </Button>
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          <Button variant="outline" disabled={isLoading}>
            Choose File
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {previewData.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Preview ({previewData.length} items)
          </h4>
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{item.category}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      ${item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-xs text-gray-500 p-2 text-center bg-gray-50">
                And {previewData.length - 10} more items...
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleImport}
          disabled={isLoading || previewData.length === 0}
        >
          {isLoading ? 'Importing...' : `Import ${previewData.length} Items`}
        </Button>
      </div>
    </div>
  );
};