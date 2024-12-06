import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1/search';

export const searchSongs = async (query, token) => {
  try {
    const response = await axios.get(SPOTIFY_API_URL, {
      params: {
        q: query,
        type: 'track',
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.tracks.items;
  } catch (error) {
    console.error('Error fetching songs', error);
  }
};
