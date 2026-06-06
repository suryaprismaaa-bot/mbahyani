/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Navigation, MapPin, RefreshCw, AlertCircle, Info, MoveRight, Smartphone, CheckCircle2 } from 'lucide-react';

interface CityPreset {
  nama: string;
  lat: number;
  lng: number;
}

const CITY_PRESETS: CityPreset[] = [
  { nama: 'Durenan / Trenggalek (Kediaman Mbah Yani)', lat: -8.0827, lng: 111.8021 },
  { nama: 'Yogyakarta (Keluarga Besar Yogya)', lat: -7.7956, lng: 110.3695 },
  { nama: 'Jakarta (Keluarga Besar Jakarta)', lat: -6.2088, lng: 106.8456 },
  { nama: 'Surabaya (Keluarga Besar Surabaya)', lat: -7.2575, lng: 112.75213 },
  { nama: 'Malang', lat: -7.9829, lng: 112.6308 },
  { nama: 'Semarang', lat: -6.9667, lng: 110.4167 }
];

const KabahLogo = ({ precision }: { precision: number }) => {
  const isPerfect = precision >= 90;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      {/* Floating glowing aura when alignment is perfect */}
      {isPerfect && (
        <div className="absolute inset-0 rounded-full bg-amber-400/35 dark:bg-amber-400/20 blur-md animate-ping" style={{ animationDuration: '2s' }} />
      )}
      
      {/* Self-contained cute complex vector of Ka'bah with lovely structural styles */}
      <svg 
        viewBox="0 0 100 100" 
        className={`w-12 h-12 drop-shadow-xl transition-all duration-300 ${isPerfect ? 'scale-115 rotate-1 animate-[bounce_1.5s_infinite]' : 'hover:scale-105'}`}
      >
        {/* Shadow floor */}
        <ellipse cx="50" cy="85" rx="28" ry="7" fill="#000000" opacity="0.18" />
        
        {/* Top/Roof face of Cube */}
        <polygon points="50,22 82,34 50,46 18,34" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
        
        {/* Left Wall (shaded) */}
        <polygon points="18,34 50,46 50,80 18,68" fill="#111827" />
        
        {/* Right Wall */}
        <polygon points="50,46 82,34 82,68 50,80" fill="#1f2937" />
        
        {/* Gold Kiswa Trim - Left Wall */}
        <polygon points="18,44 50,56 50,60 18,48" fill="#f59e0b" />
        <polygon points="18,45 50,57 50,58 18,46" fill="#fef08a" opacity="0.6" />
        
        {/* Gold Kiswa Trim - Right Wall */}
        <polygon points="50,56 82,44 82,48 50,60" fill="#d97706" />
        <polygon points="50,57 82,45 82,46 50,58" fill="#fef08a" opacity="0.6" />
        
        {/* Elegant Arabic Calligraphy mockup dots on the Kiswa belt */}
        <line x1="26" y1="48.5" x2="42" y2="54.5" stroke="#fef08a" strokeWidth="1" strokeDasharray="1.5,1.5" />
        <line x1="58" y1="54" x2="74" y2="48" stroke="#fef08a" strokeWidth="1" strokeDasharray="1.5,1.5" />

        {/* Golden Door (Bab Al-Ka'bah) on the Right Wall */}
        <polygon points="58,54 68,50 68,74 58,78" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
        {/* Tiny door details */}
        <line x1="63" y1="53" x2="63" y2="75" stroke="#fbbf24" strokeWidth="0.75" />
        {/* Door framing arc */}
        <path d="M 59 55 Q 63 52 67 51" fill="none" stroke="#fef08a" strokeWidth="0.75" />
      </svg>
    </div>
  );
};

