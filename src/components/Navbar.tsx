/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, Compass, BookOpen, HeartHandshake, Calendar, Sparkles, BookHeart, ChevronDown, Tv, GraduationCap, CheckSquare, BookMarked, Scale, MapPin, History } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryItems = [
    { id: 'home', label: 'Beranda', icon: Sparkles },
    { id: 'quran', label: 'Al-Qur\'an Digital', icon: BookOpen },
    { id: 'jadwal', label: 'Jadwal Sholat', icon: Calendar }
  ] as const;

  const dropdownItems = [
    { id: 'qibla', label: 'Arah Kiblat', desc: 'Kompas arah sholat presisi', icon: Compass, group: 'Ibadah Harian' },
    { id: 'tasbih', label: 'Tasbih Digital', desc: 'Penghitung dzikir harian', icon: HeartHandshake, group: 'Ibadah Harian' },
    { id: 'masjid', label: 'Masjid Terdekat', desc: 'Cari masjid terdekat via GPS', icon: MapPin, group: 'Ibadah Harian' },
    { id: 'tilawati', label: 'Belajar Tilawati', desc: 'Pembelajaran mengaji anak-anak', icon: GraduationCap, group: "Belajar & Qur'an" },
    { id: 'tajwid', label: 'Belajar Tajwid', desc: 'Panduan hukum membaca fashih', icon: BookMarked, group: "Belajar & Qur'an" },
    { id: 'hadith', label: 'Kumpulan Hadits', desc: 'Hadits Shahih sunnah Rasulullah', icon: BookOpen, group: 'Khazanah & Syiar' },
    { id: 'doa', label: 'Doa Harian', desc: 'Kumpulan doa pilihan islami', icon: BookHeart, group: 'Khazanah & Syiar' },
    { id: 'asmaul', label: 'Asmaul Husna', desc: '99 nama Allah luar biasa', icon: Sparkles, group: 'Khazanah & Syiar' },
    { id: 'makkah', label: 'Live Makkah', desc: 'Streaming Masjidil Haram realtime', icon: Tv, group: 'Khazanah & Syiar' },
    { id: 'zakat', label: 'Kalkulator Zakat', desc: 'Hitung zakat emas/mal realtime', icon: Scale, group: 'Khazanah & Syiar' },
    { id: 'hijriah', label: 'Bulan Hijriah', desc: 'Nama bulan & peristiwa sejarah', icon: History, group: 'Khazanah & Syiar' }
  ] as const;

  const categorizedDropdown = [
    {
      groupName: '🕌 Ibadah Harian',
      items: [
        { id: 'qibla', label: 'Arah Kiblat', desc: 'Kompas arah sholat presisi', icon: Compass },
        { id: 'tasbih', label: 'Tasbih Digital', desc: 'Penghitung dzikir harian', icon: HeartHandshake },
        { id: 'masjid', label: 'Masjid Terdekat', desc: 'Cari masjid terdekat via GPS', icon: MapPin }
      ]
    },
    {
      groupName: "📖 Belajar & Qur'an",
      items: [
        { id: 'tilawati', label: 'Belajar Tilawati', desc: 'Pembelajaran mengaji anak-anak', icon: GraduationCap },
        { id: 'tajwid', label: 'Belajar Tajwid', desc: 'Panduan hukum membaca fashih', icon: BookMarked }
      ]
    },
    {
      groupName: '✨ Khazanah & Syiar',
      items: [
        { id: 'hadith', label: 'Kumpulan Hadits', desc: 'Hadits Shahih sunnah Rasulullah', icon: BookOpen },
        { id: 'doa', label: 'Doa Harian', desc: 'Kumpulan doa pilihan islami', icon: BookHeart },
        { id: 'asmaul', label: 'Asmaul Husna', desc: '99 nama Allah luar biasa', icon: Sparkles },
        { id: 'makkah', label: 'Live Makkah', desc: 'Streaming Masjidil Haram realtime', icon: Tv },
        { id: 'zakat', label: 'Kalkulator Zakat', desc: 'Hitung zakat emas/mal realtime', icon: Scale },
        { id: 'hijriah', label: 'Bulan Hijriah', desc: 'Nama bulan & peristiwa sejarah', icon: History }
      ]
    }
  ] as const;

  const isDropdownActive = dropdownItems.some(item => item.id === activeTab);

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const [openMobileGroups, setOpenMobileGroups] = useState<Record<string, boolean>>({
    '🕌 Ibadah Harian': true,
    "📖 Belajar & Qur'an": false,
    '✨ Khazanah & Syiar': false,
  });

  const toggleMobileGroup = (groupName: string) => {
    setOpenMobileGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Auto-expand group of active tab when mobile menu opens
  useEffect(() => {
    if (isOpen) {
      const activeGroup = categorizedDropdown.find(cat => 
        cat.items.some(item => item.id === activeTab)
      );
      if (activeGroup) {
        setOpenMobileGroups(prev => ({
          ...prev,
          [activeGroup.groupName]: true
        }));
      }
    }
  }, [isOpen, activeTab]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-transparent transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              id="brand-logo"
              className="flex items-center space-x-2.5 text-left focus:outline-none cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-700 rounded-xl flex items-center justify-center shadow-emerald-250 dark:shadow-blue-950/45 shadow-md text-white transition-transform group-hover:scale-105">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="block font-sans font-black text-lg text-slate-950 dark:text-emerald-100 tracking-tight leading-tight">
                  Portal Islami
                </span>
                <span className="block font-sans font-extrabold text-[12px] text-slate-900 dark:text-emerald-200 tracking-tight leading-normal mt-0.5">
                  Keluarga Mbah Yani
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {/* Primary Nav Items */}
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-black transition-all duration-200 cursor-pointer glow-on-click ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-700 to-blue-700 text-white shadow-md scale-102 font-black border border-emerald-800'
                      : 'text-slate-950 dark:text-emerald-100 hover:bg-emerald-100/90 dark:hover:bg-blue-950/40 hover:text-emerald-950 dark:hover:text-white border-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5 shrink-0" />
                  {item.label}
                </button>
              );
            })}

            {/* Premium Dropdown for Extra Features */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="desktop-dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-black transition-all duration-200 cursor-pointer ${
                  isDropdownActive
                    ? 'bg-slate-950 text-white border-2 border-slate-950 dark:bg-emerald-950 dark:border-emerald-850'
                    : 'text-slate-950 dark:text-emerald-100 hover:bg-emerald-100/90 dark:hover:bg-blue-950/45 hover:text-emerald-950 dark:hover:text-white border-2 border-transparent'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-550 dark:text-amber-350 animate-pulse shrink-0" />
                <span>Kajian & Ibadah</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1.5 transition-transform duration-205 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Luxurious Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-950 dark:border-blue-900/40 shadow-2xl p-3.5 z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-3 max-h-[85vh] overflow-y-auto scrollbar-none">
                  <div className="px-2 pb-2 mr-1 mb-2.5 text-xs font-black uppercase tracking-widest text-slate-950 border-b-2 border-slate-950 dark:text-emerald-400 dark:border-slate-800/60 pb-1 mt-0.5">
                    Kategori Layanan & Amalan
                  </div>
                  <div className="space-y-4">
                    {categorizedDropdown.map((cat, catIdx) => (
                      <div key={catIdx} className="space-y-1">
                        <div className="px-2 text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-emerald-400/70 flex items-center gap-1.5 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                          {cat.groupName}
                        </div>
                        <div className="grid gap-1">
                          {cat.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                id={`nav-dropdown-${item.id}`}
                                onClick={() => handleNavClick(item.id)}
                                className={`flex items-center gap-3 w-full text-left p-2.5 rounded-xl transition-all duration-150 cursor-pointer hover:bg-emerald-100/90 dark:hover:bg-blue-950/30 group glow-on-click ${
                                  isActive
                                    ? 'bg-slate-950 text-white border-2 border-slate-950 dark:bg-emerald-950 dark:border-emerald-800 shadow-[0_0_12px_rgba(0,0,0,0.15)] scale-101'
                                    : 'text-slate-950 dark:text-emerald-250 border border-transparent'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                                  isActive 
                                    ? 'bg-white text-slate-950 shadow-sm' 
                                    : 'bg-emerald-100/90 dark:bg-blue-950/35 text-slate-950 dark:text-emerald-450 group-hover:bg-slate-950 group-hover:text-white'
                                }`}>
                                  <Icon className="w-3.5 h-3.5 font-bold" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className={`block text-xs font-black ${isActive ? 'text-white' : 'text-slate-950 dark:text-emerald-200'}`}>
                                    {item.label}
                                  </span>
                                  <span className={`block text-[10px] font-bold truncate ${isActive ? 'text-slate-200/90 dark:text-emerald-400/50' : 'text-slate-800 dark:text-emerald-400'}`}>
                                    {item.desc}
                                  </span>
                                </div>
                                {isActive && (
                                  <div className="w-2 h-2 rounded-full bg-amber-450 dark:bg-amber-350 animate-pulse mr-1 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile menu button and navigations */}
          <div className="flex items-center space-x-2 md:hidden">
            <div className="relative">
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-all duration-300 select-none ${
                  isOpen
                    ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 dark:border-emerald-700 text-white shadow-md'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border-amber-400 dark:border-amber-500 text-slate-950 font-black animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.7)] hover:shadow-lg active:scale-95'
                }`}
                aria-label="Open menu"
              >
                {isOpen ? (
                  <>
                    <X className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px] font-black tracking-wider uppercase text-white font-sans">Tutup</span>
                  </>
                ) : (
                  <>
                    <span className="relative flex h-1.5 w-1.5 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600"></span>
                    </span>
                    <span className="text-[10px] font-black tracking-wider uppercase font-sans text-slate-950">Pilih Menu</span>
                    <Menu className="w-3.5 h-3.5 font-extrabold text-slate-950" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-emerald-100/80 dark:border-blue-900/30 bg-white/98 dark:bg-slate-950/98 backdrop-blur-md transition-colors animate-in slide-in-from-top-4 duration-200">
          <div className="px-3 pt-3 pb-5 space-y-4">
            
            {/* Primary Section */}
            <div>
              <div className="px-3 pb-1 text-xs font-black uppercase tracking-widest text-slate-950 dark:text-emerald-300">
                Menu Utama Nusantara
              </div>
              <div className="space-y-1 mt-1">
                {primaryItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const itemNumber = String(idx + 1).padStart(2, '0');
                  return (
                    <div key={item.id}>
                      {idx > 0 && (
                        <div className="my-1.5 mx-3 border-t border-dashed border-slate-200 dark:border-slate-800" />
                      )}
                      <button
                        key={item.id}
                        id={`nav-mobile-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center w-full px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-slate-950 text-white border-slate-950 shadow-md font-bold'
                            : 'text-slate-950 dark:text-emerald-250 hover:bg-slate-100 border-transparent'
                        }`}
                      >
                        <span className="font-mono text-[10.5px] font-black mr-2.5 shrink-0 text-slate-950 dark:text-emerald-350">
                          {itemNumber}
                        </span>
                        <Icon className="w-4 h-4 mr-2.5 shrink-0" />
                        <span className="font-black">{item.label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dropdown/Other items Grouped Mobile */}
            <div className="border-t border-slate-200 dark:border-blue-900/20 pt-3">
              <div className="px-3 pb-2 text-xs font-black uppercase tracking-widest text-slate-950 dark:text-emerald-400">
                Layanan & Amalan Utama
              </div>
              <div className="space-y-4">
                {(() => {
                  let overallIndex = 4; // Start from 4 since primaryItems are 1, 2, 3
                  return categorizedDropdown.map((cat, catIdx) => {
                    const isGroupOpen = !!openMobileGroups[cat.groupName];
                    return (
                      <div key={catIdx} className="space-y-1 pl-1">
                        {/* Collapsible Category Header Button */}
                        <button
                          onClick={() => toggleMobileGroup(cat.groupName)}
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-900/35 rounded-xl transition-all duration-200 cursor-pointer group border border-slate-200/80"
                        >
                          <div className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-emerald-400/80 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                            {cat.groupName}
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-950 font-black transition-transform duration-300 ${isGroupOpen ? 'rotate-180 text-emerald-705' : ''}`} />
                        </button>
                        
                        {/* Collapsible Area with Smooth Transition */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isGroupOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                          <div className="space-y-1 pt-1 border-l-2 border-dashed border-slate-300 dark:border-blue-950/40 ml-3.5 pl-2.5">
                            {cat.items.map((item, itemIdx) => {
                              const Icon = item.icon;
                              const isActive = activeTab === item.id;
                              const currentNumStr = String(overallIndex++).padStart(2, '0');
                              return (
                                <div key={item.id}>
                                  {itemIdx > 0 && (
                                    <div className="my-1.5 border-t border-dashed border-slate-200 dark:border-slate-800" />
                                  )}
                                  <button
                                    key={item.id}
                                    id={`nav-mobile-${item.id}`}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`flex items-center w-full px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                      isActive
                                        ? 'bg-slate-950 text-white border-slate-950 shadow-md font-bold'
                                        : 'text-slate-950 dark:text-emerald-250 hover:bg-slate-100 border-transparent'
                                    }`}
                                  >
                                    <span className="font-mono text-[9.5px] font-black mr-2.5 shrink-0 text-slate-950 dark:text-emerald-300">
                                      {currentNumStr}
                                    </span>
                                    <Icon className={`w-4 h-4 mr-2.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-950 dark:text-emerald-450'}`} />
                                    <div className="text-left w-full leading-snug">
                                      <span className={`block font-black text-xs ${isActive ? 'text-white' : 'text-slate-950 dark:text-emerald-100'}`}>
                                        {item.label}
                                      </span>
                                      <span className={`block text-[10px] font-bold ${isActive ? 'text-slate-200' : 'text-slate-800 dark:text-emerald-400/50'}`}>
                                        {item.desc}
                                      </span>
                                    </div>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
