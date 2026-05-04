import api from './client';

const unwrap = (response) => response.data?.data ?? response.data;

export const systemApi = {
  getCsrfToken: async () => unwrap(await api.get('/security/csrf-token')),
  health: async () => unwrap(await api.get('/health')),
};

export default systemApi;
