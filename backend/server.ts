import express, { Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
dotenv.config();
import authRouter from "./routes/authRoutes";
import streamRouter from "./routes/streamRoute";
const app = express();
import cookieParser from "cookie-parser";
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/stream", streamRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express backend!");
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
