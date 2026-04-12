export const ROLES = {
    ADMIN: 'ADMIN',
    VENDOR: 'VENDOR',
    CUSTOMER: 'CUSTOMER',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// For Spring Boot compatibility (with ROLE_ prefix)
export const SPRING_ROLES = {
    ADMIN: 'ROLE_ADMIN',
    VENDOR: 'ROLE_VENDOR',
    CUSTOMER: 'ROLE_CUSTOMER',
} as const;

// Helper to normalize role
export const normalizeRole = (role: string): UserRole => {
    const cleanRole = role.replace('ROLE_', '').toUpperCase();
    return (ROLES[cleanRole as keyof typeof ROLES] || ROLES.CUSTOMER) as UserRole;
};