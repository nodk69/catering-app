import React, { useState } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  className = '',
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  selectable = false,
  onSelectionChange,
  striped = true,
  hoverable = true,
  bordered = true,
  compact = false,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  
  // Handle sorting
  const handleSort = (accessor: keyof T) => {
    setSortConfig({
      key: accessor,
      direction: 
        sortConfig.key === accessor && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    });
  };
  
  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);
  
  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(sortedData.map(item => String(keyExtractor(item))));
      setSelectedItems(allKeys);
      onSelectionChange?.(sortedData);
    } else {
      setSelectedItems(new Set());
      onSelectionChange?.([]);
    }
  };
  
  // Handle select single
  const handleSelect = (item: T, checked: boolean) => {
    const key = String(keyExtractor(item));
    const newSelected = new Set(selectedItems);
    
    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    
    setSelectedItems(newSelected);
    
    const selectedData = sortedData.filter(d => 
      newSelected.has(String(keyExtractor(d)))
    );
    onSelectionChange?.(selectedData);
  };
  
  const isSelected = (item: T) => selectedItems.has(String(keyExtractor(item)));
  const isAllSelected = sortedData.length > 0 && 
    sortedData.every(item => selectedItems.has(String(keyExtractor(item))));
  
  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor];
  };
  
  // Loading skeleton
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-t-xl mb-2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 mb-1 rounded" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className={`w-full ${bordered ? 'border border-gray-200' : ''} rounded-xl overflow-hidden`}>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {selectable && (
              <th className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} w-10`}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
            )}
            
            {columns.map((column, index) => (
              <th
                key={index}
                className={`
                  ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                  text-left text-xs font-semibold text-gray-700 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  ${column.className || ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable && typeof column.accessor !== 'function' && handleSort(column.accessor)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && sortConfig.key === column.accessor && (
                    <svg
                      className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className={`${compact ? 'px-3 py-8' : 'px-4 py-12'} text-center text-gray-500`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item, rowIndex) => (
              <tr
                key={keyExtractor(item)}
                className={`
                  border-b border-gray-200 last:border-b-0
                  ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  ${hoverable ? 'hover:bg-gray-100' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  transition-colors
                `}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <td className={`${compact ? 'px-3 py-2' : 'px-4 py-3'}`} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected(item)}
                      onChange={(e) => handleSelect(item, e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                )}
                
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`
                      ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                      text-sm text-gray-900
                      ${column.className || ''}
                    `}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;