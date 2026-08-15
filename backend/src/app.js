import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import connectToSocket from "./controllers/socketManager.js";

dotenv.config();

const app = express();
const server = createServer(app);

connectToSocket(server);

const allowedOrigins = [
  "http://localhost:5173",
  "https://convo-x-ten.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ConvoX Backend Running",
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    const connectDb = await mongoose.connect(process.env.MONGO_URI);

    console.log("Database:", connectDb.connection.name);
    console.log("Host:", connectDb.connection.host);
    console.log("MongoDB Connected");
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
});