/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Compass, BookOpen, HeartHandshake, BookHeart, Calendar, Sparkles, MoveRight, Moon, Sun, Star, Play, Pause, X, SkipForward, Volume2, Clock } from 'lucide-react';
import { ActiveTab, GlobalAudioState, Ayat } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QiblaFinder from './components/QiblaFinder';
import QuranReader from './components/QuranReader';
import TasbihCounter from './components/TasbihCounter';
import DailyDoa from './components/DailyDoa';
import PrayerSchedule from './components/PrayerSchedule';
import AsmaulHusnaList from './components/AsmaulHusnaList';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeSurahNum, setActiveSurahNum] = useState<number | null>(null);

  // Real-time timepiece states
  const [timeString, setTimeString] = useState<string>('');
  const [gregorianString, setGregorianString] = useState<string>('');
  const [hijriString, setHijriString] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Real-time clock formatted (HH:mm:ss)
      const tStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      // Determine dynamic time zone abbreviation (e.g. WIB, WITA, WIT or UTC)
      let tzAbbr = 'WIB';
      try {
        const tzName = new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' })
          .formatToParts(now)
          .find(p => p.type === 'timeZoneName')?.value;
        if (tzName) {
          tzAbbr = tzName;
        }
      } catch (e) {}
      setTimeString(`${tStr} ${tzAbbr}`);

      // Gregorian/Masehi date in Indonesian
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      setGregorianString(now.toLocaleDateString('id-ID', options));

      // Hijri date with premium Indonesian mapped month name
      try {
        const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        });
        const parts = formatter.formatToParts(now);
        const day = parts.find(p => p.type === 'day')?.value || '1';
        const monthNum = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
        const year = parts.find(p => p.type === 'year')?.value || '1447';
        
        const hijriMonths = [
          "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
          "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
          "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"
        ];
        
        const monthName = hijriMonths[monthNum - 1] || "Dzulhijjah";
        setHijriString(`${day} ${monthName} ${year} H`);
      } catch (e) {
        setHijriString("20 Dzulhijjah 1447 H"); // Safe fallback for current simulation date
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Audio Player states and refs
  const [globalAudioState, setGlobalAudioState] = useState<GlobalAudioState>({
    isPlaying: false,
    isAudioLoading: false,
    playingSurahNum: null,
    playingSurahName: null,
    playingAyatNum: null,
    playingAudioUrl: null
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAyatListRef = useRef<any[]>([]);

  // Synchronize activeSurahNum with background audio Surah
  useEffect(() => {
    if (globalAudioState.playingSurahNum !== null) {
      setActiveSurahNum(globalAudioState.playingSurahNum);
    }
  }, [globalAudioState.playingSurahNum]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playGlobalAudio = (ayat: any, surahNum: number, surahName: string, surahAyats: any[]) => {
    const audioUrl = ayat.audio["01"] || Object.values(ayat.audio)[0];
    if (!audioUrl) return;

    currentAyatListRef.current = surahAyats;

    if (globalAudioState.playingAudioUrl === audioUrl) {
      if (audioRef.current?.paused) {
        audioRef.current.play().catch(e => console.warn("Audio play blocked", e));
        setGlobalAudioState(prev => ({ ...prev, isPlaying: true }));
      } else {
        audioRef.current?.pause();
        setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.oncanplaythrough = null;
    }

    setGlobalAudioState({
      isPlaying: true,
      isAudioLoading: true,
      playingSurahNum: surahNum,
      playingSurahName: surahName,
      playingAyatNum: ayat.nomorAyat,
      playingAudioUrl: audioUrl
    });

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.oncanplaythrough = () => {
      setGlobalAudioState(prev => {
        if (prev.playingAudioUrl === audioUrl) {
          return { ...prev, isAudioLoading: false };
        }
        return prev;
      });
      audio.play().catch(e => {
        console.warn("Audio autoplay blocked", e);
        setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
      });
    };

    audio.onended = () => {
      handleAudioEnded(ayat.nomorAyat, surahNum, surahName, surahAyats);
    };

    audio.onerror = () => {
      setGlobalAudioState({
        isPlaying: false,
        isAudioLoading: false,
        playingSurahNum: null,
        playingSurahName: null,
        playingAyatNum: null,
        playingAudioUrl: null
      });
      alert("Gagal memutar audio Murottal. Periksa koneksi internet.");
    };
  };

  const handleAudioEnded = async (currentAyatNum: number, currentSurahNum: number, currentSurahName: string, currentAyats: any[]) => {
    // Check if next verse exists in current list
    const nextAyat = currentAyats.find(v => v.nomorAyat === currentAyatNum + 1);
    if (nextAyat) {
      playGlobalAudio(nextAyat, currentSurahNum, currentSurahName, currentAyats);
    } else {
      // Surah complete. Navigate to next Surah if < 114
      if (currentSurahNum < 114) {
        const nextSurahNum = currentSurahNum + 1;
        setGlobalAudioState(prev => ({
          ...prev,
          isAudioLoading: true,
          playingSurahNum: nextSurahNum,
          playingSurahName: `Surah ${nextSurahNum}`,
          playingAyatNum: 0, // 0 signifies Bismillah
          playingAudioUrl: `loading-${nextSurahNum}`
        }));

        try {
          // Fetch next Surah Ayat list
          const response = await fetch(`https://equran.id/api/v2/surat/${nextSurahNum}`);
          if (!response.ok) {
            throw new Error("Gagal mengunduh surat");
          }
          const json = await response.json();
          if (json && json.data && json.data.ayat && json.data.ayat.length > 0) {
            const nextSurahName = json.data.namaLatin;
            const nextSurahAyats = json.data.ayat;
            
            // Const for Bismillah audio
            const BISMILLAH_AYAT = {
              nomorAyat: 0,
              teksArab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
              teksLatin: "Bismillāhir-raḥmānir-raḥīm(i).",
              teksIndonesia: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.",
              audio: {
                "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001001.mp3"
              }
            };

            if (nextSurahNum !== 9) { // At-Tawbah has no Bismillah
              playGlobalAudio(BISMILLAH_AYAT, nextSurahNum, nextSurahName, nextSurahAyats);
            } else {
              // Direct to verse 1 for At-Tawbah
              const firstAyat = nextSurahAyats[0];
              playGlobalAudio(firstAyat, nextSurahNum, nextSurahName, nextSurahAyats);
            }
          } else {
            stopGlobalAudio();
          }
        } catch (err) {
          console.error("Gagal melompat ke surat berikutnya secara otomatis:", err);
          stopGlobalAudio();
        }
      } else {
        // En-Nas completed
        stopGlobalAudio();
      }
    }
  };

  const pauseGlobalAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const resumeGlobalAudio = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.warn("Audio play blocked", e));
      setGlobalAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const stopGlobalAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.oncanplaythrough = null;
      audioRef.current = null;
    }
    setGlobalAudioState({
      isPlaying: false,
      isAudioLoading: false,
      playingSurahNum: null,
      playingSurahName: null,
      playingAyatNum: null,
      playingAudioUrl: null
    });
  };

  const skipToNextGlobalAudio = () => {
    if (!globalAudioState.playingSurahNum || !globalAudioState.playingAyatNum) return;
    handleAudioEnded(globalAudioState.playingAyatNum, globalAudioState.playingSurahNum, globalAudioState.playingSurahName || '', currentAyatListRef.current);
  };

  // Apply dark mode theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);



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
              <div className="relative bg-gradient-to-br from-emerald-600 via-teal-800 to-blue-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden mb-12 border border-blue-500/20">
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

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 animate-in fade-in duration-500">
                  {/* Left layout: Hero Headline & Actions */}
                  <div className="lg:col-span-7 xl:col-span-8 text-left">
                    <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-emerald-900/60 to-blue-900/60 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-widest text-emerald-100 border border-white/10 mb-6">
                      🌟 Pusat Kajian & Ibadah Sinergi Umat Nusantara
                    </span>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4">
                      Temani Ibadah Keluarga <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-450 mt-1 font-extrabold">Setiap Hari</span>
                    </h1>
                    
                    <p className="text-sm md:text-base text-blue-50/90 leading-relaxed mb-8 max-w-xl">
                      Portal terpadu untuk mempermudah rutinitas ibadah, amalan fardhu & sunnah bagi Bapak, Ibu, Anak, dan seluruh cucu cicit Keluarga Mbah Yani dalam satu genggaman digital.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <button
                        id="hero-quran"
                        onClick={() => setActiveTab('quran')}
                        className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-450 hover:to-amber-550 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/10 active:scale-98 transition-all flex items-center cursor-pointer text-sm"
                      >
                        Buka Al-Qur&apos;an
                        <MoveRight className="w-4.5 h-4.5 ml-2 shrink-0" />
                      </button>
                      
                      <button
                        id="hero-jadwal"
                        onClick={() => setActiveTab('jadwal')}
                        className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 active:scale-98 transition-all cursor-pointer text-sm"
                      >
                        Lihat Jadwal Sholat
                      </button>
                    </div>
                  </div>

                  {/* Right layout: Frosted-glass luxury real-time clock widget */}
                  <div className="lg:col-span-5 xl:col-span-4 bg-white/5 dark:bg-slate-950/40 backdrop-blur-md border border-white/10 dark:border-blue-900/30 p-6.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                      <Clock className="w-32 h-32" />
                    </div>
                    
                    <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest mb-1.5 pb-1 border-b border-white/10 w-full block">
                      🔴 LIVE TIMEPIECE
                    </span>

                    <div className="text-3xl font-black font-mono tracking-wider text-white drop-shadow-md my-2">
                       {timeString || "00:00:00 WIB"}
                    </div>

                    <div className="h-px bg-white/10 w-full my-3.5" />

                    <div className="space-y-2.5 w-full text-left">
                      <div className="bg-white/5 dark:bg-slate-900/40 p-2.5 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0 animate-pulse"></div>
                        <div className="text-[11px] leading-tight text-blue-105">
                          <span className="block font-semibold text-white/55 text-[9px] uppercase tracking-wider">KALENDER MASEHI</span>
                          <span className="font-extrabold text-white text-[12px]">{gregorianString || "Memuat..."}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 dark:bg-slate-900/40 p-2.5 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></div>
                        <div className="text-[11px] leading-tight text-emerald-105">
                          <span className="block font-semibold text-white/55 text-[9px] uppercase tracking-wider">KALENDER HIJRIYAH</span>
                          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-350 text-[12px]">{hijriString || "Memuat..."}</span>
                        </div>
                      </div>
                    </div>
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
                  <div className="p-6 bg-gradient-to-br from-emerald-50/80 via-blue-50/40 to-white dark:from-slate-900/60 dark:via-blue-950/20 dark:to-slate-950/60 rounded-2xl border-l-4 border-l-emerald-600 border-r-4 border-r-blue-600 border-t border-b border-emerald-100/30 dark:border-blue-900/10 text-left shadow-md flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                      <Sparkles className="w-5.5 h-5.5 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <p className="text-[12px] text-slate-800 dark:text-emerald-100 leading-relaxed font-bold tracking-wide italic">
                        &ldquo;Mari luruskan niat mencari <span className="luxury-highlight text-emerald-800 dark:text-emerald-300">ridho-Nya</span> & rekatkan <span className="luxury-highlight text-blue-800 dark:text-blue-300">silaturahmi</span> seluruh keluarga besar Mbah Yani demi kebahagiaan dunia akhirat.&rdquo;
                      </p>
                      <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 mt-3 block uppercase tracking-wider">
                        — Almarhum Mbah Yani & Keluarga Besar
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* Active Inner Tab Views */}
          {activeTab === 'qibla' && <QiblaFinder />}
          {activeTab === 'quran' && (
            <QuranReader
              globalAudioState={globalAudioState}
              playGlobalAudio={playGlobalAudio}
              pauseGlobalAudio={pauseGlobalAudio}
              stopGlobalAudio={stopGlobalAudio}
              activeSurahNum={activeSurahNum}
              setActiveSurahNum={setActiveSurahNum}
            />
          )}
          {activeTab === 'tasbih' && <TasbihCounter />}
          {activeTab === 'doa' && <DailyDoa />}
          {activeTab === 'jadwal' && <PrayerSchedule />}
          {activeTab === 'asmaul' && <AsmaulHusnaList />}
        </main>
      </div>

      {/* Floating Global Murottal BG Player */}
      {globalAudioState.playingAudioUrl && (
        <div id="global-murottal-player" className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-emerald-100 dark:border-emerald-800/80 p-4 rounded-2xl flex items-center justify-between gap-4 z-50 transition-all duration-300">
          <div 
            className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-90 flex-grow"
            title="Buka Ayat di Al-Qur'an"
            onClick={() => {
              setActiveTab('quran');
              if (globalAudioState.playingSurahNum) {
                setActiveSurahNum(globalAudioState.playingSurahNum);
              }
            }}
          >
            <div className={`w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 ${globalAudioState.isPlaying && !globalAudioState.isAudioLoading ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <Volume2 className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                Murottal Background Player
              </span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-emerald-100 truncate">
                QS. {globalAudioState.playingSurahName}: {globalAudioState.playingAyatNum === 0 ? 'Bismillah' : `Ayat ${globalAudioState.playingAyatNum}`}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-emerald-300/60 flex items-center gap-1.5 mt-0.5 font-medium">
                {globalAudioState.isAudioLoading ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Memuat audio Qari...
                  </>
                ) : globalAudioState.isPlaying ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sedang diputar belakang layar
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-emerald-800" />
                    Audio dijeda
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Play/Pause Button */}
            <button
              id="global-player-toggle"
              onClick={globalAudioState.isPlaying ? pauseGlobalAudio : resumeGlobalAudio}
              disabled={globalAudioState.isAudioLoading}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                globalAudioState.isAudioLoading
                  ? 'border-slate-100 text-slate-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-355 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              }`}
            >
              {globalAudioState.isPlaying && !globalAudioState.isAudioLoading ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* Skip Next Button */}
            <button
              id="global-player-next"
              onClick={skipToNextGlobalAudio}
              disabled={globalAudioState.isAudioLoading}
              className="p-2 rounded-xl border border-slate-200 dark:border-emerald-900 text-slate-500 dark:text-emerald-300 hover:bg-slate-50 dark:hover:bg-emerald-900/50 cursor-pointer disabled:opacity-40"
              title="Lanjut Ayat Berikutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Stop Button */}
            <button
              id="global-player-stop"
              onClick={stopGlobalAudio}
              className="p-2 rounded-xl border border-rose-100 dark:border-rose-950/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 cursor-pointer"
              title="Hentikan & Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Styled Footer */}
      <Footer />
    </div>
  );
}
