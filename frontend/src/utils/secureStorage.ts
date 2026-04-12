// src/utils/secureStorage.ts

const STORAGE_PREFIX = 'catering_'; // Add prefix to avoid conflicts
const USE_SESSION_STORAGE = true; // Toggle between sessionStorage and localStorage

const storage = USE_SESSION_STORAGE ? sessionStorage : localStorage;

export const secureStorage = {
    // Token methods
    setToken: (token: string): void => {
        storage.setItem(`${STORAGE_PREFIX}auth_token`, token);
    },
    
    getToken: (): string | null => {
        return storage.getItem(`${STORAGE_PREFIX}auth_token`);
    },
    
    removeToken: (): void => {
        storage.removeItem(`${STORAGE_PREFIX}auth_token`);
    },
    
    // User info methods
    setUserInfo: (user: { email: string; role: string; name?: string; id?: number }): void => {
        storage.setItem(`${STORAGE_PREFIX}user_info`, JSON.stringify(user));
    },
    
    getUserInfo: <T = { email: string; role: string }>(): T | null => {
        const userInfo = storage.getItem(`${STORAGE_PREFIX}user_info`);
        if (!userInfo) return null;
        
        try {
            return JSON.parse(userInfo) as T;
        } catch (error) {
            console.error('Failed to parse user info:', error);
            return null;
        }
    },
    
    removeUserInfo: (): void => {
        storage.removeItem(`${STORAGE_PREFIX}user_info`);
    },
    
    // Refresh token methods (if you implement refresh tokens later)
    setRefreshToken: (token: string): void => {
        storage.setItem(`${STORAGE_PREFIX}refresh_token`, token);
    },
    
    getRefreshToken: (): string | null => {
        return storage.getItem(`${STORAGE_PREFIX}refresh_token`);
    },
    
    removeRefreshToken: (): void => {
        storage.removeItem(`${STORAGE_PREFIX}refresh_token`);
    },
    
    // Generic methods
    setItem: (key: string, value: string): void => {
        storage.setItem(`${STORAGE_PREFIX}${key}`, value);
    },
    
    getItem: (key: string): string | null => {
        return storage.getItem(`${STORAGE_PREFIX}${key}`);
    },
    
    removeItem: (key: string): void => {
        storage.removeItem(`${STORAGE_PREFIX}${key}`);
    },
    
    // Check authentication status
    isAuthenticated: (): boolean => {
        return !!storage.getItem(`${STORAGE_PREFIX}auth_token`);
    },
    
    // Get user role
    getUserRole: (): string | null => {
        const user = secureStorage.getUserInfo();
        return user?.role || null;
    },
    
    // Check if user has specific role
    hasRole: (role: string | string[]): boolean => {
        const userRole = secureStorage.getUserRole();
        if (!userRole) return false;
        
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(userRole) || roles.includes(userRole.replace('ROLE_', ''));
    },
    
    // Clear all app data
    clearAll: (): void => {
        // Only clear items with our prefix to avoid affecting other apps on same domain
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => storage.removeItem(key));
    },
    
    // Force clear everything (use with caution)
    clearAllForce: (): void => {
        storage.clear();
    },
    
    // Get storage type being used
    getStorageType: (): string => {
        return USE_SESSION_STORAGE ? 'sessionStorage' : 'localStorage';
    },
};

export default secureStorage;