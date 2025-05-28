import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:5000" 
    : "https://chat-c6dscne8m-rishabh-mishras-projects-5723e48a.vercel.app";

const useAuthStore = create(
    persist(
        (set, get) => ({
            authUser: null,
            isAuthenticated: false,
            isLoading: true,
            socket: null,
            onlineUsers: [],

            checkAuth: async () => {
                try {
                    const { data } = await axiosInstance.get("/auth/check");
                    set({ authUser: data.user, isAuthenticated: true, isLoading: false });
                    get().connectSocket();
                } catch (error) {
                    set({ authUser: null, isAuthenticated: false, isLoading: false });
                }
            },

            login: async (formData) => {
                try {
                    const { data } = await axiosInstance.post("/auth/login", formData);
                    set({ authUser: data.user, isAuthenticated: true });
                    toast.success("Login successful!");
                    get().connectSocket();
                    return data;
                } catch (error) {
                    toast.error(error.response?.data?.message || "Login failed");
                    throw error;
                }
            },

            signup: async (formData) => {
                try {
                    const { data } = await axiosInstance.post("/auth/signup", formData);
                    set({ authUser: data.user, isAuthenticated: true });
                    toast.success("Signup successful!");
                    get().connectSocket();
                    return data;
                } catch (error) {
                    toast.error(error.response?.data?.message || "Signup failed");
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await axiosInstance.post("/auth/logout");
                    set({ authUser: null, isAuthenticated: false });
                    toast.success("Logged out successfully");
                    get().disconnectSocket();
                } catch (error) {
                    toast.error("Logout failed");
                    throw error;
                }
            },

            updateProfile: async (formData) => {
                try {
                    const { data } = await axiosInstance.put("/auth/profile", formData);
                    set({ authUser: data.user });
                    toast.success("Profile updated successfully");
                    return data;
                } catch (error) {
                    toast.error(error.response?.data?.message || "Profile update failed");
                    throw error;
                }
            },

            connectSocket: () => {
                const { authUser } = get();
                if (!authUser || get().socket?.connected) return;
                const socket = io(BASE_URL, {
                    withCredentials: true,
                    query: { userId: authUser._id }
                });
                socket.on("connect", () => {
                    console.log("Socket connected:", socket.id);
                });
                socket.on("connect_error", (error) => {
                    console.error("Socket connection error:", error);
                    toast.error("Failed to connect to chat server");
                });
                socket.connect();
                set({ socket });
                socket.on("onlineUsers", (usersId) => {
                    set({ onlineUsers: usersId });
                });
            },

            disconnectSocket: () => {
                const { socket } = useAuthStore.getState();
                if (socket) {
                    socket.disconnect();
                    set({ socket: null });
                }
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ authUser: state.authUser, isAuthenticated: state.isAuthenticated })
        }
    )
);

export default useAuthStore;