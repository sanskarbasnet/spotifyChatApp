import React, { useState } from 'react';

const ChatSidebar = ({ onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for chat list - replace with real data later
  const [chats] = useState([
    { id: 1, name: 'John Doe', lastMessage: 'Check out this song!', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for sharing', time: '9:15 AM', unread: 0 },
    { id: 3, name: 'Mike Johnson', lastMessage: 'Great playlist!', time: 'Yesterday', unread: 1 },
    // Add more dummy chats
  ]);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-gray-200 h-screen bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 rounded-lg border border-gray-200 focus:border-[#1db954] focus:outline-none"
          />
          <svg
            className="absolute left-2 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto h-[calc(100vh-116px)]">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              {chat.name.charAt(0)}
            </div>
            
            {/* Chat Info */}
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="bg-[#1db954] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;