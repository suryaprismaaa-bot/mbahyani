/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { BookOpen, Sparkles, ChevronRight, Quote } from 'lucide-react';

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
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا استَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
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
    arabic: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
    latin: "Famay ya‘mal miṡqāla żarratin khairay yarah(ū).",
    reference: "QS. Az-Zalzalah: 7",
    category: "Amal & Pahala"
  }
];

const themeStyles: Record<string, {
  border: string;
  bg: string;
  accentBar: string;
  badgeBg: string;
  badgeTextColor: string;
  latinBg: string;
  latinText: string;
  indicatorText: string;
  btnBg: string;
  btnBorder: string;
  btnText: string;
}> = {
  emerald: {
    border: "border-emerald-500 dark:border-emerald-450 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-950/20",
    bg: "bg-emerald-50/95 dark:bg-slate-900/95",
    accentBar: "bg-emerald-600 dark:bg-emerald-450",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    badgeTextColor: "text-emerald-800 dark:text-emerald-300",
    latinBg: "bg-emerald-500/5",
    latinText: "text-emerald-700 dark:text-emerald-450 font-medium",
    indicatorText: "text-emerald-700 dark:text-emerald-400",
    btnBg: "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60",
    btnBorder: "border-emerald-305 dark:border-emerald-800",
    btnText: "text-emerald-900 dark:text-emerald-200",
  },
  merah: {
    border: "border-rose-500 dark:border-rose-450 shadow-lg shadow-rose-500/10 dark:shadow-rose-950/20",
    bg: "bg-rose-50/95 dark:bg-slate-900/95",
    accentBar: "bg-rose-600 dark:bg-rose-450",
    badgeBg: "bg-rose-500/10 dark:bg-rose-500/20",
    badgeTextColor: "text-rose-800 dark:text-rose-300",
    latinBg: "bg-rose-505/5",
    latinText: "text-rose-700 dark:text-rose-455 font-medium",
    indicatorText: "text-rose-700 dark:text-rose-400",
    btnBg: "bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/60",
    btnBorder: "border-rose-305 dark:border-rose-800",
    btnText: "text-rose-900 dark:text-rose-200",
  },
  orange: {
    border: "border-orange-500 dark:border-orange-450 shadow-lg shadow-orange-500/10 dark:shadow-orange-950/20",
    bg: "bg-orange-50/95 dark:bg-slate-900/95",
    accentBar: "bg-orange-600 dark:bg-orange-450",
    badgeBg: "bg-orange-500/10 dark:bg-orange-500/20",
    badgeTextColor: "text-orange-850 dark:text-orange-300",
    latinBg: "bg-orange-500/5",
    latinText: "text-orange-700 dark:text-orange-455 font-medium",
    indicatorText: "text-orange-700 dark:text-orange-400",
    btnBg: "bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/60 dark:hover:bg-orange-900/60",
    btnBorder: "border-orange-305 dark:border-orange-800",
    btnText: "text-orange-900 dark:text-orange-200",
  },
  biru: {
    border: "border-sky-500 dark:border-sky-450 shadow-lg shadow-sky-505/10 dark:shadow-sky-955/20",
    bg: "bg-sky-50/95 dark:bg-slate-900/95",
    accentBar: "bg-sky-600 dark:bg-sky-450",
    badgeBg: "bg-sky-500/10 dark:bg-sky-500/20",
    badgeTextColor: "text-sky-850 dark:text-sky-305",
    latinBg: "bg-sky-505/5",
    latinText: "text-sky-700 dark:text-sky-455 font-medium",
    indicatorText: "text-sky-700 dark:text-sky-400",
    btnBg: "bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-900/60",
    btnBorder: "border-sky-350 dark:border-sky-800",
    btnText: "text-sky-900 dark:text-sky-200",
  },
  ungu: {
    border: "border-violet-500 dark:border-violet-450 shadow-lg shadow-violet-500/10 dark:shadow-violet-950/20",
    bg: "bg-violet-50/95 dark:bg-slate-900/95",
    accentBar: "bg-violet-600 dark:bg-violet-450",
    badgeBg: "bg-violet-500/10 dark:bg-violet-500/20",
    badgeTextColor: "text-violet-855 dark:text-violet-305",
    latinBg: "bg-violet-505/5",
    latinText: "text-violet-700 dark:text-violet-455 font-medium",
    indicatorText: "text-violet-700 dark:text-violet-400",
    btnBg: "bg-violet-100 hover:bg-violet-200 dark:bg-violet-950/60 dark:hover:bg-violet-900/60",
    btnBorder: "border-violet-305 dark:border-violet-805",
    btnText: "text-violet-900 dark:text-violet-200",
  },
  coklat: {
    border: "border-amber-600 dark:border-amber-500 shadow-lg shadow-amber-500/10 dark:shadow-amber-950/20",
    bg: "bg-amber-50/95 dark:bg-slate-900/95",
    accentBar: "bg-amber-700 dark:bg-amber-500",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
    badgeTextColor: "text-amber-855 dark:text-amber-305",
    latinBg: "bg-amber-505/5",
    latinText: "text-amber-700 dark:text-amber-455 font-medium",
    indicatorText: "text-amber-700 dark:text-amber-400",
    btnBg: "bg-amber-100 hover:bg-amber-200 dark:bg-amber-955/60 dark:hover:bg-amber-900/60",
    btnBorder: "border-amber-305 dark:border-amber-805",
    btnText: "text-amber-900 dark:text-amber-200",
  },
  putih: {
    border: "border-slate-600 dark:border-slate-300 shadow-lg shadow-slate-500/10 dark:shadow-slate-950/20",
    bg: "bg-slate-100 dark:bg-slate-900",
    accentBar: "bg-slate-705 dark:bg-slate-350",
    badgeBg: "bg-slate-205 dark:bg-slate-800",
    badgeTextColor: "text-slate-800 dark:text-slate-200",
    latinBg: "bg-slate-505/10",
    latinText: "text-slate-800 dark:text-slate-305 font-medium",
    indicatorText: "text-slate-705 dark:text-slate-300",
    btnBg: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-705",
    btnBorder: "border-slate-305 dark:border-slate-700",
    btnText: "text-slate-900 dark:text-slate-100",
  },
  birutua: {
    border: "border-indigo-600 dark:border-indigo-400 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-950/20",
    bg: "bg-indigo-50/95 dark:bg-slate-900/95",
    accentBar: "bg-indigo-650 dark:bg-indigo-450",
    badgeBg: "bg-indigo-505/10 dark:bg-indigo-505/20",
    badgeTextColor: "text-indigo-855 dark:text-indigo-305",
    latinBg: "bg-indigo-505/5",
    latinText: "text-indigo-700 dark:text-indigo-455 font-medium",
    indicatorText: "text-indigo-700 dark:text-indigo-400",
    btnBg: "bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60",
    btnBorder: "border-indigo-350 dark:border-indigo-805",
    btnText: "text-indigo-900 dark:text-indigo-200",
  },
  merahmuda: {
    border: "border-pink-500 dark:border-pink-450 shadow-lg shadow-pink-500/10 dark:shadow-pink-955/20",
    bg: "bg-pink-50/95 dark:bg-slate-900/95",
    accentBar: "bg-pink-600 dark:bg-pink-450",
    badgeBg: "bg-pink-500/10 dark:bg-pink-500/20",
    badgeTextColor: "text-pink-855 dark:text-pink-305",
    latinBg: "bg-pink-500/5",
    latinText: "text-pink-700 dark:text-pink-455 font-medium",
    indicatorText: "text-pink-700 dark:text-pink-400",
    btnBg: "bg-pink-100 hover:bg-pink-200 dark:bg-pink-955/60 dark:hover:bg-pink-905/60",
    btnBorder: "border-pink-350 dark:border-pink-805",
    btnText: "text-pink-900 dark:text-pink-200",
  },
};

