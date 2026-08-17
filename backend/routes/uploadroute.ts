import router from "express";
const uploadRouter = router();

import { upload } from "../controllers/Upload";
import { verifyToken } from "../middleware/middleware";
import { Request, Response } from "express";
import { uploadFile } from "../controllers/Upload";
import { getStreamThumbnail } from "../controllers/Upload";
uploadRouter.post("/upload", verifyToken,upload.single("file"),uploadFile);
uploadRouter.get("/thumbnail/:streamId",verifyToken,getStreamThumbnail);

export default uploadRouter;