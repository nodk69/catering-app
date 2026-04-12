import { baseApi } from '../../../api/baseApi';
import type { 
  CreateCateringServiceRequest, 
  CateringServiceResponse,
  ApiResponse,
  Order,
  VendorStats
} from '../vendor.types';

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Catering Services
    createCateringService: builder.mutation<
      ApiResponse<CateringServiceResponse>,
      CreateCateringServiceRequest
    >({
      query: (serviceData) => ({
        url: '/vendor/catering/create',
        method: 'POST',
        body: serviceData,
      }),
      invalidatesTags: ['CateringServices'],
    }),

    getAllApprovedServices: builder.query<CateringServiceResponse[], void>({
      query: () => '/vendor/catering/all',
      providesTags: ['CateringServices'],
      transformResponse: (response: CateringServiceResponse[]) => response,
    }),

    getVendorServices: builder.query<CateringServiceResponse[], void>({
      query: () => '/vendor/catering/my-services',
      providesTags: ['CateringServices'],
    }),

    updateCateringService: builder.mutation<
      ApiResponse<CateringServiceResponse>,
      { id: number; data: Partial<CreateCateringServiceRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/vendor/catering/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CateringServices'],
    }),

    deleteCateringService: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/vendor/catering/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CateringServices'],
    }),

    toggleServiceAvailability: builder.mutation<
      ApiResponse<CateringServiceResponse>,
      { id: number; available: boolean }
    >({
      query: ({ id, available }) => ({
        url: `/vendor/catering/${id}/availability`,
        method: 'PATCH',
        body: { available },
      }),
      invalidatesTags: ['CateringServices'],
    }),

    // Vendor Orders
    getVendorOrders: builder.query<Order[], void>({
      query: () => '/vendor/orders',
      providesTags: ['Orders'],
    }),

    updateOrderStatus: builder.mutation<
      ApiResponse<Order>,
      { orderId: string; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `/vendor/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),

    // Vendor Stats
    getVendorStats: builder.query<VendorStats, void>({
      query: () => '/vendor/stats',
      providesTags: ['Stats'],
    }),

    // Add these to the existing vendorApi endpoints

// Menu Items
addMenuItem: builder.mutation<
  ApiResponse<MenuItem>,
  { serviceId: number; data: MenuItemRequest }
>({
  query: ({ serviceId, data }) => ({
    url: `/vendor/menu/add/${serviceId}`,
    method: 'POST',
    body: data,
  }),
  invalidatesTags: (result, error, { serviceId }) => [
    { type: 'MenuItems', id: serviceId },
  ],
}),

addBulkMenuItems: builder.mutation<
  ApiResponse<MenuItem[]>,
  { serviceId: number; data: BulkMenuItemRequest }
>({
  query: ({ serviceId, data }) => ({
    url: `/vendor/menu/add-bulk/${serviceId}`,
    method: 'POST',
    body: data,
  }),
  invalidatesTags: (result, error, { serviceId }) => [
    { type: 'MenuItems', id: serviceId },
  ],
}),

getMenuItems: builder.query<MenuItem[], number>({
  query: (serviceId) => `/vendor/menu/${serviceId}`,
  providesTags: (result, error, serviceId) => [
    { type: 'MenuItems', id: serviceId },
  ],
}),

updateMenuItem: builder.mutation<
  ApiResponse<MenuItem>,
  { menuItemId: number; data: Partial<MenuItemRequest> }
>({
  query: ({ menuItemId, data }) => ({
    url: `/vendor/menu/${menuItemId}`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: ['MenuItems'],
}),

deleteMenuItem: builder.mutation<ApiResponse<void>, number>({
  query: (menuItemId) => ({
    url: `/vendor/menu/${menuItemId}`,
    method: 'DELETE',
  }),
  invalidatesTags: ['MenuItems'],
}),

  }),
});

export const {
  useCreateCateringServiceMutation,
  useGetAllApprovedServicesQuery,
  useGetVendorServicesQuery,
  useUpdateCateringServiceMutation,
  useDeleteCateringServiceMutation,
  useToggleServiceAvailabilityMutation,
  useGetVendorOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetVendorStatsQuery,
  useAddMenuItemMutation,
  useAddBulkMenuItemsMutation,
  useGetMenuItemsQuery,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = vendorApi;