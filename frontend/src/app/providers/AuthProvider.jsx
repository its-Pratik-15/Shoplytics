import { createContext, useEffect, useState } from 'react';
import { authAPI } from '../../features/auth/services/auth.api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await authAPI.getProfile();
                if (response.success) {
                    setUser(response.data);
                }
            } catch (error) {
                // User not authenticated
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);

            if (response.success) {
                const { user: userData } = response.data;
                setUser(userData);

                toast.success('Login successful!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authAPI.register(userData);

            if (response.success) {
                const { user: newUser } = response.data;
                setUser(newUser);

                toast.success('Registration successful!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
            toast.success('Logged out successfully');
        }
    };

    const hasRole = (requiredRoles) => {
        if (!user || !user.role) return false;

        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(user.role);
        }

        return user.role === requiredRoles;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        hasRole,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};