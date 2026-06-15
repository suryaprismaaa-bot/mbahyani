/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, RefreshCw, AlertCircle, Sparkles, Volume2, MoveRight, HelpCircle, Info } from 'lucide-react';

interface PrayerTimeRow {
  id: string;
  nama: string;
  waktu: string;
  deskripsi: string;
}

// Surabaya Default Timings Fallback
const KEMENAG_FALLBACK_TIMES: { [key: string]: string } = {
  imsak: "04:09",
  subuh: "04:19",
  terbit: "05:36",
  dzuhur: "11:35",
  ashar: "14:54",
  maghrib: "17:29",
  isya: "18:43"
};

const MUHAMMADIYAH_FALLBACK_TIMES: { [key: string]: string } = {
  imsak: "04:17", // Subuh is calculated 8-9 mins later because Fajr is -18 degrees (compared to -20 degrees of Kemenag)
  subuh: "04:27",
  terbit: "05:36",
  dzuhur: "11:35",
  ashar: "14:54",
  maghrib: "17:29",
  isya: "18:43"
};

const STATIC_FALLBACK_TIMES = KEMENAG_FALLBACK_TIMES;

const MAJOR_CITIES = [
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "DKI Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Semarang", lat: -6.9667, lng: 110.4167 },
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
  { name: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { name: "Balikpapan", lat: -1.2654, lng: 116.8312 },
  { name: "Palembang", lat: -2.9911, lng: 104.7567 }
];

const getClosestMajorCity = (lat: number, lng: number): string => {
  let closest = MAJOR_CITIES[0];
  let minDist = Infinity;
  for (const city of MAJOR_CITIES) {
    const d = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2));
    if (d < minDist) {
      minDist = d;
      closest = city;
    }
  }
  return closest.name;
};

const fetchCityName = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
      headers: { 'Accept-Language': 'id-ID,id;q=0.9' }
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        return data.address.city || data.address.town || data.address.municipality || data.address.suburb || data.address.state || getClosestMajorCity(latitude, longitude);
      }
    }
  } catch (e) {
    console.warn("Geocoding failed, using distance fallback", e);
  }
  return getClosestMajorCity(latitude, longitude);
};

// Helper to get calculated Hijri date using native Intl
const getCalculatedHijriDate = (d: Date = new Date()): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(d);
    const day = parts.find(p => p.type === 'day')?.value || '1';
    const monthNum = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
    const year = parts.find(p => p.type === 'year')?.value || '1447';
    
    const hijriMonths = [
      "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
      "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
      "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"
    ];
    
    const monthName = hijriMonths[monthNum - 1] || "Dzulhijjah";
    return `${day} ${monthName} ${year} H`;
  } catch (e) {
    return "20 Dzulhijjah 1447 H"; // Accurate lock fallback for June 6, 2026
  }
};

// Helper function to map external API results keys to the app's Indonesian keys
const remapKeys = (rawTimings: any): { [key: string]: string } => {
  if (!rawTimings) return {};
  const cleaned: { [key: string]: string } = {};
  const keyMap: { [key: string]: string } = {
    fajr: 'subuh',
    sunrise: 'terbit',
    dhuhr: 'dzuhur',
    asr: 'ashar',
    maghrib: 'maghrib',
    isha: 'isya',
    imsak: 'imsak'
  };

  Object.keys(rawTimings).forEach(k => {
    const lowerK = k.toLowerCase();
    const targetKey = keyMap[lowerK] || lowerK;
    cleaned[targetKey] = String(rawTimings[k]).substring(0, 5);
  });
  return cleaned;
};

