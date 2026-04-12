import { useRole } from './useRole';
import { ROLE_PERMISSIONS } from '../utils/constants/permissions';

export const usePermissions = () => {
    const { role } = useRole();
    
    const hasPermission = (permission: string): boolean => {
        if (!role) return false;
        const roleKey = `ROLE_${role}` as keyof typeof ROLE_PERMISSIONS;
        return ROLE_PERMISSIONS[roleKey]?.includes(permission) || false;
    };
    
    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };
    
    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every(permission => hasPermission(permission));
    };
    
    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
};