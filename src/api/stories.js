import api from './client';

const unwrap = (response) => response.data?.data ?? response.data;

export const storiesApi = {
  createStory: async (payload) => unwrap(await api.post('/stories', payload)),
  listStories: async (params = {}) => unwrap(await api.get('/stories', { params })),
  listPublicStories: async (params = {}) => unwrap(await api.get('/stories/public', { params })),
  getStory: async (storyId) => unwrap(await api.get(`/stories/${storyId}`)),
  updateStory: async (storyId, payload) => unwrap(await api.put(`/stories/${storyId}`, payload)),
  publishStory: async (storyId) => unwrap(await api.post(`/stories/${storyId}/publish`)),
  deleteStory: async (storyId) => unwrap(await api.delete(`/stories/${storyId}`)),
  likeStory: async (storyId) => unwrap(await api.post(`/stories/${storyId}/like`)),
  commentStory: async (storyId, payload) => unwrap(await api.post(`/stories/${storyId}/comments`, payload)),
};