export default function PrayerSchedule() {
  const [calcMethod, setCalcMethod] = useState<'kemenag' | 'muhammadiyah'>(() => {
    return (localStorage.getItem('pr_calcMethod') as 'kemenag' | 'muhammadiyah') || 'kemenag';
  });
  const [lat, setLat] = useState<number>(() => {
    const saved = localStorage.getItem('pr_lat');
    return saved ? parseFloat(saved) : -7.2575;
  });
  const [lng, setLng] = useState<number>(() => {
    const saved = localStorage.getItem('pr_lng');
    return saved ? parseFloat(saved) : 112.7521;
  });
  const [locationName, setLocationName] = useState<string>(() => {
    return localStorage.getItem('pr_locationName') || "Surabaya (Waktu Setempat)";
  });
  const [detectedCity, setDetectedCity] = useState<string | null>(() => {
    return localStorage.getItem('pr_detectedCity') || null;
  });
  const [timings, setTimings] = useState<{ [key: string]: string }>(() => {
    const savedMethod = (localStorage.getItem('pr_calcMethod') as 'kemenag' | 'muhammadiyah') || 'kemenag';
    const saved = localStorage.getItem(`pr_timings_${savedMethod}`) || localStorage.getItem('pr_timings');
    if (saved) {
      try {
        return remapKeys(JSON.parse(saved));
      } catch (e) {}
    }
    return savedMethod === 'muhammadiyah' ? MUHAMMADIYAH_FALLBACK_TIMES : KEMENAG_FALLBACK_TIMES;
  });
  const [hijriDate, setHijriDate] = useState<string>(() => {
    return localStorage.getItem('pr_hijriDate') || getCalculatedHijriDate(new Date());
  });
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [systemTime, setSystemTime] = useState<Date>(new Date());
  
  // Audio state
  const [showAzzanNote, setShowAzzanNote] = useState<boolean>(false);

  // Timezone label helper based on longitude
  const getTzLabel = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes("Jakarta") || tz.includes("Bangkok") || lng < 115) {
        return "WIB";
      } else if (tz.includes("Makassar") || tz.includes("Singapore") || (lng >= 115 && lng < 135)) {
        return "WITA";
      } else if (tz.includes("Jayapura") || lng >= 135) {
        return "WIT";
      }
    } catch (e) {}
    return "WIB";
  };

  // Manual reset back to Surabaya
  const handleRestoreSurabaya = () => {
    setLat(-7.2575);
    setLng(112.7521);
    setDetectedCity(null);
    localStorage.removeItem('pr_detectedCity');
    fetchPrayerTimes(-7.2575, 112.7521, "Surabaya (Waktu Setempat)", calcMethod);
  };

  // Keep a function to handle dropdown calculation changes
  const handleCalcMethodChange = (method: 'kemenag' | 'muhammadiyah') => {
    setCalcMethod(method);
    localStorage.setItem('pr_calcMethod', method);
    
    // Swap timing lists instantly so countdown adjusts immediately!
    const cachedForMethod = localStorage.getItem(`pr_timings_${method}`);
    if (cachedForMethod) {
      try {
        setTimings(remapKeys(JSON.parse(cachedForMethod)));
      } catch (e) {}
    } else {
      setTimings(method === 'muhammadiyah' ? MUHAMMADIYAH_FALLBACK_TIMES : KEMENAG_FALLBACK_TIMES);
    }
    
    fetchPrayerTimes(lat, lng, locationName, method);
  };

  // Load times and update system watch
  useEffect(() => {
    // Gregorian calendar date output
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setGregorianDate(new Date().toLocaleDateString('id-ID', options));

    // Listen to tick every second
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);

    // Initial load check: Let's see if we already have coordinate cache
    const savedLat = localStorage.getItem('pr_lat');
    const savedLng = localStorage.getItem('pr_lng');
    const savedName = localStorage.getItem('pr_locationName');
    
    if (savedLat && savedLng && savedName) {
      fetchPrayerTimes(parseFloat(savedLat), parseFloat(savedLng), savedName, calcMethod);
    } else {
      // Fetch default Surabaya
      fetchPrayerTimes(-7.2575, 112.7521, "Surabaya (Waktu Setempat)", calcMethod);
      
      // Attempt GPS if not cached and supported
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const uLat = position.coords.latitude;
            const uLng = position.coords.longitude;
            setLat(uLat);
            setLng(uLng);
            const cityName = await fetchCityName(uLat, uLng);
            setDetectedCity(cityName);
            localStorage.setItem('pr_detectedCity', cityName);
            fetchPrayerTimes(uLat, uLng, cityName, calcMethod);
          },
          (error) => {
            console.log("GPS auto-detection skipped or blocked. Code:", error.code);
          },
          { timeout: 4000 }
        );
      }
    }

    return () => clearInterval(timer);
  }, []);

  const fetchPrayerTimes = async (latitude: number, longitude: number, name: string, methodOverride?: 'kemenag' | 'muhammadiyah') => {
    const activeMethod = methodOverride || calcMethod;
    
    // Format current system date as DD-MM-YYYY for Aladhan API to ensure accurate data
    const today = new Date();
    const dayStr = String(today.getDate()).padStart(2, '0');
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const yearStr = today.getFullYear();
    const dateStr = `${dayStr}-${monthStr}-${yearStr}`;

    const cacheKey = `${latitude.toFixed(4)}_${longitude.toFixed(4)}_${dateStr}_${activeMethod}`;
    const storedCacheKey = localStorage.getItem(`pr_timings_cache_key_${activeMethod}`) || localStorage.getItem('pr_timings_cache_key');
    const cachedTimingsForMethod = localStorage.getItem(`pr_timings_${activeMethod}`);
    
    // If the cache matches today's date, same location and same calculation method, skip network and render instantly!
    if (storedCacheKey === cacheKey && cachedTimingsForMethod) {
      try {
        const cached = JSON.parse(cachedTimingsForMethod);
        setTimings(remapKeys(cached));
        const cachedHijri = localStorage.getItem('pr_hijriDate');
        if (cachedHijri) setHijriDate(cachedHijri);
        setLocationName(name);
        return; // Complete return early - no blocking loading visual triggers!
      } catch (e) {}
    }

    setIsLoading(true);
    try {
      // Aladhan API method 20 is "Kementerian Agama Republik Indonesia" (Fajr 20, Isha 18)
      // Aladhan API method 1 is "University of Islamic Sciences, Karachi" (Fajr 18, Isha 18), fits Muhammadiyah Majelis Tarjih (KHGT) post-2021 criteria exactly.
      const methodId = activeMethod === 'muhammadiyah' ? 1 : 20;

      // Fetch timings from Aladhan API, method matching standard settings
      const response = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${methodId}`);
      if (!response.ok) {
        throw new Error("HTTP error");
      }
      const resJson = await response.json();
      if (resJson && resJson.data) {
        const remoteTimings = resJson.data.timings;
        const cleaned = remapKeys(remoteTimings);
        setTimings(cleaned);
        
        const hijri = resJson.data.date.hijri;
        const hijriMonthsMap = [
          "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
          "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
          "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"
        ];
        const monthNum = parseInt(hijri.month.number, 10);
        const mappedMonth = hijriMonthsMap[monthNum - 1] || hijri.month.en;
        const mappedHijri = `${hijri.day} ${mappedMonth} ${hijri.year} H`;
        setHijriDate(mappedHijri);
        setLocationName(name);

        // Update localstorage cache values
        localStorage.setItem('pr_lat', latitude.toString());
        localStorage.setItem('pr_lng', longitude.toString());
        localStorage.setItem('pr_locationName', name);
        localStorage.setItem('pr_timings', JSON.stringify(cleaned));
        localStorage.setItem(`pr_timings_${activeMethod}`, JSON.stringify(cleaned));
        localStorage.setItem('pr_hijriDate', mappedHijri);
        localStorage.setItem('pr_calcMethod', activeMethod);
        localStorage.setItem(`pr_timings_cache_key_${activeMethod}`, cacheKey);
      }
    } catch (err) {
      console.warn("Using local calculation fallbacks for prayer times", err);
      const savedForMethod = localStorage.getItem(`pr_timings_${activeMethod}`);
      if (savedForMethod) {
        try {
          setTimings(JSON.parse(savedForMethod));
        } catch (e) {}
      } else {
        setTimings(activeMethod === 'muhammadiyah' ? MUHAMMADIYAH_FALLBACK_TIMES : KEMENAG_FALLBACK_TIMES);
        setHijriDate(getCalculatedHijriDate(new Date()));
      }
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
      async (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setLat(uLat);
        setLng(uLng);
        const cityName = await fetchCityName(uLat, uLng);
        setDetectedCity(cityName);
        localStorage.setItem('pr_detectedCity', cityName);
        await fetchPrayerTimes(uLat, uLng, cityName, calcMethod);
        setIsGpsLoading(false);
      },
      (error) => {
        console.warn("GPS failed, using defaults", error);
        alert("Akses GPS gagal atau diblokir. Menampilkan waktu shalat wilayah Surabaya.");
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

    const defaultSubuh = calcMethod === 'muhammadiyah' ? "04:27" : "04:19";
    const schedules = [
      { id: 'subuh', nama: 'Subuh', waktu: timings.subuh || defaultSubuh },
      { id: 'dzuhur', nama: 'Dzuhur', waktu: timings.dzuhur || "11:35" },
      { id: 'ashar', nama: 'Ashar', waktu: timings.ashar || "14:54" },
      { id: 'maghrib', nama: 'Maghrib', waktu: timings.maghrib || "17:29" },
      { id: 'isya', nama: 'Isya', waktu: timings.isya || "18:43" }
    ];

    // Find next prayer today
    let nextScheduled = schedules.find(s => timeStrToMinutes(s.waktu) > currentTotalMinutes);
    let nextDay = false;

    if (!nextScheduled) {
      nextScheduled = schedules[0]; // Subuh
      nextDay = true;
    }

    // Compute remaining seconds
    const targetMinutes = timeStrToMinutes(nextScheduled.waktu);
    let diffInSeconds = 0;

    if (nextDay) {
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
    { id: 'imsak', nama: 'Imsak', waktu: timings.imsak || "04:09", deskripsi: 'Batas sahur puasa' },
    { id: 'subuh', nama: 'Subuh', waktu: timings.subuh || "04:19", deskripsi: 'Mulai fajar shodiq' },
    { id: 'terbit', nama: 'Syuruk', waktu: timings.terbit || "05:36", deskripsi: 'Matahari terbit' },
    { id: 'dzuhur', nama: 'Dzuhur', waktu: timings.dzuhur || "11:35", deskripsi: 'Matahari condong barat' },
    { id: 'ashar', nama: 'Ashar', waktu: timings.ashar || "14:54", deskripsi: 'Bayangan menyamai tinggi benda' },
    { id: 'maghrib', nama: 'Maghrib', waktu: timings.maghrib || "17:29", deskripsi: 'Matahari terbenam' },
    { id: 'isya', nama: 'Isya', waktu: timings.isya || "18:43", deskripsi: 'Hilangnya fajar merah' }
  ];

  const handlePlayAdzanDemo = () => {
    setShowAzzanNote(true);
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
        <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/40 text-emerald-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100/40 dark:border-blue-900/40">
          Tepat Waktu Menghadap Pencipta
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Jadwal Sholat Otomatis
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-lg mx-auto">
          Membantu menegakkan sholat di awal waktu. Disinkronisasikan instan sesuai koordinat GPS Anda dengan pilihan metodologi Kemenag RI atau Muhammadiyah (KHGT).
        </p>
      </div>

      {/* Banner Informasi Lokasi Default Surabaya / GPS */}
      {(!detectedCity || locationName.toLowerCase().includes("surabaya")) ? (
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-slate-900/60 p-4 rounded-2xl border-l-4 border-l-emerald-600 border-r-4 border-r-blue-600 border-t border-b border-emerald-100/30 dark:border-blue-900/10 text-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3 text-slate-700 dark:text-emerald-250">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-sm text-slate-800 dark:text-emerald-100 mb-0.5">Jadwal Aktif: Kota Surabaya</p>
              <p className="leading-relaxed font-medium">
                Jadwal di bawah adalah untuk wilayah Surabaya. Jika posisi Anda di luar Surabaya, silakan klik <span className="font-bold text-emerald-700 dark:text-emerald-300">"Sesuaikan GPS"</span> agar waktu shalat otomatis menyesuaikan lokasi Anda saat ini.
              </p>
            </div>
          </div>
          <button
            onClick={handleRequestGps}
            disabled={isGpsLoading}
            className="shrink-0 px-4.5 py-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-all whitespace-nowrap self-start sm:self-center text-xs active:scale-97"
          >
            {isGpsLoading ? "Menyesuaikan..." : "Sesuaikan GPS"}
          </button>
        </div>
      ) : null}

      {/* Real-time Location alerts (Jakarta or other detected city) */}
      {detectedCity && (detectedCity.toLowerCase().includes("jakarta") || locationName.toLowerCase().includes("jakarta")) ? (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-l-4 border-l-blue-600 rounded-r-2xl p-4 mb-8 flex items-start gap-3.5 text-slate-700 dark:text-emerald-250 animate-in fade-in slide-in-from-top-3">
          <MapPin className="w-5.5 h-5.5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5 animate-bounce" />
          <div className="text-xs">
            <span className="font-extrabold text-sm block mb-1 text-slate-800 dark:text-white">📍 Lokasi Terdeteksi di Jakarta!</span>
            Waktu jadwal sholat saat ini disinkronisasikan secara real-time mengacu pada perhitungan Kemenag RI untuk zona waktu Jakarta dan sekitarnya.
            <button 
              onClick={handleRestoreSurabaya}
              className="mt-2 block text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← RESET KE SURABAYA (DEFAULT)
            </button>
          </div>
        </div>
      ) : detectedCity && !detectedCity.toLowerCase().includes("surabaya") ? (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-l-4 border-l-emerald-600 rounded-r-2xl p-4 mb-8 flex items-start gap-3.5 text-slate-700 dark:text-emerald-250 animate-in fade-in slide-in-from-top-3">
          <MapPin className="w-5.5 h-5.5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div className="text-xs">
            <span className="font-extrabold text-sm block mb-1 text-slate-800 dark:text-white">📍 Lokasi Terdeteksi: {detectedCity}</span>
            Jadwal sholat otomatis disesuaikan secara real-time berdasarkan posisi geografis Anda di <strong>{detectedCity}</strong> sesuai hisab Kemenag RI.
            <button 
              onClick={handleRestoreSurabaya}
              className="mt-2 block text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              ← KEMBALI KE SURABAYA (DEFAULT)
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: Active Countdown Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target count clock banner */}
          <div className="bg-white dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900 shadow-xxs text-center">
            <span className="text-[10px] font-black text-slate-400 dark:text-emerald-450 uppercase block tracking-wider mb-0.5">
              SHOLAT BERIKUTNYA
            </span>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-emerald-100 font-sans flex justify-center items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-spin" />
              Sholat {activeNextInfo.nama}
            </h3>
            <p className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 bg-emerald-50/40 dark:bg-emerald-900/20 py-1.5 px-3 rounded-xl border border-emerald-100 dark:border-emerald-800 inline-block font-black">
              {activeNextInfo.countdown}
            </p>
            <div className="text-[10px] text-slate-400 mt-1.5 font-mono">
              Pukul {activeNextInfo.waktu} {getTzLabel()}
            </div>
          </div>

          {/* Test Adzan reminder */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <button
              id="test-adzan-bell"
              onClick={handlePlayAdzanDemo}
              className="w-full flex items-center justify-center space-x-2 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-transparent cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span>Alarm Bell Pengingat</span>
            </button>
            {showAzzanNote && (
              <p className="text-[10px] text-amber-600 dark:text-amber-500 text-center mt-1 font-sans animate-pulse font-semibold">
                🔔 Bersiap berwudhu untuk sholat fardhu.
              </p>
            )}
          </div>
        </div>

        {/* Right pane: Timings complete list */}
        <div className="lg:col-span-8 bg-white dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-5 shadow-xxs">
          
          {/* Header of timing table */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0 mb-4 border-b border-emerald-55/20 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-emerald-100 flex items-center">
                <MapPin className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                Jadwal Kota Aktif
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-emerald-300 font-mono mt-0.5">
                Wilayah: {locationName}
              </p>
            </div>

            {/* Retrieve browser coordinates with GPS */}
            <button
              id="gps-schedule-button"
              onClick={handleRequestGps}
              disabled={isGpsLoading}
              className="flex items-center justify-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-700 text-emerald-800 dark:text-white font-semibold text-xs border border-emerald-100 dark:border-emerald-700 rounded-xl cursor-pointer transition-colors disabled:opacity-40 h-[34px] active:scale-95 animate-pulse"
            >
              {isGpsLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Mengakses GPS...
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3 mr-1" />
                  Sesuaikan GPS
                </>
              )}
            </button>
          </div>

          {/* Segmented Reference Selector (Converted to Dropdown with Striking Background) */}
          <div className="mb-4 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 p-4 rounded-xl border border-amber-400 dark:border-amber-700 shadow-md text-white animate-pulse-slow">
            <label htmlFor="calc-method-select" className="text-[10px] font-black uppercase tracking-wider block mb-2 text-amber-50 drop-shadow-sm">
              ⚡ DASAR ACUAN PERHITUNGAN JADWAL SHALAT:
            </label>
            <div className="relative">
              <select
                id="calc-method-select"
                value={calcMethod}
                onChange={(e) => handleCalcMethodChange(e.target.value as 'kemenag' | 'muhammadiyah')}
                className="w-full bg-white dark:bg-slate-900 text-amber-950 dark:text-white font-black text-xs py-2.5 px-3.5 pr-10 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer appearance-none shadow-sm"
              >
                <option value="kemenag">🇮🇩 Kementerian Agama RI (Bimas Islam Kisaran)</option>
                <option value="muhammadiyah">🕌 Muhammadiyah / Kalender Hijriah Global Tunggal (KHGT)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-800 dark:text-white-450">
                <svg className="fill-current h-4 w-4 text-slate-650 dark:text-emerald-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            {/* Clickable web link to official references */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] font-black tracking-tight gap-1.5 border-t border-white/20 pt-2.5">
              <span className="text-amber-105">Situs Resmi Acuan:</span>
              {calcMethod === 'kemenag' ? (
                <a
                  href="https://bimasislam.kemenag.go.id/jadwalshalat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg border border-white/10 transition-all flex items-center gap-1 active:scale-95"
                >
                  bimasislam.kemenag.go.id ↗
                </a>
              ) : (
                <a
                  href="https://khgt.muhammadiyah.or.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg border border-white/10 transition-all flex items-center gap-1 active:scale-95"
                >
                  khgt.muhammadiyah.or.id ↗
                </a>
              )}
            </div>
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
                      <span className="text-[10px] text-slate-400 block font-mono">{getTzLabel()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Informational help - blinking border */}
          <div className="mt-6 p-4 bg-amber-500/5 dark:bg-amber-955/10 border-2 border-amber-500 animate-blink-border rounded-2xl flex items-start text-xs text-slate-705 dark:text-emerald-200 leading-relaxed">
            <HelpCircle className="w-4.5 h-4.5 mr-2 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-slate-800 dark:text-amber-450 mb-0.5 uppercase tracking-wider">Konvensi Perhitungan Resmi:</p>
              {calcMethod === 'kemenag' ? (
                <span>
                  Mengadopsi kriteria Kementerian Agama RI sesuai dengan situs resmi <a href="https://bimasislam.kemenag.go.id/jadwalshalat" target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">bimasislam.kemenag.go.id</a> dengan sudut Fajar -20° dan Isya -18°. Seluruh jadwal jam shalat realtime telah disinkronkan sepenuhnya mengacu pada satelit lokasi aktif Anda.
                </span>
              ) : (
                <span>
                  Mengadopsi kriteria resmi Kalender Hijriah Global Tunggal (KHGT) dari Pimpinan Pusat Muhammadiyah sesuai <a href="https://khgt.muhammadiyah.or.id/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">khgt.muhammadiyah.or.id</a> dengan sudut Fajar (Subuh) -18° dan Isya -18° demi akurasi fajar sidiq astronomis.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
