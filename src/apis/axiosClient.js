import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';

// json-server --watch data.json --port 8888
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false // nếu bạn dùng cookie để auth
});

// Request Interceptor: Gắn token nếu có
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi chung
axiosClient.interceptors.response.use(
    (response) => response.data, // Trả ra data luôn
    (error) => {
        if (error.response) {
            // Ví dụ: lỗi 401, 403
            if (error.response.status === 401) {
                console.warn('Bạn chưa đăng nhập');
                // window.location.href = '/login'; // nếu muốn redirect
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
