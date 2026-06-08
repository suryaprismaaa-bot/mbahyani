/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Bookmark, Play, Pause, ChevronLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Surah, SurahDetail, Ayat, GlobalAudioState } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// Let's bundle Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas as robust offline backends
const OFFLINE_RESOURCES: any = {
  1: {
    nomor: 1,
    nama: "الفاتحة",
    namaLatin: "Al-Fatihah",
    jumlahAyat: 7,
    tempatTurun: "Mekah",
    arti: "Pembukaan",
    deskripsi: "Surat Al Fatihah (Pembukaan) yang diturunkan di Mekah dan terdiri dari 7 ayat. Al Fatihah merupakan surat yang pertama-tama diturunkan secara lengkap di antara surat-surat yang ada dalam Al-Qur'an.",
    audioFull: { "01": "https://cdn.equran.id/audio-full/Abdurrahman-as-Sudais/001.mp3" },
    ayat: [
      { nomorAyat: 1, teksArab: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", teksLatin: "Bismillāhir-rahmānir-rahīm(i).", teksIndonesia: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001001.mp3" } },
      { nomorAyat: 2, teksArab: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", teksLatin: "Al-hamdu lillāhi rabbil-'ālamīn(a).", teksIndonesia: "Segala puji bagi Allah, Tuhan seluruh alam,", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001002.mp3" } },
      { nomorAyat: 3, teksArab: "الرَّحْمَٰنِ الرَّحِيمِ", teksLatin: "Ar-rahmānir-rahīm(i).", teksIndonesia: "Yang Maha Pengasih, Maha Penyayang,", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001003.mp3" } },
      { nomorAyat: 4, teksArab: "مَالِكِ يَوْمِ الدِّينِ", teksLatin: "Māliki yaumid-dīn(i).", teksIndonesia: "Pemilik hari pembalasan.", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001004.mp3" } },
      { nomorAyat: 5, teksArab: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", teksLatin: "Iyyāka na'budu wa iyyāka nasta'īn(u).", teksIndonesia: "Hanya kepada-Mu lah kami menyembah dan hanya kepada-Mu lah kami memohon pertolongan.", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001005.mp3" } },
      { nomorAyat: 6, teksArab: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", teksLatin: "Ihdināṣ-ṣirāṭal-mustaqīm(a).", teksIndonesia: "Tunjukkanlah kami jalan yang lurus,", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001006.mp3" } },
      { nomorAyat: 7, teksArab: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", teksLatin: "Ṣirāṭal-lażīna an'amta 'alayhim gairil-magḍūbi 'alayhim wa laḍ-ḍāllīn(a).", teksIndonesia: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001007.mp3" } }
    ]
  },
  112: {
    nomor: 112,
    nama: "الاخلاص",
    namaLatin: "Al-Ikhlas",
    jumlahAyat: 4,
    tempatTurun: "Mekah",
    arti: "Ikhlas",
    deskripsi: "Surat Al Ikhlas (Keesaan Allah)",
    audioFull: { "01": "https://cdn.equran.id/audio-full/Abdurrahman-as-Sudais/112.mp3" },
    ayat: [
      { nomorAyat: 1, teksArab: "قُلْ هُوَ اللَّهُ أَحَدٌ", teksLatin: "Qul huwallāhu aḥad(un).", teksIndonesia: "Katakanlah (Muhammad), \"Dialah Allah Yang Maha Esa.", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/112001.mp3" } },
      { nomorAyat: 2, teksArab: "اللَّهُ الصَّمَدُ", teksLatin: "Allāhuṣ-ṣamad(u).", teksIndonesia: "Allah tempat meminta segala sesuatu.", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/112002.mp3" } },
      { nomorAyat: 3, teksArab: "لَمْ يَلِدْ وَلَمْ يُولَدْ", teksLatin: "Lam yalid wa lam yūlad.", teksIndonesia: "Dia tidak beranak dan tidak pula diperanakkan,", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/112003.mp3" } },
      { nomorAyat: 4, teksArab: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", teksLatin: "Wa lam yakul-lahū kufuwan ahad(un).", teksIndonesia: "dan tidak ada sesuatu yang setara dengan Dia.\"", audio: { "01": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/112004.mp3" } }
    ]
  }
};

const OFFLINE_LIST: Surah[] = [
  { nomor: 1, nama: "الفاتحة", namaLatin: "Al-Fatihah", jumlahAyat: 7, tempatTurun: "Mekah", arti: "Pembukaan", deskripsi: "Surat Al-Fatihah", audioFull: { "01": "" } },
  { nomor: 112, nama: "الاخلاص", namaLatin: "Al-Ikhlas", jumlahAyat: 4, tempatTurun: "Mekah", arti: "Ikhlas", deskripsi: "Surat Al-Ikhlas", audioFull: { "01": "" } }
];

const AVAILABLE_QORIS = [
  { id: 'Abdurrahman-as-Sudais', name: 'Syaikh Abdurrahman as-Sudais', desc: 'Imam Masjidil Haram Makkah' },
  { id: 'Mishary-Rashid-Al-Afasy', name: 'Syaikh Mishary Rashid Al-Afasy', desc: 'Lantunan indah, merdu, & berirama' },
  { id: 'Maher-Al-Muaiqly', name: 'Syaikh Maher Al-Muaiqly', desc: 'Suara tenang, mendalam & bersih' },
  { id: 'Abdul-Basit-Abd-us-Samad', name: 'Syaikh Abdul Basit Abdus Samad', desc: 'Gaya klasik emosional legendaris' },
  { id: 'Muhammad-Ayyub', name: 'Syaikh Muhammad Ayyub', desc: 'Khas Nabawi Madinah yang jernih' }
];

interface QuranReaderProps {
  globalAudioState: GlobalAudioState;
  playGlobalAudio: (ayat: Ayat, surahNum: number, surahName: string, surahAyats: Ayat[]) => void;
  pauseGlobalAudio: () => void;
  stopGlobalAudio: () => void;
  activeSurahNum: number | null;
  setActiveSurahNum: React.Dispatch<React.SetStateAction<number | null>>;
  selectedQori: string;
  setSelectedQori: (qori: string) => void;
}

export default function QuranReader({
  globalAudioState,
  playGlobalAudio,
  pauseGlobalAudio,
  stopGlobalAudio,
  activeSurahNum,
  setActiveSurahNum,
  selectedQori,
  setSelectedQori
}: QuranReaderProps) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDetailMsg, setErrorDetailMsg] = useState<string | null>(null);

  // Derived global audio states mapping to old internal names
  const playingAudioUrl = globalAudioState.playingAudioUrl;
  const playingAyatNum = globalAudioState.playingSurahNum === surahDetail?.nomor ? globalAudioState.playingAyatNum : null;
  const isAudioLoading = globalAudioState.isAudioLoading;
  
  // Bookmarks / Last Read (localStorage keys)
  const [bookmark, setBookmark] = useState<{ surahNum: number; surahName: string; ayatNum: number } | null>(null);
  const [lastRead, setLastRead] = useState<{ surahNum: number; surahName: string; timestamp: string } | null>(null);

  // Scroll active ayat block into view if viewing that surah
  useEffect(() => {
    if (surahDetail && globalAudioState.playingSurahNum === surahDetail.nomor && globalAudioState.playingAyatNum !== null && globalAudioState.playingAyatNum !== undefined) {
      const timer = setTimeout(() => {
        if (globalAudioState.playingAyatNum === 0) {
          const bannerEl = document.getElementById('surah-banner-card');
          if (bannerEl) {
            bannerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          const el = document.getElementById(`ayat-block-${globalAudioState.playingAyatNum}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [surahDetail, globalAudioState.playingSurahNum, globalAudioState.playingAyatNum]);

  // Load surah detail if activeSurahNum changes externally
  useEffect(() => {
    if (activeSurahNum) {
      loadSurahDetail(activeSurahNum);
    } else {
      setSurahDetail(null);
    }
  }, [activeSurahNum]);

  // Load Bookmarks and list on startup
  useEffect(() => {
    // Read local data
    const savedBookmark = localStorage.getItem('mbah_yani_quran_bookmark');
    if (savedBookmark) {
      setBookmark(JSON.parse(savedBookmark));
    }
    const savedLastRead = localStorage.getItem('mbah_yani_quran_lastread');
    if (savedLastRead) {
      setLastRead(JSON.parse(savedLastRead));
    }

    // Load surah list
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    // 1. Check window cache first (instantaneous retrieval)
    if ((window as any).__quran_surah_list) {
      setSurahs((window as any).__quran_surah_list);
      return;
    }

    // 2. Check localStorage cache
    const cachedList = localStorage.getItem('mbah_yani_quran_surah_list');
    if (cachedList) {
      try {
        const parsed = JSON.parse(cachedList);
        if (parsed && parsed.length > 0) {
          setSurahs(parsed);
          (window as any).__quran_surah_list = parsed; // Sync to window memory
          return;
        }
      } catch (e) {}
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('https://equran.id/api/v2/surat');
      if (!response.ok) {
        throw new Error("Gagal mengambil data Al-Qur'an dari server.");
      }
      const json = await response.json();
      if (json && json.data) {
        setSurahs(json.data);
        // Cache to window & storage
        (window as any).__quran_surah_list = json.data;
        localStorage.setItem('mbah_yani_quran_surah_list', JSON.stringify(json.data));
      } else {
        setSurahs(OFFLINE_LIST);
      }
    } catch (err: any) {
      console.warn("Quran API failed, loading offline fallback modules", err);
      // Fallback
      setSurahs(OFFLINE_LIST);
      setErrorMsg("Menggunakan offline fallback karena koneksi internet lambat / API offline.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSurahDetail = async (nomor: number) => {
    // Check if offline resource exists first
    if (OFFLINE_RESOURCES[nomor]) {
      setSurahDetail(OFFLINE_RESOURCES[nomor]);
      setErrorDetailMsg("Menampilkan dari mode offline hemat kuota.");
      saveLastRead(nomor, OFFLINE_RESOURCES[nomor].namaLatin);
      return;
    }

    // Initialize global cache if not present
    if (!(window as any).__quran_surah_details) {
      (window as any).__quran_surah_details = {};
    }

    // Check window memory cache (instant retrieval)
    if ((window as any).__quran_surah_details[nomor]) {
      setSurahDetail((window as any).__quran_surah_details[nomor]);
      saveLastRead(nomor, (window as any).__quran_surah_details[nomor].namaLatin);
      return;
    }

    // Check sessionStorage cache (instant retrieval even across refreshes)
    try {
      const storedDetail = sessionStorage.getItem(`quran_detail_${nomor}`);
      if (storedDetail) {
        const parsed = JSON.parse(storedDetail);
        if (parsed) {
          (window as any).__quran_surah_details[nomor] = parsed;
          setSurahDetail(parsed);
          saveLastRead(nomor, parsed.namaLatin);
          return;
        }
      }
    } catch (e) {}

    setIsLoadingDetail(true);
    setErrorDetailMsg(null);

    try {
      const response = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil rincian ayat.");
      }
      const json = await response.json();
      if (json && json.data) {
        setSurahDetail(json.data);
        saveLastRead(nomor, json.data.namaLatin);
        // Save to cache for smooth, repeat zero-second loads
        (window as any).__quran_surah_details[nomor] = json.data;
        try {
          sessionStorage.setItem(`quran_detail_${nomor}`, JSON.stringify(json.data));
        } catch (e) {}
      } else {
        throw new Error("Format detail surat tidak dikenal.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorDetailMsg("Koneksi gagal. Maaf, detail surat " + nomor + " tidak dapat diunduh sekarang.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const saveLastRead = (surahNum: number, surahName: string) => {
    const data = {
      surahNum,
      surahName,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('id-ID')
    };
    localStorage.setItem('mbah_yani_quran_lastread', JSON.stringify(data));
    setLastRead(data);
  };

  const toggleBookmark = (ayatNum: number) => {
    if (!surahDetail) return;
    const current = {
      surahNum: surahDetail.nomor,
      surahName: surahDetail.namaLatin,
      ayatNum
    };

    if (bookmark && bookmark.surahNum === current.surahNum && bookmark.ayatNum === current.ayatNum) {
      // Toggle off
      localStorage.removeItem('mbah_yani_quran_bookmark');
      setBookmark(null);
    } else {
      localStorage.setItem('mbah_yani_quran_bookmark', JSON.stringify(current));
      setBookmark(current);
    }
  };

  const handleSelectSurah = (nomor: number) => {
    setActiveSurahNum(nomor);
    loadSurahDetail(nomor);
  };

  const handleBackToList = () => {
    setActiveSurahNum(null);
    setSurahDetail(null);
  };

  // Audio Playback Engine mapped to global audio player
  const playAudioAyat = (ayat: Ayat) => {
    if (!surahDetail) return;
    playGlobalAudio(ayat, surahDetail.nomor, surahDetail.namaLatin, surahDetail.ayat);
  };

  const stopAudio = () => {
    stopGlobalAudio();
  };

  const filteredSurahs = surahs.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.namaLatin.toLowerCase().includes(query) ||
      s.arti.toLowerCase().includes(query) ||
      s.nomor.toString().includes(query)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!activeSurahNum ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Quran Header */}
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
                Kalamullah Azza Wa Jalla
              </span>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
                Al-Qur&apos;an Digital
              </h1>
              <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-lg mx-auto">
                Bacalah Al-Qur&apos;an di mana pun berada. Dilengkapi transliterasi latin, terjemahan Indonesia, dan audio murattal per-ayat yang mendamaikan.
              </p>
            </div>

            {/* Bookmarks & Last Read Bar */}
            {(bookmark || lastRead) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {lastRead && (
                  <button
                    id="quran-last-read"
                    onClick={() => handleSelectSurah(lastRead.surahNum)}
                    className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl text-left cursor-pointer transition-colors hover:bg-emerald-100/50"
                  >
                    <div className="bg-emerald-600 text-white p-2.5 rounded-xl mr-3">
                      <BookOpen className="w-5 h-5 mb-0.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-emerald-700/80 dark:text-emerald-300/80 uppercase">
                        Terakhir Dibaca
                      </span>
                      <span className="font-bold text-slate-800 dark:text-emerald-100 text-sm">
                        QS. {lastRead.surahName} (Surat {lastRead.surahNum})
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{lastRead.timestamp}</span>
                    </div>
                  </button>
                )}

                {bookmark && (
                  <button
                    id="quran-bookmark-jump"
                    onClick={() => handleSelectSurah(bookmark.surahNum)}
                    className="flex items-center p-4 bg-amber-50/50 dark:bg-emerald-950/20 border border-amber-100/50 dark:border-emerald-900 rounded-2xl text-left cursor-pointer transition-colors hover:bg-amber-100/30"
                  >
                    <div className="bg-amber-500 text-white p-2.5 rounded-xl mr-3">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">
                        Ayat Ditandai
                      </span>
                      <span className="font-bold text-slate-800 dark:text-emerald-100 text-sm">
                        QS {bookmark.surahName}: Ayat {bookmark.ayatNum}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">Ketuk untuk langsung ke surat</span>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Selector list */}
            <div className="space-y-6">
              {/* Search Box */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-emerald-600/60" />
                </div>
                <input
                  id="quran-search"
                  type="text"
                  placeholder="Cari surat berdasarkan nama latin, nomor, atau arti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-emerald-100 dark:border-emerald-900 rounded-2xl bg-white dark:bg-emerald-950/20 text-slate-800 dark:text-emerald-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="mt-3 text-sm text-slate-500">Mengambil daftar surat Al-Qur&apos;an...</span>
                </div>
              ) : (
                <>
                  {errorMsg && (
                    <div className="p-3 bg-amber-50 dark:bg-emerald-900/10 border border-amber-100 dark:border-emerald-800 rounded-2xl text-xs text-amber-700 dark:text-emerald-300 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSurahs.map((surah) => (
                      <button
                        key={surah.nomor}
                        id={`surah-card-${surah.nomor}`}
                        onClick={() => handleSelectSurah(surah.nomor)}
                        className="flex items-center justify-between p-4.5 bg-white dark:bg-emerald-950/15 border border-emerald-100/80 dark:border-emerald-900 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3.5">
                          {/* Surat Number Dial */}
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100/80 dark:border-emerald-800 flex items-center justify-center font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                            {surah.nomor}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {surah.namaLatin}
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-emerald-300/40 font-medium">
                              {surah.arti} | <span className="font-semibold text-slate-500 dark:text-emerald-300/60">{surah.jumlahAyat} Ayat</span>
                            </p>
                          </div>
                        </div>
                        {/* Arabic Caligraphy Tag */}
                        <div className="text-xl font-bold font-serif text-emerald-800 dark:text-emerald-300/80">
                          {surah.nama}
                        </div>
                      </button>
                    ))}
                  </div>

                  {filteredSurahs.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-slate-400">Tidak ada surat yang sesuai dengan kata kunci pencarian.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-white dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-3xl p-6 shadow-sm"
          >
            {/* Action header */}
            <div className="flex justify-between items-center mb-6">
              <button
                id="quran-back-button"
                onClick={handleBackToList}
                className="inline-flex items-center px-4 py-2 bg-slate-50 dark:bg-emerald-900/30 hover:bg-slate-100 border border-slate-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-emerald-200 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali Ke Daftar
              </button>

              {/* Quick banner or audio stopper */}
              {playingAudioUrl && (
                <button
                  id="quran-stop-murottal"
                  onClick={stopAudio}
                  className="inline-flex items-center px-3.5 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-950 rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-100"
                >
                  Hentikan Audio
                </button>
              )}
            </div>

            {isLoadingDetail ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="mt-3 text-sm text-slate-500">Mengunduh ayat-ayat Al-Qur&apos;an...</span>
              </div>
            ) : (
              <>
                {errorDetailMsg && (
                  <div className="p-3 mb-4 bg-amber-50 dark:bg-emerald-900/20 border border-amber-200 dark:border-emerald-800 rounded-xl text-xs text-amber-800 dark:text-emerald-300 flex items-center justify-between">
                    <span>{errorDetailMsg}</span>
                    <button onClick={() => activeSurahNum && loadSurahDetail(activeSurahNum)} className="text-xs text-emerald-600 dark:text-emerald-400 font-bold underline">Coba Lagi</button>
                  </div>
                )}

                {surahDetail && (
                  <div>
                    {/* Surah Banner Card */}
                    <div id="surah-banner-card" className="relative text-center p-6 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-2xl text-white shadow-md mb-8 overflow-hidden">
                      <div className="absolute right-0 bottom-0 opacity-10 font-serif text-9xl pointer-events-none transform translate-y-12 translate-x-12">
                        {surahDetail.nama}
                      </div>
                      
                      <h2 className="text-2xl font-bold font-sans">
                        {surahDetail.namaLatin} ({surahDetail.nama})
                      </h2>
                      <p className="text-sm text-emerald-100 mt-1">
                        Arti: {surahDetail.arti} • {surahDetail.tempatTurun} • {surahDetail.jumlahAyat} Ayat
                      </p>
                      <div className="h-px bg-white/20 w-1/3 mx-auto my-3" />
                      
                      {/* Bismillah Header (Don't show for Al-Fatihah or Al-Tawbah, since Al-Fatihah includes it as verse 1) */}
                      {surahDetail.nomor !== 1 && surahDetail.nomor !== 9 && (
                        <p className={`text-xl font-serif mt-2 tracking-wide transition-all duration-300 ${
                          globalAudioState.playingSurahNum === surahDetail.nomor && globalAudioState.playingAyatNum === 0
                            ? 'text-amber-300 font-bold scale-105 animate-pulse drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]'
                            : 'text-amber-200'
                        }`}>
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                      )}
                    </div>

                    {/* Verses Scroller */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {surahDetail.ayat.map((ayat) => {
                        const isVersePlaying = playingAyatNum === ayat.nomorAyat;
                        const isBookmarked = bookmark?.surahNum === surahDetail.nomor && bookmark?.ayatNum === ayat.nomorAyat;

                        return (
                          <div
                            key={ayat.nomorAyat}
                            id={`ayat-block-${ayat.nomorAyat}`}
                            className={`p-5 rounded-2xl border transition-all duration-300 ${
                              isVersePlaying
                                ? 'bg-emerald-500/10 border-emerald-400 shadow-md'
                                : 'bg-transparent border-slate-100 dark:border-emerald-900/60 hover:bg-slate-50/50 dark:hover:bg-emerald-900/5'
                            }`}
                          >
                            {/* Ayat Controls Action Panel */}
                            <div className="flex justify-between items-center border-b border-dashed border-slate-100 dark:border-emerald-900/30 pb-3 mb-4">
                              <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center border border-emerald-100/50 dark:border-emerald-800">
                                {ayat.nomorAyat}
                              </span>

                              <div className="flex items-center space-x-2">
                                {/* Audio button */}
                                <button
                                  id={`ayat-audio-${ayat.nomorAyat}`}
                                  onClick={() => playAudioAyat(ayat)}
                                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                                    isVersePlaying
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'border-slate-200 dark:border-emerald-900 text-slate-500 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/55'
                                  }`}
                                  title="Putar Murottal Ayat"
                                >
                                  {isVersePlaying && isAudioLoading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : isVersePlaying ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Bookmark button */}
                                <button
                                  id={`ayat-bookmark-${ayat.nomorAyat}`}
                                  onClick={() => toggleBookmark(ayat.nomorAyat)}
                                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                                    isBookmarked
                                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                      : 'border-slate-200 dark:border-emerald-900 text-slate-400 dark:text-emerald-300/40 hover:bg-slate-50'
                                  }`}
                                  title="Tandai Terakhir Dibaca"
                                >
                                  <Bookmark className="w-4 h-4 fill-current" />
                                </button>
                              </div>
                            </div>

                            {/* Beautiful Big Arabic Text */}
                            <p className="text-right text-25xl leading-loose font-serif text-slate-800 dark:text-emerald-100 tracking-wide md:text-3xl my-6 font-semibold select-all">
                              {ayat.teksArab}
                            </p>

                            {/* Transliteration Latin */}
                            <p className="text-xs text-teal-700 dark:text-teal-400 font-medium italic mb-2 tracking-wide pl-2 border-l border-teal-500">
                              {ayat.teksLatin}
                            </p>

                            {/* Indonesia Translation */}
                            <p className="text-sm text-slate-600 dark:text-emerald-200/80 leading-relaxed font-sans">
                              {ayat.teksIndonesia}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Back Button */}
                    <div className="flex justify-center mt-8">
                      <button
                        id="quran-back-button-bottom"
                        onClick={handleBackToList}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm text-sm cursor-pointer transition-colors flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                        Kembali ke Daftar Surat
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
