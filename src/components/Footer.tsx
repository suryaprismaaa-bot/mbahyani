/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-sky-100/60 dark:border-blue-900/30 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center font-sans">
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 dark:text-emerald-400/40 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <span>&copy; {currentYear} Portal Sinergitas & Ibadah Mbah Yani. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-slate-500 dark:text-emerald-400/55">
            <span>Dihadirkan dengan penuh</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse fill-current" />
            <span>untuk kebersamaan Umat & Keluarga.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
