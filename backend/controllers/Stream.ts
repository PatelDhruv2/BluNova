import { Request, Response } from "express";
import  prisma  from "../config/db.config";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../config/redis";
export const createStream = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;   // from JWT middleware
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const findexistingStream = await prisma.stream.findFirst({
      where: { userId, isLive: true },
    });
    if (findexistingStream) {
      return res.status(400).json({ error: "You already have an active stream" });
    }
    const stream = await prisma.stream.create({
      data: {
        userId,
        title,
        streamKey: uuidv4(),
        isLive: true,
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


export const getpreviousStreams = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;   // from JWT middleware 
    const streams = await prisma.stream.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    res.status(200).json({ streams });    
  } catch (error) {
    console.error("Get Previous Streams Error:", error);
    res.status(500).json({ error: "Failed to fetch previous streams" });
  }
};
export const fetchStreams = async (req: Request, res: Response) => {
  try {
    const streams = await prisma.stream.findMany({
      where: { isLive: true },
      orderBy: { createdAt: "desc" },

      // ✅ ONLY return safe, public fields
      select: {
        id: true,
        title: true,
        isLive: true,
        createdAt: true,

        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    res.status(200).json({ streams });

  } catch (error) {
    console.error("Fetch Streams Error:", error);
    res.status(500).json({ error: "Failed to fetch streams" });
  }
};

export const updateStreamStatus = async (req: Request, res: Response) => {
  try {
    console.log("Update Stream Status Body:", req.body);
    const { streamKey, status } = req.body;
    const isLive = status === "live";
    console.log("Update Stream Status Request:", { streamKey, isLive });
    if (typeof isLive !== "boolean" || !streamKey) {
      return res.status(400).json({ error: "Invalid streamKey or isLive status" });
    }

    const stream = await prisma.stream.updateMany({
      where: { streamKey },
      data: { isLive },
    });
    if (stream.count === 0) {
      return res.status(404).json({ error: "Stream not found" });
    }

    res.status(200).json({ message: "Stream status updated successfully" });
  } catch (error) {
    console.error("Update Stream Status Error:", error);
    res.status(500).json({ error: "Failed to update stream status" });
  }
};

// GET /api/stream/:id
export const getStreamForViewer = async (req:Request, res:Response) => {
  console.log("Get Stream For Viewer Params:", req.params);
  const streamId = Number(req.params.id);
  console.log("Get Stream For Viewer Request:", { streamId });
  const stream = await prisma.stream.findUnique({
    where: { id: streamId },
  });

  if (!stream || !stream.isLive) {
    return res.status(404).json({ message: "Stream not live" });
  }
  console.log("Stream found for viewer:", stream);

  // IMPORTANT: We do NOT send the streamKey directly
  return res.json({
    id: stream.id,
    title: stream.title,

    // public playback url
    playbackUrl: `http://localhost:8090/hls/${stream.streamKey}.m3u8`
  });
};

export const getViewerCount = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const streamId = Number(id);
    const count = await redisClient.get(`stream:viewers:${streamId}`);

    res.json({ viewers: count || 0 });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch viewer count" });
  }
};

export const getMessages = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const streamId = Number(id);
    console.log(req.params);
    console.log("Fetching messages for streamId:", streamId);
    const raw = await redisClient.lrange(`stream:messages:${streamId}`, 0, -1);

    const messages = raw.map((msg) => JSON.parse(msg));

    res.json({ messages });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

