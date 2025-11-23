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

// Initialize Socket.io server
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handling
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

// === CORS Configuration ===
const allowedOrigins = [
  "http://localhost:5173",
  "https://rahas.vercel.app",
  process.env.FRONTEND_ORIGIN
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "token", "Authorization", "Accept"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Body parser middleware
app.use(express.json({ limit: "20mb" }));

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running..." });
});

// Routes setup
app.use("/api/status", (req, res) => res.json({ status: "ok", message: "API is running" }));
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// Database connection (MongoDB)
connectDB().catch(err => console.error("MongoDB connection error:", err));



// Start server (only in development)
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => console.log("Server is running on port: " + PORT));
}

// Export app for Vercel
export default app;