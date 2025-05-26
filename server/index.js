import express from "express";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import cors from "cors";
import {  server } from "./lib/socket.js";
import path from "path";

dotenv.config();
const app = express()


const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({ limit: "20mb" })); 
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // replace with your frontend URL
  credentials: true
}));

app.use('/api/auth', authRouter); 
app.use('/api/messages', messageRouter);

// This must come after all API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Only handle non-API routes for frontend SPA routing
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});