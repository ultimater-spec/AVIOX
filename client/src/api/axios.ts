import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach user token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aviox_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      localStorage.removeItem(isAdminRoute ? 'aviox_admin_token' : 'aviox_token');
      if (!isAdminRoute && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// Admin API instance
export const adminApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('aviox_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aviox_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);
