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

// Database connection (MongooDB)
await connectDB();

//

// Start server
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => console.log("Server is running on port: " + PORT));
}


// Export server for Vercel
export default server;