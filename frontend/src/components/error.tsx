import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function ErrorDialog({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]">
      <div className="bg-[#1E293B] p-6 rounded-2xl w-[400px] border border-red-600 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-400"
        >
          <X />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={28} />
          <h2 className="text-xl font-bold text-red-500">
            Error
          </h2>
        </div>

        <p className="text-gray-300">{message}</p>

        <button
          onClick={onClose}
          className="mt-6 bg-red-600 hover:bg-red-700 transition w-full py-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}
