import { baseApi } from './baseApi';
import type { LoginResponse, UserMeResponse, RegisterRequest } from '../types/auth';
import { secureStorage } from '../utils/secureStorage';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: {
                    email: credentials.email.toLowerCase().trim(),
                    password: credentials.password
                },
            }),
            transformResponse: (response: LoginResponse) => {
                if (response.token) {
                    secureStorage.setToken(response.token);
                }
                return response;
            },
        }),
        register: builder.mutation<any, RegisterRequest>({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: {
                    ...userData,
                    email: userData.email.toLowerCase().trim(),
                    username: userData.username.trim(),
                    address: userData.address.trim(),
                    businessName: userData.businessName?.trim()
                },
            }),
        }),
        getMe: builder.query<UserMeResponse, void>({
            query: () => '/me',
            transformResponse: (response: UserMeResponse) => {
                secureStorage.setUserInfo(response);
                return response;
            },
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    secureStorage.clearAll();
                    sessionStorage.removeItem('redirect_after_login');
                    dispatch(baseApi.util.resetApiState());
                }
            },
        }),
    }),
});

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useGetMeQuery,
    useLogoutMutation 
} = authApi;