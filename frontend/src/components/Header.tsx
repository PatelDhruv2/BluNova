import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
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
    return !!token;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState());

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        document.cookie = "jwt=; Max-Age=0; path=/;";
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getJwtFromCookie = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1] || null;
  };

  const parseJwt = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  const handleGoToStudio = () => {
    const token = getJwtFromCookie();
    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    const payload = parseJwt(token);
    const userId = payload?.userId;

    if (!userId) {
      alert("Invalid token");
      return;
    }

    navigate(`/studio/${userId}`);
  };

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-gray-900`}>
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => navigate("/")}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            BluNova
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Bell className="w-5 h-5 cursor-pointer hover:text-purple-400 transition" />
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
                className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition"
              >
                Login
              </button>
              {showLoginDialog && <Login onClose={() => setShowLoginDialog(false)} />}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
