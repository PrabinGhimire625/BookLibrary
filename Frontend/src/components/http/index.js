import axios from "axios";

// Base API instance
const API = axios.create({
    baseURL: 'http://localhost:5120/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Authenticated API instance
const APIAuthenticated = axios.create({
    baseURL: 'http://localhost:5120/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor to attach token
APIAuthenticated.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  // Corrected formatting
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { API, APIAuthenticated };
