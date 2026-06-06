/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Compass, Heart } from 'lucide-react';

const DUA_QUOTES = [
  "\"Maka sesungguhnya bersama kesulitan ada kemudahan.\" (QS. Asy-Syarh: 5)",
  "\"Cukuplah Allah bagi kami, dan Dia adalah sebaik-baik pelindung.\" (QS. Ali Imran: 173)",
  "\"Dan hanya kepada Tuhanmulah hendaknya kamu berharap.\" (QS. Asy-Syarh: 8)",
  "\"Wahai orang-orang yang beriman, jadikanlah sabar dan shalat sebagai penolongmu...\" (QS. Al-Baqarah: 153)",
  "\"Maka ingatlah kepada-Ku, Aku pun akan ingat kepadamu.\" (QS. Al-Baqarah: 152)",
  "\"Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.\" (QS. At-Talaq: 3)",
  "\"Ya Allah, bimbinglah keluarga kami selalu di jalan-Mu yang lurus.\" (Doa Keluarga Mbah Yani)"
];

export default function Footer() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Select constant quote
    const index = Math.floor(Math.random() * DUA_QUOTES.length);
    setQuote(DUA_QUOTES[index]);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-emerald-950/40 border-t border-emerald-100 dark:border-emerald-900/60 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-xl text-emerald-700 dark:text-emerald-300">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-emerald-100 font-sans">
            Portal Islami Keluarga Mbah Yani
          </span>
        </div>

        <p className="max-w-md mx-auto text-sm text-emerald-700/80 dark:text-emerald-300/80 italic px-4 py-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10 mb-6 font-medium">
          {quote}
        </p>

        <p className="text-xs text-slate-500 dark:text-emerald-300/60">
          Didedikasikan untuk merekatkan ukhuwah & keistiqomahan ibadah harian keturunan Mbah Yani.
        </p>

        <div className="mt-8 pt-6 border-t border-emerald-100/50 dark:border-emerald-900/30 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 dark:text-emerald-300/40 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <span>&copy; {currentYear} Portal Islami Keluarga Mbah Yani. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse fill-current" />
            <span>untuk kebersamaan keluarga Muslim.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
