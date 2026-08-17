import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response } from "express";
import  prisma  from "../config/db.config";
import { FileType } from "@prisma/client";
// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads/")); // works now
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /mp4|mov|avi|mkv|png|jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: File upload only supports the following video/image filetypes - " + filetypes
        )
      );
    }
  },
});




export const uploadFile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 🔥 Determine FileType properly
    let fileType: FileType;

    if (file.mimetype.startsWith("image/")) {
      fileType = FileType.THUMBNAIL; // 👈 for streams
    } else if (file.mimetype.startsWith("video/")) {
      fileType = FileType.VIDEO;
    } else {
      fileType = FileType.DOCUMENT;
    }

    // OPTIONAL: streamId (sent later or now)
    const streamId = req.body.streamId
      ? Number(req.body.streamId)
      : null;

    const savedFile = await prisma.userFile.create({
      data: {
        userId,
        streamId,
        fileName: file.filename,
        filePath: `/uploads/${file.filename}`,
        fileType,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      fileId: savedFile.id,     // ✅ frontend expects this
      filePath: savedFile.filePath,
    });
  } catch (err) {
    console.error("File upload error:", err);
    return res.status(500).json({ error: "File upload failed" });
  }
};

  export const getStreamThumbnail = async (req: Request, res: Response) => {
    const streamId = Number(req.params.streamId);
    console.log("Fetching thumbnail for streamId:", streamId);
    const thumbnail = await prisma.userFile.findFirst({
      where: { streamId },
    });
    console.log("Found thumbnail record:", thumbnail);
    const url=thumbnail?.filePath ;
    console.log("Thumbnail URL:", url);
    return res.status(200).json({ url });
  };


