import axios from "axios";
import i18n from '../i18n/instance';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const apiAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

apiAxios.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = i18n.resolvedLanguage ?? 'es';
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiAxios;
