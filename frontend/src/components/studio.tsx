import React, { useState, useEffect } from "react";
import {
  Upload,
  Video,
  BarChart2,
  Users,
  Settings,
  LogOut,
  Camera,
  X,
  Copy,
  Check
} from "lucide-react";

/* ✅ STREAM MODAL */
import StreamModal from "./streaminfo";

/* ✅ ERROR MODAL */
import ErrorModal from "./error";

export default function StudioDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [streamInfo, setStreamInfo] = useState(null);
  const [isStartingLive, setIsStartingLive] = useState(false);
  const [previousStreams, setPreviousStreams] = useState([]);
  const [isEndingStream, setIsEndingStream] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const tabs = [
    { name: "Dashboard", icon: <BarChart2 className="w-5 h-5" /> },
    { name: "Content", icon: <Video className="w-5 h-5" /> },
    { name: "Live", icon: <Camera className="w-5 h-5" /> },
    { name: "Community", icon: <Users className="w-5 h-5" /> },
    { name: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const fetchPreviousStream = async () => {
    try {
      const res = await fetch("http://localhost:3000/stream/previousStreams", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch previous streams");

      const data = await res.json();

      if (data?.streams?.length > 0) {
        const filtered = data.streams.filter((s) => s.status !== "ended");
        setPreviousStreams(filtered);
      } else {
        setPreviousStreams([]);
      }
    } catch (error) {
      setPreviousStreams([]);
      setErrorMessage(error.message || "Something went wrong fetching streams");
    }
  };

  useEffect(() => {
    fetchPreviousStream();
  }, []);

  const handleStartLive = async () => {
    setIsStartingLive(true);

    try {
      const res = await fetch("http://localhost:3000/stream/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My Live Stream" }),
      });

      if (!res.ok) throw new Error("End the Ongoing stream that is Live");

      const data = await res.json();

      const info = {
        url: data.rtmpUrl,
        key: data.stream.streamKey,
      };

      setStreamInfo(info);
      setShowModal(true); // ✅ OPEN MODAL

      await fetchPreviousStream();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong starting the stream");
    } finally {
      setIsStartingLive(false);
    }
  };

  const handleEndStream = async (key) => {
    setIsEndingStream(true);

    try {
      const res = await fetch("http://localhost:3000/stream/updateStatus", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamKey: key, status: "ended" }),
      });

      if (!res.ok) throw new Error("Failed to end the stream");

      await fetchPreviousStream();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong ending the stream");
    } finally {
      setIsEndingStream(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
        <div className="p-6 text-2xl font-bold">Studio</div>

        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-700 ${
              activeTab === tab.name && "bg-gray-700"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}

        <div className="mt-auto px-6 py-4">
          <button className="flex items-center gap-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === "Live" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Go Live</h2>

            <button
              onClick={handleStartLive}
              disabled={isStartingLive}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-10 ${
                isStartingLive
                  ? "bg-gray-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <Camera className="w-4 h-4" />
              {isStartingLive ? "Starting..." : "Start New Live Stream"}
            </button>

            <h3 className="text-xl font-semibold mb-4">Your Streams</h3>

            {previousStreams.length === 0 ? (
              <p className="text-gray-400">No streams found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="bg-gray-800 p-4 rounded-xl border border-gray-700"
                  >
                    <h4 className="font-semibold text-lg mb-2">
                      {stream.title || "Untitled Stream"}
                    </h4>

                    <p className="text-sm text-gray-400 mb-1">
                      Key: {stream.streamKey}
                    </p>

                    <p className="text-sm mb-3">
                      Status:
                      <span
                        className={`ml-2 ${
                          stream.isLive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {stream.isLive ? "LIVE" : "OFFLINE"}
                      </span>
                    </p>

                    {stream.isLive ? (
                      <button
                        disabled={isEndingStream}
                        onClick={() => handleEndStream(stream.streamKey)}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        {isEndingStream ? "Ending..." : "End Stream"}
                      </button>
                    ) : (
                      <a
                        href={`/live/${stream.streamKey}`}
                        className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Watch Stream
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Stream Modal */}
      {showModal && (
        <StreamModal
          stream={streamInfo}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ✅ Error Modal */}
      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </div>
  );
}
