import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import {Server} from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io server only if not in production or if explicitly enabled
let io = null;
let userSocketMap = {};

if (process.env.NODE_ENV !== "production" || process.env.ENABLE_WEBSOCKETS === "true") {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_ORIGIN || "*",
            credentials: true
        }
    });
    
    // Store online users
    userSocketMap = {}; // { userId: socketId }
}

// Socket.io connection handling (only if io exists)
if (io) {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        console.log("User connected", userId );

        if(userId) userSocketMap[userId] = socket.id;

        // Emit online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("User disconnected", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        })
    })
}

// Export io and userSocketMap for use in other modules
export { io, userSocketMap };

// === CORS + body parsers (replace your existing app.use(cors()) and express.json limit)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "token", "Authorization", "Accept"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
    


// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is running..."));
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// Add a route to check WebSocket status
app.get("/api/websocket-status", (req, res) => {
    res.json({ 
        enabled: !!io, 
        environment: process.env.NODE_ENV,
        onlineUsers: Object.keys(userSocketMap).length
    });
});

// Add route to get online users via HTTP (fallback when WebSockets aren't available)
app.get("/api/auth/online-users", (req, res) => {
    res.json({ 
        success: true, 
        onlineUsers: Object.keys(userSocketMap),
        count: Object.keys(userSocketMap).length,
        websocketEnabled: !!io
    });
});

// Database connection (MongooDB)
await connectDB();



// Start server
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
    server.listen(PORT, () => {
        console.log("Server is running on port: " + PORT);
        console.log("WebSockets enabled:", !!io);
    });
}

// Export app for Vercel (instead of server to avoid WebSocket issues)
export default process.env.NODE_ENV === "production" ? app : server;