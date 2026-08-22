import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on app mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res?.data?.user) {
            setUser(res.data.user);
          } else {
            // Invalid session
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res?.data) {
        const { user: authUser, tokens } = res.data;
        localStorage.setItem('token', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        setToken(tokens.accessToken);
        setUser(authUser);
        toast.success(`Welcome back, ${authUser.name}!`);
        return { success: true, user: authUser };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res?.data) {
        const { user: authUser, tokens } = res.data;
        localStorage.setItem('token', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        setToken(tokens.accessToken);
        setUser(authUser);
        toast.success(`Account created! Welcome, ${authUser.name}!`);
        return { success: true, user: authUser };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network failure on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setToken(null);
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
