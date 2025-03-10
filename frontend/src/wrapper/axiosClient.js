import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://male-be.onrender.com/api',
  timeout: 30000,
  headers: {'Application-Type': 'application/json'}
});

export default apiClient;
