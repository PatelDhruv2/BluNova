import React, { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import Login from './Login';
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const navigate = useNavigate();

    const getInitialLoginState = () => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1];
        console.log("JWT Token:", token);
        return !!token;
    };
    console.log("Is Logged In:",document.cookie);
useEffect(() => {
    if (!document.cookie.includes("jwt=")) {
        navigate("/");
    }
}, []);


    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                console.log("Logout successful");
                window.location.reload();
            }
        }
        catch (err) {
            console.error("Logout error:", err);
        }
    };

    const getJwtFromCookie = () => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1] || null;
    };

    const parseJwt = (token: string) => {
        try {
            const payload = token.split('.')[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
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
        window.location.href = `/studio/${userId}`;
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

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollPosition > 50 ? 'bg-gray-900 shadow-lg' : 'bg-gray-900'}`}>
                <div className="px-6 py-3 flex items-center justify-between border-b border-gray-800">

                    {/* LEFT SIDE */}
                    <div className="flex items-center space-x-8">
                        <button
                            onClick={() => window.location.reload()}
                            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                        >
                            BluNova
                        </button>
                        <div className="hidden md:flex space-x-6 text-sm font-semibold">
                            <a href="#" className="hover:text-purple-400 transition">Browse</a>
                            <a href="#" className="hover:text-purple-400 transition">Following</a>
                            <a href="#" className="hover:text-purple-400 transition">Categories</a>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center space-x-4">

                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-gray-800 text-white px-4 py-2 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                            />
                            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {isLoggedIn ? (
                            <>
                                <Bell className="w-5 h-5 cursor-pointer hover:text-purple-400 transition" />
                                {/* Avatar + Dropdown */}
                                <div className="relative group">
                                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full cursor-pointer flex items-center justify-center p-1">
                                        <User className="w-5 h-5" />
                                    </div>

                                    <div className="absolute right-0 mt-3 w-52 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <button
                                            onClick={handleGoToStudio}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-800 transition"
                                        >
                                            🎬 Studio
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/10 transition"
                                        >
                                            🔴 Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowLoginDialog(true)}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <span>Login</span>
                                </button>

                                {showLoginDialog && (
                                    <Login onClose={() => setShowLoginDialog(false)} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ===== PAGE CONTENT ===== */}
            <div className="pt-24 px-6">

                {/* Example: Hero / Live Channels */}
                <h2 className="text-2xl font-bold mb-6">Live Channels</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {liveChannels.map(channel => (
                        <div key={channel.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <img src={channel.thumbnail} alt={channel.streamer} className="w-full h-40 object-cover" />
                            <div className="p-3 flex items-center gap-3">
                                <img src={channel.avatar} alt={channel.streamer} className="w-10 h-10 rounded-full" />
                                <div>
                                    <h3 className="font-semibold">{channel.streamer}</h3>
                                    <p className="text-sm text-gray-400">{channel.game} • {channel.viewers} viewers</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* You can add Categories, Recommended Channels, etc here */}
            </div>
        </div>
    );
}
