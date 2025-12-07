import { X, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function StreamModal({ stream, onClose }) {
  const [copied, setCopied] = useState("");

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  if (!stream) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111] w-[500px] p-6 rounded-xl border border-purple-600 relative">

        {/* Close */}
        <X
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-white"
        />

        <h2 className="text-xl font-bold text-white mb-4">
          🎥 Stream Info (Use in OBS)
        </h2>

        {/* RTMP URL */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">RTMP URL</p>
          <div className="flex items-center justify-between bg-black p-2 rounded">
            <span className="text-purple-400 text-sm truncate">
              {stream.url}
            </span>

            <button
              onClick={() => handleCopy(stream.url, "url")}
              className="text-white ml-2"
            >
              {copied === "url" ? <CheckCircle size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Stream Key */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-1">Stream Key</p>
          <div className="flex items-center justify-between bg-black p-2 rounded">
            <span className="text-purple-400 text-sm truncate">
              {stream.key}
            </span>

            <button
              onClick={() => handleCopy(stream.key, "key")}
              className="text-white ml-2"
            >
              {copied === "key" ? <CheckCircle size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="text-sm text-gray-400 mb-5">
          <p>1. Open OBS</p>
          <p>2. Go to Settings → Stream</p>
          <p>3. Paste URL & Key</p>
          <p>4. Click Start Streaming</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          Done
        </button>
      </div>
    </div>
  );
}
