import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { secureStorage } from '../../utils/secureStorage';

interface UserMeResponse {
    email: string;
    role: string;
    name?: string;
    id?: number;
}

interface AuthState {
    token: string | null;
    user: UserMeResponse | null;
    isInitialized: boolean;
}

// ✅ Initialize from secure storage
const storedToken = secureStorage.getToken();
const storedUser = secureStorage.getUserInfo();

const initialState: AuthState = {
    token: storedToken,
    user: storedUser,
    isInitialized: false, // Always start as false, AuthInitializer will set to true
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user?: UserMeResponse }>) => {
            const { token, user } = action.payload;
            
            state.token = token;
            secureStorage.setToken(token);
            
            if (user) {
                state.user = user;
                secureStorage.setUserInfo(user);
            }
            
            // ✅ Don't set isInitialized here - let AuthInitializer handle it
        },
        
        // ✅ For backward compatibility
        setAuth: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            secureStorage.setToken(action.payload.token);
        },
        
        setUser: (state, action: PayloadAction<UserMeResponse>) => {
            state.user = action.payload;
            secureStorage.setUserInfo(action.payload);
        },
        
        setInitialized: (state) => {
            state.isInitialized = true;
        },
        
        // ✅ Update user info (for profile updates)
        updateUser: (state, action: PayloadAction<Partial<UserMeResponse>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                secureStorage.setUserInfo(state.user);
            }
        },
        
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isInitialized = true; // ✅ Mark as initialized after logout
            secureStorage.clearAll();
        },
        
        // ✅ Reset initialization (useful for force re-fetch)
        resetInitialization: (state) => {
            state.isInitialized = false;
        },
    },
});

export const { 
    setCredentials, 
    setAuth, 
    setUser, 
    setInitialized, 
    updateUser, 
    logout,
    resetInitialization 
} = authSlice.actions;

export default authSlice.reducer;