import React, { useState, useEffect } from 'react';
import { Eye, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LiveContent() {
  const [liveChannels, setLiveChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch thumbnail once per stream
  const fetchThumbnail = async (streamId) => {
    try {
      const res = await fetch(`http://localhost:3000/file/thumbnail/${streamId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      return `http://localhost:3000${data.url}`;
    } catch (err) {
      console.error('Error fetching thumbnail:', err);
      return 'http://localhost:3000/default-thumbnail.png';
    }
  };

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const res = await fetch("http://localhost:3000/stream/allStreams", {
          credentials: "include",
        });
        const data = await res.json();

        // Prepare base channels with thumbnail fetched separately
        const baseChannels = await Promise.all(
          data.streams
            .filter(stream => stream.isLive)
            .map(async (stream) => ({
              id: stream.id,
              title: stream.title,
              userId: stream.userId,
              streamId: stream.id,
              streamKey: stream.streamKey,
              thumbnail: await fetchThumbnail(stream.id), // ✅ thumbnail fetched outside main useEffect loop
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
              viewers: 0,
              category: ["Gaming", "Music", "Tech", "Art"][Math.floor(Math.random() * 4)],
            }))
        );

        // Fetch viewer counts only
        const updatedChannels = await Promise.all(
          baseChannels.map(async ch => {
            try {
              const countRes = await fetch(
                `http://localhost:3000/stream/viewers/count/${ch.streamId}`,
                { credentials: "include" }
              );
              const countData = await countRes.json();
              return { ...ch, viewers: countData.viewers ?? 0 };
            } catch (err) {
              console.error("Error fetching viewers:", err);
              return { ...ch, viewers: 0 };
            }
          })
        );

        setLiveChannels(updatedChannels);
      } catch (err) {
        console.error("Error fetching streams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStreams();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      {liveChannels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-3xl font-bold text-white mb-3">No Live Streams</h2>
          <p className="text-purple-300 text-lg text-center max-w-md">
            There are no active broadcasts at the moment. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveChannels.map(channel => (
            <div
              key={channel.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => navigate(`/watch/${channel.streamId}`)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all shadow-xl hover:shadow-2xl">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={channel.thumbnail}
                    alt={channel.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    <Eye className="w-4 h-4" /> {channel.viewers}
                  </div>

                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>LIVE
                  </div>

                  <div className="absolute bottom-3 left-3 bg-purple-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {channel.category}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex gap-3">
                  <img
                    src={channel.avatar}
                    alt="Creator"
                    className="w-12 h-12 rounded-full ring-2 ring-purple-500/50"
                  />
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">{channel.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
