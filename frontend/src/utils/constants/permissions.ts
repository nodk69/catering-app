export const PERMISSIONS = {
    VIEW_MENU: 'view_menu',
    PLACE_ORDER: 'place_order',
    TRACK_ORDER: 'track_order',
    MANAGE_MENU: 'manage_menu',
    VIEW_ORDERS: 'view_orders',
    UPDATE_ORDER_STATUS: 'update_order_status',
    MANAGE_USERS: 'manage_users',
    APPROVE_VENDORS: 'approve_vendors',
    VIEW_REPORTS: 'view_reports',
} as const;

export const ROLE_PERMISSIONS = {
    ROLE_CUSTOMER: [
        PERMISSIONS.VIEW_MENU,
        PERMISSIONS.PLACE_ORDER,
        PERMISSIONS.TRACK_ORDER,
    ],
    ROLE_VENDOR: [
        PERMISSIONS.VIEW_MENU,
        PERMISSIONS.MANAGE_MENU,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.UPDATE_ORDER_STATUS,
    ],
    ROLE_ADMIN: [
        PERMISSIONS.VIEW_MENU,
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.APPROVE_VENDORS,
        PERMISSIONS.VIEW_REPORTS,
    ],
} as const;