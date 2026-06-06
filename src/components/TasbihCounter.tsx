/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';

interface DzikirPreset {
  id: string;
  arab: string;
  latin: string;
  arti: string;
  target: number;
}

const DZIKIR_LIST: DzikirPreset[] = [
  { id: 'subhanallah', arab: 'سُبْحَانَ اللَّهِ', latin: 'Subhanallah', arti: 'Maha Suci Allah', target: 33 },
  { id: 'alhamdulillah', arab: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillah', arti: 'Segala Puji Bagi Allah', target: 33 },
  { id: 'allahuakbar', arab: 'اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar', arti: 'Allah Maha Besar', target: 33 },
  { id: 'lailahaillallah', arab: 'لَا إِلَٰهَ إِلَّا اللَّهُ', latin: 'Laa Ilaaha Illallah', arti: 'Tiada Tuhan Selain Allah', target: 100 }
];

export default function TasbihCounter() {
  const [activeDzikirId, setActiveDzikirId] = useState<string>('subhanallah');
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    subhanallah: 0,
    alhamdulillah: 0,
    allahuakbar: 0,
    lailahaillallah: 0
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Load numbers from localStorage on start
  useEffect(() => {
    const savedCounts = localStorage.getItem('mbah_yani_tasbih_counts');
    if (savedCounts) {
      try {
        setCounts({ ...counts, ...JSON.parse(savedCounts) });
      } catch (err) {
        console.warn("Could not read tasbih counts from localStorage");
      }
    }
  }, []);

  const activeDzikir = DZIKIR_LIST.find((d) => d.id === activeDzikirId) || DZIKIR_LIST[0];
  const currentCount = counts[activeDzikirId] || 0;

  // Save progress helper
  const updateCountState = (newCount: number) => {
    const updated = { ...counts, [activeDzikirId]: newCount };
    setCounts(updated);
    localStorage.setItem('mbah_yani_tasbih_counts', JSON.stringify(updated));
  };

  const handleIncrement = () => {
    const nextCount = currentCount + 1;
    updateCountState(nextCount);

    // Vibration triggers
    if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      // Short 50ms vibration
      navigator.vibrate(50);
    }

    // Audio click mock
    if (soundEnabled) {
      playClickSound();
    }

    // Target check trigger
    if (nextCount > 0 && nextCount % activeDzikir.target === 0) {
      // Long vibration or double vibration
      if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      triggerSuccessSound();
      showTemporaryToast(`Alhamdulillah, target ${activeDzikir.target}x ${activeDzikir.latin} tercapai!`);
    }
  };

  const handleReset = () => {
    if (confirm(`Apakah Anda yakin ingin menyetel ulang jumlah ${activeDzikir.latin}?`)) {
      updateCountState(0);
      showTemporaryToast(`Jumlah ${activeDzikir.latin} berhasil direset.`);
    }
  };

  const handleResetAll = () => {
    if (confirm("Apakah Anda yakin ingin menyetel ulang SEMUA dzikir tasbih?")) {
      const reset = { subhanallah: 0, alhamdulillah: 0, allahuakbar: 0, lailahaillallah: 0 };
      setCounts(reset);
      localStorage.setItem('mbah_yani_tasbih_counts', JSON.stringify(reset));
      showTemporaryToast("Semua hitungan tasbih berhasil disetel ulang.");
    }
  };

  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // fail silently
    }
  };

  const triggerSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // fail silently
    }
  };

  const showTemporaryToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Calculating progress ring ratio
  const progressRatio = Math.min((currentCount % activeDzikir.target) / activeDzikir.target, 1);
  const strokeDashoffset = 440 - (440 * progressRatio);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Tasbih Header */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
          Dzikir Penyegar Jiwa
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Tasbih Digital
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-sm mx-auto">
          Basahi lidah dengan mengingat Allah di sela kesibukan harian keluarga Mbah Yani. Hitungan tersimpan otomatis.
        </p>
      </div>

      {/* Floating Notifications */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 bg-emerald-800 text-white p-4 rounded-2xl shadow-lg border border-emerald-700 max-w-sm">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-amber-300 mr-2 shrink-0 animate-spin" />
            <span className="text-xs font-bold leading-tight">{notification}</span>
          </div>
        </div>
      )}

      {/* Grid containing Presets and Counter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        
        {/* Left Column: Preset Selectors */}
        <div className="md:col-span-2 space-y-3 bg-white dark:bg-emerald-950/20 p-4 border border-emerald-100 dark:border-emerald-900 rounded-3xl">
          <h3 className="text-xs font-bold text-slate-500 dark:text-emerald-200/50 uppercase tracking-widest pl-1 mb-2">
            Pilihan Bacaan
          </h3>

          <div className="flex flex-col space-y-2">
            {DZIKIR_LIST.map((preset) => {
              const count = counts[preset.id] || 0;
              const isActive = preset.id === activeDzikirId;
              return (
                <button
                  key={preset.id}
                  id={`dzikir-select-${preset.id}`}
                  onClick={() => setActiveDzikirId(preset.id)}
                  className={`w-full p-3 text-left rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/10'
                      : 'bg-slate-50 dark:bg-emerald-900/10 border-emerald-100/40 dark:border-emerald-900/10 text-slate-700 dark:text-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm tracking-wide">{preset.latin}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 dark:bg-emerald-800 text-slate-500 dark:text-emerald-300'
                    }`}>
                      {count}x
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className={`text-xs ${isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-emerald-300/40'}`}>
                      {preset.arti}
                    </span>
                    <span className={`text-xs font-serif font-semibold ${isActive ? 'text-amber-200' : 'text-emerald-800/80'}`}>
                      {preset.arab}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900 flex justify-between items-center text-xs text-slate-400 dark:text-emerald-300/40 px-1">
            <span>Target Putaran:</span>
            <span className="font-bold text-slate-600 dark:text-emerald-200">{activeDzikir.target}x repetisi</span>
          </div>
        </div>

        {/* Right Column: Dynamic Counter Disc */}
        <div className="md:col-span-3 bg-white dark:bg-emerald-950/20 p-6 border border-emerald-100 dark:border-emerald-900 rounded-3xl flex flex-col items-center justify-between shadow-sm">
          
          {/* Settings switch buttons */}
          <div className="flex justify-end w-full space-x-2">
            <button
              id="tasbih-sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-colors cursor-pointer ${
                soundEnabled
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 text-slate-400'
              }`}
              title="Suara Ketukan"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              id="tasbih-vibrate-toggle"
              onClick={() => setVibrateEnabled(!vibrateEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-colors cursor-pointer ${
                vibrateEnabled
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 text-slate-400'
              }`}
              title="Getaran HP"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Large circular disk count button */}
          <div className="my-6 relative flex flex-col items-center select-none">
            {/* Visual Ring Indicator */}
            <svg className="w-60 h-60 transform -rotate-90">
              <circle
                cx="120"
                cy="120"
                r="100"
                className="stroke-slate-150 dark:stroke-emerald-900/30 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="120"
                cy="120"
                r="100"
                className="stroke-emerald-600 dark:stroke-emerald-400 fill-none transition-all duration-300"
                strokeWidth="10"
                strokeDasharray="628" /* 2 * PI * 100 */
                strokeDashoffset={628 - (628 * progressRatio)}
                strokeLinecap="round"
              />
            </svg>

            {/* Tap Container inside the SVG */}
            <button
              id="tasbih-tap-button"
              onClick={handleIncrement}
              className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/50 dark:to-emerald-950 border border-emerald-100 dark:border-emerald-900 shadow-lg active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer group"
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 -mt-1 block">
                {activeDzikir.latin}
              </span>
              <span className="text-4xl font-extrabold text-slate-800 dark:text-emerald-50 font-mono tracking-tight my-1">
                {currentCount}
              </span>
              <span className="text-xs text-slate-400 dark:text-emerald-300/40 font-serif font-semibold">
                {activeDzikir.arab}
              </span>
              <span className="absolute bottom-4 text-[9px] font-bold text-slate-350 dark:text-emerald-500/50 uppercase tracing-widest">
                KETUK DISINI
              </span>
            </button>
          </div>

          {/* Lower Actions (Reset & Preset status) */}
          <div className="flex justify-between items-center w-full border-t border-emerald-150/40 dark:border-emerald-900/40 pt-4 mt-2">
            <button
              id="tasbih-reset-preset"
              onClick={handleReset}
              className="inline-flex items-center px-3.5 py-2 bg-slate-50 dark:bg-emerald-900/10 hover:bg-slate-100 border border-slate-200 dark:border-emerald-900/40 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-200 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Hitungan
            </button>

            <button
              id="tasbih-reset-all"
              onClick={handleResetAll}
              className="text-xs text-slate-400 hover:text-rose-500 font-semibold cursor-pointer transition-colors"
            >
              Setel Ulang Semua Preset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
