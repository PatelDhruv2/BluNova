import React, { useState, useEffect } from 'react';
import {  Eye, Radio } from 'lucide-react';

export default function BluNovaHome() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const getInitialLoginState = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1];

    console.log("JWT Token:", token);
    return !!token;
  };
  
  // Function to get JWT from cookie
const getJwtFromCookie = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='))
    ?.split('=')[1] || null;
};

// Function to decode JWT payload (base64)
const parseJwt = (token: string) => {
  try {
    const payload = token.split('.')[1]; // middle part of JWT
    const decoded = atob(payload); // decode base64
    return JSON.parse(decoded); // parse JSON
  } catch (err) {
    console.error("Failed to parse JWT:", err);
    return null;
  }
};

  const handleGoToStudio = () => {
  const token = getJwtFromCookie();
  if (!token) {
    alert("Please log in to access Studio");
    return;
  }

  const payload = parseJwt(token);
  console.log("JWT Payload:", payload);
  const userId = payload?.userId;

  if (!userId) {
    alert("Invalid token, please log in again");
    return;
  }

  console.log("Navigating to studio for user:", userId);
  window.location.href = '/studio/{$userId}'; // optional: you could pass state/context
};

  const [isLoggedIn] = useState(getInitialLoginState());


  const liveChannels = [
    { id: 1, streamer: "CosmicGamer", game: "Starfield", viewers: "12.4K", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", isLive: true },
    { id: 2, streamer: "NeonQueen", game: "Cyberpunk 2077", viewers: "8.2K", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isLive: true },
    { id: 3, streamer: "TechMaster", game: "Just Chatting", viewers: "15.7K", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", isLive: true },
    { id: 4, streamer: "PixelPro", game: "Minecraft", viewers: "6.9K", thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop", isLive: true },
    { id: 5, streamer: "NovaArtist", game: "Art", viewers: "3.1K", thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", isLive: true },
  ];

  const categories = [
    { name: "Just Chatting", viewers: "423K", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=267&fit=crop" },
    { name: "Valorant", viewers: "312K", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=267&fit=crop" },
    { name: "League of Legends", viewers: "298K", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=267&fit=crop" },
    { name: "Minecraft", viewers: "245K", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=267&fit=crop" },
    { name: "Fortnite", viewers: "189K", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=267&fit=crop" },
    { name: "Music", viewers: "156K", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=267&fit=crop" },
  ];

  const recommendedChannels = [
    ...liveChannels,
    { id: 6, streamer: "BluStream", game: "Counter-Strike 2", viewers: "5.3K", thumbnail: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", isLive: true },
    { id: 7, streamer: "GalaxyGirl", game: "Valorant", viewers: "9.8K", thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", isLive: true },
    { id: 8, streamer: "ProPlayer", game: "League of Legends", viewers: "11.2K", thumbnail: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=225&fit=crop", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", isLive: true },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
  
    {/* Main Content */}
    <div className="pt-6">
      {/* Featured Live Streams */}
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Radio className="w-6 h-6 text-red-500 mr-2 animate-pulse" />
          Live Channels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {liveChannels.map((channel) => (
            <div key={channel.id} className="group cursor-pointer">
              <div className="relative rounded-lg overflow-hidden mb-2">
                <img
                  src={channel.thumbnail}
                  alt={channel.streamer}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-1 rounded flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {channel.viewers}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <img
                  src={channel.avatar}
                  alt={channel.streamer}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate group-hover:text-purple-400 transition">
                    {channel.streamer}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{channel.game}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories & Recommended sections as it is... */}
    </div>
  </div>
  );
}