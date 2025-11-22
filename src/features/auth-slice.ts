import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';

export type AuthState = {
  sessionTimedOut: boolean;
};

const initialState: AuthState = {
  sessionTimedOut: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSessionTimedOut: (state, action: PayloadAction<boolean>) => {
      state.sessionTimedOut = action.payload;
    },
  },
});

export const { setSessionTimedOut } = authSlice.actions;

// Selectors
export const selectSessionTimedOut = (state: RootState) =>
  state._auth.sessionTimedOut;

export default authSlice.reducer;
