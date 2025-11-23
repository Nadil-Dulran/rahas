import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { checkAuth, login, signup, updateProfile, getUsers, getOnlineUsers } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.put("/updateProfilePicture", protectRoute, updateProfile);
userRoutes.get("/checkAuth", protectRoute, checkAuth);
userRoutes.get("/users", protectRoute, getUsers);
userRoutes.get("/online-users", protectRoute, getOnlineUsers);

export default userRoutes;