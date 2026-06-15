/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, Feather, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface Affirmation {
  text: string;
  source: string;
  category: string;
}

const AFFIRMATIONS: Affirmation[] = [
  {
    text: "Setiap detak jantung adalah bukti kasih sayang Allah. Mulailah hari dengan penuh rasa syukur dan mengucap Alhamdulillah.",
    source: "Umar bin Khattab",
    category: "Syukur & Harapan"
  },
  {
    text: "Jangan berduka, apa pun yang hilang darimu pasti akan kembali dalam bentuk lain yang jauh lebih baik atas kehendak-Nya.",
    source: "Jalaluddin Rumi",
    category: "Ketenangan Jiwa"
  },
  {
    text: "Ketika Allah menuntunmu untuk berdoa, ketahuilah bahwa sesungguhnya Dia telah rindu untuk mencurahkan jawaban kepadamu.",
    source: "Ibnu Qayyim Al-Jauziyyah",
    category: "Kekuatan Doa"
  },
  {
    text: "Keyakinan yang paling indah adalah percaya sepenuhnya bahwa takdir Allah selalu lebih baik dari semua skenario rencana kita.",
    source: "Tawakal Harian",
    category: "Tawakal"
  },
  {
    text: "Sabar bukanlah sekadar cara menunggu, melainkan bagaimana kita mampu menjaga ucapan dan prasangka baik selagi menanti keputusan-Nya.",
    source: "Sabar & Keikhlasan",
    category: "Kesabaran"
  },
  {
    text: "Lelahmu dalam bekerja mencari rezeki halal dan taat beribadah adalah guguran dosa yang berharga di hadapan Allah Ta’ala.",
    source: "Pesan Bijak",
    category: "Ikhtiar & Doa"
  },
  {
    text: "Jangan biarkan duniamu membuat riuh hatimu. Kembalilah bersimpuh sujud, karena di sanalah ketenangan sejati tersimpan rapi.",
    source: "Zikir Kalbu",
    category: "Ubudiyah"
  },
  {
    text: "Allah sedang mempersiapkan hal besar untukmu melewati jalan kesabaran yang hari ini sedang kamu tempuh dengan tabah.",
    source: "Penyemangat Jiwa",
    category: "Optimisme"
  }
];

// Stylings by active portal theme
const themePalette: Record<string, {
  border: string;
  textAccent: string;
  iconBg: string;
  btnHover: string;
  accentLine: string;
}> = {
  emerald: {
    border: "border-emerald-500",
    textAccent: "text-emerald-700 dark:text-emerald-450",
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    btnHover: "hover:bg-emerald-50 text-emerald-700 dark:hover:bg-emerald-900/30",
    accentLine: "bg-emerald-500"
  },
  merah: {
    border: "border-rose-500",
    textAccent: "text-rose-700 dark:text-rose-450",
    iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    btnHover: "hover:bg-rose-50 text-rose-700 dark:hover:bg-rose-900/30",
    accentLine: "bg-rose-500"
  },
  orange: {
    border: "border-orange-500",
    textAccent: "text-orange-700 dark:text-orange-450",
    iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-450",
    btnHover: "hover:bg-orange-50 text-orange-700 dark:hover:bg-orange-900/30",
    accentLine: "bg-orange-500"
  },
  biru: {
    border: "border-sky-500",
    textAccent: "text-sky-700 dark:text-sky-450",
    iconBg: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    btnHover: "hover:bg-sky-50 text-sky-700 dark:hover:bg-sky-900/30",
    accentLine: "bg-sky-500"
  },
  ungu: {
    border: "border-violet-500",
    textAccent: "text-violet-700 dark:text-violet-450",
    iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    btnHover: "hover:bg-violet-50 text-violet-700 dark:hover:bg-violet-900/30",
    accentLine: "bg-violet-500"
  },
  coklat: {
    border: "border-amber-700",
    textAccent: "text-amber-800 dark:text-amber-450",
    iconBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    btnHover: "hover:bg-amber-50 text-amber-800 dark:hover:bg-amber-900/30",
    accentLine: "bg-amber-700"
  },
  putih: {
    border: "border-slate-800 dark:border-slate-300",
    textAccent: "text-slate-900 dark:text-slate-200",
    iconBg: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    btnHover: "hover:bg-slate-200/60 dark:hover:bg-slate-800",
    accentLine: "bg-slate-800 dark:bg-slate-250"
  },
  birutua: {
    border: "border-indigo-650",
    textAccent: "text-indigo-805 dark:text-indigo-400",
    iconBg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-305",
    btnHover: "hover:bg-indigo-50 text-indigo-700 dark:hover:bg-indigo-900/30",
    accentLine: "bg-indigo-600"
  },
  merahmuda: {
    border: "border-pink-500",
    textAccent: "text-pink-700 dark:text-pink-450",
    iconBg: "bg-pink-55/10 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400",
    btnHover: "hover:bg-pink-50 text-pink-700 dark:hover:bg-pink-900/30",
    accentLine: "bg-pink-500"
  }
};

interface HomeIslamicAffirmationProps {
  theme?: string;
}

export default function HomeIslamicAffirmation({ theme = 'emerald' }: HomeIslamicAffirmationProps) {
  const [index, setIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  // Pick a random daily seed or quote on mount
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000
    );
    setIndex(dayOfYear % AFFIRMATIONS.length);
  }, []);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
      setFade(true);
    }, 200);
  };

  const palette = themePalette[theme] || themePalette.emerald;
  const currentAffirmation = AFFIRMATIONS[index];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative font-sans animate-in fade-in duration-300">
      {/* Decorative quotes icons on background */}
      <div className="absolute -top-4 -right-2 text-slate-200/10 dark:text-slate-800/15 pointer-events-none select-none">
        <Quote className="w-16 h-16 transform scale-x-[-1]" />
      </div>

      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl p-6.5 border-[3.5px] shadow-[0_12px_30px_-5px_rgba(0,0,0,0.06)] relative overflow-hidden transition-all duration-300"
        style={{ borderColor: `var(--color-${theme}-500, #10b981)` }}
      >
        {/* Dynamic theme bar */}
        <div className={`absolute top-0 left-0 w-2 h-full ${palette.accentLine}`} />

        <div className={`transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8.5 h-8.5 rounded-xl ${palette.iconBg} flex items-center justify-center`}>
                <Feather className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className={`block text-[10px] font-black uppercase tracking-widest ${palette.textAccent}`}>
                  Afirmasi Islami Hari Ini
                </span>
                <span className="block text-[8.5px] font-semibold text-slate-400 dark:text-slate-550 lowercase tracking-tight italic">
                  penyejuk kalbu & ketenangan pikiran
                </span>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              📌 {currentAffirmation.category}
            </div>
          </div>

          <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed font-sans mt-3 px-1">
            &ldquo;{currentAffirmation.text}&rdquo;
          </p>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-linear-to-r from-transparent to-slate-50/20 mt-4.5 pt-4">
            <span className="text-xs font-black text-slate-600 dark:text-slate-400 italic flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse inline" /> {currentAffirmation.source}
            </span>

            <button
              id="btn-affirmation-refresh"
              onClick={handleNext}
              className={`p-2 rounded-xl border border-slate-250 dark:border-slate-800 ${palette.btnHover} text-slate-650 dark:text-slate-400 hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer flex items-center gap-1.5 font-bold shadow-2xs`}
              title="Ganti Afirmasi Baru"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase">Acak</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
