import { Server } from "socket.io"
import http from "http"
import { PrismaClient } from "@prisma/client"
import { redisClient } from "./redis.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!
const prisma = new PrismaClient()

// ---------------------------------------------
// 🔥 SAFE INCR / DECR HELPERS
// ---------------------------------------------
async function safeIncr(key: string) {
  const val = await redisClient.get(key)
  if (val === null || isNaN(Number(val))) {
    await redisClient.set(key, 0)
  }
  return redisClient.incr(key)
}

async function safeDecr(key: string) {
  const val = await redisClient.get(key)
  if (val === null || isNaN(Number(val))) {
    await redisClient.set(key, 0)
    return 0
  }
  return redisClient.decr(key)
}

export const setupSocket = (server: http.Server) => {

  console.log("✅ Setting up Socket.io server...")

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  io.on("connection", (socket) => {

    console.log("✅ User connected:", socket.id)

    // JWT Authentication
    const token = socket.handshake.auth.token
    console.log("Socket auth token:", token)

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      socket.data.user = decoded
    } catch (err) {
      console.log("❌ Invalid token. Disconnecting...")
      socket.disconnect()
      return
    }

    // Track which stream user is inside
    let currentStreamId: string | null = null


    // --------------------------------------------------
    // 🔥 JOIN STREAM
    // --------------------------------------------------
    socket.on("join-stream", async (streamId: string) => {
      try {
        currentStreamId = streamId

        socket.join(streamId)

        await safeIncr(`stream:viewers:${streamId}`)

        socket.to(streamId).emit("user-joined", socket.id)

      } catch (error) {
        console.error("❌ join-stream error:", error)
      }
    })
    socket.on("leave-stream", async () => {
      try {
        if (!currentStreamId) return

        socket.leave(currentStreamId)

        await safeDecr(`stream:viewers:${currentStreamId}`)

        socket.to(currentStreamId).emit("user-left", socket.id)

        currentStreamId = null

      } catch (error) {
        console.error("❌ leave-stream error:", error)
      }
    })


    // --------------------------------------------------
    // 🔥 SEND MESSAGE
    // --------------------------------------------------
    socket.on("send-message", async ({ streamId, message }) => {
      try {
        if (!streamId || !message) return

        const user = socket.data.user.name || "Anonymous"

        const savedMessage = await prisma.message.create({
          data: { streamId, user, message }
        })

        await redisClient.rpush(
          `stream:messages:${streamId}`,
          JSON.stringify(savedMessage)
        )

        io.to(streamId).emit("receive-message", {
          id: savedMessage.id,
          user: savedMessage.user,
          message: savedMessage.message,
          time: savedMessage.createdAt
        })

      } catch (error) {
        console.error("❌ send-message error:", error)
      }
    })


    // --------------------------------------------------
    // 🔥 DISCONNECT → AUTO LEAVE STREAM
    // --------------------------------------------------
    socket.on("disconnect", async () => {
      console.log("❌ User disconnected:", socket.id)

      if (currentStreamId) {
        await safeDecr(`stream:viewers:${currentStreamId}`)
        socket.to(currentStreamId).emit("user-left", socket.id)
      }
    })

  })

  return io
}
