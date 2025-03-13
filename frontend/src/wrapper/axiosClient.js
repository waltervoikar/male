import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {'Application-Type': 'application/json'}
});

const handleError = (error) => {
  if (error.response) {
    return { success: false, message: error.response.data.error || "Midagi läks valesti" };
  } else if (error.request) {
    return { success: false, message: "Server ei vasta" };
  } else {
    return { success: false, message: "Ootamatu error" };
  }
};

const handleResponse = (response) => {
  return { success: true, data: response }
};

// apiClient.interceptors.request.use(
//   response => handleResponse(response),
//   error => Promise.reject(handleError(error))
// )
//
// apiClient.interceptors.response.use(
//   response => handleResponse(response),
//   error => Promise.reject(handleError(error))
// )

export default apiClient;
