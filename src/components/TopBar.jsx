import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

const TopBar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('profile_completed');
    navigate('/');
  };

  return (
    <>
      <div className="bg-[#1db954] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <img 
            src="/spotify-icon.png"
            alt="Spotify Chat"
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold">Spotify Chat</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-4 py-2 bg-white text-[#1db954] rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-[#1db954] rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414L11.414 5H15v2.414zM4 5h6.586L14 8.414V15H4V5z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default TopBar; 