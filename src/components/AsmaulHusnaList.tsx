/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Sparkles, Star, AlertCircle, X, BookOpen, Quote, Sparkle, Heart, Bookmark } from 'lucide-react';
import { ASMAUL_HUSNA } from '../data/asmaulhusna';
import { getAsmaulHusnaSyarah } from '../data/asmaulhusnaExplanations';

export default function AsmaulHusnaList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNameUrutan, setSelectedNameUrutan] = useState<number | null>(null);

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
          <button
            key={name.urutan}
            id={`asmaul-card-${name.urutan}`}
            onClick={() => setSelectedNameUrutan(name.urutan)}
            className="relative bg-white dark:bg-emerald-950/15 border border-emerald-100/70 dark:border-emerald-900 rounded-2xl p-4.5 text-center shadow-sm hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-400/30 transition-all duration-300 overflow-hidden group select-none cursor-pointer active:scale-97 text-left block w-full"
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
            <h3 className="font-bold text-sm text-slate-800 dark:text-emerald-100 tracking-wide font-sans group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-center transition-colors">
              {name.latin}
            </h3>

            {/* Indonesian meaning translation */}
            <p className="text-xs text-slate-400 dark:text-emerald-300/60 mt-1 italic font-medium leading-tight text-center">
              &ldquo;{name.arti}&rdquo;
            </p>

            {/* Golden micro glowing line at bottom of active card */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400">Tidak ada nama sifat asmaul husna yang cocok.</p>
        </div>
      )}

      {/* DETAILED SCHOLARLY COMMENTARY MODAL DIALOG */}
      {selectedNameUrutan !== null && (
        (() => {
          const name = ASMAUL_HUSNA.find(n => n.urutan === selectedNameUrutan);
          const syarah = getAsmaulHusnaSyarah(selectedNameUrutan);
          if (!name) return null;
          
          return (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div 
                className="bg-white dark:bg-slate-900 border border-emerald-500/20 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Top Branding bar */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 dark:from-emerald-950 dark:to-slate-950 p-6 text-white relative">
                  <button 
                    onClick={() => setSelectedNameUrutan(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                    title="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-600/50 text-[10px] font-extrabold text-amber-200 border border-emerald-555/45 uppercase tracking-widest mb-2">
                        Asmaul Husna ke-{name.urutan}
                      </span>
                      <h2 className="text-2xl font-black text-white font-sans tracking-tight">
                        {name.latin}
                      </h2>
                      <p className="text-xs text-emerald-200 mt-1 italic">
                        &ldquo;{name.arti}&rdquo;
                      </p>
                    </div>
                    
                    {/* Giant elegant arabic calli text */}
                    <div className="text-right">
                      <p className="text-4xl font-serif font-extrabold text-amber-300 drop-shadow-md py-1">
                        {name.arab}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal main detailed panels */}
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                  
                  {/* Tab 1: Sholar Syarah explanation */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-400 dark:text-emerald-450 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      Penjelasan & Makna Syarah
                    </h4>
                    <p className="text-sm text-slate-705 dark:text-emerald-100 leading-relaxed font-normal">
                      {syarah.syarah}
                    </p>
                  </div>

                  {/* Tab 2: Authentic Quranic / Hadith references */}
                  <div className="space-y-1.5 pt-3.5 border-t border-slate-100 dark:border-emerald-900/30">
                    <h4 className="text-xs font-black text-slate-400 dark:text-emerald-450 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Quote className="w-3.5 h-3.5 text-amber-500" />
                      Rujukan Dalil Naqli
                    </h4>
                    <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/10 text-slate-800 dark:text-emerald-200">
                      <p className="text-xs italic leading-relaxed font-medium">
                        {syarah.dalil}
                      </p>
                    </div>
                  </div>

                  {/* Tab 3: Daily Implementation value */}
                  <div className="space-y-1.5 pt-3.5 border-t border-slate-100 dark:border-emerald-900/30">
                    <h4 className="text-xs font-black text-slate-400 dark:text-emerald-450 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkle className="w-3.5 h-3.5 text-emerald-600" />
                      Amalan & Keteladanan Akhlak
                    </h4>
                    <p className="text-xs text-slate-655 dark:text-emerald-250 leading-relaxed font-medium">
                      {syarah.amalan}
                    </p>
                  </div>

                  {/* Tab 4: Bibliography Source representing validity */}
                  <div className="pt-4 border-t border-slate-100 dark:border-emerald-900/30 flex items-center justify-between text-[10px] text-slate-400 dark:text-emerald-450">
                    <span>Sumber Otentik Rujukan:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-450 italic bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                      {syarah.sumber}
                    </span>
                  </div>

                </div>

                {/* Bottom Close panel */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-emerald-900/20 flex gap-2">
                  <button
                    onClick={() => setSelectedNameUrutan(null)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-emerald-700/10 text-center"
                  >
                    Tutup Penjelasan
                  </button>
                </div>
              </div>
            </div>
          );
        })()
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
