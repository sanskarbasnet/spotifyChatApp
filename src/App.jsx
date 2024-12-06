import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Chat from "./components/Chat"
import Login from "./components/Login";
import Player from "./components/Player";
import ProfileSetup from "./components/ProfileSetup";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('spotify_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const SetupRoute = ({ children }) => {
  const token = localStorage.getItem('spotify_token');
  const hasCompletedSetup = localStorage.getItem('profile_completed');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  if (token && hasCompletedSetup) {
    return <Navigate to="/chat" replace />;
  }
  
  return children;
};

const ChatRoute = ({ children }) => {
  const token = localStorage.getItem('spotify_token');
  const hasCompletedSetup = localStorage.getItem('profile_completed');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  if (token && !hasCompletedSetup) {
    return <Navigate to="/setup" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Login />} />
        <Route 
          path="/setup" 
          element={
            <SetupRoute>
              <ProfileSetup />
            </SetupRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ChatRoute>
              <div className="h-screen">
                <Player />
                <Chat />
              </div>
            </ChatRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
