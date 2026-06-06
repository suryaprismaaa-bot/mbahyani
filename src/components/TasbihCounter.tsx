/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, Sparkles, AlertCircle, Smartphone, SmartphoneNfc, BadgeHelp } from 'lucide-react';

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

  // Customized target state
  const [customTargets, setCustomTargets] = useState<{ [key: string]: number }>({
    subhanallah: 33,
    alhamdulillah: 33,
    allahuakbar: 33,
    lailahaillallah: 100
  });

  // Modal confirm handlers instead of browser confirm
  const [confirmResetActive, setConfirmResetActive] = useState<boolean>(false);
  const [confirmResetAll, setConfirmResetAll] = useState<boolean>(false);

  // Load numbers and custom targets from localStorage on start
  useEffect(() => {
    const savedCounts = localStorage.getItem('mbah_yani_tasbih_counts');
    if (savedCounts) {
      try {
        setCounts((prev) => ({ ...prev, ...JSON.parse(savedCounts) }));
      } catch (err) {
        console.warn("Could not read tasbih counts from localStorage");
      }
    }

    const savedTargets = localStorage.getItem('mbah_yani_tasbih_targets');
    if (savedTargets) {
      try {
        setCustomTargets((prev) => ({ ...prev, ...JSON.parse(savedTargets) }));
      } catch (err) {
        console.warn("Could not read tasbih targets from localStorage");
      }
    }
  }, []);

  const activeDzikir = DZIKIR_LIST.find((d) => d.id === activeDzikirId) || DZIKIR_LIST[0];
  const currentCount = counts[activeDzikirId] || 0;
  const activeTarget = customTargets[activeDzikirId] || activeDzikir.target;

  // Save progress helper
  const updateCountState = (newCount: number) => {
    const updated = { ...counts, [activeDzikirId]: newCount };
    setCounts(updated);
    localStorage.setItem('mbah_yani_tasbih_counts', JSON.stringify(updated));
  };

  const changeTarget = (presetId: string, newTarget: number) => {
    if (newTarget < 1) newTarget = 1;
    if (newTarget > 100000) newTarget = 100000;
    const updated = { ...customTargets, [presetId]: newTarget };
    setCustomTargets(updated);
    localStorage.setItem('mbah_yani_tasbih_targets', JSON.stringify(updated));
    showTemporaryToast(`Target ${activeDzikir.latin} diubah menjadi ${newTarget}x.`);
  };

  const handleIncrement = () => {
    const nextCount = currentCount + 1;
    updateCountState(nextCount);

    // Vibration triggers
    if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(45);
      } catch (e) {
        // fail silently for security/sandboxing checks
      }
    }

    // Audio click mock
    if (soundEnabled) {
      playClickSound();
    }

    // Target check trigger
    if (nextCount > 0 && nextCount % activeTarget === 0) {
      if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([120, 60, 120]);
        } catch (e) {}
      }
      triggerSuccessSound();
      showTemporaryToast(`Alhamdulillah, target ${activeTarget}x ${activeDzikir.latin} tercapai!`);
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
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
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
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12); // G5
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // fail silently
    }
  };

  const showTemporaryToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Counting dynamic rotation angle of the prayer chain. We do 33 beads.
  const NUM_BEADS = 33;
  // Rotate smoothly on each count. An entire 360-rotation happens every 33 counts.
  const angleOfEachBead = 360 / NUM_BEADS;
  const tasbihRotationAngle = currentCount * angleOfEachBead;

  // Calculating progress ring ratio
  const progressRatio = Math.min((currentCount % activeTarget) / activeTarget, 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative">
      {/* Tasbih Header */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
          ✨ Dzikir Penyegar Qolbu
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Tasbih Digital
        </h1>
        <p className="text-slate-600 dark:text-emerald-250 mt-2 text-sm max-w-md mx-auto leading-relaxed">
          Basahi lidah dengan mengingat Allah di sela kesibukan harian keluarga Mbah Yani. Hitungan tersimpan otomatis di perangkat Anda.
        </p>
      </div>

      {/* Floating Notifications */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 bg-emerald-850 text-white py-3.5 px-5 rounded-2xl shadow-xl border border-emerald-700/80 max-w-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-pulse" />
            <span className="text-xs font-bold leading-snug">{notification}</span>
          </div>
        </div>
      )}

      {/* Grid containing Presets and Counter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        
        {/* Left Column: Preset Selectors */}
        <div className="md:col-span-2 space-y-4 bg-white dark:bg-emerald-950/20 p-5 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-400 dark:text-emerald-300/50 uppercase tracking-widest pl-1 mb-3 flex items-center gap-1">
              📝 Pilihan Bacaan
            </h3>

            <div className="flex flex-col space-y-2">
              {DZIKIR_LIST.map((preset) => {
                const count = counts[preset.id] || 0;
                const isActive = preset.id === activeDzikirId;
                const targetVal = customTargets[preset.id] || preset.target;
                return (
                  <button
                    key={preset.id}
                    id={`dzikir-select-${preset.id}`}
                    onClick={() => {
                      setActiveDzikirId(preset.id);
                      setConfirmResetActive(false);
                    }}
                    className={`w-full p-3.5 text-left rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/10'
                        : 'bg-slate-50 dark:bg-emerald-950/10 border-emerald-100/30 dark:border-emerald-900/10 text-slate-700 dark:text-emerald-200 hover:bg-emerald-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-sm tracking-wide">{preset.latin}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 dark:bg-emerald-800 text-slate-500 dark:text-emerald-300'
                      }`}>
                        {count}x
                      </span>
                    </div>
                    <div className="flex justify-between items-end gap-1">
                      <span className={`text-xs ${isActive ? 'text-emerald-100/90' : 'text-slate-400 dark:text-emerald-300/40'}`}>
                        {preset.arti}
                      </span>
                      <span className={`text-xs font-serif font-bold tracking-wide ${isActive ? 'text-amber-200' : 'text-emerald-800/80 dark:text-emerald-400/80'}`}>
                        {preset.arab}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-100 dark:border-emerald-900/40 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 dark:text-emerald-300/40 px-1">
              <span>Target Saat Ini:</span>
              <span className="font-bold text-slate-700 dark:text-emerald-350">{activeTarget}x Dzikir</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 dark:text-emerald-300/40 px-1">
              <span>Total Semua Dzikir:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {Object.keys(counts).reduce((sum, key) => sum + (counts[key] || 0), 0)}x
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Counter Disc & Customized Reminders */}
        <div className="md:col-span-3 bg-white dark:bg-emerald-950/20 p-6 border border-emerald-105 dark:border-emerald-900/50 rounded-3xl flex flex-col items-center justify-between shadow-sm relative overflow-hidden min-h-[500px]">
          
          {/* Confirms In-place Overlay cards */}
          {confirmResetActive && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 rounded-3xl p-6 flex flex-col items-center justify-center text-center z-30 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-805 dark:text-emerald-100 mb-1">
                Reset Hitungan {activeDzikir.latin}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/60 max-w-xs mb-6">
                Rincian dzikir saat ini ({currentCount}x) akan kembali ke angka nol. Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={() => {
                    updateCountState(0);
                    setConfirmResetActive(false);
                    showTemporaryToast(`Jumlah ${activeDzikir.latin} berhasil direset.`);
                  }}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Ya, Reset
                </button>
                <button
                  onClick={() => setConfirmResetActive(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-705 dark:text-emerald-100 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {confirmResetAll && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 rounded-3xl p-6 flex flex-col items-center justify-center text-center z-30 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-805 dark:text-emerald-100 mb-1">
                Reset Seluruh Preset Dzikir?
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/60 max-w-xs mb-6">
                Hitunan seluruh bacaan tasbih ({DZIKIR_LIST.map(d => d.latin).join(', ')}) akan dibersihkan kembali ke angka nol sekaligus.
              </p>
              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={() => {
                    const reset = { subhanallah: 0, alhamdulillah: 0, allahuakbar: 0, lailahaillallah: 0 };
                    setCounts(reset);
                    localStorage.setItem('mbah_yani_tasbih_counts', JSON.stringify(reset));
                    setConfirmResetAll(false);
                    showTemporaryToast("Semua hitungan tasbih berhasil disetel ulang.");
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors shadow-sm"
                >
                  Ya, Reset Semua
                </button>
                <button
                  onClick={() => setConfirmResetAll(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 text-slate-750 dark:text-emerald-100 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Top Control Bar: Targets Choice */}
          <div className="w-full">
            
            {/* Targets pills selectors */}
            <div className="mb-4">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-emerald-450 pl-0.5 mb-2.5 text-center md:text-left">
                🎯 Atur Target Hitungan ({activeDzikir.latin})
              </span>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                {[33, 99, 100, 1000].map((t) => (
                  <button
                    key={t}
                    id={`target-pill-${t}`}
                    onClick={() => changeTarget(activeDzikirId, t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all border ${
                      activeTarget === t
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-600 dark:text-emerald-250 border-slate-200/50 dark:border-emerald-900/30'
                    }`}
                  >
                    {t}x
                  </button>
                ))}
                
                {/* Custom Target input widget details */}
                <div className="flex items-center pl-2.5 pr-1 py-0.5 border border-slate-200/50 dark:border-emerald-905/30 rounded-xl bg-slate-50 dark:bg-slate-800/10 h-7.5">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-emerald-400 uppercase tracking-widest mr-1">Kustom:</span>
                  <input
                    type="number"
                    min="1"
                    max="99999"
                    value={activeTarget}
                    onChange={(e) => changeTarget(activeDzikirId, parseInt(e.target.value) || 33)}
                    className="w-11 text-center text-xs font-bold bg-transparent text-slate-700 dark:text-emerald-100 outline-none p-0 border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="33"
                  />
                </div>
              </div>
            </div>

            {/* Notification/Sensory controls */}
            <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-emerald-900/30 py-2.5">
              <span className="text-[10px] uppercase font-extrabold text-slate-450 dark:text-emerald-450 tracking-widest pl-0.5">
                🔔 Opsi Pengingat Target
              </span>
              <div className="flex items-center space-x-2">
                <button
                  id="tasbih-sound-toggle"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-colors cursor-pointer ${
                    soundEnabled
                      ? 'border-emerald-100/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:border-emerald-800/20'
                      : 'border-slate-205 dark:border-emerald-950/40 text-slate-400'
                  }`}
                  title={soundEnabled ? "Suara Ketukan Aktif" : "Suara Ketukan Mati"}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${soundEnabled ? 'scale-110' : 'opacity-60'}`} />
                  <span className="ml-1 text-[10px] font-bold">{soundEnabled ? 'Suara' : 'Mute'}</span>
                </button>
                <button
                  id="tasbih-vibrate-toggle"
                  onClick={() => setVibrateEnabled(!vibrateEnabled)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-colors cursor-pointer ${
                    vibrateEnabled
                      ? 'border-emerald-100/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:border-emerald-800/20'
                      : 'border-slate-205 dark:border-emerald-950/40 text-slate-400'
                  }`}
                  title={vibrateEnabled ? "Getar HP Aktif" : "Getar HP Mati"}
                >
                  <Smartphone className={`w-3.5 h-3.5 ${vibrateEnabled ? 'scale-110' : 'opacity-60'}`} />
                  <span className="ml-1 text-[10px] font-bold">{vibrateEnabled ? 'Getar' : 'Off'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* LARGE INTERACTIVE BEAD STRING AND TAP CONTAINER */}
          <div className="my-5 relative flex flex-col items-center justify-center select-none w-64 h-64 overflow-visible">
            
            {/* Elegant, clean circular progress ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <svg viewBox="0 0 256 256" className="w-60 h-60 overflow-visible selection:bg-transparent">
                {/* Outer ring track */}
                <circle
                  cx="128"
                  cy="128"
                  r="92"
                  className="fill-none stroke-slate-100 dark:stroke-emerald-950/40"
                  strokeWidth="8"
                />
                
                {/* Active progress segment (Circumference = 2 * PI * 92 ≈ 578) */}
                <circle
                  cx="128"
                  cy="128"
                  r="92"
                  className="fill-none stroke-sky-400 dark:stroke-emerald-400 transition-all duration-300"
                  strokeWidth="8"
                  strokeDasharray={`${progressRatio * 578} 578`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 128 128)" // Start progress from top (12 o'clock)
                />

                {/* Sparkling decorative dots at milestones */}
                <circle cx="128" cy="36" r="3" fill="#fbbf24" className="animate-pulse" />
              </svg>
            </div>

            {/* Tap Button inside the Ring */}
            <button
              id="tasbih-tap-button"
              onClick={handleIncrement}
              className="absolute w-38 h-38 rounded-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-emerald-905 shadow-md hover:shadow-lg active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer group z-10"
              title="Ketuk untuk berdzikir"
            >
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-sky-600 dark:text-emerald-400 mb-1 max-w-[110px] truncate block">
                {activeDzikir.latin}
              </span>
              <span className="text-4xl font-extrabold text-slate-800 dark:text-emerald-50 font-mono tracking-tight my-0.5">
                {currentCount}
              </span>
              <span className="text-xs text-slate-400 dark:text-emerald-305 font-serif font-bold max-w-[110px] truncate block">
                {activeDzikir.arab}
              </span>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 animate-ping" />
            </button>
          </div>

          {/* DYNAMIC SENSORY REMINDER BANNER - Real-time state indicator requested */}
          <div className="w-full max-w-sm px-4 py-2 mt-1 mb-2 bg-gradient-to-r from-emerald-550/5 to-amber-550/5 dark:from-emerald-900/10 dark:to-amber-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-emerald-300/80">
            {vibrateEnabled || soundEnabled ? (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                <span>Pengingat Target ({activeTarget}x):</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-350">
                  {soundEnabled && vibrateEnabled 
                    ? "Suara Nada 🔊 + Getar HP 📳 " 
                    : soundEnabled 
                      ? "Suara Nada 🔊 (Tanpa Getar)" 
                      : "Getar HP 📳 (Mute)"
                  } Aktif 
                </span>
              </span>
            ) : (
              <span className="text-slate-400 font-medium">
                🔇 Semua Pengingat Nonaktif (Hanya Kedipan Visual)
              </span>
            )}
          </div>

          {/* Lower Actions (Reset & Preset status) */}
          <div className="flex justify-between items-center w-full border-t border-slate-100 dark:border-emerald-900/40 pt-4 mt-3">
            <button
              id="tasbih-reset-preset"
              onClick={() => {
                setConfirmResetAll(false);
                setConfirmResetActive(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-slate-50 dark:bg-emerald-900/10 hover:bg-slate-100/80 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-emerald-900/40 rounded-xl text-xs font-bold text-slate-650 dark:text-emerald-250 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Hitungan
            </button>

            <button
              id="tasbih-reset-all"
              onClick={() => {
                setConfirmResetActive(false);
                setConfirmResetAll(true);
              }}
              className="text-xs text-slate-400 hover:text-rose-500 dark:text-emerald-500/60 dark:hover:text-rose-450 font-bold cursor-pointer transition-colors"
            >
              Setel Ulang Semua Preset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
