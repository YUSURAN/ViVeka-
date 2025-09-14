import React, { useState } from 'react';
import { SearchIcon } from './icons/Icons';

interface VideoInfo {
    id: string;
    title: string;
    description: string;
}

const educationalVideos: VideoInfo[] = [
    {
        id: 'VQqA6XGrY3E',
        title: 'Berhenti Menjadi "People Pleaser"',
        description: 'Pelajari cara berhenti menyenangkan semua orang dan mulai memprioritaskan diri sendiri. Video ini membahas cara menolak dengan tegas namun sopan.',
    },
    {
        id: 'QW4By7KrIyw',
        title: 'Cara Praktis Mengatasi Overthinking',
        description: 'Sebuah panduan praktis dari Analisa Channel tentang cara mengatasi pikiran berlebih (overthinking), baik itu merenungi masa lalu atau mengkhawatirkan masa depan.',
    },
    {
        id: 'rGEKzfsENxY',
        title: 'Berdamai dengan Diri Sendiri (Self-Acceptance)',
        description: 'Video dari Satu Persen ini menjelaskan pentingnya penerimaan diri dan memberikan langkah-langkah praktis untuk mulai berdamai dengan diri sendiri.',
    },
     {
        id: 'j9vqa4K4h90',
        title: 'Menyembuhkan Luka Batin (Inner Child)',
        description: 'Analisa Channel membahas konsep "inner child" dan bagaimana menyembuhkan luka batin dari masa lalu untuk kehidupan yang lebih damai.',
    },
    {
        id: 'JHHqmGx_SKY',
        title: 'Mengatasi Rasa Malas & Meningkatkan Disiplin',
        description: 'Temukan strategi efektif dari Satu Persen untuk melawan rasa malas, membangun kebiasaan positif, dan meningkatkan disiplin diri.',
    },
    {
        id: 'C8Kj4Wj1_Dw',
        title: 'Cara Memaafkan Diri Sendiri (Self-Forgiveness)',
        description: 'Pelajari pentingnya memaafkan diri sendiri dan langkah-langkah praktis untuk melakukannya, agar dapat melepaskan beban masa lalu.',
    },
    {
        id: 'SB4N4wl2P8E',
        title: "Mengenal 'Gaslighting' dan Cara Menghadapinya",
        description: "Video ini menjelaskan apa itu 'gaslighting', tanda-tandanya, dan bagaimana cara melindungi diri dari manipulasi psikologis ini.",
    },
    {
        id: '4KXbSU2jKew',
        title: "Apa Itu 'Burnout' dan Cara Mengatasinya?",
        description: "Ketahui perbedaan antara stres biasa dan 'burnout', serta strategi untuk mencegah dan memulihkan diri dari kelelahan emosional ini.",
    },
    {
        id: '6-VWqjvcQYc',
        title: 'Teknik Pernapasan untuk Meredakan Kecemasan',
        description: 'Ikuti panduan teknik pernapasan sederhana namun efektif ini untuk menenangkan sistem saraf dan meredakan perasaan cemas seketika.',
    }
];

const VideoCard: React.FC<{ video: VideoInfo }> = ({ video }) => {
    return (
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="aspect-video">
                 <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                    className="w-full h-full"
                ></iframe>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-800">{video.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{video.description}</p>
            </div>
        </div>
    );
}

const EducationScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVideos = educationalVideos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">Pusat Edukasi Psikologi</h1>
                <p className="text-slate-600 mb-6">Temukan video-video pilihan untuk membantumu lebih memahami pikiran dan perasaanmu.</p>

                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Cari video berdasarkan judul atau deskripsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300/70 bg-white/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
                        aria-label="Cari Video"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                </div>

                {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredVideos.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-10">
                        <p className="text-slate-500">Tidak ada video yang cocok dengan pencarian Anda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationScreen;