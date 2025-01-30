import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
  headers: {'Application-Type': 'application/json'}
});

export default apiClient;
