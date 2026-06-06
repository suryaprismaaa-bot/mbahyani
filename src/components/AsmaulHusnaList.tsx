/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Sparkles, Star, AlertCircle } from 'lucide-react';
import { ASMAUL_HUSNA } from '../data/asmaulhusna';

export default function AsmaulHusnaList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNames = ASMAUL_HUSNA.filter((name) => {
    const query = searchQuery.toLowerCase();
    return (
      name.latin.toLowerCase().includes(query) ||
      name.arti.toLowerCase().includes(query) ||
      name.urutan.toString() === query
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
          99 Sifat Mulia Pencipta Semesta
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Asmaul Husna
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-lg mx-auto">
          Merenungkan nama-nama Allah yang Maha Indah yang menenangkan hati, melancarkan rezeki, dan menuntun doa di sepertiga malam.
        </p>
      </div>

      {/* Search box filter */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-emerald-600/60" />
          </div>
          <input
            id="asmaul-search"
            type="text"
            placeholder="Cari nama (misal: 'Ar Rahman' atau 'Penyayang' atau '1')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-emerald-100 dark:border-emerald-900 rounded-2xl bg-white dark:bg-emerald-950/20 text-slate-800 dark:text-emerald-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="text-right mt-2 text-[10px] text-slate-400 dark:text-emerald-300/40 pl-1">
          Menampilkan {filteredNames.length} dari 99 Nama Allah
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredNames.map((name) => (
          <div
            key={name.urutan}
            id={`asmaul-card-${name.urutan}`}
            className="relative bg-white dark:bg-emerald-950/15 border border-emerald-100/70 dark:border-emerald-900 rounded-2xl p-4.5 text-center shadow-sm hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-400/30 transition-all duration-300 overflow-hidden group select-none"
          >
            {/* Top golden sequence identifier */}
            <div className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center border border-emerald-100/30 dark:border-emerald-800">
              {name.urutan}
            </div>

            {/* Micro star icon at corners */}
            <div className="absolute top-2 right-2 text-amber-500 opacity-20 group-hover:opacity-100 transition-opacity">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>

            {/* Arabic Caligraphy - Bold & large */}
            <div className="my-5 flex justify-center">
              <p className="text-2xl font-serif text-slate-800 dark:text-emerald-50 font-bold group-hover:scale-105 group-hover:text-amber-500 transition-all duration-300 py-1">
                {name.arab}
              </p>
            </div>

            {/* Translit latin title */}
            <h3 className="font-bold text-sm text-slate-800 dark:text-emerald-100 tracking-wide font-sans group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {name.latin}
            </h3>

            {/* Indonesian meaning translation */}
            <p className="text-xs text-slate-400 dark:text-emerald-300/60 mt-1 italic font-medium leading-tight">
              &ldquo;{name.arti}&rdquo;
            </p>

            {/* Golden micro glowing line at bottom of active card */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400">Tidak ada nama sifat asmaul husna yang cocok.</p>
        </div>
      )}

      {/* Quote Banner */}
      <div className="mt-10 p-5 bg-gradient-to-br from-emerald-850 to-emerald-950 dark:from-emerald-950 dark:to-slate-900 text-white rounded-3xl border border-emerald-700 dark:border-emerald-900 shadow-sm text-center">
        <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2.5 animate-spin" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">Keutamaan Menghafal Asmaul Husna</h4>
        <p className="text-xs text-emerald-100 max-w-xl mx-auto leading-relaxed mt-1.5 italic">
          &ldquo;Sesungguhnya Allah memiliki 99 nama, seratus kurang satu, barangsiapa yang menghafalkannya (dan mengamalkannya) maka ia akan masuk surga.&rdquo; (HR. Bukhari dan Muslim)
        </p>
      </div>
    </div>
  );
}
