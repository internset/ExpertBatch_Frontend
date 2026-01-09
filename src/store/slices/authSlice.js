import { createSlice } from '@reduxjs/toolkit';

// Initialize state from localStorage (only on client side)
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: true,
    };
  }

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      return {
        user,
        token,
        isAuthenticated: true,
        isInitializing: false,
      };
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isInitializing: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isInitializing = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    setInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setCredentials, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;

