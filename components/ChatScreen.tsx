import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types';
import { useSounds } from '../App';
import { BotIcon, SendIcon, SparklesIcon, ExpertIcon } from './icons/Icons';
import TypingMessage from './TypingMessage';

interface ChatScreenProps {
    userName: string;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    isLoading: boolean;
    historyState: 'checking' | 'prompting' | 'ready';
    onSendMessage: (message: string) => Promise<void>;
    onStartNewChat: () => void;
    onContinueChat: () => void;
}

const FeatureButton: React.FC<{ onClick: () => void; children: React.ReactNode, icon: React.ReactNode }> = ({ onClick, children, icon }) => {
    const { playClick } = useSounds();
    const handleClick = () => {
        playClick();
        onClick();
    };
    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 text-sm bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-full px-3 py-1.5 text-blue-700 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
            {icon}
            {children}
        </button>
    );
};

const extractYouTubeId = (text: string): string | null => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = text.match(youtubeRegex);
    return match ? match[1] : null;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ 
    userName, 
    messages,
    setMessages, 
    isLoading, 
    historyState, 
    onSendMessage, 
    onStartNewChat, 
    onContinueChat 
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevIsLoadingRef = useRef(isLoading);
    const { playClick } = useSounds();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, historyState]);

    useEffect(() => {
        // Play sound only when this screen is active and a bot message just finished arriving.
        if (prevIsLoadingRef.current && !isLoading && messages.length > 0 && messages[messages.length - 1]?.sender === 'bot') {
            if (audioRef.current) {
                audioRef.current.volume = 0.3;
                audioRef.current.play().catch(e => console.log("Audio play failed"));
            }
        }
        prevIsLoadingRef.current = isLoading;
    }, [isLoading, messages]);

    const handleSendMessageInternal = useCallback(async (messageText?: string) => {
        const textToSend = (messageText || input).trim();
        if (!textToSend) return;

        playClick();
        setInput('');
        await onSendMessage(textToSend);
    }, [input, onSendMessage, playClick]);

    const handleFeatureClick = (actionOrPrompt: string) => {
        handleSendMessageInternal(actionOrPrompt);
    };

    const handleExpertClick = () => {
        playClick();
        const expertMessage: ChatMessage = {
            sender: 'bot',
            text: 'Kamu ingin bicara lebih dalam? Jadwalkan sesi dengan pakar.'
        };
        setMessages(prev => [...prev, expertMessage]);
        
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(e => console.log("Audio play failed"));
        }
    };

    return (
        <div className="flex flex-col h-screen bg-transparent relative">
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-8xl font-bold text-blue-100/80 select-none">ViVeka oleh YNZ AI</span>
            </div>
            
            <audio ref={audioRef}>
                <source src="https://cdn.pixabay.com/audio/2022/03/15/audio_2407453b7c.mp3" type="audio/mpeg" />
            </audio>

            <div className="flex-1 overflow-y-auto p-4 pb-48 z-10">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((msg, index) => {
                        const videoId = msg.sender === 'bot' ? extractYouTubeId(msg.text) : null;
                        const isStreamingBotMessage = msg.sender === 'bot' && isLoading && index === messages.length - 1;

                        return (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <BotIcon />
                                    </div>
                                )}
                                <div
                                    className={`max-w-lg px-4 py-2.5 rounded-2xl shadow-lg ${
                                        msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                                            : 'bg-white/80 backdrop-blur-sm text-slate-700 rounded-bl-none border border-slate-200/50'
                                    }`}
                                >
                                    {isStreamingBotMessage ? (
                                        <TypingMessage text={msg.text} />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    )}
                                    {videoId && (
                                        <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-blue-100">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title="Video Edukasi"
                                                className="w-full h-full"
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    {historyState === 'prompting' && (
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><BotIcon /></div>
                            <div className="bg-white/80 backdrop-blur-sm text-slate-700 rounded-2xl rounded-bl-none border border-slate-200/50 px-4 py-3 shadow-lg">
                                <p className="mb-3">Selamat datang kembali. Apakah Anda ingin melanjutkan percakapan terakhir?</p>
                                <div className="flex gap-3">
                                    <button onClick={onContinueChat} className="text-sm bg-blue-600 text-white rounded-full px-4 py-1.5 hover:bg-blue-700 transition-colors">Ya, lanjutkan</button>
                                    <button onClick={onStartNewChat} className="text-sm bg-gray-200 text-slate-700 rounded-full px-4 py-1.5 hover:bg-gray-300 transition-colors">Tidak, mulai baru</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isLoading && messages[messages.length-1]?.sender === 'user' && (
                         <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <BotIcon />
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm text-slate-700 rounded-2xl rounded-bl-none border border-slate-200/50 px-4 py-3 shadow-lg">
                                <div className="flex items-center justify-center gap-2">
                                     <span className="text-sm text-slate-600">ViVeka berpikir...</span>
                                    <div className="flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/60 backdrop-blur-md border-t border-slate-200/50 z-20">
                <div className="max-w-3xl mx-auto">
                    <>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <FeatureButton icon={<SparklesIcon/>} onClick={() => handleFeatureClick("Beri aku artikel singkat tentang overthinking.")}>Artikel Edukasi</FeatureButton>
                            <FeatureButton icon={<ExpertIcon/>} onClick={handleExpertClick}>Tanya Pakar</FeatureButton>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessageInternal();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pesan Anda..."
                                className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
                                disabled={isLoading || historyState !== 'ready'}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim() || historyState !== 'ready'}
                                className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-blue-600 shadow-lg disabled:from-blue-300 disabled:to-blue-400 transition-all"
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;
