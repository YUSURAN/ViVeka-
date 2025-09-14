import React from 'react';
import { ChatIcon, EducationIcon, ArticleIcon, MoodIcon, JournalIcon, QuizIcon } from './icons/Icons';
import { useSounds } from '../App';

type View = 'chat' | 'education' | 'article' | 'mood' | 'journal' | 'quiz';

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const NavButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => {
    const { playClick } = useSounds();

    const handleClick = () => {
        playClick();
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            aria-label={label}
            className={`relative flex flex-col items-center justify-center w-full h-20 transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:bg-blue-100/70 hover:text-blue-600'
            }`}
        >
            {isActive && (
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-blue-500 rounded-r-full" />
            )}
            {children}
            <span className="text-xs mt-1 font-medium">{label}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
    return (
        <nav className="flex flex-col h-full w-20 bg-white border-r border-blue-100 shadow-sm">
            <div className="p-2 mt-2">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">V</span>
                </div>
            </div>
            <div className="mt-8 space-y-2">
                <NavButton
                    label="Chat"
                    isActive={activeView === 'chat'}
                    onClick={() => onNavigate('chat')}
                >
                    <ChatIcon />
                </NavButton>
                <NavButton
                    label="Mood"
                    isActive={activeView === 'mood'}
                    onClick={() => onNavigate('mood')}
                >
                    <MoodIcon />
                </NavButton>
                <NavButton
                    label="Catatan"
                    isActive={activeView === 'journal'}
                    onClick={() => onNavigate('journal')}
                >
                    <JournalIcon />
                </NavButton>
                <NavButton
                    label="Kuis"
                    isActive={activeView === 'quiz'}
                    onClick={() => onNavigate('quiz')}
                >
                    <QuizIcon />
                </NavButton>
                <NavButton
                    label="Edukasi"
                    isActive={activeView === 'education'}
                    onClick={() => onNavigate('education')}
                >
                    <EducationIcon />
                </NavButton>
                <NavButton
                    label="Artikel"
                    isActive={activeView === 'article'}
                    onClick={() => onNavigate('article')}
                >
                    <ArticleIcon />
                </NavButton>
            </div>
        </nav>
    );
};

export default Sidebar;
