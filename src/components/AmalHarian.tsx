/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Award, Sparkles, BookOpen, User, Flame, Calendar, Trash2 } from 'lucide-react';
import { WorshipTrack } from '../types';

const INITIAL_TRACK: WorshipTrack = {
  subuh: false,
  dzuhur: false,
  ashar: false,
  maghrib: false,
  isya: false,
  dhuha: false,
  tahajjud: false,
  tilawahPages: 0,
  sedekah: false,
  dzikirPagi: false,
  dzikirPetang: false
};

export default function AmalHarian() {
  const [userName, setUserName] = useState<string>("Anggota Keluarga");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [track, setTrack] = useState<WorshipTrack>(INITIAL_TRACK);
  const [streak, setStreak] = useState<number>(0);
  const [hasCompletedToday, setHasCompletedToday] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('mbah_yani_amal_name');
    if (savedName) {
      setUserName(savedName);
    }

    const savedTrack = localStorage.getItem('mbah_yani_amal_track');
    const savedDate = localStorage.getItem('mbah_yani_amal_date');
    const todayStr = new Date().toDateString();

    if (savedTrack && savedDate === todayStr) {
      try {
        setTrack(JSON.parse(savedTrack));
      } catch (e) {
        console.warn("Could not load amal harian tracker", e);
      }
    }

    const savedStreak = localStorage.getItem('mbah_yani_amal_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  const saveTrack = (newTrack: WorshipTrack) => {
    setTrack(newTrack);
    localStorage.setItem('mbah_yani_amal_track', JSON.stringify(newTrack));
    localStorage.setItem('mbah_yani_amal_date', new Date().toDateString());

    // Compute progress completion
    const score = calculateScore(newTrack);
    if (score === 100 && !hasCompletedToday) {
      setHasCompletedToday(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('mbah_yani_amal_streak', newStreak.toString());
    } else if (score < 100 && hasCompletedToday) {
      setHasCompletedToday(false);
      const newStreak = Math.max(0, streak - 1);
      setStreak(newStreak);
      localStorage.setItem('mbah_yani_amal_streak', newStreak.toString());
    }
  };

  const handleToggle = (key: keyof WorshipTrack) => {
    if (key === 'tilawahPages') return; // Handled separately
    const updated = {
      ...track,
      [key]: !track[key]
    };
    saveTrack(updated);
  };

  const handleChangeTilawah = (amount: number) => {
    const updated = {
      ...track,
      tilawahPages: Math.max(0, track.tilawahPages + amount)
    };
    saveTrack(updated);
  };

  const calculateScore = (t: WorshipTrack) => {
    // 10 key elements (including reading at least 2 pages of Quran = 1 point)
    let score = 0;
    if (t.subuh) score += 10;
    if (t.dzuhur) score += 10;
    if (t.ashar) score += 10;
    if (t.maghrib) score += 10;
    if (t.isya) score += 10;
    if (t.dhuha) score += 10;
    if (t.tahajjud) score += 10;
    if (t.sedekah) score += 10;
    if (t.dzikirPagi) score += 10;
    if (t.dzikirPetang) score += 10;

    // Tilawah multiplier (max 10 points)
    if (t.tilawahPages >= 1) score += 10;

    // Total score scale to 100 maximum
    const normalized = Math.min((score / 110) * 100, 100);
    return Math.round(normalized);
  };

  const currentScore = calculateScore(track);

  const handleSaveName = () => {
    localStorage.setItem('mbah_yani_amal_name', userName);
    setIsEditingName(false);
  };

  const handleResetAmal = () => {
    if (confirm("Reset seluruh ceklis ibadah Anda hari ini kembali ke awal?")) {
      saveTrack(INITIAL_TRACK);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
          Evaluasi Amal Sholeh Harian
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Jurnal Ibadah Keluarga Mbah Yani
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-sm mx-auto">
          Memonitor amalan sehari-hari secara disiplin guna membangun kebiasaan mulia yang langgeng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: User Personalization & Progress Score */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900 p-6 shadow-sm">
            {/* Name editor tab */}
            <div className="flex items-center space-x-3 mb-6 bg-slate-50 dark:bg-emerald-900/10 p-3 rounded-2xl border border-slate-100 dark:border-emerald-900">
              <div className="bg-emerald-600 text-white p-2 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div className="grow">
                {isEditingName ? (
                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-xs font-bold border-b border-emerald-500 bg-transparent text-slate-700 dark:text-emerald-105 focus:outline-none focus:ring-0 grow"
                      placeholder="Masukkan nama"
                      maxLength={18}
                    />
                    <button
                      id="save-amal-name"
                      onClick={handleSaveName}
                      className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Jurnal Milik</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-emerald-100">{userName}</span>
                    </div>
                    <button
                      id="edit-amal-name-trigger"
                      onClick={() => setIsEditingName(true)}
                      className="text-[10px] text-emerald-600 font-semibold underline"
                    >
                      Ubah Nama
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Completion metrics wheel */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Score Indicator Track */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    className="stroke-slate-100 dark:stroke-emerald-900/30 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    className="stroke-emerald-600 dark:stroke-emerald-400 fill-none transition-all duration-500"
                    strokeWidth="10"
                    strokeDasharray="408" /* 2 * PI * 65 */
                    strokeDashoffset={408 - (408 * (currentScore / 100))}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Score badge at center */}
                <div className="absolute inset-5 rounded-full flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">SKOR AMAL</span>
                  <span className="text-4xl font-extrabold text-slate-800 dark:text-emerald-50 font-mono">
                    {currentScore}%
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Hari Ini
                  </span>
                </div>
              </div>

              {/* Progress message alerts */}
              <div className="mt-4 text-center">
                {currentScore === 100 ? (
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center animate-bounce">
                    <Award className="w-4 h-4 mr-1 fill-current" />
                    Masyallah! Target Amal 100% Tercapai!
                  </p>
                ) : currentScore >= 70 ? (
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Sangat Bagus! Sedikit lagi menuju mutlak berkah.
                  </p>
                ) : currentScore >= 40 ? (
                  <p className="text-xs text-teal-600 dark:text-teal-400">
                    Bagus! Teruskan mengisi sisa waktu dengan amalan utama.
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Mari isi hari Anda dengan beribadah kepada Allah.
                  </p>
                )}
              </div>
            </div>

            {/* Streak Tracker info */}
            <div className="border-t border-slate-100 dark:border-emerald-900/40 pt-4 flex justify-between items-center text-xs">
              <div className="flex items-center text-amber-500 font-bold">
                <Flame className="w-4 h-4 mr-1.5 fill-current animate-pulse" />
                <span>Istiqomah Streak:</span>
              </div>
              <span className="font-mono text-base font-bold text-slate-800 dark:text-emerald-50 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-lg border border-amber-100">
                {streak} Hari Ke-100%
              </span>
            </div>

          </div>

          {/* Guidelines info */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300">
            <h4 className="font-bold flex items-center mb-1">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 mr-1.5 animate-spin" />
              Saling Berlomba dalam Kebaikan (Fastabiqul Khairat):
            </h4>
            <p className="leading-relaxed text-slate-650 dark:text-emerald-200/80">
              Isi ceklis harian setelah menyelesaikan setiap ibadah Anda. Jadikan ini sarana introspeksi diri (muhasabah) agar ibadah keturunan Keluarga Besar Mbah Yani terus istiqomah tiap harinya.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Checklists Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-emerald-100/30 pb-3">
            <h3 className="font-bold text-base text-slate-800 dark:text-emerald-100 flex items-center">
              <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
              Ceklis Amal Shalih
            </h3>
            <button
              id="reset-amal-today"
              onClick={handleResetAmal}
              className="inline-flex items-center text-[10px] font-bold text-slate-450 hover:text-rose-500 uppercase cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Reset Ceklis
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sholat Fardhu Presets */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sholat Fardhu lima waktu</h4>
            </div>

            <button
              id="check-subuh"
              onClick={() => handleToggle('subuh')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.subuh
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.subuh ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sholat Subuh Berjamaat</span>
            </button>

            <button
              id="check-dzuhur"
              onClick={() => handleToggle('dzuhur')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.dzuhur
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.dzuhur ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sholat Dzuhur Berjamaat</span>
            </button>

            <button
              id="check-ashar"
              onClick={() => handleToggle('ashar')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.ashar
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.ashar ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sholat Ashar Berjamaat</span>
            </button>

            <button
              id="check-maghrib"
              onClick={() => handleToggle('maghrib')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.maghrib
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.maghrib ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sholat Maghrib Musala</span>
            </button>

            <button
              id="check-isya"
              onClick={() => handleToggle('isya')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.isya
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.isya ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sholat Isya Berjamaah</span>
            </button>

            {/* Sunnah & Other Virtuous presets list */}
            <div className="space-y-2 col-span-1 sm:col-span-2 mt-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Ibadah Sunnah & Amal Sosial</h4>
            </div>

            <button
              id="check-dhuha"
              onClick={() => handleToggle('dhuha')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.dhuha
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.dhuha ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sholat Sunnah Dhuha</span>
            </button>

            <button
              id="check-tahajjud"
              onClick={() => handleToggle('tahajjud')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.tahajjud
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.tahajjud ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sholat Malam / Qiyamul Lail</span>
            </button>

            <button
              id="check-pagi"
              onClick={() => handleToggle('dzikirPagi')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.dzikirPagi
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.dzikirPagi ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Membaca Dzikir Pagi</span>
            </button>

            <button
              id="check-petang"
              onClick={() => handleToggle('dzikirPetang')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.dzikirPetang
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.dzikirPetang ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Membaca Dzikir Petang</span>
            </button>

            <button
              id="check-sedekah"
              onClick={() => handleToggle('sedekah')}
              className={`flex items-center p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                track.sedekah
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 border-emerald-500/40'
                  : 'bg-transparent border-slate-100 dark:border-emerald-900/30 text-slate-500 dark:text-emerald-300'
              }`}
            >
              {track.sedekah ? <CheckSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0" /> : <Square className="w-5 h-5 text-slate-350 mr-3 shrink-0" />}
              <span className="font-semibold text-xs py-0.5">Sedekah / Beramal Sosial</span>
            </button>

            {/* Custom tilawah pages editor block */}
            <div className="p-3.5 bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900 rounded-2xl flex items-center justify-between col-span-1 sm:col-span-2">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-emerald-600 mr-3 shrink-0 animate-pulse" />
                <div>
                  <h5 className="text-[12px] font-bold text-slate-700 dark:text-emerald-100 leading-tight">Tilawah Al-Qur&apos;an</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Jumlah halaman terbaca hari ini</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-white dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl px-2.5 py-1">
                <button
                  id="tilawah-decrement"
                  onClick={() => handleChangeTilawah(-1)}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-emerald-100 w-6 text-center">
                  {track.tilawahPages}
                </span>
                <button
                  id="tilawah-increment"
                  onClick={() => handleChangeTilawah(1)}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
