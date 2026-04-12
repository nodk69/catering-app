export interface CreateCateringServiceRequest {
  serviceName: string;
  description: string;
  pricePerPlate: number;
  minOrderQuantity: number;
}

export interface CateringServiceResponse {
  serviceId: number;
  serviceName: string;
  description: string;
  pricePerPlate: number;
  minOrderQuantity: number;
  vendorBusinessName: string;
  vendorEmail: string;
  available?: boolean;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data: T;
  status?: number;
  timestamp?: string;
}

export interface VendorStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface OrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  eventDate: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  deliveryAddress: string;
  specialInstructions?: string;
}

export interface MenuItem {
  menuItemId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  preparationTime?: number;
  dietaryInfo?: string[];
}

// Add these to existing types

export interface MenuItemRequest {
  name: string;
  category: string;
  price: number;
}

export interface BulkMenuItemRequest {
  items: MenuItemRequest[];
}

export interface MenuItem {
  menuItemId: number;
  name: string;
  category: string;
  price: number;
  cateringService?: {
    serviceId: number;
    serviceName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}