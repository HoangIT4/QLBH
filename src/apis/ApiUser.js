import axiosClient from "@/apis/axiosClient.js";

export const Login = () => axiosClient.post('/login');
export const Register = () => axiosClient.post('/register');