import React, { useState, useEffect, useRef } from 'react';

interface LoginScreenProps {
    onLogin: (name: string) => void;
}

// Helper function to get a greeting based on the time of day
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Selamat pagi";
    if (hour >= 11 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 18) return "Selamat sore";
    return "Selamat malam";
};


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const [greeting] = useState(getGreeting()); // Get greeting once on component mount

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.1;
            audioRef.current.play().catch(e => console.log("Audio autoplay was prevented."));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(name);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-200 via-blue-100 to-white p-4">
            <audio ref={audioRef} loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <div className="text-center w-full max-w-md">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">
                    ViVeka
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8">
                    {greeting}! Selamat datang di ViVeka — Teman Reflektif Emosimu
                </p>
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama Anda"
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
                        aria-label="Your Name"
                    />
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 disabled:from-blue-300 disabled:to-blue-400 disabled:shadow-md disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Masuk
                    </button>
                </form>
                <p className="text-sm text-slate-400 mt-12">
                    diciptakan oleh YNZ AI technology
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;