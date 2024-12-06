import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CLIENT_ID = 'a25d201db27b4c23a04993091807e947'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'http://localhost:5173/callback';
const SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state'
].join('%20');

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&show_dialog=true`;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (token) {
      navigate('/chat');
      return;
    }

    if (location.pathname === '/callback') {
      const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
          if (item) {
            const parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});

      if (hash.access_token) {
        localStorage.setItem('spotify_token', hash.access_token);
        window.location.hash = '';
        navigate('/setup');
      }
    }
  }, [navigate, location]);

  if (localStorage.getItem('spotify_token')) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-4xl mb-5">Welcome to Spotify Chat</h1>
      <a
        href={AUTH_URL}
        className="bg-[#1db954] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#1ed760] transition-colors duration-300"
      >
        Login with Spotify
      </a>
    </div>
  );
}

export default Login;
