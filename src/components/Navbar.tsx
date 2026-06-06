/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, Compass, BookOpen, HeartHandshake, Calendar, Sparkles, BookHeart, ChevronDown, Tv, GraduationCap, CheckSquare, BookMarked, Scale, MapPin } from 'lucide-react';
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
    { id: 'doa', label: 'Doa Harian', desc: 'Kumpulan doa pilihan islami', icon: BookHeart, group: 'Khazanah & Syiar' },
    { id: 'asmaul', label: 'Asmaul Husna', desc: '99 nama Allah luar biasa', icon: Sparkles, group: 'Khazanah & Syiar' },
    { id: 'makkah', label: 'Live Makkah', desc: 'Streaming Masjidil Haram realtime', icon: Tv, group: 'Khazanah & Syiar' },
    { id: 'zakat', label: 'Kalkulator Zakat', desc: 'Hitung zakat emas/mal realtime', icon: Scale, group: 'Khazanah & Syiar' }
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
        { id: 'doa', label: 'Doa Harian', desc: 'Kumpulan doa pilihan islami', icon: BookHeart },
        { id: 'asmaul', label: 'Asmaul Husna', desc: '99 nama Allah luar biasa', icon: Sparkles },
        { id: 'makkah', label: 'Live Makkah', desc: 'Streaming Masjidil Haram realtime', icon: Tv },
        { id: 'zakat', label: 'Kalkulator Zakat', desc: 'Hitung zakat emas/mal realtime', icon: Scale }
      ]
    }
  ] as const;

  const isDropdownActive = dropdownItems.some(item => item.id === activeTab);

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

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
    <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-100/60 dark:border-blue-900/30 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              id="brand-logo"
              className="flex items-center space-x-2.5 text-left focus:outline-none cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 rounded-xl flex items-center justify-center shadow-emerald-250 dark:shadow-blue-950/45 shadow-md text-white transition-transform group-hover:scale-105">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="block font-sans font-extrabold text-lg text-slate-800 dark:text-emerald-100 tracking-tight leading-tight">
                  Keluarga Mbah Yani
                </span>
                <span className="block text-[9px] font-bold text-center bg-gradient-to-r from-emerald-600 to-blue-650 bg-clip-text text-transparent uppercase tracking-widest -mt-0.5 font-mono">
                  Portal Sinergi Umat
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
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer glow-on-click ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md shadow-emerald-600/10 scale-102 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : 'text-slate-600 dark:text-emerald-200 hover:bg-emerald-50/65 dark:hover:bg-blue-950/20 hover:text-emerald-700 dark:hover:text-emerald-100'
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
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isDropdownActive
                    ? 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 text-emerald-700 dark:text-blue-300 border border-emerald-200/50 dark:border-blue-900/50'
                    : 'text-slate-600 dark:text-emerald-200 hover:bg-emerald-50/65 dark:hover:bg-blue-950/20 hover:text-emerald-700 dark:hover:text-emerald-100'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-550 dark:text-amber-350 animate-pulse shrink-0" />
                <span>Kajian & Ibadah</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1.5 transition-transform duration-205 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Luxurious Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100/90 dark:border-blue-900/40 shadow-2xl p-3.5 z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-3 max-h-[85vh] overflow-y-auto scrollbar-none">
                  <div className="px-2 pb-2 mr-1 mb-2.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent border-b border-slate-100 dark:border-slate-800/60">
                    Kategori Layanan & Amalan
                  </div>
                  <div className="space-y-4">
                    {categorizedDropdown.map((cat, catIdx) => (
                      <div key={catIdx} className="space-y-1">
                        <div className="px-2 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-emerald-400/70 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {cat.groupName}
                        </div>
                        <div className="grid gap-0.5">
                          {cat.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                id={`nav-dropdown-${item.id}`}
                                onClick={() => handleNavClick(item.id)}
                                className={`flex items-center gap-3 w-full text-left p-2 rounded-xl transition-all duration-150 cursor-pointer hover:bg-emerald-50/60 dark:hover:bg-blue-950/30 group glow-on-click ${
                                  isActive
                                    ? 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 text-emerald-700 dark:text-blue-100 border border-emerald-100/40 dark:border-blue-900/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                                    : 'text-slate-700 dark:text-emerald-250'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                                  isActive 
                                    ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-sm' 
                                    : 'bg-emerald-50/70 dark:bg-blue-950/35 text-emerald-650 dark:text-emerald-450 group-hover:bg-emerald-100 dark:group-hover:bg-blue-900/50'
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className={`block text-xs font-bold ${isActive ? 'text-emerald-700 dark:text-blue-300' : 'text-slate-800 dark:text-emerald-200'}`}>
                                    {item.label}
                                  </span>
                                  <span className="block text-[9.5px] text-slate-450 dark:text-emerald-400/50 font-semibold truncate">
                                    {item.desc}
                                  </span>
                                </div>
                                {isActive && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-550 dark:bg-amber-350 animate-pulse mr-1" />
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

            <div className="h-6 w-px bg-emerald-100 dark:bg-blue-900/40 mx-1.5" />

            {/* Dark Mode Toggle */}
            <button
              id="desktop-dark-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-emerald-100/60 dark:border-blue-900/30 text-slate-600 dark:text-emerald-300 hover:bg-emerald-50/65 dark:hover:bg-blue-955 cursor-pointer transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300 animate-pulse" /> : <Moon className="w-4 h-4 text-blue-800" />}
            </button>
          </div>

          {/* Mobile menu button & dark mode toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              id="mobile-dark-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-emerald-100/60 dark:border-blue-900/30 text-slate-600 dark:text-emerald-300 hover:bg-emerald-50/65 dark:hover:bg-blue-955 cursor-pointer transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300 animate-pulse" /> : <Moon className="w-4 h-4 text-blue-800" />}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-emerald-100/60 dark:border-blue-900/30 text-slate-600 dark:text-emerald-300 hover:bg-emerald-50/65 dark:hover:bg-blue-950/20 cursor-pointer transition-colors"
              aria-label="Open menu"
            >
              {isOpen ? <X className="w-5 h-5 text-slate-800 dark:text-emerald-100" /> : <Menu className="w-5 h-5 text-slate-800 dark:text-emerald-100" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-emerald-100/80 dark:border-blue-900/30 bg-white/98 dark:bg-slate-950/98 backdrop-blur-md transition-colors animate-in slide-in-from-top-4 duration-200">
          <div className="px-3 pt-3 pb-5 space-y-4">
            
            {/* Primary Section */}
            <div>
              <div className="px-3 pb-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                Menu Utama
              </div>
              <div className="space-y-1 mt-1">
                {primaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-mobile-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-emerald-250 hover:bg-emerald-50 dark:hover:bg-blue-950/20'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 mr-3 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropdown/Other items Grouped Mobile */}
            <div className="border-t border-slate-100 dark:border-blue-900/20 pt-3">
              <div className="px-3 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-emerald-400/50">
                Layanan & Amalan Utama
              </div>
              <div className="space-y-4">
                {categorizedDropdown.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-1 pl-2">
                    <div className="px-3 text-[8.5px] font-black uppercase tracking-wider text-slate-400 dark:text-emerald-500/60 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                      {cat.groupName}
                    </div>
                    <div className="space-y-0.5">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`nav-mobile-${item.id}`}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex items-center w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md'
                                : 'text-slate-600 dark:text-emerald-250 hover:bg-emerald-50/60 dark:hover:bg-blue-950/20'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mr-2.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-650 dark:text-emerald-450'}`} />
                            <div className="text-left w-full">
                              <span className="block">{item.label}</span>
                              <span className={`block text-[9px] -mt-0.5 ${isActive ? 'text-amber-200' : 'text-slate-450 dark:text-emerald-400/50'}`}>{item.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
