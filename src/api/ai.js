import api from './client';

const unwrap = (response) => response.data?.data ?? response.data;

export const aiApi = {
  generateStory: async (payload) => unwrap(await api.post('/ai/generate-story', payload)),
  customizeStory: async (storyId, payload) => unwrap(await api.post(`/ai/customize-story/${storyId}`, payload)),
};