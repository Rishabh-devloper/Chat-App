import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api" 
    : "https://chat-c6dscne8m-rishabh-mishras-projects-5723e48a.vercel.app/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
