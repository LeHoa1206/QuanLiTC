import axios from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants'

// Create axios instance for Laravel API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Laravel Sanctum
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Laravel API Request:', config.url);
      console.log('🔑 Token:', token.substring(0, 20) + '...');
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 Unauthorized - Logging out');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.log('🚫 Forbidden - No permission');
    } else if (error.code === 'ERR_NETWORK') {
      console.log('⚠️ Network error - Check if Laravel backend is running');
    }
    return Promise.reject(error)
  }
)

export default api

