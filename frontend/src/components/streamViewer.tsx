import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  user: string;
  message: string;
}

const USER_COLORS = [
  "#FF4D4D",
  "#4DA6FF",
  "#4DFF4D",
  "#FFB84D",
  "#BF80FF",
  "#FF66B2",
  "#00E6E6",
  "#FFD24D",
  "#C68C53",
];

const StreamViewer: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();

  const chatRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [viewerCount, setViewerCount] = useState<number>(0);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Store username → color mapping
  const userColors = useRef<{ [key: string]: string }>({});

  const getUserColor = (username: string) => {
    if (userColors.current[username]) {
      return userColors.current[username];
    }

    const used = Object.values(userColors.current);
    const available = USER_COLORS.filter((c) => !used.includes(c));

    const assigned =
      available.length > 0
        ? available[0]
        : USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

    userColors.current[username] = assigned;
    return assigned;
  };

  /* --------------------------------------------------------
      FETCH PLAYBACK URL
  -------------------------------------------------------- */
  useEffect(() => {
    const getPlayUrl = async () => {
      try {
        const res = await fetch(`http://localhost:3000/stream/${streamId}`, {
          credentials: "include",
        });

        const data = await res.json();
        setStreamUrl(data.playbackUrl);
      } catch (err) {
        console.error("Stream fetch error:", err);
      }
    };

    if (streamId) getPlayUrl();
  }, [streamId]);

  /* --------------------------------------------------------
      FETCH CHAT HISTORY (REDIS)
  -------------------------------------------------------- */
  useEffect(() => {
    if (!streamId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/stream/messages/${streamId}`,
          {
            credentials: "include",
            method: "GET",
          }
        );

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchMessages();
  }, [streamId]);

  /* --------------------------------------------------------
      SOCKET SETUP
  -------------------------------------------------------- */
  useEffect(() => {
    if (!streamId) return;

    const socket: Socket = io("http://127.0.0.1:3000", {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        token: document.cookie.split("=")[1],
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join-stream", streamId);
    });

    socket.on("receive-message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("viewer_count", (count: number) => {
      setViewerCount(count);
    });

    socket.on("leave-stream", (count: number) => {
      setViewerCount(count);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [streamId]);

  /* --------------------------------------------------------
      AUTO SCROLL CHAT
  -------------------------------------------------------- */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  /* --------------------------------------------------------
      VIDEO HLS SETUP
  -------------------------------------------------------- */
  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch(console.error);
      });
    } else if (
      videoRef.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoRef.current.src = streamUrl;
      videoRef.current.play().catch(console.error);
    }

    return () => {
      hls?.destroy();
    };
  }, [streamUrl]);

  /* --------------------------------------------------------
      SEND MESSAGE
  -------------------------------------------------------- */
  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit("send-message", {
      streamId,
      user: "User",
      message,
    });

    setMessage("");
  };

  /* --------------------------------------------------------
      FETCH LIVE VIEWER COUNT API
  -------------------------------------------------------- */
  useEffect(() => {
    if (!streamId) return;

    const fetchViewerCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/stream/viewers/count/${streamId}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();
        if (data.viewers !== undefined) {
          setViewerCount(Number(data.viewers));
        }
      } catch (error) {
        console.error("Viewer count fetch error:", error);
      }
    };

    fetchViewerCount();
    const interval = setInterval(fetchViewerCount, 5000);
    return () => clearInterval(interval);
  }, [streamId]);

  /* --------------------------------------------------------
      JSX RETURN
  -------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* HEADER */}
      <div className="border-b border-gray-800 px-6 py-4 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Live Stream</h1>
            <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              LIVE
            </span>
            <span className="text-gray-400 text-sm">
              | {viewerCount} watching
            </span>
          </div>

          <span className="text-gray-500 text-sm">Stream ID: {streamId}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-6">
        {/* VIDEO */}
        <div className="lg:col-span-3">
          <div className="rounded-xl overflow-hidden shadow-2xl bg-black relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-[260px] sm:h-[400px] lg:h-[520px] object-cover"
              controls
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
              onContextMenu={(e) => e.preventDefault()}
            />



            <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-t border-gray-800">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                📡 Live Stream
              </span>
              <span className="text-green-400 text-sm font-semibold">
                ● Connected
              </span>
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div className="bg-[#111] rounded-xl shadow-xl flex flex-col h-[600px] border border-gray-800">
          <div className="p-4 border-b border-gray-800 bg-black/30 backdrop-blur-md text-center">
            <h2 className="text-lg font-semibold">Live Chat</h2>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
          >
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center mt-20">
                No messages yet...
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="text-sm leading-relaxed break-words">
                  <span
                    className="font-semibold"
                    style={{ color: getUserColor(msg.user) }}
                  >
                    {msg.user}
                  </span>
                  <span className="text-white">: {msg.message}</span>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-800 bg-black/30 backdrop-blur-md flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 p-3 rounded-xl bg-gray-900 placeholder-gray-600 text-white border border-gray-700 focus:border-blue-500 outline-none"
              placeholder="Say something..."
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamViewer;