interface HomeQuranReminderProps {
  theme?: string;
  arabicFontSize?: number;
}

export default function HomeQuranReminder({ theme = 'emerald', arabicFontSize = 3 }: HomeQuranReminderProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper font size scaling classes mapping
  const getArabicFontSizeClass = (level: number) => {
    switch (level) {
      case 1: return 'text-lg';
      case 2: return 'text-xl md:text-2xl';
      case 3: return 'text-2xl md:text-3xl'; // default
      case 4: return 'text-3xl md:text-4xl';
      case 5: return 'text-4xl md:text-5xl';
      default: return 'text-2xl md:text-3xl';
    }
  };

  const getLatinFontSizeClass = (level: number) => {
    switch (level) {
      case 1: return 'text-[10px]';
      case 2: return 'text-[11px] sm:text-xs';
      case 3: return 'text-xs sm:text-sm'; // default
      case 4: return 'text-sm sm:text-base';
      case 5: return 'text-base sm:text-lg';
      default: return 'text-xs sm:text-sm';
    }
  };

  const getTranslationFontSizeClass = (level: number) => {
    switch (level) {
      case 1: return 'text-[10px]';
      case 2: return 'text-[11px] sm:text-xs';
      case 3: return 'text-xs sm:text-sm'; // default
      case 4: return 'text-sm sm:text-base';
      case 5: return 'text-base sm:text-lg';
      default: return 'text-xs sm:text-sm';
    }
  };

  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % QURAN_QUOTES.length);
      setFade(true);
    }, 200);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      handleNextQuote();
    }, 12000); // Rotate every 12s

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleManualNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    handleNextQuote();
    timerRef.current = setInterval(() => {
      handleNextQuote();
    }, 12000);
  };

  const activeQuote = QURAN_QUOTES[currentIndex];
  const currentStyle = themeStyles[theme] || themeStyles.emerald;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative animate-in fade-in duration-500 z-10 font-sans">
      <div className="absolute -top-3 -left-2 text-slate-400/10 pointer-events-none select-none z-0">
        <Quote className="w-10 h-10 transform rotate-180" />
      </div>

      <div 
        className="rounded-3xl p-5.5 relative overflow-hidden transition-all duration-300 border-[3.5px] flex flex-col justify-between min-h-[220px]"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--color-emerald-500)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Thick dynamic color left bar - with blinking animation */}
        <div className={`absolute top-0 left-0 w-2.5 h-full transition-colors duration-300 animate-pulse ${currentStyle.accentBar}`} />

        <div className={`transition-all duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border-2 transition-all duration-300 ${currentStyle.badgeBg} ${currentStyle.badgeTextColor} ${currentStyle.btnBorder}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow animate-pulse" />
              Ayat & Pengingat Hari Ini
            </span>
            <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider transition-all duration-300 ${currentStyle.badgeBg} ${currentStyle.indicatorText}`}>
              📍 {activeQuote.category}
            </span>
          </div>

          {/* Elegant Blinking Line Indicator for premium focus */}
          <div className={`h-1 w-20 mb-4 rounded-full animate-pulse transition-all duration-300 ${currentStyle.accentBar}`} />

          {/* Large Arabic text */}
          <div 
            dir="rtl" 
            className={`text-right font-serif text-slate-950 font-black leading-loose mb-3.5 tracking-wide drop-shadow-sm transition-all duration-250 ${getArabicFontSizeClass(arabicFontSize)}`}
          >
            {activeQuote.arabic}
          </div>

          {/* Latin & translation */}
          <p className={`italic font-extrabold px-3 py-1.5 rounded-xl inline-block mb-3 border-[1.5px] transition-all duration-250 ${getLatinFontSizeClass(arabicFontSize)} ${currentStyle.latinBg} ${currentStyle.latinText} ${currentStyle.btnBorder}`}>
            {activeQuote.latin}
          </p>

          <p className={`font-black text-slate-900 mt-1 leading-relaxed bg-slate-50/90 p-3.5 rounded-2xl border-[1.5px] border-slate-200/90 shadow-xs transition-all duration-250 ${getTranslationFontSizeClass(arabicFontSize)}`}>
            &ldquo;{activeQuote.text}&rdquo;
          </p>

          <div className="flex justify-between items-center mt-5 border-t-[1.5px] border-slate-100 pt-4 text-[11px] font-black uppercase tracking-wide text-slate-800">
            <span>📚 {activeQuote.reference}</span>
            <button
              onClick={handleManualNext}
              className={`px-3.5 py-1.5 text-xs font-black rounded-xl border-2 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xxs ${currentStyle.btnBg} ${currentStyle.btnBorder} ${currentStyle.btnText}`}
            >
              Lanjut
              <ChevronRight className="w-3.5 h-3.5 font-bold" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
