import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://alx-capstone.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  login: async (username, password) => {
    const response = await api.post('/accounts/login/', { username, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/accounts/logout/');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/accounts/profile/');
    return response.data;
  },

  // Services endpoints
  getServiceCategories: async () => {
    const response = await api.get('/services/categories/');
    return response.data;
  },

  getServices: async (params = {}) => {
    const response = await api.get('/services/', { params });
    return response.data;
  },

  getService: async (id) => {
    const response = await api.get(`/services/${id}/`);
    return response.data;
  },

  getServiceProviders: async () => {
    const response = await api.get('/accounts/providers/');
    return response.data;
  },

  getBusinessHours: async (providerId) => {
    const response = await api.get(`/services/business-hours/${providerId}/`);
    return response.data;
  },

  // Appointments endpoints
  getAppointments: async () => {
    const response = await api.get('/appointments/');
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/', appointmentData);
    return response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}/`, appointmentData);
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.post(`/appointments/${id}/cancel/`);
    return response.data;
  },

  createReview: async (appointmentId, reviewData) => {
    const response = await api.post(`/appointments/${appointmentId}/review/`, reviewData);
    return response.data;
  },
};