import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";

// Create Express app and HTTP server

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// Sample route
app.use("/api/status", (req, res) => res.send("Server is running..."));


// Database connection (MongooDB)
await connectDB();



// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log("Server is running on port: " + PORT));