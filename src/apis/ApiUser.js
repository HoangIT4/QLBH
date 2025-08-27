import axiosClient from '@/apis/axiosClient.js';

export const Login = () => axiosClient.post('/login');
export const Register = () => axiosClient.post('/register');
export const UpdateProfile = (userData) =>
    axiosClient.put('/user/profile', userData);
export const GetUserProfile = (userId) =>
    axiosClient.get(`/user/profile/${userId}`);
