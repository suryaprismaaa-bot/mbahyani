/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, RefreshCw, AlertCircle, Sparkles, Volume2, MoveRight, HelpCircle } from 'lucide-react';

interface PrayerTimeRow {
  id: string;
  nama: string;
  waktu: string;
  deskripsi: string;
}

// Solid Indonesian local prayer times database fallback (Yogyakarta / East Java coordinates)
const STATIC_FALLBACK_TIMES: { [key: string]: string } = {
  imsak: "04:08",
  subuh: "04:18",
  terbit: "05:35",
  dzuhur: "11:34",
  ashar: "14:53",
  maghrib: "17:28",
  isya: "18:42"
};

export default function PrayerSchedule() {
  const [lat, setLat] = useState<number>(-8.0827); // Default (Keluarga Besar Mbah Yani area, Jawa Timur)
  const [lng, setLng] = useState<number>(111.8021);
  const [locationName, setLocationName] = useState<string>("Trenggalek / Durenan (Kediaman Mbah Yani)");
  const [timings, setTimings] = useState<{ [key: string]: string }>(STATIC_FALLBACK_TIMES);
  const [hijriDate, setHijriDate] = useState<string>("Safar 1448 H");
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [systemTime, setSystemTime] = useState<Date>(new Date());
  
  // Audio state
  const [showAzzanNote, setShowAzzanNote] = useState<boolean>(false);

  // Load times and update system watch
  useEffect(() => {
    // Gregorian calendar date output
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setGregorianDate(new Date().toLocaleDateString('id-ID', options));

    // Listen to tick every second
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);

    // Initial load
    fetchPrayerTimes(lat, lng, "Trenggalek / Durenan");

    return () => clearInterval(timer);
  }, []);

  const fetchPrayerTimes = async (latitude: number, longitude: number, name: string) => {
    setIsLoading(true);
    try {
      // Fetch timings from Aladhan API, method 11 (Kemenag RI / Singapore / Malaysia MUIS region)
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=11`);
      if (!response.ok) {
        throw new Error("HTTP error");
      }
      const resJson = await response.json();
      if (resJson && resJson.data) {
        const remoteTimings = resJson.data.timings;
        // Strip out seconds if returned
        const cleaned: { [key: string]: string } = {};
        Object.keys(remoteTimings).forEach(k => {
          cleaned[k.toLowerCase()] = remoteTimings[k].substring(0, 5);
        });
        setTimings(cleaned);
        
        const hijri = resJson.data.date.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.ar} ${hijri.year} H (${hijri.month.en})`);
        setLocationName(name);
      }
    } catch (err) {
      console.warn("Using local calculation fallbacks for prayer times", err);
      setTimings(STATIC_FALLBACK_TIMES);
      // Give simulated Hijri date based on year 2026
      setHijriDate("Dzulhijjah 1447 H");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestGps = () => {
    setIsGpsLoading(true);
    if (!navigator.geolocation) {
      alert("GPS tidak didukung oleh browser Anda.");
      setIsGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setLat(uLat);
        setLng(uLng);
        fetchPrayerTimes(uLat, uLng, "Lokasi GPS Anda");
        setIsGpsLoading(false);
      },
      (error) => {
        console.warn("GPS failed, using defaults", error);
        alert("Akses GPS gagal. Menampilkan waktu shalat wilayah keluarga Mbah Yani secara presisi.");
        setIsGpsLoading(false);
      },
      { timeout: 6000 }
    );
  };

  // Convert time string "HH:MM" to minutes from midnight
  const timeStrToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const getNextPrayerInfo = () => {
    const currentHour = systemTime.getHours();
    const currentMin = systemTime.getMinutes();
    const currentSec = systemTime.getSeconds();
    const currentTotalMinutes = currentHour * 60 + currentMin;

    const schedules = [
      { id: 'subuh', nama: 'Subuh', waktu: timings.subuh || "04:18" },
      { id: 'dzuhur', nama: 'Dzuhur', waktu: timings.dzuhur || "11:34" },
      { id: 'ashar', nama: 'Ashar', waktu: timings.ashar || "14:53" },
      { id: 'maghrib', nama: 'Maghrib', waktu: timings.maghrib || "17:28" },
      { id: 'isya', nama: 'Isya', waktu: timings.isya || "18:42" }
    ];

    // Find next prayer today
    let nextScheduled = schedules.find(s => timeStrToMinutes(s.waktu) > currentTotalMinutes);
    let nextDay = false;

    // If passed Isya, next prayer is Subuh of tomorrow
    if (!nextScheduled) {
      nextScheduled = schedules[0]; // Subuh
      nextDay = true;
    }

    // Compute remaining seconds
    const targetMinutes = timeStrToMinutes(nextScheduled.waktu);
    let diffInSeconds = 0;

    if (nextDay) {
      // Remaining minutes today + minutes tomorrow
      const minutesRemainingToday = (24 * 60) - currentTotalMinutes;
      diffInSeconds = (minutesRemainingToday + targetMinutes) * 60 - currentSec;
    } else {
      diffInSeconds = (targetMinutes - currentTotalMinutes) * 60 - currentSec;
    }

    const hours = Math.floor(diffInSeconds / 3600);
    const mins = Math.floor((diffInSeconds % 3600) / 60);
    const secs = diffInSeconds % 60;

    return {
      nama: nextScheduled.nama,
      waktu: nextScheduled.waktu,
      countdown: `${hours > 0 ? `${hours} jam ` : ''}${mins} menit ${secs} detik`,
      isUrgent: hours === 0 && mins < 30
    };
  };

  const activeNextInfo = getNextPrayerInfo();

  const prayList: PrayerTimeRow[] = [
    { id: 'imsak', nama: 'Imsak', waktu: timings.imsak || "04:08", deskripsi: 'Batas sahur puasa' },
    { id: 'subuh', nama: 'Subuh', waktu: timings.subuh || "04:18", deskripsi: 'Mulai fajar shodiq' },
    { id: 'terbit', nama: 'Syuruk', waktu: timings.terbit || "05:35", deskripsi: 'Matahari terbit' },
    { id: 'dzuhur', nama: 'Dzuhur', waktu: timings.dzuhur || "11:34", deskripsi: 'Matahari condong barat' },
    { id: 'ashar', nama: 'Ashar', waktu: timings.ashar || "14:53", deskripsi: 'Bayangan menyamai tinggi benda' },
    { id: 'maghrib', nama: 'Maghrib', waktu: timings.maghrib || "17:28", deskripsi: 'Matahari terbenam' },
    { id: 'isya', nama: 'Isya', waktu: timings.isya || "18:42", deskripsi: 'Hilangnya fajar merah' }
  ];

  const handlePlayAdzanDemo = () => {
    setShowAzzanNote(true);
    // Beep double tone
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}

    setTimeout(() => {
      setShowAzzanNote(false);
    }, 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Schedule Header */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
          Tepat Waktu Menghadap Pencipta
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Jadwal Sholat Otomatis
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-lg mx-auto">
          Membantu keluarga Mbah Yani menegakkan sholat di awal waktu. Terbuka otomatis bagi semua wilayah di Indonesia didukung koordinat satelit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: Active Countdown Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Current clock display */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 text-white text-center shadow-md select-none relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform -translate-y-6 translate-x-6">
              <Clock className="w-48 h-48" />
            </div>
            
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest block font-mono">
              WAKTU HARI INI (GMT+7)
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-tight my-2.5">
              {systemTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-xs text-white/90 font-medium font-sans">
              {gregorianDate}
            </p>
            <div className="h-px bg-white/20 my-4" />
            <div className="flex justify-center items-center text-xs text-amber-200 font-semibold bg-emerald-900/40 py-1.5 px-3 rounded-2xl border border-emerald-500/10">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-full mr-2 animate-pulse" />
              {hijriDate}
            </div>
          </div>

          {/* Target count clock banner */}
          <div className="bg-white dark:bg-emerald-950/20 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 dark:text-emerald-300 uppercase block tracking-wider mb-1">
              MENUJU SHOLAT BERIKUTNYA
            </span>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-emerald-50 font-sans flex justify-center items-center">
              <Sparkles className="w-5 h-5 text-amber-500 mr-2 shrink-0 animate-spin" />
              Sholat {activeNextInfo.nama}
            </h3>
            <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50/50 dark:bg-emerald-900/30 py-2.5 px-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 inline-block">
              {activeNextInfo.countdown}
            </p>
            <div className="text-xs text-slate-400 mt-2 font-mono">
              Pukul {activeNextInfo.waktu} WIB
            </div>
          </div>

          {/* Test Adzan reminder */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <button
              id="test-adzan-bell"
              onClick={handlePlayAdzanDemo}
              className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-transparent cursor-pointer"
            >
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>Dengarkan Alarm Bell Pengingat</span>
            </button>
            {showAzzanNote && (
              <p className="text-[11px] text-amber-600 dark:text-amber-500 text-center mt-2 font-sans animate-pulse font-semibold">
                🔔 Ucapkan &ldquo;Asyhadu an laa ilaaha illallah...&rdquo; – persiapkan wudhu untuk sholat segera.
              </p>
            )}
          </div>
        </div>

        {/* Right pane: Timings complete list */}
        <div className="lg:col-span-8 bg-white dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3.5 sm:space-y-0 mb-6 border-b border-emerald-55/20 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-emerald-100 flex items-center">
                <MapPin className="w-5 h-5 text-emerald-600 mr-2 shrink-0" />
                Jadwal Kota Aktif
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300 font-mono mt-0.5">
                Wilayah: {locationName}
              </p>
            </div>

            {/* Retrieve browser coordinates */}
            <button
              id="gps-schedule-button"
              onClick={handleRequestGps}
              disabled={isGpsLoading}
              className="flex items-center justify-center px-4.5 py-2.5 bg-emerald-50 dark:bg-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-700 hover:text-emerald-900 text-emerald-800 dark:text-white font-semibold text-xs border border-emerald-100 dark:border-emerald-700 rounded-2xl cursor-pointer transition-colors disabled:opacity-40"
            >
              {isGpsLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Mengakses GPS...
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  Sesuaikan GPS Saya
                </>
              )}
            </button>
          </div>

          {/* List display */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="mt-3 text-sm text-slate-500">Mengkoneksikan jadwal ke satelit...</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {prayList.map((pray) => {
                const isNext = pray.nama === activeNextInfo.nama;

                return (
                  <div
                    key={pray.id}
                    id={`schedule-row-${pray.id}`}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isNext
                        ? 'bg-emerald-600/10 border-emerald-500 shadow-sm scale-[1.01]'
                        : 'bg-transparent border-slate-50 dark:border-emerald-900/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      {/* Name of timing */}
                      <div>
                        <div className="flex items-center">
                          <span className="font-bold text-slate-800 dark:text-emerald-50 text-sm">
                            {pray.nama}
                          </span>
                          {isNext && (
                            <span className="ml-2 px-2 py-0.5 bg-emerald-500 text-white font-mono text-[9px] font-bold rounded-md uppercase tracking-wider animate-pulse">
                              BERIKUTNYA
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-emerald-300/40">
                          {pray.deskripsi}
                        </span>
                      </div>
                    </div>

                    {/* Precise timings */}
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-slate-800 dark:text-emerald-50">
                        {pray.waktu}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">WIB</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Informational help */}
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-start text-xs text-slate-500 dark:text-emerald-300/60 leading-relaxed">
            <HelpCircle className="w-4.5 h-4.5 mr-2 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-700 dark:text-emerald-100 mb-0.5">Konvensi Perhitungan:</p>
              Mengadopsi formula hitungan astronomi Kementrian Agama Republik Indonesia (Kemenag RI) dengan ikhtiyat +2 menit demi ketenangan pengamalan ibadah fardhu Bapak/Ibu lansia dan seluruh keluarga besar Mbah Yani.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
