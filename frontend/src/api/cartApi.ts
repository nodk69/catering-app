import { baseApi } from './baseApi';
import { secureStorage } from '../utils/secureStorage';
// import { secureStorage } from '../../utils/storage/secureStorage';

export interface CartItemRequest {
    menuItemId: number;
    quantity: number;
    serviceId: number;
}

export interface CartItemResponse {
    cartItemId: number;
    menuItemId: number;
    menuItemName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface CartResponse {
    items: CartItemResponse[];
    subtotal: number;
    totalItems: number;
    serviceId: number | null;
    serviceName: string | null;
}

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addToCart: builder.mutation<CartResponse, CartItemRequest>({
            query: (data) => ({
                url: '/api/customer/cart/add',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Cart'],
        }),
        
        getCart: builder.query<CartResponse, void>({
            query: () => '/api/customer/cart',
            providesTags: ['Cart'],
        }),
        
        updateCartItem: builder.mutation<CartResponse, { cartItemId: number; quantity: number }>({
            query: ({ cartItemId, quantity }) => ({
                url: `/api/customer/cart/item/${cartItemId}?quantity=${quantity}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Cart'],
        }),
        
        removeCartItem: builder.mutation<void, number>({
            query: (cartItemId) => ({
                url: `/api/customer/cart/item/${cartItemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        
        clearCart: builder.mutation<void, void>({
            query: () => ({
                url: '/api/customer/cart/clear',
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useAddToCartMutation,
    useGetCartQuery,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
} = cartApi;