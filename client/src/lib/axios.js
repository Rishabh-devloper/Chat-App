import axios from 'axios';

export const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.MODE ==="development" ?"http://localhost:5000/api": "/api", // or your backend URL
=======
  baseURL: import.meta.env.MODE==="development" ? "http://localhost:5000/api":"/api", // or your backend URL
>>>>>>> 15801ae32de03da3953078ffa4fb44fb0c82fc35
  withCredentials: true, // 🔥 this is required to send/receive cookies
});
