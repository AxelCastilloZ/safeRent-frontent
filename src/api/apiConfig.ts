import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const apiAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

apiAxios.interceptors.request.use(
  (config) => {
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