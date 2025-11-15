// Function to authenticate user using JWT execute before executing the controller functions

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try{
        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userID).select("-password");

        if(!user)  return res.json({ success: false, message: "Unauthorized Access" });
        
        req.user = user;
        next();

    } catch(error){
        console.log(error.message);
        res.json({ success: false, message: "Unauthorized Access" });   
    }

}