import router from "express";
const streamRouter = router();
import { createStream } from "../controllers/Stream";
import { verifyToken } from "../middleware/middleware"; 
streamRouter.post("/create", verifyToken,createStream);

export default streamRouter;