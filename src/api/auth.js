import api from './client';

const unwrap = (response) => response.data?.data ?? response.data;

export const authApi = {
  register: async (payload) => unwrap(await api.post('/auth/register', payload)),
  login: async (payload) => unwrap(await api.post('/auth/login', payload)),
  logout: async () => unwrap(await api.post('/auth/logout')),
  verifyEmail: async (token) => {
    const response = await api.get('/auth/verify-email', { params: { token } });
    return response.data;
  },
  resendVerificationEmail: async (email) => unwrap(await api.post('/auth/resend-verification', { email })),
  forgotPassword: async (email) => unwrap(await api.post('/auth/forgot-password', { email })),
  resetPassword: async (payload) => unwrap(await api.post('/auth/reset-password', payload)),
  refreshToken: async (refreshToken) => unwrap(await api.post('/auth/refresh-token', { refreshToken })),
  me: async () => unwrap(await api.get('/users/profile')),
};