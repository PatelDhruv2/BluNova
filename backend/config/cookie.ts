import { Response } from "express";

export const setTokenCookie = (res: Response, token: string) => {
    console.log("Token received",token);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,    
    sameSite: "none",
    maxAge: 60 * 60 * 1000 
  });
};

export const clearTokenCookie = (res: Response) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
}