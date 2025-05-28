import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE ==="development" ?"http://localhost:5000": "/"; // Update with your server URL

const BASE_URL = import.meta.env.MODE==="development" ? "http://localhost:5000/":"/"; // Update with your server URL



export const useAuthStore = create((set ,get ) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
            get().connectSocket()

        } catch (err) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false }); // ✅ important
        }
    },
    login: async (data) => {
        set({ isLogingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data }); // ✅ fix here
            toast.success("Logged in successfully");
            get().connectSocket()

        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            set({ isLogingIn: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data, }); // ✅ fix here
            toast.success("Account created successfully");
            get().connectSocket()

        } catch (error) {
            toast.error(error?.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            console.log("Sending to backend:", data); // 👈 log payload
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
            
        } catch (error) {
            console.log("Update error:", error); // 👈 log client error
            toast.error(error?.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    
    connectSocket:  () =>{
        const {authUser}= get()
        if(!authUser || get().socket?.connected) return
        const socket = io(BASE_URL , {
            query: {
                userId: authUser._id // Send user ID as a query parameter
            },
       
        })
        socket.connect();
        set({ socket: socket });
        socket.on("onlineUsers", (usersId) => {
            set({ onlineUsers: usersId });
        })
    },
    disconnectSocket: () => {
        if(get().socket.connected ){
            get().socket.disconnect();
            set({ socket: null });
            
        }
    }


}
));