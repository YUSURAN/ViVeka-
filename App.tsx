import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import type { Chat } from '@google/genai';
import { startNewChatSession, sendStreamedMessage } from './services/geminiService';
import { ChatMessage } from './types';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';
import Sidebar from './components/Sidebar';
import EducationScreen from './components/EducationScreen';
import ArticleScreen from './components/ArticleScreen';
import MoodTrackerScreen from './components/MoodTrackerScreen';
import EmotionJournalScreen from './components/EmotionJournalScreen';
import QuizScreen from './components/QuizScreen';
import { ChatIcon, CloseIcon } from './components/icons/Icons';

// --- Sound Context ---
const SoundContext = createContext<{ playClick: () => void; } | null>(null);
export const useSounds = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSounds must be used within a SoundProvider');
    }
    return context;
};

// Helper function to get a greeting based on the time of day
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Selamat pagi";
    if (hour >= 11 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 18) return "Selamat sore";
    return "Selamat malam";
};

type View = 'chat' | 'education' | 'article' | 'mood' | 'journal' | 'quiz';
const viewOrder: View[] = ['chat', 'mood', 'journal', 'quiz', 'education', 'article'];

enum TransitionState {
    IDLE,
    OUT,
    IN,
}

const App: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<View>('chat');
    const [viewToRender, setViewToRender] = useState<View>('chat');
    const [transitionState, setTransitionState] = useState<TransitionState>(TransitionState.IDLE);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
    const [isEntering, setIsEntering] = useState(false);
    const [notificationContent, setNotificationContent] = useState<string | null>(null);
    const notificationAudioRef = useRef<HTMLAudioElement>(null);
    const loginSoundRef = useRef<HTMLAudioElement>(null);
    const clickSoundRef = useRef<HTMLAudioElement>(null);


    // --- Chat State Lifted from ChatScreen ---
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [historyState, setHistoryState] = useState<'checking' | 'prompting' | 'ready'>('checking');
    const chatRef = useRef<Chat | null>(null);
    // --- End of Lifted State ---

    const playSound = useCallback((ref: React.RefObject<HTMLAudioElement>, volume = 0.5) => {
        if (ref.current) {
            ref.current.volume = volume;
            ref.current.currentTime = 0; // Rewind to start in case it's played again quickly
            ref.current.play().catch(e => console.error("Sound play failed", e));
        }
    }, []);

    const playClick = useCallback(() => playSound(clickSoundRef, 0.3), [playSound]);

    const handleLogin = useCallback((name: string) => {
        if (name.trim()) {
            setUserName(name.trim());
            playSound(loginSoundRef, 0.4);
        }
    }, [playSound]);

    const handleNavigate = useCallback((view: View) => {
        if (view === 'chat') {
            setNotificationContent(null);
        }
        if (transitionState === TransitionState.IDLE && view !== activeView) {
            const currentIndex = viewOrder.indexOf(activeView);
            const nextIndex = viewOrder.indexOf(view);
            
            setAnimationDirection(nextIndex > currentIndex ? 'right' : 'left');
            setActiveView(view);
            setTransitionState(TransitionState.OUT);
        }
    }, [activeView, transitionState]);
    
    // This effect manages the timed transitions between states
    useEffect(() => {
        // FIX: Changed type of timer from `number` to `ReturnType<typeof setTimeout>`
        // to handle both browser (number) and Node.js (Timeout object) return types.
        let timer: ReturnType<typeof setTimeout>;
        if (transitionState === TransitionState.OUT) {
            timer = setTimeout(() => {
                setViewToRender(activeView);
                setIsEntering(true); // Prepare for entrance animation
            }, 300); // Match CSS duration
        } else if (transitionState === TransitionState.IN) {
            timer = setTimeout(() => {
                setTransitionState(TransitionState.IDLE); // Go back to idle after IN animation
            }, 300);
        }
        return () => clearTimeout(timer);
    }, [transitionState, activeView]);

    // This effect handles the single-frame state change for the entrance animation
    useEffect(() => {
        if (isEntering) {
            // Force a reflow by setting state in the next frame.
            // This ensures 'from' styles are applied before 'to' styles for the transition.
            requestAnimationFrame(() => {
                setTransitionState(TransitionState.IN);
                setIsEntering(false);
            });
        }
    }, [isEntering]);

    // --- Chat Logic Lifted from ChatScreen ---
    const startNewChat = useCallback(() => {
        localStorage.removeItem('vivekaChatHistory');
        const greeting = getGreeting();
        const initialMessages: ChatMessage[] = [{ sender: 'bot', text: `${greeting}, ${userName}. Terima kasih telah datang. Ceritakan apa yang kamu rasakan hari ini.` }];
        setMessages(initialMessages);
        chatRef.current = startNewChatSession(initialMessages);
        setHistoryState('ready');
    }, [userName]);

    const continueChat = useCallback(() => {
        const storedHistory = localStorage.getItem('vivekaChatHistory');
        if (storedHistory) {
            try {
                const parsedHistory: ChatMessage[] = JSON.parse(storedHistory);
                chatRef.current = startNewChatSession(parsedHistory);
                setMessages(parsedHistory);
                setHistoryState('ready');
            } catch (e) {
                console.error("Failed to parse history, starting new chat.", e);
                startNewChat();
            }
        } else {
            startNewChat();
        }
    }, [startNewChat]);

    useEffect(() => {
        if (!userName) return;
        try {
            const storedHistory = localStorage.getItem('vivekaChatHistory');
            if (storedHistory) {
                const parsedHistory: ChatMessage[] = JSON.parse(storedHistory);
                if (parsedHistory && parsedHistory.length > 1) {
                    setMessages(parsedHistory);
                    setHistoryState('prompting');
                } else {
                    startNewChat();
                }
            } else {
                startNewChat();
            }
        } catch (e) {
            console.error("Failed to load chat history, starting new chat.", e);
            startNewChat();
        }
    }, [userName, startNewChat]);

    useEffect(() => {
        if (historyState === 'ready' && messages.length > 0 && !isLoading) {
            try {
                localStorage.setItem('vivekaChatHistory', JSON.stringify(messages));
            } catch (e) {
                console.error("Failed to save chat history", e);
            }
        }
    }, [messages, historyState, isLoading]);
    
    const handleSendMessage = useCallback(async (textToSend: string) => {
        if (!textToSend.trim() || !chatRef.current) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: textToSend.trim() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        let botResponse = '';
        let isFirstChunk = true;

        await sendStreamedMessage(chatRef.current, textToSend.trim(), (chunk) => {
            botResponse += chunk;
            if (isFirstChunk) {
                setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
                isFirstChunk = false;
            } else {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage?.sender === 'bot') {
                        lastMessage.text = botResponse;
                    }
                    return newMessages;
                });
            }
        });
        
        setIsLoading(false);
        if (activeView !== 'chat' && botResponse) {
            const snippet = botResponse.length > 50 ? botResponse.substring(0, 50) + '...' : botResponse;
            setNotificationContent(snippet);
            notificationAudioRef.current?.play().catch(e => console.error("Notification sound failed", e));
        }
    }, [activeView]);
    // --- End of Lifted Logic ---

    const getAnimationClass = () => {
        const isSlidingRight = animationDirection === 'right';

        // 'From' state for the incoming element
        if (isEntering) {
            return isSlidingRight ? 'opacity-0 translate-x-12' : 'opacity-0 -translate-x-12';
        }

        switch (transitionState) {
            case TransitionState.OUT:
                 // 'To' state for the outgoing element
                return isSlidingRight ? 'opacity-0 -translate-x-12' : 'opacity-0 translate-x-12';
            case TransitionState.IN:
            case TransitionState.IDLE:
            default:
                 // 'To' state for the incoming element, and the final state
                return 'opacity-100 translate-x-0';
        }
    };

    const renderView = () => {
        switch (viewToRender) {
            case 'chat': return <ChatScreen 
                userName={userName!} 
                messages={messages}
                setMessages={setMessages}
                isLoading={isLoading}
                historyState={historyState}
                onSendMessage={handleSendMessage}
                onStartNewChat={startNewChat}
                onContinueChat={continueChat}
            />;
            case 'education': return <EducationScreen />;
            case 'article': return <ArticleScreen />;
            case 'mood': return <MoodTrackerScreen />;
            case 'journal': return <EmotionJournalScreen />;
            case 'quiz': return <QuizScreen />;
            default: return null;
        }
    };

    if (!userName) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <SoundContext.Provider value={{ playClick }}>
            <div className="flex h-screen w-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white text-slate-800 overflow-hidden">
                {notificationContent && (
                    <div 
                        onClick={() => {
                            setNotificationContent(null);
                            handleNavigate('chat');
                        }}
                        className="fixed top-5 right-5 z-50 flex items-center gap-4 px-4 py-3 rounded-xl shadow-2xl cursor-pointer bg-white/80 backdrop-blur-md border border-blue-200/50 animate-slide-in-down"
                        role="alert"
                        aria-live="polite"
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white ring-4 ring-white/50">
                            <ChatIcon className="w-6 h-6"/>
                        </div>
                        <div className="max-w-xs">
                            <p className="font-semibold text-blue-800">Pesan baru dari ViVeka</p>
                            <p className="text-sm text-slate-600 truncate">{notificationContent}</p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setNotificationContent(null); playClick(); }}
                            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200/70 transition-colors"
                            aria-label="Tutup notifikasi"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {/* --- Audio Elements --- */}
                <audio ref={notificationAudioRef} preload="auto">
                    <source src="https://cdn.pixabay.com/audio/2022/10/28/audio_36596d25f3.mp3" type="audio/mpeg" />
                </audio>
                <audio ref={loginSoundRef} preload="auto">
                    <source src="https://cdn.pixabay.com/audio/2022/11/17/audio_88f1e9c3da.mp3" type="audio/mpeg" />
                </audio>
                 <audio ref={clickSoundRef} preload="auto">
                    <source src="https://cdn.pixabay.com/audio/2022/03/10/audio_62c77dcd93.mp3" type="audio/mpeg" />
                </audio>

                <Sidebar activeView={activeView} onNavigate={handleNavigate} />
                <main className={`flex-1 h-screen overflow-y-hidden transition-all duration-300 ease-in-out transform ${getAnimationClass()}`}>
                    {renderView()}
                </main>
            </div>
        </SoundContext.Provider>
    );
};

export default App;