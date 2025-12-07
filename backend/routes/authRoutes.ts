import router from "express";
import { sendSignupOtp, login,dummy,verifySignupOtp,logout } from "../controllers/Auth";
import { verifyToken } from "../middleware/middleware";
const authRouter = router();

authRouter.post("/signup", sendSignupOtp);
authRouter.post("/login", login);
authRouter.get("/dummy", verifyToken, dummy);
authRouter.post("/verify-otp", verifySignupOtp);
authRouter.post("/logout", logout);
export default authRouter;