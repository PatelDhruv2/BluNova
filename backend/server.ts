import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import uploadRouter from "./routes/uploadroute";
import authRouter from "./routes/authRoutes";
import streamRouter from "./routes/streamRoute";
import { setupSocket } from "./config/socket";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/stream", streamRouter);
app.use("/file", uploadRouter);
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

/* ✅ CORRECT WAY */
const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
