import primsa from '../config/db.config';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setTokenCookie } from '../config/cookie';
const JWT_SECRET = process.env.JWT_SECRET
declare global {
  namespace Express {
    interface Request {
      user?: User; // optional because not every request will have it
    }
  }
}
const signup = async (req: Request, res: Response) => {
    const { name,email,password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }
    try{
        const existingUser = await primsa.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await primsa.user.create({
            data: { name, email, password: hashedPassword }
        });
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET!, { expiresIn: '1h' });
         setTokenCookie(res, token);
        return res.status(201).json({ message: "User created", userId: newUser.id ,token});
    }catch(e){
        console.error("Signup error:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export { signup };
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await primsa.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET!, { expiresIn: '1h' });
         const cook=await setTokenCookie(res, token);
        return res.status(200).json({ message: "Login successful", token });
    }catch(e){
        console.error("Login error:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export { login };

const dummy = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Protected route accessed", user: req.user });
}
export { dummy };   