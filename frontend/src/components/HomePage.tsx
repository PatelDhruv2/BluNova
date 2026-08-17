import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import LiveContent from './content';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.cookie.includes("jwt=")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1e0c3b] to-[#5b0f9a]">
      <Header />
      <main className="flex-1 pt-20 px-4">
        <LiveContent />
      </main>
    </div>
  );
};

export default HomePage;
