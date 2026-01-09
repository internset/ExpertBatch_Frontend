'use client';

import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/api/authApi';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isInitializing } = useSelector((state) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const login = async (email, password) => {
    try {
      const response = await loginMutation({ email, password }).unwrap();
      const { token, user: userData } = response;
      dispatch(setCredentials({ user: userData, token }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.data?.message || error.message || 'Login failed' };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    router.push('/login');
  };

  // Loading is true if initializing or logging in
  const loading = isInitializing || isLoggingIn;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

