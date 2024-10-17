import axios from 'axios';
import { baseURL } from '../constants/constants';


const API_URL = `${baseURL}/api`;


// Refresh the access token
export const refreshToken = () => {
    const refresh_token = localStorage.getItem('authRefreshToken');
    return axios.post(`${API_URL}/users/refresh/`, { refresh: refresh_token })
        .then(response => {
            localStorage.setItem('authToken', response.data.access);
            return response.data;
        })
        .catch(error => {
            // Handle refresh token expiration
            if (error.response.status === 401) {
                logout();
                window.location.href = '/login';  // Redirect to login if refresh token expired
            }
            return Promise.reject(error);
        });
};

// Log out and remove tokens
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRefreshToken');
    localStorage.removeItem('current_username');
    localStorage.removeItem('current_user_id');
    localStorage.setItem('isLoggedIn', false);
    window.dispatchEvent(new Event("storage"));
};

// Check if the user is authenticated
export const isAuthenticated = () => {
    return JSON.parse(localStorage.getItem('isLoggedIn'));
};
