import express from "express";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "20mb" })); 
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? "https://chat-c6dscne8m-rishabh-mishras-projects-5723e48a.vercel.app"
    : "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRouter); 
app.use('/api/messages', messageRouter);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});