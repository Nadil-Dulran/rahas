import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// Create Express app and HTTP server

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is running..."));
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// Database connection (MongooDB)
await connectDB();



// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log("Server is running on port: " + PORT));