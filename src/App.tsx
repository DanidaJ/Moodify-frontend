import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Track {
    name: string;
    artist: string;
    album: string;
    preview_url: string;
    image: string;
}

const moods = ['happy', 'sad', 'chill', 'party', 'sexy', 'romantic'];

const App: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<string>('');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Assume true since no check_auth

    const fetchPlaylist = async (mood: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/playlist?mood=${mood}`, { withCredentials: true });
            if (response.status === 200) {
                const tracksData = response.data.items.map((item: any) => ({
                    name: item.track.name,
                    artist: item.track.artists[0].name,
                    album: item.track.album.name,
                    preview_url: item.track.preview_url,
                    image: item.track.album.images[0]?.url || '',
                }));
                setTracks(tracksData);
            }
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                window.location.href = 'http://localhost:5000/callback';
            } else {
                setError('Failed to fetch playlist. Make sure you are logged in via Spotify.');
            }
            setTracks([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 text-white flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-8 mt-4">Moodify😉🎧 — Playlist Generator</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
                {moods.map((mood) => (
                    <button
                        key={mood}
                        onClick={() => {
                            setSelectedMood(mood);
                            fetchPlaylist(mood);
                        }}
                        className={`px-4 py-2 rounded-xl font-medium shadow-lg transition transform hover:scale-105 hover:bg-blue-700 ${selectedMood === mood ? 'bg-blue-700' : 'bg-blue-500'}`}
                    >
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </button>
                ))}
            </div>

            {loading && <p className="text-lg animate-pulse">Loading your vibe playlist...</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {tracks.map((track, index) => (
                    <div key={index} className="bg-white bg-opacity-10 p-4 rounded-xl shadow-md hover:shadow-lg transition">
                        <img src={track.image} alt={track.name} className="rounded-md mb-3 w-full h-48 object-cover" />
                        <h2 className="text-xl font-semibold mb-1">{track.name}</h2>
                        <p className="text-sm text-gray-300 mb-2">{track.artist}</p>
                        {track.preview_url ? (
                            <audio controls className="w-full">
                                <source src={track.preview_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No preview available</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;