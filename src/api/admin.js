import api from './client';

const unwrap = (response) => response.data?.data ?? response.data;

export const adminApi = {
  listPendingStories: async (params = {}) => unwrap(await api.get('/admin/stories', { params })),
  approveStory: async (storyId, payload) => unwrap(await api.post(`/admin/stories/${storyId}/approve`, payload)),
  rejectStory: async (storyId, payload) => unwrap(await api.post(`/admin/stories/${storyId}/reject`, payload)),
  listUsers: async (params = {}) => unwrap(await api.get('/admin/users', { params })),
  suspendUser: async (userId, payload) => unwrap(await api.post(`/admin/users/${userId}/suspend`, payload)),
  getLogs: async (params = {}) => unwrap(await api.get('/admin/logs', { params })),
};