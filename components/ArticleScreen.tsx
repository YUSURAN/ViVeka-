import React from 'react';

const ArticleScreen: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">Artikel Edukasi</h1>
                    <p className="text-slate-600">Pelajari dasar-dasar pemikiran dan emosi melalui artikel komprehensif ini.</p>
                </header>

                <article className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl shadow-lg overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1598214886806-2c88b8134d17?q=80&w=1770&auto=format&fit=crop" 
                        alt="Abstract representation of psychology and thought"
                        className="w-full h-52 sm:h-64 object-cover"
                    />
                    <div className="p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                            🧠 Psikologi: Ilmu yang Membantu Kita Memahami Diri dan Orang Lain
                        </h2>
                        
                        <section className="mb-8">
                            <h3 className="text-xl font-semibold text-slate-700 mb-3">Apa Itu Psikologi?</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Psikologi adalah ilmu yang mempelajari perilaku, pikiran, dan proses mental manusia. Tujuan utama psikologi adalah untuk memahami mengapa manusia berpikir, merasa, dan bertindak seperti yang mereka lakukan. Ilmu ini tidak hanya berguna bagi para profesional seperti psikolog atau konselor, tetapi juga sangat bermanfaat dalam kehidupan sehari-hari.
                            </p>
                            <blockquote className="mt-4 p-3 bg-blue-100/50 border-l-4 border-blue-300 text-slate-600 rounded-r-lg">
                                Contoh sederhana: Mengapa seseorang bisa tiba-tiba marah saat lapar? Psikologi menjelaskan hubungan antara emosi dan kebutuhan biologis.
                            </blockquote>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-xl font-semibold text-slate-700 mb-3">Mengapa Psikologi Penting?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 text-lg">✅</span>
                                    <p className="text-slate-600 leading-relaxed"><strong className="font-semibold text-slate-700">Membantu Mengelola Emosi:</strong> Dengan memahami psikologi, kita bisa mengenali emosi diri sendiri seperti marah, cemas, atau sedih, lalu mengelolanya dengan cara yang sehat.</p>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 text-lg">✅</span>
                                    <p className="text-slate-600 leading-relaxed"><strong className="font-semibold text-slate-700">Meningkatkan Hubungan Sosial:</strong> Psikologi mengajarkan empati dan komunikasi yang efektif—kunci dalam menjaga hubungan yang baik dengan keluarga, teman, dan pasangan.</p>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 text-lg">✅</span>
                                    <p className="text-slate-600 leading-relaxed"><strong className="font-semibold text-slate-700">Mencegah dan Mengatasi Masalah Mental:</strong> Pengetahuan dasar tentang stres, depresi, dan kecemasan bisa membantu kita tahu kapan harus mencari bantuan profesional.</p>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 text-lg">✅</span>
                                    <p className="text-slate-600 leading-relaxed"><strong className="font-semibold text-slate-700">Memahami Pola Pikir Orang Lain:</strong> Misalnya: mengapa anak remaja mudah memberontak? Atau kenapa seseorang takut berbicara di depan umum? Psikologi punya jawabannya.</p>
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-xl font-semibold text-slate-700 mb-4">Cabang-Cabang Psikologi Populer</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-100/50 rounded-lg border border-slate-200/60">
                                    <h4 className="font-semibold text-slate-800">🧒 Psikologi Perkembangan</h4>
                                    <p className="text-sm text-slate-600 mt-1">Mempelajari bagaimana manusia berkembang dari bayi, anak-anak, remaja, hingga lansia—baik secara kognitif maupun emosional.</p>
                                </div>
                                 <div className="p-4 bg-slate-100/50 rounded-lg border border-slate-200/60">
                                    <h4 className="font-semibold text-slate-800">🧘 Psikologi Klinis</h4>
                                    <p className="text-sm text-slate-600 mt-1">Fokus pada gangguan mental dan bagaimana cara menanganinya, misalnya depresi, gangguan kecemasan, dan trauma.</p>
                                </div>
                                 <div className="p-4 bg-slate-100/50 rounded-lg border border-slate-200/60">
                                    <h4 className="font-semibold text-slate-800">🧑‍⚖️ Psikologi Forensik</h4>
                                    <p className="text-sm text-slate-600 mt-1">Mengaitkan psikologi dengan hukum, seperti memeriksa kondisi mental pelaku kejahatan atau membantu penyelidikan kasus hukum.</p>
                                </div>
                                <div className="p-4 bg-slate-100/50 rounded-lg border border-slate-200/60">
                                    <h4 className="font-semibold text-slate-800">🏫 Psikologi Pendidikan</h4>
                                    <p className="text-sm text-slate-600 mt-1">Mengkaji cara belajar siswa dan menciptakan lingkungan belajar yang lebih efektif.</p>
                                </div>
                                <div className="p-4 bg-slate-100/50 rounded-lg border border-slate-200/60 md:col-span-2">
                                    <h4 className="font-semibold text-slate-800">👥 Psikologi Sosial</h4>
                                    <p className="text-sm text-slate-600 mt-1">Mempelajari bagaimana manusia dipengaruhi oleh orang lain, termasuk soal konformitas, diskriminasi, atau hubungan antarindividu.</p>
                                </div>
                            </div>
                        </section>

                         <section className="mb-8">
                            <h3 className="text-xl font-semibold text-slate-700 mb-3">Fakta Menarik Tentang Psikologi</h3>
                             <ul className="space-y-2 list-disc list-inside text-slate-600">
                                <li>Tidur yang buruk selama 3 hari bisa mengganggu kemampuan berpikir jernih seperti orang mabuk alkohol.</li>
                                <li>Orang cenderung meniru ekspresi wajah lawan bicaranya secara tidak sadar, ini disebut mirroring—bentuk empati alami.</li>
                                <li>Penggunaan media sosial berlebihan bisa meningkatkan risiko gangguan kecemasan dan kesepian, terutama pada remaja.</li>
                            </ul>
                        </section>
                        
                        <hr className="my-8 border-blue-100" />
                        
                        <section className="mb-8 bg-amber-100/50 border-2 border-amber-200/80 rounded-lg p-5">
                            <h3 className="text-xl font-semibold text-amber-800 mb-3">Kapan Harus ke Psikolog?</h3>
                            <p className="text-amber-700 leading-relaxed mb-4">
                                Jangan menunggu "gila" dulu baru ke psikolog. Jika kamu:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-amber-700">
                                <li>Merasa stres berlebihan</li>
                                <li>Sering cemas tanpa alasan</li>
                                <li>Sulit tidur karena pikiran yang berat</li>
                                <li>Kehilangan semangat hidup</li>
                            </ul>
                            <p className="text-amber-700 leading-relaxed mt-4">
                                ... itu semua cukup untuk mencari bantuan. Sama seperti ke dokter saat demam, ke psikolog juga langkah sehat untuk menjaga kondisi mentalmu.
                            </p>
                        </section>
                        
                        <section>
                             <h3 className="text-xl font-semibold text-slate-700 mb-3">Penutup</h3>
                             <p className="text-slate-600 leading-relaxed">
                                Psikologi bukan sekadar ilmu teori, tapi panduan nyata untuk memahami diri sendiri dan orang lain. Dengan belajar psikologi, kita bisa menjadi pribadi yang lebih sadar, tenang, dan bijak dalam menghadapi hidup.
                            </p>
                        </section>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default ArticleScreen;