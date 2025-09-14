import React, { useState, useEffect, useMemo } from 'react';
import { useSounds } from '../App';

type Mood = "Senang" | "Sedih" | "Marah" | "Cemas" | "Lelah" | "Biasa Saja";
type MoodData = { [date: string]: Mood };

const MOOD_OPTIONS: Mood[] = ["Senang", "Sedih", "Marah", "Cemas", "Lelah", "Biasa Saja"];

const MOOD_VISUALS: { [key in Mood]: { emoji: string; color: string, barColor: string } } = {
    "Senang": { emoji: "😊", color: "bg-green-100 text-green-800", barColor: "bg-gradient-to-b from-green-300 to-green-400" },
    "Sedih": { emoji: "😢", color: "bg-blue-100 text-blue-800", barColor: "bg-gradient-to-b from-blue-300 to-blue-400" },
    "Marah": { emoji: "😠", color: "bg-red-100 text-red-800", barColor: "bg-gradient-to-b from-red-300 to-red-400" },
    "Cemas": { emoji: "😟", color: "bg-yellow-100 text-yellow-800", barColor: "bg-gradient-to-b from-yellow-300 to-yellow-400" },
    "Lelah": { emoji: "😴", color: "bg-gray-100 text-gray-800", barColor: "bg-gradient-to-b from-gray-300 to-gray-400" },
    "Biasa Saja": { emoji: "🙂", color: "bg-indigo-100 text-indigo-800", barColor: "bg-gradient-to-b from-indigo-300 to-indigo-400" },
};

const formatDateForModal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Use UTC to avoid off-by-one day errors
    });
};

