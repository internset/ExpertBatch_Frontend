import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';

// Import all API slices to ensure endpoints are injected
import './api/authApi';
import './api/usersApi';
import './api/skillsApi';
import './api/topicsApi';
import './api/questionsApi';
import './api/examsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

