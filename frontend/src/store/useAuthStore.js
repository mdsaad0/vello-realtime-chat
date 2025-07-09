import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:5001" : "/"; // This should match the URL where your Socket.IO server is running

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    onlineUsers: [], // This will be used to store the online users in the application


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("checkAuth response:", res.data);
            set({ authUser: res.data });

            // After checking auth, you might want to connect to the socket server
            get().connectSocket(); //? This will call the connectSocket function defined in the store

        } catch (error) {
            console.error("Error in checkAuth:", error);
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });  //! Update authUser with the response data that is the user object which is returned from the server 
            toast.success("Account created successful!");

            // After successful signup, you might want to connect to the socket server
            get().connectSocket(); //? This will call the connectSocket function defined in the store
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });  //! Update authUser with the response data that is the user object which is returned from the server
            toast.success("Logged in successfully!");

            // After successful login, you might want to connect to the socket server
            get().connectSocket(); //? This will call the connectSocket function defined in the store
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIng: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!");

            // After successful logout, you might want to disconnect from the socket server
            get().disconnectSocket(); //? This will call the disconnectSocket function defined in the store
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return; // If no user is authenticated or socket is already connected, do nothing

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id, // Pass the user ID as a query parameter to the Socket.IO server
            }, // 
        }
        );
        socket.connect(); // Connect to the Socket.IO server
        set({ socket: socket }); // Store the socket in the Zustand store

        socket.on("getOnlineUsers", (userIds) => {
            console.log("Online users received:", userIds);
            set({ onlineUsers: userIds }); // Update the onlineUsers state with the list of online users received from the server
        });
    },
    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) { // If the socket is connected, disconnect it 
            socket.disconnect(); // Disconnect from the Socket.IO server
            set({ socket: null }); // Clear the socket from the store
        }
    },
}));








// The useAuthStore is a Zustand store that manages the authentication state of the user in a React application.
// Zustand is a small, fast, and scalable state management solution for React applications.
// It is an alternative of redux and is designed to be simple and easy to use.
// This store is used to manage the authentication state of the user in the application, which means it keeps track of whether the user is signed up, logged in, or updating their profile.
// authUser is the user object that contains information about the authenticated user, such as their username, email, and other details.
// isSigningUp is a boolean that indicates whether the user is currently signing up.
// isLoggingIng is a boolean that indicates whether the user is currently logging in.
// isUpdatingProfile is a boolean that indicates whether the user is currently updating their profile.
// isCheckingAuth is a boolean that indicates whether the application is currently checking the authentication status of the user, which is useful for determining if the user is logged in or not when the application loads.
// checkAuth is an asynchronous function that checks the authentication status of the user by making a GET request to the /auth/check endpoint.
// If the request is successful, it updates the authUser state with the user data returned from the server. If there is an error, it sets authUser to null. Finally, it sets isCheckingAuth to false to indicate that the authentication check is complete.
