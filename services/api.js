import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.x.x:3000/api', // đổi sau
    timeout: 10000,
});

api.interceptors.request.use(
    async config => {
        // thêm token nếu có
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

export default api;