import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup a new User
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if(user){
        return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        bio
    });

    const token = generateToken(newUser._id)

    res.json({ success: true, userData: newUser, token, message: "User Account created successfully" })
    } catch(error){
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Controller for user login