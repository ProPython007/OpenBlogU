import axios from 'axios';
import {logout, refreshToken} from './authService'; // Importing token refresh logic
import { baseURL as burl } from '../constants/constants';


const api = axios.create({
    baseURL: `${burl}/api`,
});

// Add access token to all requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh if access token expires
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshToken();  // Refresh token logic
                return api(originalRequest);  // Retry original request with new access token
            } catch (refreshError) {
                if (refreshError.response && refreshError.response.status === 401) {
                    logout();  // Clear tokens and redirect to login
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;