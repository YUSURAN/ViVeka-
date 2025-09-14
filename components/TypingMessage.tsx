import React, { useState, useEffect } from 'react';

interface TypingMessageProps {
    text: string;
}

const TypingMessage: React.FC<TypingMessageProps> = ({ text }) => {
    const [animatedText, setAnimatedText] = useState('');

    useEffect(() => {
        // Jika teks animasi sudah sama dengan teks lengkap, tidak perlu melakukan apa-apa.
        if (animatedText.length === text.length) {
            return;
        }

        // Jadwalkan penambahan karakter berikutnya dengan jeda untuk menciptakan efek pengetikan.
        const timeoutId = setTimeout(() => {
            setAnimatedText(text.slice(0, animatedText.length + 1));
        }, 30); // Kecepatan pengetikan dalam milidetik

        // Bersihkan timer jika komponen dilepas atau props berubah sebelum timeout.
        return () => clearTimeout(timeoutId);

    }, [text, animatedText]);

    return (
        <p className="whitespace-pre-wrap">
            {animatedText}
            {/* Efek kursor berkedip hanya ditampilkan saat mengetik */}
            {animatedText.length < text.length && (
                <span className="inline-block w-0.5 h-4 bg-slate-600 animate-pulse ml-1 align-bottom" />
            )}
        </p>
    );
};

export default TypingMessage;
