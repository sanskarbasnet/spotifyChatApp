import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { playSong } from '../services/spotifyPlayback';
import SearchSongs from './SearchSongs';
import ChatSidebar from './ChatSidebar';
import TopBar from './TopBar';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setError(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to chat server');
    });

    newSocket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('chatMessage', {
        type: 'text',
        content: message,
        sender: socket.id,
        timestamp: new Date().toISOString()
      });
      setMessage('');
    }
  };

  const handleShareSong = async (song) => {
    if (socket) {
      socket.emit('chatMessage', {
        type: 'song',
        songName: song.name,
        artistName: song.artists.map(artist => artist.name).join(', '),
        albumImage: song.album.images[0]?.url,
        songUri: song.uri,
        sender: socket.id,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handlePlaySong = async (songUri) => {
    try {
      await playSong(songUri);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    if (socket) {
      socket.disconnect();
    }
    navigate('/');
  };

  if (error) {
    return <div className="text-red-500 p-5">{error}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Sidebar */}
        <ChatSidebar onSelectChat={setSelectedChat} />
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            {selectedChat ? (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedChat.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h2 className="text-xl font-bold">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-bold">Select a chat to start messaging</h2>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.sender === socket?.id ? 'ml-auto' : 'mr-auto'
                } max-w-[70%]`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    msg.sender === socket?.id
                      ? 'bg-[#1db954] text-white ml-auto'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {msg.type === 'song' ? (
                    <div 
                      onClick={() => handlePlaySong(msg.songUri)}
                      className="cursor-pointer bg-[#282828] rounded-lg text-white overflow-hidden hover:bg-[#383838] transition-colors"
                    >
                      {msg.albumImage && (
                        <div className="relative w-full h-[200px]">
                          <img 
                            src={msg.albumImage} 
                            alt="Album cover"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-[#1db954] rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                            <span role="img" aria-label="play" className="text-lg">▶️</span>
                          </div>
                        </div>
                      )}
                      <div className="p-3">
                        <div className="font-semibold text-sm mb-1">
                          {msg.songName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {msg.artistName}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {/* Search Songs */}
            <div className="mb-4">
              <SearchSongs onShare={handleShareSong} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message"
                className="flex-1 p-3 rounded-lg border border-gray-200 focus:border-[#1db954] outline-none text-sm"
              />
              <button 
                onClick={sendMessage}
                className="px-6 py-3 bg-[#1db954] text-white rounded-lg text-sm font-semibold hover:bg-[#1ed760] transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;