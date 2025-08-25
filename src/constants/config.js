// API Configuration
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888';
export const JSON_SERVER_PORT = import.meta.env.VITE_JSON_SERVER_PORT || 8888;
export const DEV_PORT = import.meta.env.VITE_DEV_PORT || 5173;

// App Configuration
export const APP_NAME = 'QLBH - Quản Lý Bán Hàng';
export const APP_VERSION = '1.0.0';

// Local Storage Keys
export const STORAGE_KEYS = {
    CURRENT_USER: 'currentUser',
    AUTH_TOKEN: 'token'
};

// API Endpoints
export const API_ENDPOINTS = {
    USERS: '/users',
    PRODUCTS: '/products',
    ORDERS: '/orders',
    LOGIN: '/login',
    REGISTER: '/register'
};

