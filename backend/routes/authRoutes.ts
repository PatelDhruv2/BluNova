import router from "express";
import { signup, login,dummy } from "../controllers/Auth";
import { verifyToken } from "../middleware/middleware";
const authRouter = router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/dummy", verifyToken, dummy);
export default authRouter;