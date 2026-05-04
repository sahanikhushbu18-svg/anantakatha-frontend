import axios from 'axios';
import { clearAuth, setCredentials } from '../store/authSlice';
import { store } from '../store';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://api.anantakatha.in/api/v1' : 'http://localhost:5000/api/v1'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfToken = null;

const ensureCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await api.get('/security/csrf-token');
    const payload = response.data?.data || response.data;
    csrfToken = payload?.csrfToken || null;
    return csrfToken;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.request.use(async (config) => {
  const method = String(config.method || 'get').toUpperCase();
  const requiresCsrf = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
  if (!requiresCsrf) {
    return config;
  }

  const token = await ensureCsrfToken();
  if (token) {
    config.headers['x-csrf-token'] = token;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      csrfToken = null;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh-token', { refreshToken }).finally(() => {
          refreshPromise = null;
        });
      }

      const response = await refreshPromise;
      const payload = response.data?.data || response.data;
      if (payload?.accessToken) {
        const currentUser = store.getState().auth.user;
        store.dispatch(
          setCredentials({
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken || refreshToken,
            user: currentUser,
          })
        );
        originalRequest.headers.Authorization = `Bearer ${payload.accessToken}`;
        return api(originalRequest);
      }
    } catch (refreshError) {
      store.dispatch(clearAuth());
      return Promise.reject(refreshError);
    }

    store.dispatch(clearAuth());
    return Promise.reject(error);
  }
);

export default api;