export interface Restaurant {
    serviceId: number;
    serviceName: string;
    description: string;
    pricePerPlate: number;
    minOrderQuantity: number;
    vendorBusinessName: string;
    vendorEmail: string;
    imageUrl?: string;
    rating?: number;
    cuisineType?: string;
}

export interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    isAvailable: boolean;
    description?: string;
    imageUrl?: string;
}

export interface CartItem {
    cartItemId: number;
    menuItemId: number;
    menuItemName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    totalItems: number;
    serviceId: number | null;
    serviceName: string | null;
}

export interface OrderItem {
    menuItemId: number;
    menuItemName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Order {
    orderId: number;
    orderNumber: string;
    customerName: string;
    serviceName: string;
    eventDate: string;
    eventType: string;
    guestCount: number;
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
    orderDate: string;
    items?: OrderItem[];
    eventAddress?: string;
}