import cloudinary from "../lib/cloudinary.js";
import { getReciverSocketId, io } from "../lib/socket.js";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(users);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId}= req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId:myId , receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
                
                
        })        
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
        
    }

}
export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const {id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        const savedMessage = await newMessage.save();
        // Realtime functionality goes her => socket.io

        const receiverSocketId = getReciverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", savedMessage);
        }

        res.status(200).json(savedMessage);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}