import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { ROLES } from '../utils/constants/roles';

export const useRole = () => {
    const user = useSelector((state: any) => state.auth.user);
    
    const role = user?.role?.replace('ROLE_', '') || null;
    
    const isCustomer = useMemo(() => role === ROLES.CUSTOMER, [role]);
    const isVendor = useMemo(() => role === ROLES.VENDOR, [role]);
    const isAdmin = useMemo(() => role === ROLES.ADMIN, [role]);
    const isAuthenticated = useMemo(() => !!user, [user]);
    
    return {
        role,
        user,
        isCustomer,
        isVendor,
        isAdmin,
        isAuthenticated,
    };
};