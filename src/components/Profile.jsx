import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dummy friends data - replace with real data from your backend
  const [friends] = useState([
    { id: 1, username: 'JohnDoe', status: 'online' },
    { id: 2, username: 'MusicLover', status: 'offline' },
    { id: 3, username: 'RockStar', status: 'online' },
    // Add more dummy friends
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile data from localStorage
        const profileData = JSON.parse(localStorage.getItem('user_profile'));
        
        // Fetch top artists from Spotify
        const token = localStorage.getItem('spotify_token');
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 6 }
        });
        
        setUserData({
          ...profileData,
          topArtists: response.data.items
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Username and Basic Info */}
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userData?.username?.[0]?.toUpperCase()}
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold">{userData?.username}</h3>
                <p className="text-gray-600">{userData?.city}</p>
              </div>
            </div>

            {/* Top Artists */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">Favorite Artists</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userData?.topArtists?.map(artist => (
                  <div 
                    key={artist.id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    <img 
                      src={artist.images[0]?.url} 
                      alt={artist.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-3">
                      <p className="font-medium truncate">{artist.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friends List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Friends</h4>
                <button className="text-[#1db954] hover:underline text-sm font-medium">
                  Find Friends
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {friends.map(friend => (
                  <div 
                    key={friend.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1db954] rounded-full flex items-center justify-center text-white font-bold">
                        {friend.username[0].toUpperCase()}
                      </div>
                      <span className="ml-3 font-medium">{friend.username}</span>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`w-2 h-2 rounded-full ${
                          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {friend.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 