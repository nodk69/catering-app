import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state: RootState) => state.auth);
    
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };
    
    return {
        token: auth.token,
        user: auth.user,
        isInitialized: auth.isInitialized,
        isAuthenticated: !!auth.token && !!auth.user, 
        logout: handleLogout,
    };
};