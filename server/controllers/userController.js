import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        const isPasswordCorrect =  await bcrypt.compare(password, userData.password);
        
        if(!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid Credentials" });

        }

        const token = generateToken(userData._id);

        res.json({ success: true, userData, token, message: "Login Successful" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Controller to check if user is authenticated (protected route & handled by auth middleware)
export const checkAuth = (req, res) => {
        res.json({ success: true, user: req.user});
}
// Handle users (function to handle profile)

export const updateProfile = async (req, res) => {
  try {
    // Log request info (this must be INSIDE the handler so req is defined)
    console.log("UPDATE PROFILE CALLED. USER ID:", req.user?._id);
    console.log("UPDATE PROFILE BODY:", req.body);

    // Normalize expected fields from the client
    const fullName = req.body.fullName ?? req.body.fullname;
    const bio = req.body.bio;
    const profilePic = req.body.profilePic ?? req.body.profilepic; // base64 data URL expected

    // Build update object (only include keys that are present)
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;

    // If the client sent a profile picture (data URL), upload it
    if (profilePic) {
      console.log("Uploading profile picture to Cloudinary...");
      const uploaded = await cloudinary.uploader.upload(profilePic, {
        folder: "rahas/profile_pics",
        overwrite: true,
      });
      console.log("Cloudinary uploaded:", uploaded.secure_url);
      updateData.profilePic = uploaded.secure_url;
    }

    // Update the user in DB and return the new document
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    console.log("User updated:", !!user);
    return res.json({ success: true, user });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};           

