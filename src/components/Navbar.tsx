/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Moon, Sun, Compass, BookOpen, HeartHandshake, Calendar, Sparkles, BookHeart } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Sparkles },
    { id: 'qibla', label: 'Arah Kiblat', icon: Compass },
    { id: 'quran', label: 'Al-Qur\'an', icon: BookOpen },
    { id: 'tasbih', label: 'Tasbih', icon: HeartHandshake },
    { id: 'doa', label: 'Doa Harian', icon: BookHeart },
    { id: 'jadwal', label: 'Jadwal Sholat', icon: Calendar },
    { id: 'asmaul', label: 'Asmaul Husna', icon: Sparkles },
    { id: 'amal', label: 'Amal Harian', icon: HeartHandshake }
  ] as const;

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              id="brand-logo"
              className="flex items-center space-x-2.5 text-left focus:outline-none cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center shadow-emerald-200 dark:shadow-emerald-950/45 shadow-md text-white">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-bold text-xl text-emerald-800 dark:text-emerald-100 tracking-tight font-sans">
                Keluarga Mbah Yani
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 scale-102 font-semibold'
                      : 'text-slate-600 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5 shrink-0" />
                  {item.label}
                </button>
              );
            })}

            <div className="h-6 w-px bg-emerald-100 dark:bg-emerald-900 mx-2" />

            {/* Dark Mode Toggle */}
            <button
              id="desktop-dark-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900 text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 cursor-pointer transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
            </button>
          </div>

          {/* Mobile menu button & dark mode toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              id="mobile-dark-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-emerald-100 dark:border-emerald-900 text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 cursor-pointer transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-emerald-100 dark:border-emerald-900 text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 cursor-pointer transition-colors"
              aria-label="Open menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-emerald-100 dark:border-emerald-900 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md transition-colors animate-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-mobile-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 shrink-0 text-emerald-500" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
