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

export interface AddToCartRequest {
    menuItemId: number;
    quantity: number;
    serviceId: number;
}