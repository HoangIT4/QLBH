import axiosClient from '@/apis/axiosClient.js';

// Authentication
export const Login = () => axiosClient.post('/login');
export const Register = () => axiosClient.post('/register');

// User Management
export const getUsers = () => axiosClient.get('/users');
export const getUserById = (userId) => axiosClient.get(`/users/${userId}`);
export const createUser = (userData) => axiosClient.post('/users', userData);
export const updateUser = (userId, userData) =>
    axiosClient.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => axiosClient.delete(`/users/${userId}`);

// Profile Management
export const UpdateProfile = (userData) =>
    axiosClient.put('/user/profile', userData);
export const UpdatePassword = (passwordData) =>
    axiosClient.put('/user/password', passwordData);
export const GetUserProfile = (userId) =>
    axiosClient.get(`/user/profile/${userId}`);
