import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Player = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      setError('Please log in to Spotify first');
      navigate('/');
      return;
    }

    const checkSpotifyAvailability = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          localStorage.removeItem('spotify_token');
          setError('Spotify session expired. Please log in again.');
          navigate('/');
          return;
        }
        
        if (!response.ok) {
          setError('Please open Spotify on any device to enable playback control');
        }
      } catch (err) {
        console.error('Spotify availability check failed:', err);
        setError('Unable to connect to Spotify');
      }
    };

    checkSpotifyAvailability();
  }, [navigate]);

  if (error) {
    return (
      <div className="p-2.5 m-2.5 bg-red-50 rounded text-red-800">
        <p>{error}</p>
        <p className="text-sm mt-1.5">
          Don't worry! Songs will open in your Spotify app when shared.
        </p>
      </div>
    );
  }

  return null;
};

export default Player;