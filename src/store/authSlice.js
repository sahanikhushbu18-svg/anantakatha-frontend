import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('accessToken');

const initialState = {
  accessToken: token || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: null,
  status: token ? 'authenticated' : 'anonymous',
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || state.refreshToken;
      state.user = user;
      state.status = 'authenticated';
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.status = 'anonymous';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setHydrated: (state, action) => {
      state.hydrated = action.payload;
    },
  },
});

export const { setCredentials, setUser, clearAuth, setHydrated } = authSlice.actions;
export default authSlice.reducer;