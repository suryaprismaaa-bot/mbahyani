/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, HeartHandshake, BookHeart, Calendar, Sparkles, MoveRight, Moon, Sun, Star } from 'lucide-react';
import { ActiveTab } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QiblaFinder from './components/QiblaFinder';
import QuranReader from './components/QuranReader';
import TasbihCounter from './components/TasbihCounter';
import DailyDoa from './components/DailyDoa';
import PrayerSchedule from './components/PrayerSchedule';
import AsmaulHusnaList from './components/AsmaulHusnaList';
import AmalHarian from './components/AmalHarian';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Apply dark mode theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle CTA Start Worship click
  const handleStartWorship = () => {
    setActiveTab('amal');
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-emerald-50 font-sans transition-colors duration-300 flex flex-col justify-between">
      <div>
        {/* Main Header / Navigation */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />

        {/* Primary Content Container */}
        <main className="min-h-[70vh]">
          {activeTab === 'home' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {/* Majestic Modern Islamic Hero Section */}
              <div className="relative bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden mb-12 border border-emerald-500/25">
                {/* Decorative CSS patterns background */}
                <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 opacity-10 pointer-events-none select-none flex items-center justify-center">
                  {/* Styled scalable vector dome silhouette */}
                  <svg viewBox="0 0 400 400" className="w-4/5 h-4/5 fill-current text-white transform translate-y-12 translate-x-12">
                    <path d="M200,40 C280,40 330,120 330,220 L330,360 L70,360 L70,220 C70,120 120,40 200,40 Z" />
                    <line x1="200" y1="10" x2="200" y2="40" stroke="currentColor" strokeWidth="4" />
                    <circle cx="200" cy="10" r="4" />
                  </svg>
                </div>

                <div className="absolute left-6 top-6 opacity-45 animate-pulse">
                  <Star className="w-5 h-5 text-amber-300 fill-current" />
                </div>
                <div className="absolute right-12 top-10 opacity-35 animate-ping">
                  <Star className="w-8 h-8 text-amber-200 fill-current" />
                </div>

                <div className="relative max-w-2xl xl:max-w-3xl z-10">
                  <span className="inline-flex items-center px-4 py-1.5 bg-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-50 border border-emerald-400/20 mb-6">
                    🌟 Pusat Kajian & Ibadah Digital Keluarga
                  </span>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4">
                    Temani Ibadah Keluarga <span className="block text-amber-350 mt-1">Setiap Hari</span>
                  </h1>
                  
                  <p className="text-sm md:text-base text-emerald-50/80 leading-relaxed mb-8 max-w-xl">
                    Portal digital untuk mempermudah rutinitas ibadah, amalan fardhu & sunnah bagi Bapak, Ibu, Anak, dan seluruh cucu cicit Keluarga Mbah Yani dalam satu genggaman.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      id="hero-cta"
                      onClick={handleStartWorship}
                      className="px-8 py-3.5 bg-amber-450 hover:bg-amber-500 text-emerald-950 font-bold rounded-xl shadow-lg active:scale-98 transition-all flex items-center cursor-pointer text-sm"
                    >
                      Mulai Ceklis Ibadah
                      <MoveRight className="w-4.5 h-4.5 ml-2 shrink-0" />
                    </button>
                    
                    <button
                      id="hero-quran"
                      onClick={() => setActiveTab('quran')}
                      className="px-7 py-3.5 bg-emerald-500/30 hover:bg-emerald-500/45 text-white font-bold rounded-xl border border-white/20 active:scale-98 transition-all cursor-pointer text-sm"
                    >
                      Buka Al-Qur&apos;an
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid Menu Section - Tiru konsep Healing Bareng */}
              <div className="space-y-6">
                <div className="border-b border-emerald-100 dark:border-emerald-900 pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-emerald-50 tracking-tight">
                      Layanan Utama Ibadah
                    </h2>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-400 mt-1 font-semibold tracking-wider font-sans uppercase">
                      Layanan Utama Portal Keluarga
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">Pilih menu untuk memulai</span>
                </div>

                {/* Main Menu Cards list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  
                  {/* CARD 1: Amalan Harian Tracker */}
                  <button
                    id="menu-amal"
                    onClick={() => setActiveTab('amal')}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/60 dark:hover:border-emerald-700 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                      <HeartHandshake className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 leading-tight">
                        Worship Journal
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
                        Ceklis amalan shalih harian sholat fardhu, sunnah, sedekah, dan tilawah.
                      </p>
                    </div>
                  </button>

                  {/* CARD 2: Al-Qur'an Digital */}
                  <button
                    id="menu-quran"
                    onClick={() => setActiveTab('quran')}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/60 dark:hover:border-emerald-700 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 leading-tight">
                        Al-Qur&apos;an Digital
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
                        Surat lengkap dengan transliterasi latin, terjemahan Indonesia, & audio murottal.
                      </p>
                    </div>
                  </button>

                  {/* CARD 3: Cari Kiblat */}
                  <button
                    id="menu-qibla"
                    onClick={() => setActiveTab('qibla')}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/60 dark:hover:border-emerald-700 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                      <Compass className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 leading-tight">
                        Cari Arah Kiblat
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
                        Kompas penunjuk arah Ka&apos;bah magnetis presisi menggunakan GPS browser.
                      </p>
                    </div>
                  </button>

                  {/* CARD 4: Tasbih Digital */}
                  <button
                    id="menu-tasbih"
                    onClick={() => setActiveTab('tasbih')}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/60 dark:hover:border-emerald-700 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                      <HeartHandshake className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 leading-tight">
                        Tasbih Digital
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
                        Dzikir dinamis dengan setelan preset, feedback audio, & getaran HP.
                      </p>
                    </div>
                  </button>

                  {/* CARD 5: Doa Harian */}
                  <button
                    id="menu-doa"
                    onClick={() => setActiveTab('doa')}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/60 dark:hover:border-emerald-700 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                      <BookHeart className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 leading-tight">
                        Doa Sehari-hari
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
                        Tuntunan doa lengkap, salin & kirim instan ke WhatsApp grup keluarga.
                      </p>
                    </div>
                  </button>

                  {/* CARD 6: Jadwal Sholat */}
                  <button
                    id="menu-jadwal"
                    onClick={() => setActiveTab('jadwal')}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/60 dark:hover:border-emerald-700 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 leading-tight">
                        Jadwal Sholat
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
                        Waktu sholat otomatis GPS, countdown presisi kembalian alarm wudhu.
                      </p>
                    </div>
                  </button>

                  {/* CARD 7: Asmaul Husna */}
                  <button
                    id="menu-asmaul"
                    onClick={() => setActiveTab('asmaul')}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/60 dark:hover:border-emerald-700 text-left hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 leading-tight">
                        Asmaul Husna
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
                        99 Nama Allah Yang Indah beserta asbab khasiat, transliterasi & makna.
                      </p>
                    </div>
                  </button>

                  {/* SPECIAL FAMILY STATEMENT CARD */}
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-slate-900/40 rounded-2xl border border-emerald-250/20 text-left shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <p className="text-[11px] text-emerald-800/90 dark:text-emerald-200/90 leading-relaxed font-semibold italic">
                        &ldquo;Mari luruskan niat mencari ridho-Nya & rekatkan silaturahmi seluruh keluarga besar Mbah Yani demi kebahagiaan dunia akhirat.&rdquo;
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-emerald-400/50 mt-3 block">
                        - Almarhum Mbah Yani & Keluarga
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* Active Inner Tab Views */}
          {activeTab === 'qibla' && <QiblaFinder />}
          {activeTab === 'quran' && <QuranReader />}
          {activeTab === 'tasbih' && <TasbihCounter />}
          {activeTab === 'doa' && <DailyDoa />}
          {activeTab === 'jadwal' && <PrayerSchedule />}
          {activeTab === 'asmaul' && <AsmaulHusnaList />}
          {activeTab === 'amal' && <AmalHarian />}
        </main>
      </div>

      {/* Styled Footer */}
      <Footer />
    </div>
  );
}
