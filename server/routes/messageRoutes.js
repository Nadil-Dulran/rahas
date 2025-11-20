import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen } from "../controllers/messageController.js";

const messageRoutes = express.Router();

messageRoutes.get("/users", protectRoute, getUsersForSidebar);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.put("/mark/:id", protectRoute, markMessageAsSeen);

export default messageRoutes;