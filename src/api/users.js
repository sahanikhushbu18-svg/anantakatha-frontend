import api from './client';

const unwrap = (response) => response.data?.data ?? response.data;

export const usersApi = {
  getProfile: async () => unwrap(await api.get('/users/profile')),
  updateProfile: async (payload) => unwrap(await api.put('/users/profile', payload)),
  requestEmailChange: async (payload) => unwrap(await api.patch('/users/email', payload)),
  updateConsent: async (payload) => unwrap(await api.patch('/users/consent', payload)),
  exportData: async () => unwrap(await api.get('/users/export-data')),
  changePassword: async (payload) => unwrap(await api.post('/users/change-password', payload)),
  deleteAccount: async (payload) => unwrap(await api.delete('/users/profile', { data: payload })),
};