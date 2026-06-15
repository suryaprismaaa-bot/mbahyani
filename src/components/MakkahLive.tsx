/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tv, Info, Youtube, Heart, ExternalLink, Calendar, MapPin, Sparkles, Clock, RefreshCw, Volume2 } from 'lucide-react';

interface StreamChannel {
  id: string;
  title: string;
  description: string;
  embedUrl: string; // Dynamic YouTube embed live stream URL or specific active live video ID
  location: string;
}

export default function MakkahLive() {
  const [activeStreamId, setActiveStreamId] = useState('makkah-alternative');
  const [ksaTimeStr, setKsaTimeStr] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableStreamIds, setAvailableStreamIds] = useState<string[]>(['makkah-alternative', 'madinah-sunnah']);
  const [isStreamPlaying, setIsStreamPlaying] = useState(false);

  // Saudi Al Quran TV channel (Makkah) and Saudi Sunnah TV channel (Madinah)
  // We use YouTube dynamic live_stream endpoint which automatically grabs the latest/active stream of the channel!
  const streams: StreamChannel[] = [
    {
      id: 'makkah-quran',
      title: 'Makkah Live (Saudi Al-Qur\'an TV)',
      description: 'Siaran langsung 24 jam non-stop dari Masjidil Haram, Makkah Al-Mukarramah, menampilkan Thawaf di sekitar Ka\'bah agung.',
      embedUrl: 'https://www.youtube.com/embed/bNY8a2BB5Gc?autoplay=1&mute=0',
      location: 'Masjidil Haram, Makkah'
    },
    {
      id: 'makkah-alternative',
      title: 'Feed Alternatif - Haramain Live',
      description: 'Saluran siaran alternatif untuk suasana beribadah di lingkungan Masjidil Mukarramah.',
      embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC8FpQvGAnB6CqHAsGstSkhg&autoplay=1&mute=0',
      location: 'Masjidil Haram, Makkah'
    },
    {
      id: 'madinah-sunnah',
      title: 'Madinah Live (Saudi Sunnah TV)',
      description: 'Siaran langsung 24 jam non-stop dari Masjidil Nabawi, Madinah Al-Munawwarah, kota peristirahatan terakhir Rasulullah SAW.',
      embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCvSiafVbsh9B_74S6g8_9Xg&autoplay=0',
      location: 'Masjidil Nabawi, Madinah'
    }
  ];

  // Dynamic check for offline YouTube channels
  useEffect(() => {
    const verifyStreams = async () => {
      const activeIds: string[] = ['makkah-alternative', 'madinah-sunnah']; // Safe verified defaults because channel live_stream redirects automaticially
      
      const checkOne = async (st: StreamChannel): Promise<boolean> => {
        let videoId = '';
        const embedParts = st.embedUrl.split('/embed/');
        if (embedParts[1]) {
          videoId = embedParts[1].split('?')[0];
        }

        if (!videoId) return true;

        return new Promise<boolean>((resolve) => {
          const img = new Image();
          const timeout = setTimeout(() => {
            img.src = '';
            resolve(false);
          }, 3500);

          img.onload = () => {
            clearTimeout(timeout);
            // YouTube serves a default 120x90 image if the video is offline or invalid
            if (img.naturalWidth === 120 && img.naturalHeight === 90) {
              resolve(false);
            } else {
              resolve(true);
            }
          };

          img.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };

          img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        });
      };

      try {
        const isMakkahQuranOnline = await checkOne(streams[0]);
        if (isMakkahQuranOnline) {
          // Put the premium main feed at the top and activate it
          setAvailableStreamIds(['makkah-quran', 'makkah-alternative', 'madinah-sunnah']);
          setActiveStreamId('makkah-quran');
        } else {
          // Otherwise, only list the alternative and madinah feeds, and choose the alternative
          setAvailableStreamIds(['makkah-alternative', 'madinah-sunnah']);
          setActiveStreamId('makkah-alternative');
        }
      } catch (e) {
        console.warn("Failed checking main stream status, defaulting to safe feeds", e);
        setAvailableStreamIds(['makkah-alternative', 'madinah-sunnah']);
        setActiveStreamId('makkah-alternative');
      }
    };

    verifyStreams();
  }, []);

  // Calculate live Saudi Arabian Standard Time (GMT+3)
  useEffect(() => {
    const updateKsaTime = () => {
      const gmtDate = new Date();
      // AST is GMT+3, so we can convert the date to KSA timezone string nicely
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Riyadh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('id-ID', options);
      setKsaTimeStr(formatter.format(gmtDate) + ' AST (Makkah)');
    };

    updateKsaTime();
    const interval = setInterval(updateKsaTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshStream = () => {
    setIsRefreshing(true);
    const prevStream = activeStreamId;
    setActiveStreamId('');
    setTimeout(() => {
      setActiveStreamId(prevStream);
      setIsRefreshing(false);
    }, 1000);
  };

  const selectedStream = streams.find(s => s.id === activeStreamId) || streams[0];

  // Qur'an verses related to Ka'bah to enrich content spiritually
  const makkahVerses = [
    {
      surah: "QS. Ali 'Imran: 96",
      arab: "إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا وَهُدًى لِّلْعَالَمِينَ",
      terjemahan: "Sesungguhnya rumah (ibadah) pertama yang dibangun untuk manusia, ialah (Baitullah) yang di Bakkah (Makkah) yang diberkahi dan menjadi petunjuk bagi seluruh alam."
    },
    {
      surah: "QS. Al-Baqarah: 125",
      arab: "وَإِذْ جَعَلْنَا الْبَيْتَ مَثَابَةً لِّلنَّاسِ وَأَمْنًا وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى",
      terjemahan: "Dan (ingatlah), ketika Kami menjadikan rumah itu (Ka'bah) tempat berkumpul bagi manusia dan tempat yang aman. Dan jadikanlah sebahagian maqam Ibrahim tempat shalat."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <span className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-200 dark:border-amber-900/60 inline-flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5 animate-pulse" />
          Haramain Live Streaming
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Siaran Langsung Masjidil Haram
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-lg mx-auto">
          Rasakan kedamaian spiritual dengan menyaksikan kemegahan Kakbah di Masjidil Haram, Makkah dan keindahan kubah hijau di Masjidil Nabawi secara langsung.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Streaming Player Container */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Main Player Card */}
          <div className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-lg relative">
            
            {/* Header Stream Bar */}
            <div className="bg-emerald-50 text-slate-800 px-5 py-3.5 flex flex-wrap justify-between items-center border-b border-emerald-100">
              <div className="flex items-center space-x-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="text-[11px] font-black tracking-widest text-rose-600 uppercase">
                  LIVE STREAMING
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  | {selectedStream.location}
                </span>
              </div>

              {/* Saudi Arabia AST clock */}
              <div className="bg-amber-100/90 px-3.5 py-1 border border-amber-200 rounded-xl flex items-center space-x-1.5 mt-1 sm:mt-0">
                <Clock className="w-3.5 h-3.5 text-amber-800 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-amber-900 tracking-wider">
                  {ksaTimeStr || "MEMUAT WAKTU KSA..."}
                </span>
              </div>
            </div>

            {/* Video Iframe Frame */}
            <div className="relative aspect-video bg-slate-100 w-full flex items-center justify-center">
              {isStreamPlaying ? (
                activeStreamId ? (
                  <iframe
                    id="makkah-youtube-iframe"
                    width="100%"
                    height="100%"
                    src={selectedStream.embedUrl}
                    title="Masjidil Haram Live Stream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-3 p-4">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                    <span className="text-xs text-slate-600 font-mono">Menyegarkan feed siaran luar jaringan...</span>
                  </div>
                )
              ) : (
                <div 
                  className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-6 text-center cursor-pointer overflow-hidden group select-none transition-all duration-300"
                  onClick={() => setIsStreamPlaying(true)}
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-600/30 transition-all duration-300 scale-95 group-hover:scale-105">
                    <Youtube className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white mt-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block" />
                    Putar Siaran Langsung
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 max-w-sm mt-1.5 leading-relaxed font-semibold">
                    Hemat kuota data internet Anda. Aliran video YouTube secara live baru akan dimuat setelah Anda menekan tombol putar.
                  </p>
                  <button
                    className="mt-4 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Mulai Menonton LIVE
                  </button>
                </div>
              )}
            </div>

            {/* Action Bar Sub-player */}
            <div className="bg-slate-50 text-slate-800 p-4.5 flex flex-wrap justify-between items-center gap-3 border-t border-slate-100">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  {selectedStream.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {selectedStream.description}
                </p>
              </div>

              {/* Reload controller */}
              <button
                id="btn-refresh-stream"
                onClick={handleRefreshStream}
                disabled={isRefreshing}
                className="px-3 border border-emerald-200/60 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 text-emerald-800 text-xs py-2 rounded-xl flex items-center cursor-pointer font-bold transition-all shrink-0 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refresh Siaran
              </button>
            </div>
          </div>

          {/* Tips Adab Memandang Ka'bah */}
          <div className="bg-amber-500/5 dark:bg-emerald-950/15 border border-amber-500/15 dark:border-emerald-900/35 rounded-3xl p-5 flex items-start gap-4">
            <div className="bg-amber-500/10 text-amber-700 dark:text-amber-300 p-2.5 rounded-2xl shrink-0 mt-0.5">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 dark:text-emerald-100 uppercase tracking-widest">
                Petunjuk Berkhidmat & Berdoa
              </h4>
              <p className="text-xs text-slate-600 dark:text-emerald-300/80 mt-1.5 leading-relaxed">
                Nyalakan suara (unmute) pada pojok kanan bawah video YouTube jika dinonaktifkan secara bawaan, agar lantunan murattal ayat Al-Qur&apos;an yang merdu mengiringi ketakziman ibadah Anda dari rumah. Saat memandang Ka&apos;bah via siaran, perbanyaklah memohon berkah dunia akhirat.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Feed Selection, Verse Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Channel Multi-feed List selection */}
          <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 rounded-3xl p-5 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-emerald-50 mb-4 tracking-tight border-b border-slate-100 dark:border-emerald-900/30 pb-2 flex items-center">
              <Tv className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              Pilih Saluran Utama
            </h3>

            <div className="space-y-2.5">
              {streams.filter(st => availableStreamIds.includes(st.id)).map((st) => {
                const isSelected = activeStreamId === st.id;
                return (
                  <button
                    key={st.id}
                    id={`stream-select-${st.id}`}
                    onClick={() => {
                      setActiveStreamId(st.id);
                      setIsStreamPlaying(true);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10 font-medium'
                        : 'border-slate-100 dark:border-emerald-900 bg-slate-50/50 dark:bg-emerald-950/10 text-slate-700 dark:text-emerald-200 hover:bg-emerald-50/70'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-blue-400 group-hover:bg-emerald-100'
                    }`}>
                      <Youtube className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold leading-snug truncate">
                        {st.title}
                      </span>
                      <span className={`block text-[10px] mt-0.5 font-medium ${
                        isSelected ? 'text-emerald-50' : 'text-slate-400'
                      }`}>
                        {st.location}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qur'an Virtues Card Section */}
          <div className="space-y-4">
            <div className="text-xs font-black uppercase text-slate-400 dark:text-emerald-400/40 tracking-wider px-1">
              Keutamaan Rumah Allah (Baitullah)
            </div>

            {makkahVerses.map((v, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-emerald-950/10 border border-emerald-100/70 dark:border-emerald-900/50 rounded-2xl p-5 shadow-xs relative overflow-hidden"
              >
                <div className="absolute right-2 top-2 text-[60px] font-bold text-slate-100 dark:text-emerald-900/5 select-none pointer-events-none font-serif leading-none">
                  {idx + 1}
                </div>
                
                <p dir="rtl" className="text-right text-base font-serif text-emerald-900 dark:text-emerald-100 font-semibold leading-relaxed mb-3">
                  {v.arab}
                </p>

                <p className="text-[11px] leading-relaxed italic text-slate-600 dark:text-emerald-300/70 border-l border-emerald-400/55 pl-3 mb-2.5">
                  &ldquo;{v.terjemahan}&rdquo;
                </p>

                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 text-right">
                  — {v.surah}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Footer Info Makkah */}
      <div className="mt-8 p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-emerald-900 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-650 dark:text-emerald-300 rounded-xl">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-emerald-100">Keterangan Sumber Tayangan</h4>
            <p className="text-[11px] text-slate-400 dark:text-emerald-405 mt-0.5 leading-relaxed">
              Siaran streaming ini dialirkan langsung secara otomatis dari stasiun televisi resmi Kerajaan Arab Saudi (Saudi TV) melalui platform resmi Youtube. Semua hak milik berada pada pemilik hak siar masing-masing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
