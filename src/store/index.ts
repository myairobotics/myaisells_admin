import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@/features';
import { Env } from '@/libs/Env';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    _auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: Env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof store.getState>;
