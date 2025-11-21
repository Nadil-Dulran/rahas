import { createContext, useState } from "react";
import axios from "axios";


const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

// Check if user is authenticated and if, set the user data and connect socket
const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                // Initialize socket connection here if needed
            }
        } catch (error) {
            console.error("Authentication check failed", error);
        }
    }


    const value = {
        axios,
        authUser,
        onlineUsers,
        socket
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}