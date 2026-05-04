import api from './client';

const unwrap = (response) => response.data?.data ?? response.data;

export const analyticsApi = {
  mySummary: async (days = 30) => unwrap(await api.get('/analytics/me', { params: { days } })),
  adminSummary: async (days = 30) => unwrap(await api.get('/analytics/admin', { params: { days } })),
};
