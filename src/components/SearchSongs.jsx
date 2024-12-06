import React, { useState } from 'react';
import axios from 'axios';

const SearchSongs = ({ onShare }) => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      setError('Please log in to Spotify first');
      return;
    }

    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'track',
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSongs(response.data.tracks.items);
      setError(null);
    } catch (error) {
      console.error('Error fetching songs', error);
      setError('Failed to search songs. Please try again.');
    }
  };

  return (
    <div className="mb-5">
      <div className="flex gap-2.5 mb-2.5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for songs"
          className="flex-1 p-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1db954] transition-colors duration-300"
        />
        <button 
          onClick={handleSearch}
          className="px-4 py-2 bg-[#1db954] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-[#1ed760] hover:-translate-y-0.5"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-2.5">
          {error}
        </div>
      )}

      {songs.length > 0 && (
        <div className="max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg">
          {songs.map((song) => (
            <div 
              key={song.id}
              className="p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center gap-2.5 transition-colors duration-200"
              onClick={() => onShare(song)}
            >
              {song.album.images[2] && (
                <img 
                  src={song.album.images[2].url} 
                  alt={song.name}
                  className="w-10 h-10 rounded"
                />
              )}
              <div>
                <div className="font-semibold text-sm">{song.name}</div>
                <div className="text-xs text-gray-500">
                  {song.artists.map(artist => artist.name).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSongs;
