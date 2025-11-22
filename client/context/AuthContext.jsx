import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

// Check if user is authenticated and if, set the user data and connect socket
const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/checkAuth");
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

// Login function to handle user authintication and socket connection
    const login = async (state, credentials) => {
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

// Logout function to handle user logout and disconnect socket

const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully")
    if (socket?.disconnect) {
        socket.disconnect();
    }
}

// Update profile function to handle user profile updates
const updateProfile = async (body) => {
    try {
        // Ensure token is set in headers
        const currentToken = localStorage.getItem("token");
        console.log("=== UPDATE PROFILE DEBUG ===");
        console.log("Token from localStorage:", currentToken);
        console.log("Body to send:", body);
        
        if (currentToken) {
            axios.defaults.headers.common["token"] = currentToken;
            console.log("Token set in axios headers");
        } else {
            console.log("ERROR: No token in localStorage");
            toast.error("No authentication token found. Please login again.");
            throw new Error("No authentication token");
        }
        
        const {data} = await axios.put("/api/auth/updateProfilePicture", body);
        console.log("Update profile response:", data);
        if (data.success) {
            setAuthUser(data.user);
            toast.success("Profile updated successfully");
            return data;
        } else {
            console.log("Update failed with message:", data.message);
            toast.error(data.message || "Profile update failed");
            throw new Error(data.message || "Profile update failed");
        }
    } catch (error) {
        console.error("Profile update error:", error);
        const msg = error?.response?.data?.message || error.message;
        toast.error(msg || "Profile update failed");
        throw error;
    }
}

    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: { userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
            checkAuth()
        },[])




    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}