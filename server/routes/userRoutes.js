import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.put("/updateProfilePicture", protectRoute, updateProfile)
userRoutes.get("/checkAuth", protectRoute, checkAuth);

export default userRoutes;