export default function QiblaFinder() {
  const [lat, setLat] = useState<number | null>(-8.0827); // Defaults to Yogyakarta/Jawa Timur area
  const [lng, setLng] = useState<number | null>(111.8021);
  const [cityName, setCityName] = useState<string>("Durenan (Kediaman Mbah Yani)");
  const [qiblaAngle, setQiblaAngle] = useState<number>(294.2); // Default for East Java
  const [accuracy, setAccuracy] = useState<string>("Sangat Baik (Prediksi Lokal)");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [heading, setHeading] = useState<number>(0); // Simulated aligned direction or actual sensor heading
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [manualRotate, setManualRotate] = useState<number>(0); // Client can slide to rotate compass manually
  const [perfectPositionAlert, setPerfectPositionAlert] = useState<boolean>(false);
  const [hasAlertedForCurrentZone, setHasAlertedForCurrentZone] = useState<boolean>(false);

  // Mecca coordinates
  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;

  // Calculate Qibla bearing
  const calculateQibla = (latitude: number, longitude: number) => {
    const latRad = (latitude * Math.PI) / 180;
    const lngRad = (longitude * Math.PI) / 180;
    const meccaLatRad = (MECCA_LAT * Math.PI) / 180;
    const meccaLngRad = (MECCA_LNG * Math.PI) / 180;

    const deltaLng = meccaLngRad - lngRad;

    const y = Math.sin(deltaLng);
    const x = Math.cos(latRad) * Math.tan(meccaLatRad) - Math.sin(latRad) * Math.cos(deltaLng);
    
    let qiblaRad = Math.atan2(y, x);
    let qiblaDeg = (qiblaRad * 180) / Math.PI;
    
    // Normalise to 0-360
    qiblaDeg = (qiblaDeg + 360) % 360;
    
    // Round to 1 decimal
    return parseFloat(qiblaDeg.toFixed(1));
  };

  // Get Geolocation
  const requestLocation = () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("Browser Anda tidak mendukung layanan lokasi GPS.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setLat(uLat);
        setLng(uLng);
        setCityName("Lokasi GPS Anda");
        
        const angle = calculateQibla(uLat, uLng);
        setQiblaAngle(angle);
        setAccuracy(`Sangat Tinggi (Akurasi GPS: ~${Math.round(position.coords.accuracy || 10)}m)`);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg("Akses lokasi ditolak. Silakan pilih lokasi keluarga secara manual pada daftar atau aktifkan izin GPS.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg("Informasi lokasi GPS tidak tersedia.");
            break;
          case error.TIMEOUT:
            setErrorMsg("Permintaan GPS habis waktu.");
            break;
          default:
            setErrorMsg("Terjadi kegagalan mengakses lokasi.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Preset location chooser
  const handleSelectPreset = (preset: CityPreset) => {
    setLat(preset.lat);
    setLng(preset.lng);
    setCityName(preset.nama);
    const angle = calculateQibla(preset.lat, preset.lng);
    setQiblaAngle(angle);
    setAccuracy("Sangat Baik (Koordinat Preset)");
    setErrorMsg(null);
  };

  // Set up device orientation listeners
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // absolute orientation or normal orientation
      let currentHeading = 0;
      if ('webkitCompassHeading' in event) {
        // webkitCompassHeading is simple for iOS Safari
        currentHeading = (event as any).webkitCompassHeading;
        setSensorActive(true);
      } else if (event.alpha !== null) {
        // android alpha increases counter-clockwise, let's normalize
        currentHeading = (360 - event.alpha) % 360;
        setSensorActive(true);
      }
      setHeading(currentHeading);
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const distanceToMecca = () => {
    if (lat === null || lng === null) return 0;
    // Haversine formula
    const R = 6371; // earth radius km
    const dLat = ((MECCA_LAT - lat) * Math.PI) / 180;
    const dLng = ((MECCA_LNG - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((MECCA_LAT * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Determine rotated compass angle
  // On desktop, user slides a dial to point "North" correctly, updating the compass dial
  const alignedCompassBearing = sensorActive ? heading : manualRotate;

  // The Qibla pointer in the UI is relative to the compass display
  // Qibla display angle = Qibla Real Angle - Compass Heading
  const qiblaRelativeAngle = (qiblaAngle - alignedCompassBearing + 360) % 360;

  // Calculate precision percentage based on how close heading is to the Qibla bearing
  const angleDiffIndex = Math.abs(alignedCompassBearing - qiblaAngle) % 360;
  const shortestDiff = angleDiffIndex > 180 ? 360 - angleDiffIndex : angleDiffIndex;
  const precisionPercent = Math.max(0, Math.round(100 - (shortestDiff / 180) * 100));

  // Trigger focus stealing alert in 90%-100% precision with an entry threshold
  useEffect(() => {
    if (precisionPercent >= 90 && precisionPercent <= 100) {
      if (!hasAlertedForCurrentZone) {
        setPerfectPositionAlert(true);
        setHasAlertedForCurrentZone(true);
      }
    } else if (precisionPercent < 83) { // 83% deadzone to avoid repeat triggers while adjusting slightly
      setHasAlertedForCurrentZone(false);
    }
  }, [precisionPercent, hasAlertedForCurrentZone]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Header */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
          Penunjuk Arah Ibadah
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Cari Arah Kiblat
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-lg mx-auto">
          Temukan arah Ka&apos;bah di Mekkah secara akurat dari rumah mana pun keluarga Mbah Yani berada menggunakan kompas digital interaktif.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Compass UI */}
        <div className="lg:col-span-7 bg-white dark:bg-emerald-950/25 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900 shadow-sm flex flex-col items-center">
          
          <div className="relative w-72 h-72 my-4 flex items-center justify-center">
            {/* outer glowing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 dark:border-emerald-500/5 animate-pulse" />
            <div className="absolute inset-2 rounded-full border border-emerald-500/20 dark:border-emerald-500/10" />

            {/* Comppas Face - Rotates matching "alignedCompassBearing" (which aligns North) */}
            <div 
              className="absolute w-64 h-64 rounded-full bg-slate-50 dark:bg-emerald-900/10 border-2 border-emerald-600/30 dark:border-emerald-500/20 shadow-inner flex items-center justify-center transition-transform duration-300 pointer-events-none"
              style={{ transform: `rotate(${-alignedCompassBearing}deg)` }}
            >
              {/* Card Cardinal points */}
              <span className="absolute top-3 font-bold text-lg text-rose-600">U</span>
              <span className="absolute right-4 font-bold text-sm text-slate-500 dark:text-slate-400">T</span>
              <span className="absolute bottom-3 font-bold text-sm text-slate-500 dark:text-slate-400">S</span>
              <span className="absolute left-4 font-bold text-sm text-slate-500 dark:text-slate-400">B</span>
              
              {/* Compass degrees marks */}
              <div className="absolute inset-0 p-1 flex justify-center text-[8px] text-slate-400 dark:text-emerald-300/30 select-none">
                <span className="absolute top-10">0°</span>
                <span className="absolute right-10 rotate-90 transform origin-center">90°</span>
                <span className="absolute bottom-10 rotate-180 transform origin-center">180°</span>
                <span className="absolute left-10 -rotate-90 transform origin-center">270°</span>
              </div>

              {/* Sub-cardinals */}
              <span className="absolute top-8 right-10 text-[10px] text-slate-400 dark:text-emerald-300/30">TL</span>
              <span className="absolute bottom-8 right-10 text-[10px] text-slate-400 dark:text-emerald-300/30">BL</span>
              <span className="absolute bottom-8 left-10 text-[10px] text-slate-400 dark:text-emerald-300/30">BD</span>
              <span className="absolute top-8 left-10 text-[10px] text-slate-400 dark:text-emerald-300/30">BL</span>

              {/* Central Pivot */}
              <div className="w-4 h-4 bg-emerald-600 rounded-full border border-white dark:border-emerald-300 shadow-md z-12" />
            </div>

            {/* QIBLA POINTER - Points to Ka&apos;bah! Represented relative to the Dial */}
            <div 
              className="absolute w-56 h-56 flex items-center justify-center transition-transform duration-500 ease-out z-10 pointer-events-none"
              style={{ transform: `rotate(${qiblaRelativeAngle}deg)` }}
            >
              {/* Beautiful Golden Gate / Mosque Arrow with Iconic Cute Ka'bah on Top */}
              <div className="absolute top-0 flex flex-col items-center">
                {/* Cute Ka'bah logo indicator */}
                <div className="transform -translate-y-6 select-none transition-transform duration-300">
                  <KabahLogo precision={precisionPercent} />
                </div>
                {/* Double Spear head */}
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-amber-500 dark:border-b-amber-400" />
                {/* Stem line */}
                <div className="w-1.5 h-20 bg-gradient-to-b from-amber-500 via-emerald-600/50 to-transparent" />
              </div>
            </div>

            {/* Fixed North Arrow Helper (for desktop manual calibration) */}
            {!sensorActive && (
              <div className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center select-none opacity-40">
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider">KOMPAS UTARA</span>
                <div className="w-0.5 h-4 bg-slate-300 dark:bg-emerald-800" />
              </div>
            )}
          </div>

          {/* Blinking alignment banner when 90-100% precision is met */}
          {precisionPercent >= 90 && (
            <div className="w-full max-w-xs px-4 py-3 mb-4 bg-amber-500/15 dark:bg-amber-400/10 rounded-2xl border border-amber-300/50 text-center animate-pulse">
              <span className="font-extrabold text-[11px] uppercase text-amber-600 dark:text-amber-400 tracking-widest block">
                ✨ POSISI TERBAIK SEJAJAR KIBLAT ✨
              </span>
              <span className="block text-xs font-bold text-slate-700 dark:text-emerald-250 mt-1 leading-normal">
                Sajadah lurus memproyeksikan Ka&apos;bah ({precisionPercent}% Presisi)
              </span>
            </div>
          )}

          {/* Precision percentage indicator */}
          <div className="w-full max-w-xs mb-1 px-4 py-3 bg-slate-50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between shadow-inner">
            <div className="text-left">
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-emerald-400/50">AKURASI PENYEARAHAN</span>
              <span className="block text-xs font-bold text-slate-700 dark:text-emerald-100">Presisi Posisi Sajadah</span>
            </div>
            <div className={`px-3 py-1.5 rounded-xl font-mono text-sm font-black flex items-center gap-1 border ${
              precisionPercent >= 90
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-850 animate-pulse'
                : precisionPercent >= 70
                  ? 'bg-emerald-100 dark:bg-emerald-100/40 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-emerald-900/20'
            }`}>
              {precisionPercent}%
            </div>
          </div>

          {/* Information tip stating best precision */}
          <div className="w-full max-w-xs px-2 text-[10.5px] text-slate-500 dark:text-emerald-405 mb-4 text-center leading-relaxed">
            💡 <span className="font-semibold text-slate-600 dark:text-emerald-300">Presisi terbaik ada di angka 90 - 100%</span> sebagai tanda arah kiblat paling sejajar.
          </div>

          {/* Device Orientation Status */}
          <div className="w-full text-center mt-4">
            {sensorActive ? (
              <span className="inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-ping" />
                Sensor Kompas Live Aktif (Hadapkan HP ke Utara)
              </span>
            ) : (
              <div className="w-full px-2 max-w-sm">
                <span className="text-xs text-slate-500 dark:text-emerald-300/60 block mb-2">
                  Navigasi di laptop? Putar lingkaran kompas di bawah agar jarum merah <strong>U</strong> menunjuk ke atas (Utara navigasi Anda):
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400">0°</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="359" 
                    value={manualRotate} 
                    onChange={(e) => setManualRotate(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-ew-resize h-1.5 bg-slate-200 dark:bg-emerald-900/40 rounded-lg appearance-none" 
                  />
                  <span className="text-xs text-slate-400">360°</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Rotasi Kompas Anda: {manualRotate}°
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right column: Data & Config */}
        <div className="lg:col-span-5 space-y-6">
          {/* Location details card */}
          <div className="bg-white dark:bg-emerald-950/25 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900 shadow-sm transition-colors">
            <h2 className="text-lg font-bold text-slate-800 dark:text-emerald-100 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
              Lokasi Aktif
            </h2>

            {/* Geolocation trigger */}
            <button
              id="qibla-gps-trigger"
              onClick={requestLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Mengambil Koordinat GPS...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Deteksi Lokasi GPS Saya Otomatis
                </>
              )}
            </button>

            {errorMsg && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start">
                <AlertCircle className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Coordinate info sheet */}
            <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-900 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-emerald-300/60">Wilayah / Nama:</span>
                <span className="font-semibold text-slate-800 dark:text-emerald-100 text-right">{cityName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-emerald-300/60">Koordinat:</span>
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  {lat ? lat.toFixed(4) : '-'}, {lng ? lng.toFixed(4) : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-emerald-300/60">Akurasi GPS:</span>
                <span className="text-xs text-slate-600 dark:text-emerald-300">{accuracy}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-emerald-100/50 dark:border-emerald-900/50">
                <span className="font-bold text-emerald-800 dark:text-emerald-100 flex items-center">
                  Derajat Kiblat:
                </span>
                <span className="font-mono text-base font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  {qiblaAngle}° UTSB
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-emerald-300/60">Jarak ke Ka&apos;bah:</span>
                <span className="font-medium text-slate-800 dark:text-emerald-100 font-mono">
                  {distanceToMecca().toLocaleString('id-ID')} km
                </span>
              </div>
            </div>
          </div>

          {/* Presets List */}
          <div className="bg-white dark:bg-emerald-950/25 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 dark:text-emerald-200 mb-3 uppercase tracking-wider flex items-center">
              <Info className="w-4 h-4 mr-1.5 text-amber-500" />
              Pilih Wilayah Keluarga Mbah Yani
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/50 mb-3">
              Tidak ingin mengaktifkan GPS? Pilih preset kediaman keluarga di bawah untuk mementaskan koordinat dan arah kiblat secara instan:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CITY_PRESETS.map((preset) => (
                <button
                  key={preset.nama}
                  id={`preset-${preset.nama.split(' ')[0]}`}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-2 text-left rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                    cityName === preset.nama
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-50 dark:bg-emerald-900/10 border-emerald-100/30 dark:border-emerald-900/20 text-slate-600 dark:text-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {preset.nama.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Smartphone Guide & Best Practice Calibration */}
          <div className="bg-white dark:bg-emerald-950/25 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-emerald-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 dark:border-emerald-900 pb-2.5">
              <Smartphone className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Cara Penggunaan Akurat di HP
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-emerald-300/60 leading-relaxed">
              Jika Anda membuka portal ibadah ini menggunakan <strong>HP (Smartphone)</strong>, ikuti petunjuk penting berikut untuk mendapatkan akurasi kompas giroskopik 100% presisi:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-[10px] font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  1
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-700 dark:text-emerald-200 block">Izinkan Izin GPS Lokasi</span>
                  <p className="text-slate-500 dark:text-emerald-300/50 leading-tight mt-0.5">Klik tombol <strong>"Deteksi Lokasi GPS Saya"</strong> di atas. Berikan akses browser untuk membaca lokasi Anda demi perhitungan derajat kemiringan Kabah yang eksak.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-[10px] font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  2
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-700 dark:text-emerald-200 block">Letakkan HP Secara Datar / Rata</span>
                  <p className="text-slate-500 dark:text-emerald-300/50 leading-tight mt-0.5">Letakkan smartphone mendatar di lantai, sajadah, atau telapak tangan yang datar. Memegang HP secara miring akan merusak kalibrasi sensor giroskop.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-[10px] font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  3
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-700 dark:text-emerald-200 block">Jauhkan dari Interferensi Magnet</span>
                  <p className="text-slate-500 dark:text-emerald-300/50 leading-tight mt-0.5">Pastikan tidak ada benda logam, kabel listrik, charger, jam tangan pintar, speaker, atau casing HP magnetis karena dapat membelokkan jarum sensor kompas.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-[10px] font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  4
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-700 dark:text-emerald-200 block">Lakukan Kalibrasi Sapuan Angka &ldquo;8&rdquo;</span>
                  <p className="text-slate-500 dark:text-emerald-300/50 leading-tight mt-0.5">Jika kompas mampet atau melantur, pegang HP Anda dan bayangkan melukis pola angka delapan <strong>(8)</strong> di udara 3-4 kali. Ini memicu kalibrasi ulang chip geomagnetik internal HP.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-[10px] font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  5
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-700 dark:text-emerald-200 block">Putar HP Perlahan</span>
                  <p className="text-slate-500 dark:text-emerald-300/50 leading-tight mt-0.5">Putar tubuh Anda bersama HP secara bertahap sampai jarum emas sejajar lurus ke depan. Begitu akurasi menyentuh <strong>90% - 100%</strong>, pertanda letak sajadah terbaik lurus memproyeksikan Ka&apos;bah Masjidil Haram.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Guide */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Panduan Membaca Jarum Kiblat:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Jarum berwarna <span className="font-semibold text-amber-600 dark:text-amber-400">Emas (Kompas Bintang)</span> adalah arah kiblat Anda.</li>
                <li>Posisikan kompas lurus hingga jarum emas sejajar dengan <span className="font-semibold text-rose-600">Utara (U)</span> (untuk kemiringan derajat kiblat Anda yang sebenarnya: <strong>{qiblaAngle}°</strong> dari Utara).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal removed to ensure seamless background experience */}
    </div>
  );
}
