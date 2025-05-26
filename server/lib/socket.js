import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',

    }
})




// used for storing online users
const userSocketMap = {}
export const getReciverSocketId = (userId) => {
    return userSocketMap[userId];
}




io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    const userId = socket.handshake.query.userId; // Assuming userId is sent as a query parameter
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit("onlineUsers", Object.keys(userSocketMap)); // Emit online users to all clients

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userSocketMap[userId]; // Remove user from online users
        io.emit("onlineUsers", Object.keys(userSocketMap)); // Emit updated online users to all clients
    });

    // You can add more event listeners here
});

export { io, server, app };