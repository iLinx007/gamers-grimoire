// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables sending cookies with each request
});

export default api;