const MoodTrackerScreen: React.FC = () => {
    const [moods, setMoods] = useState<MoodData>({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const { playClick } = useSounds();

    useEffect(() => {
        try {
            const storedMoods = localStorage.getItem('vivekaMoods');
            if (storedMoods) {
                setMoods(JSON.parse(storedMoods));
            }
        } catch (error) {
            console.error("Failed to load moods from localStorage:", error);
        }
    }, []);

    const saveMoods = (newMoods: MoodData) => {
        setMoods(newMoods);
        try {
            localStorage.setItem('vivekaMoods', JSON.stringify(newMoods));
        } catch (error) {
            console.error("Failed to save mood to localStorage:", error);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysMood = moods[todayStr];

    const handleMoodSelect = (mood: Mood, date: string = todayStr) => {
        playClick();
        const newMoods = { ...moods, [date]: mood };
        saveMoods(newMoods);
        if (editingDate) {
            setEditingDate(null);
        }
    };
    
    const handleDeleteMood = (date: string) => {
        playClick();
        const newMoods = { ...moods };
        delete newMoods[date];
        saveMoods(newMoods);
        setEditingDate(null);
    };

    const moodSummary = useMemo(() => {
        const summary: { [key in Mood]?: number } = {};
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        Object.entries(moods).forEach(([dateStr, mood]) => {
            if (new Date(dateStr) >= thirtyDaysAgo) {
                summary[mood] = (summary[mood] || 0) + 1;
            }
        });
        return summary;
    }, [moods]);

    const hasRecentData = Object.keys(moodSummary).length > 0;
    const maxCount = hasRecentData ? Math.max(...Object.values(moodSummary).map(count => count || 0), 1) : 1;

    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return { days, month, year };
    }, [currentDate]);

    return (
        <div className="h-full overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">Pelacak Suasana Hati</h1>
                    <p className="text-slate-600">Catat dan lihat riwayat suasana hatimu dari waktu ke waktu.</p>
                </header>

                <section className="bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Bagaimana perasaanmu hari ini?</h2>
                    {todaysMood ? (
                        <div className={`p-4 rounded-lg flex items-center gap-4 ${MOOD_VISUALS[todaysMood].color}`}>
                            <span className="text-3xl">{MOOD_VISUALS[todaysMood].emoji}</span>
                            <div>
                                <p className="font-semibold">Suasana hatimu hari ini:</p>
                                <p className="text-lg font-bold">{todaysMood}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {MOOD_OPTIONS.map(mood => (
                                <button
                                    key={mood}
                                    onClick={() => handleMoodSelect(mood)}
                                    className={`flex items-center gap-2 text-sm border rounded-full px-4 py-2 transition-colors duration-200 shadow-md ${MOOD_VISUALS[mood].color.replace('bg-', 'hover:bg-').replace('100', '200')} border-transparent`}
                                >
                                    <span className="text-lg">{MOOD_VISUALS[mood].emoji}</span>
                                    {mood}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
                
                <section className="bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-slate-700 mb-6">Ringkasan 30 Hari Terakhir</h2>
                    {hasRecentData ? (
                        <div>
                            <div className="flex justify-around items-end h-40 gap-3 border-b border-gray-200 pb-2 px-2">
                                {MOOD_OPTIONS.map(mood => {
                                    const count = moodSummary[mood] || 0;
                                    const height = (count / maxCount) * 100;
                                    return (
                                        <div key={mood} className="flex-1 flex flex-col items-center justify-end group">
                                            <div className="text-sm font-bold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                                            <div
                                                className={`w-full rounded-t-md ${MOOD_VISUALS[mood].barColor} transition-all duration-500 ease-out`}
                                                style={{ height: `${height}%` }}
                                                title={`${mood}: ${count} hari`}
                                            ></div>
                                        </div>
                                    );
                                })}
                            </div>
                             <div className="flex justify-around text-center mt-2 px-2">
                                {MOOD_OPTIONS.map(mood => (
                                    <div key={mood} className="flex-1 text-2xl" title={mood}>
                                        {MOOD_VISUALS[mood].emoji}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500">Belum ada data suasana hati dalam 30 hari terakhir.</p>
                            <p className="text-sm text-slate-400 mt-1">Mulai catat suasana hatimu untuk melihat ringkasannya di sini.</p>
                        </div>
                    )}
                </section>
                
                <section className="bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4 text-center">
                        {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                            <div key={day} className="p-2">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarData.days.map((day, index) => {
                             const dateKey = day ? `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                             const mood = day ? moods[dateKey] : undefined;
                             const isToday = day ? dateKey === todayStr : false;

                            return (
                                <div 
                                    key={index} 
                                    className={`aspect-square flex items-center justify-center rounded-lg border border-transparent transition-all ${mood ? 'cursor-pointer hover:border-blue-400' : ''}`}
                                    onClick={() => mood && day && setEditingDate(dateKey)}
                                >
                                    {day && (
                                        <div className={`w-full h-full flex flex-col items-center justify-center rounded-lg ${isToday ? 'border-2 border-blue-500' : ''} ${mood ? 'bg-opacity-30 ' + MOOD_VISUALS[mood].color.replace('text-', 'border-') : 'bg-gray-50/70'}`}>
                                            <span className="text-sm text-slate-700">{day}</span>
                                            {mood && <span className="text-xl mt-1">{MOOD_VISUALS[mood].emoji}</span>}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

            {editingDate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setEditingDate(null)}>
                    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Edit Suasana Hati</h3>
                        <p className="text-sm text-slate-500 mb-6">{formatDateForModal(editingDate)}</p>
                        <div className="flex flex-wrap gap-3 mb-8">
                           {MOOD_OPTIONS.map(mood => (
                                <button
                                    key={mood}
                                    onClick={() => handleMoodSelect(mood, editingDate)}
                                    className={`flex items-center gap-2 text-sm border rounded-full px-4 py-2 transition-colors duration-200 shadow-sm ${MOOD_VISUALS[mood].color.replace('bg-', 'hover:bg-').replace('100', '200')} border-transparent`}
                                >
                                    <span className="text-lg">{MOOD_VISUALS[mood].emoji}</span>
                                    {mood}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <button 
                                onClick={() => handleDeleteMood(editingDate)}
                                className="text-red-600 hover:text-red-800 text-sm font-semibold px-3 py-2 rounded-md hover:bg-red-50"
                            >
                                Hapus Catatan
                            </button>
                            <button 
                                onClick={() => setEditingDate(null)}
                                className="px-5 py-2 bg-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-300"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoodTrackerScreen;
