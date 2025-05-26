import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve the token from the correct cookie name
        const token = req.cookies.jwt; // Updated from `req.cookies.token` to `req.cookies.jwt`
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Find the user by ID and attach it to the request object
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};