import React, { useState, useEffect, useRef } from 'react';
import { useSounds } from '../App';

// Define the structure of a journal entry
interface JournalEntry {
    id: string;
    date: string;
    content: string;
}

// A simple utility to format dates consistently
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


const EmotionJournalScreen: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntry, setNewEntry] = useState('');
    const [isWriting, setIsWriting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { playClick } = useSounds();

    // Load entries from localStorage on initial render
    useEffect(() => {
        try {
            const storedEntries = localStorage.getItem('vivekaJournalEntries');
            if (storedEntries) {
                setEntries(JSON.parse(storedEntries));
            }
        } catch (error) {
            console.error("Failed to load journal entries from localStorage:", error);
        }
    }, []);

    // Save entries to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('vivekaJournalEntries', JSON.stringify(entries));
        } catch (error) {
            console.error("Failed to save journal entries to localStorage:", error);
        }
    }, [entries]);

    useEffect(() => {
        if (isWriting && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isWriting]);


    const handleSaveEntry = () => {
        playClick();
        if (newEntry.trim() === '') return;

        const entry: JournalEntry = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
            content: newEntry.trim(),
        };

        setEntries([entry, ...entries]); // Add new entry to the top
        setNewEntry('');
        setIsWriting(false);
    };

    const handleDeleteEntry = (id: string) => {
        playClick();
        if (window.confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
            setEntries(entries.filter(entry => entry.id !== id));
        }
    };

    const handleNewEntryClick = () => {
        playClick();
        setIsWriting(true);
    };


    return (
        <div className="h-full overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">Catatan Emosi Harian</h1>
                    <p className="text-slate-600">Tuliskan apa yang kamu rasakan. Refleksi adalah langkah pertama menuju ketenangan.</p>
                </header>
                
                {!isWriting && (
                    <div className="mb-8 text-center">
                        <button 
                            onClick={handleNewEntryClick}
                            className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                           + Tulis Catatan Baru
                        </button>
                    </div>
                )}

                {isWriting && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-lg mb-8">
                         <textarea
                            ref={textareaRef}
                            value={newEntry}
                            onChange={(e) => setNewEntry(e.target.value)}
                            placeholder="Ceritakan perasaanmu hari ini..."
                            className="w-full h-40 p-3 border border-slate-300/70 bg-transparent rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 text-slate-700"
                            aria-label="New journal entry"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                             <button 
                                onClick={() => {
                                    playClick();
                                    setIsWriting(false);
                                }}
                                className="px-4 py-2 bg-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSaveEntry}
                                disabled={!newEntry.trim()}
                                className="px-5 py-2 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-600 disabled:from-blue-300 disabled:to-blue-400 transition-colors"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                )}

                <section>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2 border-blue-200">Riwayat Catatan</h2>
                    {entries.length > 0 ? (
                        <div className="space-y-6">
                            {entries.map(entry => (
                                <div key={entry.id} className="bg-white/90 backdrop-blur-sm border border-white/50 p-5 rounded-lg shadow-lg relative group">
                                    <p className="text-sm text-slate-500 mb-2">{formatDate(entry.date)}</p>
                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                                     <button
                                        onClick={() => handleDeleteEntry(entry.id)}
                                        aria-label="Hapus catatan"
                                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white/50 rounded-lg border-2 border-dashed border-blue-200">
                             <p className="text-slate-500">Belum ada catatan yang tersimpan.</p>
                             <p className="text-sm text-slate-400 mt-1">Mulai tulis catatan pertamamu!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default EmotionJournalScreen;
