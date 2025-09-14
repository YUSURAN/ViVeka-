import React, { useState } from 'react';
import { QuizIcon } from './icons/Icons';
import { useSounds } from '../App';

type AnswerScore = {
    [key: string]: number;
};

interface Question {
    text: string;
    options: string[];
    scores: number[];
}

const quizData: { title: string; questions: Question[], results: {min: number, max: number, text: string}[] } = {
    title: "Bagaimana Kamu Mengelola Stres?",
    questions: [
        {
            text: "Ketika menghadapi tenggat waktu yang ketat, apa yang biasanya Anda lakukan?",
            options: [
                "Merasa panik dan sulit fokus.",
                "Membuat rencana langkah-demi-langkah dan mengerjakannya satu per satu.",
                "Menunda pekerjaan hingga saat-saat terakhir."
            ],
            scores: [1, 3, 1]
        },
        {
            text: "Setelah hari yang melelahkan, bagaimana cara Anda bersantai?",
            options: [
                "Melakukan hobi yang menenangkan (membaca, mendengar musik).",
                "Terus memikirkan pekerjaan atau masalah yang belum selesai.",
                "Menonton TV atau bermain media sosial tanpa henti."
            ],
            scores: [3, 1, 2]
        },
        {
            text: "Jika seseorang mengkritik pekerjaan Anda, bagaimana reaksi pertama Anda?",
            options: [
                "Merasa sedih dan menganggapnya sebagai serangan pribadi.",
                "Mendengarkan masukan dan melihatnya sebagai peluang untuk berkembang.",
                "Menjadi defensif dan menyalahkan faktor eksternal."
            ],
            scores: [1, 3, 1]
        },
        {
            text: "Seberapa sering Anda meluangkan waktu untuk diri sendiri tanpa gangguan?",
            options: [
                "Hampir setiap hari.",
                "Beberapa kali seminggu.",
                "Jarang sekali atau tidak pernah."
            ],
            scores: [3, 2, 1]
        },
        {
            text: "Ketika merasa kewalahan, apakah Anda merasa nyaman untuk meminta bantuan?",
            options: [
                "Ya, saya tidak ragu meminta dukungan dari teman atau keluarga.",
                "Terkadang, tapi saya lebih suka menyelesaikannya sendiri.",
                "Tidak, saya merasa itu adalah tanda kelemahan."
            ],
            scores: [3, 2, 1]
        }
    ],
    results: [
        { min: 5, max: 8, text: "Hasilnya menunjukkan Anda mungkin sering merasa tertekan dan kewalahan. Penting untuk belajar mengenali pemicu stres dan mencari cara sehat untuk meresponsnya. Meluangkan waktu untuk diri sendiri, bahkan hanya beberapa menit setiap hari, bisa membuat perbedaan besar." },
        { min: 9, max: 12, text: "Anda memiliki beberapa strategi yang baik untuk mengelola stres, tetapi terkadang masih merasa kesulitan. Mencoba teknik relaksasi baru atau berbicara dengan seseorang yang Anda percaya saat merasa tertekan bisa membantu memperkuat ketahanan Anda." },
        { min: 13, max: 15, text: "Anda tampaknya memiliki cara yang sehat dan efektif dalam mengelola stres. Anda proaktif dan tahu cara menyeimbangkan tantangan dengan perawatan diri. Terus pertahankan kebiasaan baik ini!" }
    ]
};

const QuizScreen: React.FC = () => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<AnswerScore>({});
    const [totalScore, setTotalScore] = useState(0);
    const { playClick } = useSounds();

    const handleStart = () => {
        playClick();
        setGameState('playing');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setTotalScore(0);
    };

    const handleAnswer = (optionIndex: number) => {
        playClick();
        const question = quizData.questions[currentQuestionIndex];
        const newAnswers = { ...answers, [currentQuestionIndex]: optionIndex };
        setAnswers(newAnswers);

        setTimeout(() => {
            if (currentQuestionIndex < quizData.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                calculateResults(newAnswers);
                setGameState('end');
            }
        }, 300);
    };
    
    const calculateResults = (finalAnswers: AnswerScore) => {
        let score = 0;
        for (const qIndex in finalAnswers) {
            const question = quizData.questions[qIndex];
            const answerIndex = finalAnswers[qIndex];
            score += question.scores[answerIndex];
        }
        setTotalScore(score);
    };

    const getResultText = () => {
        const result = quizData.results.find(r => totalScore >= r.min && totalScore <= r.max);
        return result ? result.text : "Terima kasih telah menyelesaikan kuis.";
    };
    
    const renderContent = () => {
        switch (gameState) {
            case 'start':
                return (
                    <div className="text-center bg-white/70 backdrop-blur-md border border-white/50 p-8 rounded-xl shadow-lg">
                        <QuizIcon className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{quizData.title}</h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">Kuis singkat ini dirancang untuk membantu Anda merefleksikan cara Anda merespons situasi yang menantang. Ingat, ini bukan tes, hanya alat untuk kesadaran diri.</p>
                        <button 
                            onClick={handleStart}
                            className="px-8 py-3 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        >
                           Mulai Kuis
                        </button>
                    </div>
                );
            case 'playing':
                const question = quizData.questions[currentQuestionIndex];
                return (
                    <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md border border-white/50 p-8 rounded-xl shadow-lg">
                        <div className="mb-6">
                            <p className="text-sm font-medium text-blue-600 mb-1">Pertanyaan {currentQuestionIndex + 1} dari {quizData.questions.length}</p>
                            <h3 className="text-xl font-semibold text-slate-800">{question.text}</h3>
                        </div>
                        <div className="space-y-3">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className="w-full text-left p-4 bg-white/50 border border-slate-300/70 rounded-lg hover:bg-white/80 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'end':
                 return (
                    <div className="text-center bg-white/70 backdrop-blur-md border border-white/50 p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Hasil Refleksi Anda</h2>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">{getResultText()}</p>
                        <button 
                            onClick={handleStart}
                            className="px-8 py-3 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        >
                           Ulangi Kuis
                        </button>
                    </div>
                );
        }
    }

    return (
        <div className="h-full overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">Kuis Psikologi Ringan</h1>
                    <p className="text-slate-600">Alat sederhana untuk refleksi diri.</p>
                </header>
                <main className="flex justify-center">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default QuizScreen;
