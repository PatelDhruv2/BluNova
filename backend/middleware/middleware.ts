import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Extend Request type to include `user`
export interface AuthRequest extends Request {
  user?: any;
}

// Middleware to verify JWT from HTTP-only cookie
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("Verifying token from cookies:", req.cookies);
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    console.log("user info",decoded);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

