import { baseApi } from '../../../api/baseApi';
import type { Restaurant, MenuItem, Order } from '../types/customer.types';
// import { MenuItem } from '../customer.types';

export const customerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRestaurants: builder.query<Restaurant[], void>({
            query: () => '/api/services/all',
            providesTags: ['Services'],
        }),
        
        getRestaurantById: builder.query<Restaurant, number>({
            query: (id) => `/api/services/${id}`,
            providesTags: (result, error, id) => [{ type: 'Services', id }],
        }),
        
        getMenuByService: builder.query<MenuItem[], number>({
            query: (serviceId) => `/api/menu/service/${serviceId}`,
            providesTags: ['Menu'],
        }),
        
        getCustomerOrders: builder.query<Order[], void>({
            query: () => '/api/orders/my',
            providesTags: ['Orders'],
        }),
        
        getOrderDetails: builder.query<Order, number>({
            query: (orderId) => `/api/orders/${orderId}`,
            providesTags: (result, error, orderId) => [{ type: 'Orders', id: orderId }],
        }),
        
        placeOrder: builder.mutation<Order, any>({
            query: (orderData) => ({
                url: '/api/orders/place',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders', 'Cart'],
        }),
        
        cancelOrder: builder.mutation<void, number>({
            query: (orderId) => ({
                url: `/api/orders/${orderId}/cancel`,
                method: 'PUT',
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetRestaurantsQuery,
    useGetRestaurantByIdQuery,
    useGetMenuByServiceQuery,
    useGetCustomerOrdersQuery,
    useGetOrderDetailsQuery,
    usePlaceOrderMutation,
    useCancelOrderMutation,
} = customerApi;