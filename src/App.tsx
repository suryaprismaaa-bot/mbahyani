/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Compass, BookOpen, HeartHandshake, BookHeart, Calendar, Sparkles, MoveRight, Moon, Sun, Star, Play, Pause, X, SkipForward, Volume2, Clock, Tv, GraduationCap, BookMarked, Scale, MapPin, ChevronDown, ChevronUp, History } from 'lucide-react';
import { ActiveTab, GlobalAudioState, Ayat } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QiblaFinder from './components/QiblaFinder';
import QuranReader from './components/QuranReader';
import TasbihCounter from './components/TasbihCounter';
import DailyDoa from './components/DailyDoa';
import PrayerSchedule from './components/PrayerSchedule';
import AsmaulHusnaList from './components/AsmaulHusnaList';
import MakkahLive from './components/MakkahLive';
import MosqueFinder from './components/MosqueFinder';
import TilawatiLearning from './components/TilawatiLearning';
import HomeQuranReminder from './components/HomeQuranReminder';
import TajweedLearning from './components/TajweedLearning';
import ZakatCalculator from './components/ZakatCalculator';
import HijriCalendarHistory from './components/HijriCalendarHistory';
import HadithCollection from './components/HadithCollection';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [menuCategory, setMenuCategory] = useState<'all' | 'ibadah' | 'pembelajaran' | 'kajian'>('all');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portal_dark_mode');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  });
  const [theme, setTheme] = useState<'emerald' | 'merah' | 'orange' | 'biru' | 'ungu' | 'coklat' | 'putih' | 'birutua' | 'merahmuda'>(() => {
    try {
      return (localStorage.getItem('portal_theme') as any) || 'orange';
    } catch (e) {
      return 'orange';
    }
  });

  const [arabicFontSize, setArabicFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('portal_arabic_font_size');
      return saved !== null ? parseInt(saved, 10) : 3;
    } catch (e) {
      return 3;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('portal_theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_dark_mode', String(darkMode));
    } catch (e) {}
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_arabic_font_size', String(arabicFontSize));
    } catch (e) {}
  }, [arabicFontSize]);

  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [activeSurahNum, setActiveSurahNum] = useState<number | null>(null);
  const [showDevModal, setShowDevModal] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('portal_dev_alert_closed') !== 'true';
    } catch (e) {
      return true;
    }
  });
  const [modalTimeLeft, setModalTimeLeft] = useState<number>(15);

  useEffect(() => {
    if (!showDevModal) return;
    setModalTimeLeft(15);
    const interval = setInterval(() => {
      setModalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          try {
            sessionStorage.setItem('portal_dev_alert_closed', 'true');
          } catch (e) {}
          setShowDevModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showDevModal]);

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
  const [selectedQori, setSelectedQori] = useState(() => localStorage.getItem('mbah_yani_selected_qori') || 'Abdurrahman-as-Sudais');
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

  const prefetchNextSurah = async (surahNum: number) => {
    if (surahNum >= 114) return;
    const nextSurahNum = surahNum + 1;
    try {
      if ((window as any).__quran_surah_details && (window as any).__quran_surah_details[nextSurahNum]) return;
      const cached = sessionStorage.getItem(`quran_detail_${nextSurahNum}`);
      if (cached) return;

      const response = await fetch(`https://equran.id/api/v2/surat/${nextSurahNum}`);
      if (response.ok) {
        const json = await response.json();
        if (json && json.data) {
          if (!(window as any).__quran_surah_details) {
            (window as any).__quran_surah_details = {};
          }
          (window as any).__quran_surah_details[nextSurahNum] = json.data;
          sessionStorage.setItem(`quran_detail_${nextSurahNum}`, JSON.stringify(json.data));
        }
      }
    } catch (e) {
      console.warn("Prefetch next surah failed:", e);
    }
  };

  const playGlobalAudio = (ayat: any, surahNum: number, surahName: string, surahAyats: any[]) => {
    // Dynamically and consistently construct URL with the selected Qari key
    let audioUrl = '';
    if (ayat.nomorAyat === 0) {
      // Bismillah
      audioUrl = `https://cdn.equran.id/audio-partial/${selectedQori}/001001.mp3`;
    } else {
      const sStr = String(surahNum).padStart(3, '0');
      const aStr = String(ayat.nomorAyat).padStart(3, '0');
      audioUrl = `https://cdn.equran.id/audio-partial/${selectedQori}/${sStr}${aStr}.mp3`;
    }

    if (!audioUrl) return;

    currentAyatListRef.current = surahAyats;

    if (surahNum < 114 && ayat.nomorAyat >= surahAyats.length - 2) {
      prefetchNextSurah(surahNum);
    }

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

    // Immediately start playing to respect modern browser autoplay policies within user interaction contexts
    audio.play()
      .then(() => {
        setGlobalAudioState(prev => {
          if (prev.playingAudioUrl === audioUrl) {
            return { ...prev, isPlaying: true, isAudioLoading: false };
          }
          return prev;
        });
      })
      .catch(e => {
        console.warn("Audio autoplay blocked or interrupted", e);
        // Do not fail hard, just set isPlaying to false so user can click play to resume
        setGlobalAudioState(prev => {
          if (prev.playingAudioUrl === audioUrl) {
            return { ...prev, isPlaying: false, isAudioLoading: false };
          }
          return prev;
        });
      });

    audio.onwaiting = () => {
      setGlobalAudioState(prev => {
        if (prev.playingAudioUrl === audioUrl) {
          return { ...prev, isAudioLoading: true };
        }
        return prev;
      });
    };

    audio.onplaying = () => {
      setGlobalAudioState(prev => {
        if (prev.playingAudioUrl === audioUrl) {
          return { ...prev, isAudioLoading: false, isPlaying: true };
        }
        return prev;
      });
    };

    audio.oncanplay = () => {
      setGlobalAudioState(prev => {
        if (prev.playingAudioUrl === audioUrl) {
          return { ...prev, isAudioLoading: false };
        }
        return prev;
      });
    };

    audio.onended = () => {
      handleAudioEnded(ayat.nomorAyat, surahNum, surahName, surahAyats);
    };

    audio.onerror = () => {
      console.warn("Murottal playback error for URL:", audioUrl);
      setGlobalAudioState({
        isPlaying: false,
        isAudioLoading: false,
        playingSurahNum: null,
        playingSurahName: null,
        playingAyatNum: null,
        playingAudioUrl: null
      });
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

        // Bismillah representation
        const BISMILLAH_AYAT = {
          nomorAyat: 0,
          teksArab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
          teksLatin: "Bismillāhir-raḥmānir-raḥīm(i).",
          teksIndonesia: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.",
          audio: {
            "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001001.mp3"
          }
        };

        // Check if next surah details are cached in window memory or sessionStorage
        let nextSurahData: any = null;
        try {
          if ((window as any).__quran_surah_details && (window as any).__quran_surah_details[nextSurahNum]) {
            nextSurahData = (window as any).__quran_surah_details[nextSurahNum];
          } else {
            const storedDetail = sessionStorage.getItem(`quran_detail_${nextSurahNum}`);
            if (storedDetail) {
              nextSurahData = JSON.parse(storedDetail);
              if (nextSurahData) {
                if (!(window as any).__quran_surah_details) {
                  (window as any).__quran_surah_details = {};
                }
                (window as any).__quran_surah_details[nextSurahNum] = nextSurahData;
              }
            }
          }
        } catch (e) {
          console.warn("Error reading cache for next surah:", e);
        }

        // If cached surah data is available, skip network request entirely for instant playback
        if (nextSurahData && nextSurahData.ayat && nextSurahData.ayat.length > 0) {
          const nextSurahName = nextSurahData.namaLatin;
          const nextSurahAyats = nextSurahData.ayat;

          if (nextSurahNum !== 9) { // At-Tawbah has no Bismillah
            playGlobalAudio(BISMILLAH_AYAT, nextSurahNum, nextSurahName, nextSurahAyats);
          } else {
            const firstAyat = nextSurahAyats[0];
            playGlobalAudio(firstAyat, nextSurahNum, nextSurahName, nextSurahAyats);
          }
          return;
        }

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

            // Cache downloaded surah data
            try {
              if (!(window as any).__quran_surah_details) {
                (window as any).__quran_surah_details = {};
              }
              (window as any).__quran_surah_details[nextSurahNum] = json.data;
              sessionStorage.setItem(`quran_detail_${nextSurahNum}`, JSON.stringify(json.data));
            } catch (e) {
              console.warn("Could not cache fetched surah details:", e);
            }

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
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50/45 via-white to-emerald-100/25 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 text-slate-800 dark:text-emerald-50 font-sans transition-all duration-300 flex flex-col justify-between theme-${theme}`}>
      <div>
        {/* Main Header / Navigation - Combined Sticky Container with Custom Distinct Color and Animated Divider */}
        <div className="sticky top-0 z-50 w-full shadow-md bg-[#f4fcf8]/98 dark:bg-slate-950/98 backdrop-blur-md transition-all duration-300">
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
          />

          {/* Visual Theme Swatches Bar - Contained within the Sticky Header */}
          <div className="bg-transparent border-t border-emerald-100/35 dark:border-slate-800/45 py-2.5 px-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
              
              {/* Baris 1: Tanggal Masehi & Tanggal Hijriyah Sejajar */}
              <div className="flex items-center justify-center gap-3 text-center whitespace-nowrap overflow-x-auto scrollbar-none w-full py-0.5">
                <div className="text-[11px] sm:text-xs font-semibold text-slate-655 dark:text-slate-305 shrink-0 flex items-center gap-1">
                  <span className="opacity-75">📅</span>
                  <span>{gregorianString || "Memuat..."}</span>
                </div>
                
                <span className="text-slate-300 dark:text-slate-705 font-bold text-xs shrink-0">|</span>
                
                <div className="text-[11px] sm:text-xs font-black text-emerald-700 dark:text-amber-400 shrink-0 bg-emerald-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-lg border border-emerald-100/80 dark:border-amber-900/20 flex items-center gap-1">
                  <span>🌙</span>
                  <span>{hijriString || "Memuat..."}</span>
                </div>
              </div>

              {/* Thin Elegant Divider */}
              <div className="w-full h-px bg-slate-150 dark:bg-slate-800/60" />

              {/* Baris 2: Warna Tema Portal Dropdown Selector */}
              <div className="flex items-center justify-center gap-3 relative">
                <div className="flex flex-col items-end leading-tight text-right select-none">
                  <span className="text-[10.5px] sm:text-xs font-black uppercase tracking-wider text-slate-600 dark:text-emerald-400">
                    Warna Tema Portal:
                  </span>
                  <span className="text-[9px] sm:text-[9.5px] font-bold text-slate-400 dark:text-emerald-500/60 lowercase italic tracking-wide mt-0.5">
                    (pilih warna salah satu)
                  </span>
                </div>
                
                {/* Custom Elegant Dropdown Trigger */}
                <div className="relative" ref={themeDropdownRef}>
                  <button
                    id="theme-dropdown-trigger"
                    onClick={() => setIsThemeOpen(!isThemeOpen)}
                    className="px-3.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-extrabold cursor-pointer transition-all border bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-755 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-1.5 shrink-0 shadow-xxs active:scale-98"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      theme === 'orange' ? 'bg-orange-500' :
                      theme === 'emerald' ? 'bg-emerald-600' :
                      theme === 'biru' ? 'bg-sky-500' :
                      theme === 'merah' ? 'bg-rose-500' :
                      theme === 'ungu' ? 'bg-violet-600' :
                      theme === 'coklat' ? 'bg-amber-800' :
                      theme === 'putih' ? 'bg-slate-500' :
                      theme === 'birutua' ? 'bg-indigo-900' : 'bg-pink-500'
                    } border border-white/25 shadow-xxs`} />
                    <span>
                      {theme === 'orange' ? 'Hijau Jingga (Orange)' :
                       theme === 'emerald' ? 'Khazanah Hijau (Emerald)' :
                       theme === 'biru' ? 'Samudera Biru (Blue)' :
                       theme === 'merah' ? 'Kasih Merah (Rose)' :
                       theme === 'ungu' ? 'Mulia Ungu (Violet)' :
                       theme === 'coklat' ? 'Tanah Coklat (Amber)' :
                       theme === 'putih' ? 'Putih & Charcoal' :
                       theme === 'birutua' ? 'Malam Biru Tua' : 'Merah Muda (Pink)'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-emerald-400/70 transition-transform duration-200 ${isThemeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Panel (Centered dropdown overlay) */}
                  {isThemeOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-1.5 grid grid-cols-1 gap-1 w-64 hover:shadow-2xl transition-all duration-150 animate-in fade-in duration-100">
                      <div className="px-2.5 py-1.5 text-[8.5px] font-black uppercase tracking-wider text-slate-400 dark:text-emerald-500 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                        Pilih Nuansa Warna Widget
                      </div>
                      {[
                        { id: 'orange', name: 'Hijau Jingga (Orange)', color: 'bg-orange-500' },
                        { id: 'emerald', name: 'Khazanah Hijau (Emerald)', color: 'bg-emerald-600' },
                        { id: 'biru', name: 'Samudera Biru (Blue)', color: 'bg-sky-500' },
                        { id: 'merah', name: 'Kasih Merah (Rose)', color: 'bg-rose-500' },
                        { id: 'ungu', name: 'Mulia Ungu (Violet)', color: 'bg-violet-600' },
                        { id: 'coklat', name: 'Tanah Coklat (Amber)', color: 'bg-amber-800' },
                        { id: 'putih', name: 'Putih & Charcoal', color: 'bg-slate-500' },
                        { id: 'birutua', name: 'Malam Biru Tua', color: 'bg-indigo-900' },
                        { id: 'merahmuda', name: 'Merah Muda (Pink)', color: 'bg-pink-500' },
                      ].map((swatch) => {
                        const isActive = theme === swatch.id;
                        return (
                          <button
                            key={swatch.id}
                            onClick={() => {
                              setTheme(swatch.id as any);
                              setIsThemeOpen(false);
                            }}
                            className={`px-3 py-2 rounded-xl text-[10.5px] sm:text-xs font-bold cursor-pointer transition-all border flex items-center gap-2.5 w-full text-left ${
                              isActive
                                ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-600 dark:text-white shadow-sm'
                                : 'bg-transparent border-transparent text-slate-705 dark:text-emerald-150 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${swatch.color} border border-white/20`} />
                            <span>{swatch.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Thin Elegant Divider */}
              <div className="w-full h-px bg-slate-150 dark:bg-slate-800/40" />

              {/* Baris 3: Pengatur Ukuran Teks Arab, Latin & Terjemahan */}
              <div 
                id="arabic-resizer-control" 
                className="flex items-center justify-center gap-3 p-1.5 px-3.5 rounded-2xl border border-transparent transition-all duration-300 ease-in-out hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 hover:border-emerald-500/15 hover:shadow-[0_0_15px_rgba(16,185,129,0.12)] focus-within:bg-emerald-50/40 dark:focus-within:bg-emerald-950/15 focus-within:border-emerald-500/35 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.22)]"
              >
                <div className="flex flex-col items-end leading-tight text-right select-none">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-emerald-400">
                    Ukuran Teks Arab:
                  </span>
                  <span className="text-[8.5px] sm:text-[9.2px] font-semibold text-slate-400 dark:text-emerald-500/55 lowercase italic tracking-normal mt-0.5">
                    (latin & arti menyesuaikan)
                  </span>
                </div>

                {/* Adjuster Buttons: Up/Down Buttons */}
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 p-1 rounded-xl shrink-0">
                  <button
                    id="arabic-zoom-down"
                    onClick={() => setArabicFontSize(prev => Math.max(1, prev - 1))}
                    disabled={arabicFontSize === 1}
                    className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-emerald-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus:outline-hidden"
                    title="Perkecil Ukuran Teks"
                    aria-label="Perkecil Ukuran Teks"
                  >
                    <ChevronDown className="w-4 h-4 font-bold" />
                  </button>
                  <span className="px-3.5 text-[10.5px] font-black font-mono text-emerald-800 dark:text-emerald-200 select-none bg-white dark:bg-slate-900 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/80 shadow-3xs min-w-[50px] text-center">
                    Lv {arabicFontSize}
                  </span>
                  <button
                    id="arabic-zoom-up"
                    onClick={() => setArabicFontSize(prev => Math.min(5, prev + 1))}
                    disabled={arabicFontSize === 5}
                    className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-755 text-slate-600 dark:text-emerald-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus:outline-hidden"
                    title="Perbesar Ukuran Teks"
                    aria-label="Perbesar Ukuran Teks"
                  >
                    <ChevronUp className="w-4 h-4 font-bold" />
                  </button>
                </div>
              </div>

            </div>
          </div>
          
          {/* Animated Moving Divider Line to demarcate scrolling content boundary */}
          <div className="h-[5px] w-full animate-moving-divider shadow-[0_4px_16px_rgba(0,0,0,0.18)] border-b border-emerald-900/10 dark:border-amber-450/10" />
        </div>

        {/* Primary Content Container */}
        <main className="min-h-[70vh] overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
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

                 <div className="relative z-10 animate-in fade-in duration-500">
                  {/* Expanded majestic text layout */}
                  <div className="w-full text-left max-w-3xl">
                    <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-emerald-950/60 to-blue-900/60 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-widest text-emerald-100 border border-white/10 mb-6">
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
                        Buka Al-Qur&apos;an Digital
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
                </div>
              </div>

              {/* Ayat & Pengingat Hari Ini untuk melengkapi beranda yang bersih */}
              <div className="mt-8">
                <HomeQuranReminder theme={theme} arabicFontSize={arabicFontSize} />
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
              selectedQori={selectedQori}
              setSelectedQori={setSelectedQori}
              arabicFontSize={arabicFontSize}
            />
          )}
          {activeTab === 'tasbih' && <TasbihCounter />}
          {activeTab === 'doa' && <DailyDoa arabicFontSize={arabicFontSize} />}
          {activeTab === 'jadwal' && <PrayerSchedule />}
          {activeTab === 'asmaul' && <AsmaulHusnaList />}
          {activeTab === 'makkah' && <MakkahLive />}
          {activeTab === 'masjid' && <MosqueFinder />}
          {activeTab === 'tilawati' && <TilawatiLearning />}
          {activeTab === 'tajwid' && <TajweedLearning />}
          {activeTab === 'zakat' && <ZakatCalculator />}
          {activeTab === 'hijriah' && <HijriCalendarHistory />}
          {activeTab === 'hadith' && <HadithCollection theme={theme} arabicFontSize={arabicFontSize} />}
            </motion.div>
          </AnimatePresence>
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

      {/* Dev Alert Modal Overlay (AnimatePresence supported) */}
      <AnimatePresence>
        {showDevModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                try {
                  sessionStorage.setItem('portal_dev_alert_closed', 'true');
                } catch (e) {}
                setShowDevModal(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Glowing minimalist modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 28, stiffness: 400 }}
              className="relative w-full max-w-[325px] bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 rounded-[24px] p-5.5 shadow-xl overflow-hidden text-center z-130 flex flex-col justify-between"
            >
              {/* Cute top sparkle lights with countdown progress bar overlay */}
              <div className="absolute top-0 inset-x-0 h-1 bg-slate-100 dark:bg-slate-850">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(modalTimeLeft / 15) * 100}%` }}
                />
              </div>
              
              {/* Top corner close button */}
              <button
                onClick={() => {
                  try {
                    sessionStorage.setItem('portal_dev_alert_closed', 'true');
                  } catch (e) {}
                  setShowDevModal(false);
                }}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:text-emerald-400/60 dark:hover:text-emerald-200 hover:bg-slate-50 dark:hover:bg-emerald-950/45 cursor-pointer transition-colors active:scale-90"
                aria-label="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* mascot/avatar character - "lucu dan humanis" (Smaller, minimalized) */}
              <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                {/* Ping waves */}
                <span className="absolute inset-0 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full animate-ping duration-1500 opacity-50"></span>
                {/* Golden glowing rays */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500/15 to-amber-400/15 rounded-full blur-md opacity-80 animate-pulse"></div>
                
                {/* Mascot Outer Circle */}
                <div className="relative w-14 h-14 bg-amber-100 dark:bg-amber-100 rounded-full border-[2.5px] border-emerald-500 dark:border-emerald-400 shadow-sm overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Cute Green Muslim Songkok / Peci */}
                  <div className="absolute top-0 w-full h-4 bg-emerald-600 dark:bg-emerald-700 flex justify-center items-start shadow-sm">
                    {/* Tiny stitch details */}
                    <div className="w-[85%] h-[1px] bg-emerald-450 dark:bg-emerald-500 mt-[0.5px] opacity-70 animate-pulse"></div>
                  </div>

                  {/* Smiling Sparkly Eyes */}
                  <div className="flex gap-2.5 mt-3.5">
                    {/* Left Eye */}
                    <div className="relative w-1.5 h-2 bg-slate-800 rounded-full flex items-center justify-center">
                      <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                    </div>
                    {/* Right Eye */}
                    <div className="relative w-1.5 h-2 bg-slate-800 rounded-full flex items-center justify-center">
                      <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Blush cheeks */}
                  <div className="flex justify-between w-8 px-0.5 mt-0.5 z-10">
                    <div className="w-1.5 h-1 rounded-full bg-rose-400/80 dark:bg-rose-400/70 blur-[0.4px]"></div>
                    <div className="w-1.5 h-1 rounded-full bg-rose-400/80 dark:bg-rose-400/70 blur-[0.4px]"></div>
                  </div>

                  {/* Smiling mouth */}
                  <div className="w-3.5 h-1.5 border-b-[2px] border-slate-800 rounded-b-full -mt-0.5"></div>
                </div>

                {/* Floating mini heart */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-rose-500 dark:bg-rose-600 rounded-full flex items-center justify-center text-[8px] text-white shadow-xs animate-bounce transform rotate-12">
                  💖
                </div>
              </div>

              {/* Greeting Header */}
              <div className="mb-3.5">
                <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 dark:bg-amber-955/40 text-amber-800 dark:text-amber-300 font-extrabold text-[9px] uppercase tracking-wide rounded-full mb-1.5 border border-amber-100 dark:border-amber-900/60 transition-all">
                  ✨ Assalamu&apos;alaikum! 👋
                </span>
                <h3 className="font-serif font-black text-sm text-slate-800 dark:text-emerald-100 tracking-tight leading-tight">
                  Update & Pemeliharaan Sistem
                </h3>
              </div>

              {/* Warm Message Body - highly compact & direct */}
              <div className="space-y-2 text-[11px] text-slate-600 dark:text-emerald-200/90 leading-relaxed font-sans mb-4 px-1 text-center">
                <p>
                  Sistem kebanggaan <strong>Mbah Yani</strong> sedang dalam masa peningkatan kualitas secara berkala dan realtime di belakang layar.
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/20 py-1 px-2 rounded-xl border border-emerald-100/30">
                  Seluruh fitur tetap dapat diakses dengan lancar! ✨🤲
                </p>
              </div>

              {/* Action Buttons: Tutup & Timer information */}
              <div className="space-y-2 w-full">
                <button
                  id="close-dev-modal"
                  onClick={() => {
                    try {
                      sessionStorage.setItem('portal_dev_alert_closed', 'true');
                    } catch (e) {}
                    setShowDevModal(false);
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-emerald-600/15 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Tutup Notifikasi ({modalTimeLeft}s)</span>
                  <MoveRight className="w-3.5 h-3.5 animate-pulse" />
                </button>
                
                <div className="text-[9px] text-slate-400 dark:text-emerald-500/50 text-center font-semibold">
                  Tutup otomatis dalam {modalTimeLeft} detik • Ver 2.0
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <Footer />
    </div>
  );
}
