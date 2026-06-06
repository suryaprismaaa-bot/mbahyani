/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, Share2, BookHeart, Send, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { DOA_DATA } from '../data/doa';
import { DoaItem } from '../types';

export default function DailyDoa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Display 4 per page so it is highly focused and looks premium on mobile/desktop without overflow

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Extract categorisation lists dynamically
  const categories = ["Semua", ...Array.from(new Set(DOA_DATA.map((d) => d.kategori)))];

  const handleCopyDoa = (doa: DoaItem) => {
    const textToCopy = `📝 ${doa.judul}\n\n🕌 Arab:\n${doa.arab}\n\n📖 Latin:\n${doa.latin}\n\nArtinya:\n"${doa.terjemahan}"\n\nSaling Berbagi Kebaikan, Portal Islami Keluarga Mbah Yani`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(doa.id);
      setTimeout(() => {
        setCopiedId(null);
      }, 3000);
    }).catch(err => {
      console.error('Could not copy', err);
    });
  };

  const handleShareDoa = (doa: DoaItem) => {
    const shareTitle = doa.judul;
    const shareText = `📝 ${doa.judul}\n\n"${doa.terjemahan}"\n`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      }).then(() => {
        setSharedId(doa.id);
        setTimeout(() => setSharedId(null), 3000);
      }).catch(err => {
        console.warn('Share failed or dismissed', err);
      });
    } else {
      // Fallback: Copy to clipboard and notify that they can paste to WhatsApp!
      const textToCopy = `📝 *${shareTitle}* \n\n_${doa.arab}_\n\n*Artinya:* "${doa.terjemahan}"\n\nKirim ke Grup Keluarga Mbah Yani: ${shareUrl}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        setSharedId(doa.id);
        setTimeout(() => {
          setSharedId(null);
        }, 3000);
      });
    }
  };

  const filteredDoas = DOA_DATA.filter((doa) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doa.judul.toLowerCase().includes(query) ||
      doa.latin.toLowerCase().includes(query) ||
      doa.terjemahan.toLowerCase().includes(query) ||
      doa.kategori.toLowerCase().includes(query);
    
    const matchesCategory = activeCategory === "Semua" || doa.kategori === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate items for current page
  const totalItems = filteredDoas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoas = filteredDoas.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Doa Header */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800">
          Tuntunan Doa Sehari-hari
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-emerald-50 mt-3 font-sans">
          Doa Sehari-hari
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/70 mt-2 text-sm max-w-lg mx-auto">
          Kumpulan doa harian mustajab beserta tulisan arab, latin, dan terjemahan bahasa Indonesia untuk diamalkan seluruh anggota keluarga.
        </p>
      </div>

      {/* Control panel: Search and categories picker */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-emerald-600/60" />
          </div>
          <input
            id="doa-search"
            type="text"
            placeholder="Cari doa berdasarkan judul, lafal latin, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-emerald-100 dark:border-emerald-900 rounded-2xl bg-white dark:bg-emerald-950/20 text-slate-800 dark:text-emerald-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories list */}
        <div className="flex flex-wrap gap-1.5 pb-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`category-doa-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing prayers - Paginated */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedDoas.map((doa) => {
          const isCopied = copiedId === doa.id;
          const isShared = sharedId === doa.id;

          return (
            <div
              key={doa.id}
              id={`doa-card-${doa.id}`}
              className="bg-white dark:bg-emerald-950/15 border border-emerald-100/80 dark:border-emerald-900/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:translate-y-[-2px] duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/40 text-[10px] text-emerald-800 dark:text-emerald-300 rounded-full font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/40">
                    {doa.kategori}
                  </span>
                  
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {doa.id}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-800 dark:text-emerald-50 tracking-tight leading-snug mb-4">
                  {doa.judul}
                </h3>

                {/* Big Arabic text container */}
                <div className="p-4 bg-slate-50 dark:bg-emerald-900/10 rounded-xl mb-4">
                  <p dir="rtl" className="text-right text-xl font-serif text-slate-800 dark:text-emerald-100 leading-loose font-semibold">
                    {doa.arab}
                  </p>
                </div>

                {/* Translit and translation */}
                <p className="text-xs text-teal-700 dark:text-teal-400 font-medium italic pl-2 border-l border-teal-500 mb-3">
                  {doa.latin}
                </p>

                <p className="text-xs text-slate-600 dark:text-emerald-300/80 leading-relaxed italic mb-4 font-sans">
                  &ldquo;{doa.terjemahan}&rdquo;
                </p>
              </div>

              {/* Action utilities */}
              <div className="flex justify-end space-x-2 border-t border-slate-50 dark:border-emerald-900/30 pt-3 mt-2">
                <button
                  id={`doa-copy-${doa.id}`}
                  onClick={() => handleCopyDoa(doa)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center cursor-pointer transition-colors ${
                    isCopied
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-inner'
                      : 'border-slate-200 dark:border-emerald-900 text-slate-500 dark:text-emerald-300 hover:bg-slate-50 dark:hover:bg-emerald-900/30'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Disalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Salin Doa
                    </>
                  )}
                </button>

                <button
                  id={`doa-share-${doa.id}`}
                  onClick={() => handleShareDoa(doa)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center cursor-pointer transition-colors ${
                    isShared
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-slate-200 dark:border-emerald-900 text-slate-500 dark:text-emerald-300 hover:bg-slate-50 dark:hover:bg-emerald-900/30'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 mr-1" />
                  {isShared ? 'Khusus WA!' : 'Bagikan Doa'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDoas.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400">Tidak ada doa harian yang sesuai dengan filter Anda.</p>
        </div>
      )}

      {/* Pagination Controls Section */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 p-4 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 rounded-2xl shadow-sm">
          <button
            id="doa-page-prev"
            disabled={currentPage === 1}
            onClick={goToPrevPage}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
            Sebelumnya
          </button>

          <span className="text-xs font-bold text-slate-600 dark:text-emerald-200">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            id="doa-page-next"
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer ${
              currentPage === totalPages
                ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            Berikutnya
            <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
          </button>
        </div>
      )}

      {/* WA Info guide box */}
      <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-center space-x-3.5">
        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl animate-pulse">
          <Send className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-emerald-100">Kirim Ke WA Keluarga Mbah Yani!</h4>
          <p className="text-[11px] text-slate-500 dark:text-emerald-300/60 mt-0.5 leading-relaxed">
            Gunakan tombol &ldquo;Bagikan Doa&rdquo; untuk secara otomatis menyalin format tulisan indah yang siap dikirim langsung ke grup obrolan Whatsapp / Telegram keluarga besar Mbah Yani.
          </p>
        </div>
      </div>
    </div>
  );
}
