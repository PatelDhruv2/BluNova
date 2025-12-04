import { Request, Response } from "express";
import  prisma  from "../config/db.config";
import { v4 as uuidv4 } from "uuid";

export const createStream = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;   // from JWT middleware
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const stream = await prisma.stream.create({
      data: {
        userId,
        title,
        streamKey: uuidv4(),
        isLive: false,
      },
    });

    res.status(201).json({
      message: "Stream created successfully",
      stream,
      rtmpUrl: `rtmp://localhost:1935/live/${stream.streamKey}`,
      hlsUrl: `http://localhost:8080/hls/${stream.streamKey}.m3u8`
    });

  } catch (error) {
    console.error("Create Stream Error:", error);
    res.status(500).json({ error: "Failed to create stream" });
  }
};
