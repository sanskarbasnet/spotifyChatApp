import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topArtists, setTopArtists] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    gender: '',
    pronouns: '',
    city: '',
    profilePicture: null,
    selectedArtists: []
  });

  // Fetch user's top artists from Spotify
  useEffect(() => {
    const fetchTopArtists = async () => {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        console.error('No Spotify token found');
        return;
      }

      try {
        console.log('Spotify Token:', token);
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 20 }
        });
        console.log('Top artists response:', response.data);
        setTopArtists(response.data.items);
      } catch (error) {
        console.error('Error fetching top artists:', error.response ? error.response.data : error.message);
      }
    };

    fetchTopArtists();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profilePicture: file }));
  };

  const handleArtistToggle = (artistId) => {
    setFormData(prev => ({
      ...prev,
      selectedArtists: prev.selectedArtists.includes(artistId)
        ? prev.selectedArtists.filter(id => id !== artistId)
        : [...prev.selectedArtists, artistId]
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Choose a Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1db954] focus:outline-none"
          placeholder="Enter a unique username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1db954] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1db954] focus:outline-none"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pronouns
        </label>
        <select
          name="pronouns"
          value={formData.pronouns}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1db954] focus:outline-none"
        >
          <option value="">Select pronouns</option>
          <option value="he/him">He/Him</option>
          <option value="she/her">She/Her</option>
          <option value="they/them">They/Them</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1db954] focus:outline-none"
          placeholder="Enter your city"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Your Favorite Artists
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {topArtists.length > 0 ? (
          topArtists.map(artist => (
            <div
              key={artist.id}
              onClick={() => handleArtistToggle(artist.id)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                formData.selectedArtists.includes(artist.id)
                  ? 'border-[#1db954] scale-105'
                  : 'border-transparent'
              }`}
            >
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-2 bg-white">
                <p className="text-sm font-medium truncate">{artist.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No artists found. Please try again later.</p>
        )}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Here you would typically send the formData to your backend
      console.log('Form submitted:', formData);
      localStorage.setItem('user_profile', JSON.stringify(formData));
      localStorage.setItem('profile_completed', 'true');
      navigate('/chat');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="mt-2 text-gray-600">Step {step} of 3</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
            <div
              className="h-full bg-[#1db954] rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {step === 1 && renderStep1()}
            {step === 3 && renderStep3()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else handleSubmit();
              }}
              disabled={loading}
              className="ml-auto px-6 py-3 bg-[#1db954] text-white rounded-lg font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : step === 3 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 