import { genrateToken } from '../lib/utils.js'
import User from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);

        // Create a new user
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Generate a token and set it as a cookie
        genrateToken(newUser._id, res);

        // Respond with the newly created user's data
        return res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log("Login error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Generate a token and set it as a cookie
        genrateToken(user._id, res);
        // Respond with the user's data
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    }
    // Handle any errors that occur during the process
    catch (error) {
        console.log("Login error: ", error.message);
        res.status(500).json({ message: "Internal server error" });

        
    } 
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Set maxAge to 0 to delete the cookie
        });
        return res.status(200).json({ message: "Logged out successfully" });
        
    } catch (error) {
        console.log("Logout error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const updateProfile = async (req, res) => {
    try {
        const {profilePic} =req.body
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const uploadResponse =await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url,
        }, { new: true });
        return res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Update profile error:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
export const checkAuth = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("Check auth error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
}