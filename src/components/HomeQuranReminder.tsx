/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { BookOpen, Sparkles, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

export default function HomeQuranReminder() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative animate-in fade-in duration-500">
      <div className="absolute -top-3 -left-2 text-sky-100/30 dark:text-sky-905/10 pointer-events-none select-none z-0">
        <Quote className="w-10 h-10 transform rotate-180" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-100 dark:border-emerald-950 p-5.5 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px]">
        {/* Underlay delicate light green border */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-450 to-emerald-400" />

        <div className={`transition-all duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-between items-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-950/20 dark:to-emerald-950/20 text-sky-700 dark:text-sky-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-sky-100/50 dark:border-sky-900/30">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              Ayat & Pengingat Hari Ini
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-extrabold font-mono uppercase tracking-widest">
              {activeQuote.category}
            </span>
          </div>

          {/* Large Arabic text */}
          <div dir="rtl" className="text-right text-lg md:text-xl font-serif text-slate-800 dark:text-emerald-50 leading-relaxed font-normal mb-3">
            {activeQuote.arabic}
          </div>

          {/* Latin & translation */}
          <p className="text-[11px] italic text-sky-655 dark:text-sky-400/80 mb-2 leading-relaxed bg-sky-500/5 py-1 px-2 rounded-lg inline-block">
            {activeQuote.latin}
          </p>

          <p className="text-xs text-slate-650 dark:text-emerald-200 mt-1 leading-relaxed">
            &ldquo;{activeQuote.text}&rdquo;
          </p>

          <div className="flex justify-between items-center mt-4 border-t border-slate-105 dark:border-emerald-900/20 pt-3 text-[11px] font-bold text-slate-400">
            <span>{activeQuote.reference}</span>
            <button
              onClick={handleManualNext}
              className="px-3 py-1 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/25 text-sky-700 dark:text-sky-305 rounded-lg border border-sky-100/60 dark:border-sky-900/40 flex items-center gap-1 font-extrabold cursor-pointer transition-colors hover:text-sky-800"
            >
              Lanjut
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
