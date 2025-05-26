import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // or your backend URL
  withCredentials: true, // 🔥 this is required to send/receive cookies
});
