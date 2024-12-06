import React from 'react';

const SongList = ({ songs, onShare }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <ul className="space-y-2">
        {songs.map((song) => (
          <li key={song.id} className="hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <button 
              onClick={() => onShare(song.uri)}
              className="w-full text-left p-2 hover:text-[#1db954]"
            >
              {song.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
