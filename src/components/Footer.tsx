/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Compass, Heart, ArrowRight, Quote, BookOpen } from 'lucide-react';

interface QuranQuote {
  text: string;
  arabic: string;
  latin: string;
  reference: string;
  category: string;
}

const QURAN_QUOTES: QuranQuote[] = [
  {
    text: "Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    latin: "Yā ayyuhal-lażīna āmanusta‘īnū biṣ-ṣabri waṣ-ṣalāh(ti), innallāha ma‘aṣ-ṣābirīn(a).",
    reference: "QS. Al-Baqarah: 153",
    category: "Sabar & Sholat"
  },
  {
    text: "Maka sesungguhnya beserta kesulitan ada kemudahan, sesungguhnya beserta kesulitan ada kemudahan.",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    latin: "Fa inna ma‘al-‘usri yusrā(n). Inna ma‘al-‘usri yusrā(n).",
    reference: "QS. Asy-Syarh: 5-6",
    category: "Kemudahan Hidup"
  },
  {
    text: "Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    latin: "Wa may yatawakkal ‘alallāhi fahuwa ḥasbuh(ū).",
    reference: "QS. At-Talaq: 3",
    category: "Tawakal & Rezeki"
  },
  {
    text: "Jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    latin: "La'in syakartum la'azīdannakum.",
    reference: "QS. Ibrahim: 7",
    category: "Syukur & Nikmat"
  },
  {
    text: "Dan barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat (balasan)nya.",
    arabic: "فَمَن يَعْمЕЛْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
    latin: "Famay ya‘mal miṡqāla żarratin khairay yarah(ū).",
    reference: "QS. Az-Zalzalah: 7",
    category: "Amal & Pahala"
  },
  {
    text: "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?",
    arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    latin: "Fabi`ayyi ālā`i Rabbikumā tukażżibān(i).",
    reference: "QS. Ar-Rahman: 13",
    category: "Kecintaan & Syukur"
  },
  {
    text: "Dan berbuat baiklah, sungguh Allah menyukai orang-orang yang berbuat baik.",
    arabic: "وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
    latin: "Wa aḥsinū, innallāha yuḥibbul-muḥsinīn(a).",
    reference: "QS. Al-Baqarah: 195",
    category: "Kebaikan Sosial"
  },
  {
    text: "Dan Tuhanmu berfirman, 'Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu'.",
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    latin: "Wa qāla Rabbukumud-‘ūnī astajib lakum.",
    reference: "QS. Ghafir: 60",
    category: "Doa & Harapan"
  },
  {
    text: "Tidak ada balasan untuk kebaikan selain kebaikan (pula).",
    arabic: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ",
    latin: "Hal jazā'ul-iḥsāni illal-iḥsān(u).",
    reference: "QS. Ar-Rahman: 60",
    category: "Pahala Amal"
  },
  {
    text: "Sesungguhnya rahmat Allah sangat dekat kepada orang-orang yang berbuat baik.",
    arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
    latin: "Inna raḥmatallāhi qarībum minal-muḥsinīn(a).",
    reference: "QS. Al-A'raf: 56",
    category: "Rahmah & Kasih"
  }
];

export default function Footer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to navigate next with a sleek fade transition
  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % QURAN_QUOTES.length);
      setFade(true);
    }, 250);
  };

  // Setup 15-second automatic rotation
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        handleNextQuote();
      }, 15000); // 15 seconds
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle manual click: clear the current interval so the user gets fully 15s for the next selected verse
  const handleManualNext = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    handleNextQuote();
    
    // Re-initialize interval timer
    timerRef.current = setInterval(() => {
      handleNextQuote();
    }, 15000);
  };

  const activeQuote = QURAN_QUOTES[currentIndex];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-emerald-100 dark:border-blue-900/30 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center font-sans">
        
        {/* ROTATING QURAN QUOTE CONTAINER */}
        <div className="max-w-xl md:max-w-2xl mx-auto mb-12 relative">
          <div className="absolute -top-6 -left-3 text-emerald-100 dark:text-emerald-900/40 pointer-events-none select-none">
            <Quote className="w-12 h-12 transform rotate-180 opacity-60" />
          </div>
          
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden group">
            
            {/* Visual Progress Bar tracking 15-second decay (approximate loop visualization) */}
            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/30 dark:bg-emerald-400/20 w-full overflow-hidden">
              <div 
                key={currentIndex} 
                className="h-full bg-emerald-500/80 dark:bg-emerald-400/80 transition-all duration-[15000ms] ease-linear"
                style={{ width: '100%', animation: 'progressBar 15s linear forwards' }}
              />
            </div>

            <div className={`transition-all duration-300 ease-out transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              
              {/* Highlight & Informasi Ayat & Pengingat Hari Ini */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 dark:from-amber-500 dark:via-amber-600 dark:to-yellow-600 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-xl shadow-md shadow-amber-500/10 border border-amber-300/40 animate-pulse">
                  🕌 Ayat & Pengingat Hari Ini
                </span>
              </div>

              {/* Category Badge */}
              <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-3.5 border border-emerald-100/50 dark:border-emerald-900/30">
                ⭐ {activeQuote.category}
              </span>

              {/* Arabic Script - Custom font style & large high contrast size */}
              <div dir="rtl" className="text-xl md:text-2xl font-serif text-right text-slate-800 dark:text-emerald-50 font-normal leading-loose tracking-wide my-4 select-all">
                {activeQuote.arabic}
              </div>

              {/* Latin Transliteration Reading */}
              <p className="text-xs md:text-sm italic text-amber-600 dark:text-amber-450 font-serif font-medium tracking-wide my-2 leading-relaxed bg-amber-500/5 dark:bg-amber-400/5 py-1 px-3 rounded-xl max-w-lg mx-auto">
                {activeQuote.latin}
              </p>

              {/* Indonesian translation */}
              <p className="text-sm md:text-base text-slate-705 dark:text-emerald-100/90 font-medium leading-relaxed max-w-lg mx-auto mt-2.5">
                &ldquo;{activeQuote.text}&rdquo;
              </p>

              {/* Reference */}
              <div className="text-xs font-bold text-slate-450 dark:text-emerald-400/60 mt-4.5 flex items-center justify-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{activeQuote.reference}</span>
              </div>
            </div>

            {/* Manual navigation control button */}
            <div className="mt-6 flex justify-center">
              <button
                id="next-quran-quote"
                onClick={handleManualNext}
                className="px-4.5 py-2 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-705 dark:text-emerald-100 text-xs font-bold rounded-xl border border-slate-200/60 dark:border-emerald-900/50 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300 group"
              >
                Ayat Selanjutnya
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
          
          <style>{`
            @keyframes progressBar {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>

        {/* LOGO AND BRANDING */}
        <div className="flex justify-center items-center space-x-2.5 mb-4">
          <div className="bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 p-2 rounded-xl text-blue-700 dark:text-amber-350">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-blue-700 dark:from-emerald-300 dark:to-blue-300 bg-clip-text text-transparent font-sans">
            Portal Islami Keluarga Mbah Yani
          </span>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-blue-900/20 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 dark:text-emerald-300/40 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <span>&copy; {currentYear} Portal Sinergitas & Ibadah. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-slate-500 dark:text-emerald-400/55">
            <span>Dihadirkan dengan penuh</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse fill-current" />
            <span>untuk kebersamaan Umat & Keluarga.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
