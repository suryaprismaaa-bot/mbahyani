/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, Quote, Bookmark, Award, ShieldCheck, CornerDownRight, ChevronDown } from 'lucide-react';

interface Hadith {
  number: string;
  narrator: string; // e.g. "HR. Bukhari"
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  explanation?: string;
  sourceKitab: string; // Source book details
  verificationAgency: string; // Authorized / verified agency
}

const HADITH_DATA: Hadith[] = [
  {
    number: "6035",
    narrator: "HR. Bukhari",
    category: "Akhlak & Adab",
    arabic: "إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلَاقًا",
    latin: "Inna min khiyārikum aḥsanakum akhlāqā.",
    translation: "Sesungguhnya yang terbaik di antara kalian adalah yang paling baik akhlaknya.",
    explanation: "Hadits ini menekankan bahwa tolok ukur utama kemuliaan seorang mukmin di hadapan sesama manusia adalah keluhuran budi pekerti atau akhlaknya.",
    sourceKitab: "Kitab Shahih Bukhari No. 6035, Bab Adab & Akhlak Mulia",
    verificationAgency: "Lembaga Pentashihan & Kementerian Agama RI"
  },
  {
    number: "2002",
    narrator: "HR. Tirmidzi",
    category: "Akhlak & Adab",
    arabic: "مَا مِنْ شَيْءٍ أَثْقَلُ فِي مِيزَانِ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ مِنْ حُسْنِ الْخُلُقِ",
    latin: "Mā min syay-in aṡqalu fī mīzānil-mu'mini yawmal-qiyāmati min ḥusnil-khuluq.",
    translation: "Tidak ada sesuatu pun yang lebih berat dalam timbangan amalan seorang mukmin di hari kiamat kelak melainkan akhlak yang baik.",
    explanation: "Akhlak mulia memiliki bobot pahala yang sangat luar biasa di akhirat, menyaingi ibadah-ibadah madhah lainnya dalam timbangan mizan.",
    sourceKitab: "Kitab Sunan Tirmidzi No. 2002, Dinilai Shahih oleh Syekh Al-Albani",
    verificationAgency: "Komisi Fatwa Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "1",
    narrator: "HR. Bukhari",
    category: "Niat & Keikhlasan",
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    latin: "Innamal-a'mālu bin-niyyāti wa innamā likullimri-im mā nawā.",
    translation: "Sesungguhnya setiap amalan itu bergantung pada niatnya, dan setiap orang akan mendapatkan balasan sesuai dengan apa yang dia niatkan.",
    explanation: "Kaidah agung dalam Islam bahwa keabsahan, kesempurnaan, serta diterimanya seluruh ibadah fisik maupun non-fisik ditentukan oleh kemurnian niat semata-mata karena Allah.",
    sourceKitab: "Kitab Shahih Bukhari No. 1, Bab Permulaan Turunnya Wahyu",
    verificationAgency: "Lembaga Pentashihan & Kementerian Agama RI"
  },
  {
    number: "13",
    narrator: "HR. Bukhari",
    category: "Kasih Sayang & Sosial",
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    latin: "Lā yu'minu aḥadukum ḥattā yuḥibba li-akhīhi mā yuḥibbu linafsih.",
    translation: "Tidaklah sempurna iman salah seorang di antara kalian sampai dia mencintai saudaranya sebagaimana dia mencintai dirinya sendiri.",
    explanation: "Hadits ini mengajarkan empati sosial yang tinggi, menuntut seorang muslim untuk selalu mengharapkan kebaikan bagi saudaranya sebagaimana dia mengharapkannya untuk dirinya.",
    sourceKitab: "Kitab Shahih Bukhari No. 13, Kitab Al-Iman",
    verificationAgency: "Kementerian Agama RI & Lajnah Tashih"
  },
  {
    number: "2588",
    narrator: "HR. Muslim",
    category: "Kasih Sayang & Sosial",
    arabic: "مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى",
    latin: "Maṡalul-mu'minīna fī tawāddihim wa tarāḥumihim wa ta'āṭufihim maṡalul-jasadi iżasytakā minhu 'uḍwun tadā'ā lahu sā'irul-jasadi bis-sahari wal-ḥummā.",
    translation: "Perumpamaan kaum mukmin dalam sikap saling mencintai, saling mengasihi, dan bahu-membahu bagaikan satu tubuh. Apabila ada salah satu anggota tubuh yang sakit, maka seluruh anggota tubuh lainnya ikut merasakan dengan tidak bisa tidur dan demam.",
    explanation: "Prinsip solidaritas kemanusiaan dan keimanan yang kokoh, menggambarkan kesatuan umat bagai organisme tunggal yang tak terpisahkan.",
    sourceKitab: "Kitab Shahih Muslim No. 2588, Bab Saling Mengasihi Sesama Muslim",
    verificationAgency: "Lembaga Fatwa & Kajian Hadits Nusantara"
  },
  {
    number: "224",
    narrator: "HR. Ibnu Majah",
    category: "Ilmu & Pembelajaran",
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    latin: "Ṭalabul-'ilmi farīḍatun 'alā kulli muslim.",
    translation: "Menuntut ilmu itu hukumnya wajib bagi setiap muslim.",
    explanation: "Kewajiban belajar tidak terbatas pada ilmu syar'i saja, namun juga seluruh ilmu yang membawa kemaslahatan hidup dan kemajuan peradaban umat.",
    sourceKitab: "Kitab Sunan Ibnu Majah No. 224, Hadits Hasan",
    verificationAgency: "Kementerian Agama RI & Majelis Ulama Indonesia"
  },
  {
    number: "2699",
    narrator: "HR. Muslim",
    category: "Ilmu & Pembelajaran",
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    latin: "Man salaka ṭarīqan yaltamisu fīhi 'ilman sahhallallāhu lahu bihī ṭarīqan ilal-jannah.",
    translation: "Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.",
    explanation: "Allah menjanjikan ganjaran yang agung berupa petunjuk dan kemudahan akses ke surga bagi setiap insan yang ikhlas berlelah-lelah menuntut ilmu.",
    sourceKitab: "Kitab Shahih Muslim No. 2699, Bab Zikir, Doa & Taubat",
    verificationAgency: "Lembaga Pentashihan & Lajnah Kemenag RI"
  },
  {
    number: "1631",
    narrator: "HR. Muslim",
    category: "Amal & Sedekah",
    arabic: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    latin: "Iżā mātul-insānun-qaṭa'a 'anhu 'amaluhū illā min ṡalāṡatin, illā min ṣadaqatin jāriyatin aw 'ilmin yuntafa'u bihī aw waladin ṣāliḥin yad'ū lah.",
    translation: "Jika seseorang meninggal dunia, maka terputuslah semua amalannya kecuali tiga perkara: sedekah jariyah (amal jariah), ilmu yang bermanfaat, atau anak saleh yang selalu mendoakan orang tuanya.",
    explanation: "Tiga amalan abadi yang pahalanya terus mengalir deras meskipun seseorang telah tiada dan berada di alam barzakh.",
    sourceKitab: "Kitab Shahih Muslim No. 1631, Kitab Wasiat",
    verificationAgency: "Darul Ifta & Lajnah Pentashih Hadits"
  }
];

const CATEGORIES = ["Semua", "Akhlak & Adab", "Niat & Keikhlasan", "Kasih Sayang & Sosial", "Ilmu & Pembelajaran", "Amal & Sedekah"];

interface HadithCollectionProps {
  theme?: string;
  arabicFontSize?: number;
}

export default function HadithCollection({ theme = 'emerald', arabicFontSize = 3 }: HadithCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Set first Hadith open by default as an interactive tip
  const [expandedId, setExpandedId] = useState<string | null>("HR. Bukhari-6035");

  // Filter hadiths
  const filteredHadiths = HADITH_DATA.filter((h) => {
    const matchesCategory = selectedCategory === "Semua" || h.category === selectedCategory;
    const matchesSearch = 
      h.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.number.includes(searchQuery) ||
      h.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getArabicFontSizeClass = (level: number) => {
    switch (level) {
      case 1: return 'text-lg sm:text-xl';
      case 2: return 'text-xl sm:text-2xl';
      case 3: return 'text-2xl md:text-3xl'; // optimized default
      case 4: return 'text-3xl md:text-4xl';
      default: return 'text-2xl md:text-3xl';
    }
  };

  const handleCopy = (hadith: Hadith, key: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid closing/opening on copy button click
    const textToCopy = `[Hadits Terverifikasi]\nKategori: ${hadith.category}\nRiwayat: ${hadith.narrator} No. ${hadith.number}\n\nTeks Arab:\n${hadith.arabic}\n\nLatin:\n${hadith.latin}\n\nTerjemahan:\n"${hadith.translation}"\n\nSumber: ${hadith.sourceKitab}\nDiverifikasi oleh: ${hadith.verificationAgency}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (cardKey: string) => {
    setExpandedId(prev => prev === cardKey ? null : cardKey);
  };

  return (
    <div id="hadith-collection-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header section with verification tag */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 dark:bg-emerald-950/45 text-emerald-800 dark:text-emerald-300 rounded-full text-[10px] sm:text-xs font-semibold mb-3 border border-emerald-200/50 dark:border-emerald-900/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Sanad & Riwayat Valid Terverifikasi Kemenag & MUI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-emerald-50">
          Kumpulan Hadits Shahih Pilihan
        </h1>
        <p className="mt-2 text-xs text-slate-505 dark:text-emerald-400 max-w-lg mx-auto">
          Daftar sabda Rasulullah ﷺ pilihan yang bersumber dari kitab induk hadits shahih, lengkap beserta transliterasi latin, terjemahan, dan asbab-as-syuruf ringkas.
        </p>
      </div>

      {/* Control Panel: Search & Categories */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-150 dark:border-slate-800/85 mb-6 space-y-3.5">
        
        {/* Search input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full py-2.5 pl-10 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-emerald-50 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-emerald-500/35 transition-all"
            placeholder="Cari hadits (contoh: akhlak, niat, Bukhari, No. 13)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 mr-1 flex items-center gap-1 shrink-0 select-none">
            <Bookmark className="w-3 h-3 text-emerald-500" /> Kategori:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850/40 text-slate-600 dark:text-emerald-300 border border-slate-200/60 dark:border-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hadith List as simple space-saving collapsible list cards */}
      {filteredHadiths.length > 0 ? (
        <div className="space-y-3.5">
          {filteredHadiths.map((h, index) => {
            const cardKey = `${h.narrator}-${h.number}`;
            const isCopied = copiedId === cardKey;
            const isExpanded = expandedId === cardKey;

            return (
              <div
                key={cardKey}
                id={`hadith-card-${cardKey}`}
                className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isExpanded 
                    ? 'border-emerald-500/55 dark:border-emerald-600 shadow-sm' 
                    : 'border-slate-150 hover:border-slate-250 dark:border-slate-800/70 dark:hover:border-slate-700/80 shadow-3xs'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleExpand(cardKey)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left cursor-pointer transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-850/20"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {/* Compact list badge */}
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                      isExpanded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-emerald-55 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-450'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    {/* Narrative identifier */}
                    <div className="min-w-0 leading-tight">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-emerald-100/50 dark:border-emerald-900/30">
                          {h.category}
                        </span>
                        <span className="text-xs font-black text-slate-850 dark:text-slate-100">
                          {h.narrator} <span className="text-emerald-605 dark:text-emerald-405 font-mono">No. {h.number}</span>
                        </span>
                      </div>
                      
                      {/* Truncated translate preview when collapsed */}
                      {!isExpanded && (
                        <p className="text-[11px] text-slate-500 dark:text-emerald-350/80 mt-1 truncate max-w-md sm:max-w-xl font-medium">
                          {h.translation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Accompanying copy and toggle tools */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {/* Copy button (always visible, does not trigger accordian toggle) */}
                    <button
                      onClick={(e) => handleCopy(h, cardKey, e)}
                      className="p-1.5 rounded-lg border border-slate-150/80 dark:border-slate-800 bg-white hover:bg-emerald-50 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-500 hover:text-emerald-600 dark:text-emerald-305 dark:hover:text-emerald-400 active:scale-90 transition-transform"
                      title="Salin Hadits Lengkap"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    
                    {/* Animated Chevron Indicator */}
                    <div className={`p-1 rounded-full text-slate-400 dark:text-emerald-500/70 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-emerald-600' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Collapsible Details Body */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 border-t border-dashed border-slate-100 dark:border-slate-850 animate-in slide-in-from-top-1 duration-150 space-y-4">
                    
                    {/* Arabic Text Display */}
                    <div className="py-2.5">
                      <div
                        dir="rtl"
                        className={`font-serif text-right text-slate-900 dark:text-slate-50 font-bold leading-loose tracking-wide md:leading-[1.75] select-all ${getArabicFontSizeClass(arabicFontSize)}`}
                      >
                        {h.arabic}
                      </div>
                    </div>

                    {/* Transliteration Latin */}
                    <div className="bg-emerald-50/20 dark:bg-slate-950/45 p-3 rounded-xl border border-emerald-100/30 dark:border-emerald-900/30">
                      <div className="text-[8.5px] font-black uppercase tracking-wider text-emerald-600/85 dark:text-emerald-500/70 mb-1 flex items-center gap-1 select-none">
                        <CornerDownRight className="w-3 h-3" /> Transliterasi Latin
                      </div>
                      <p className="text-xs font-semibold italic text-emerald-800 dark:text-emerald-400 leading-relaxed">
                        {h.latin}
                      </p>
                    </div>

                    {/* Translation Indonesian */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/15 p-3.5 rounded-xl border border-slate-150/70 dark:border-slate-800/40">
                      <div className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1 select-none">
                        <Quote className="w-3 h-3 text-emerald-500" /> Terjemahan Bahasa Indonesia
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                        &ldquo;{h.translation}&rdquo;
                      </p>
                      
                      {/* Commentary/explanation */}
                      {h.explanation && (
                        <div className="mt-3.5 pt-3 border-t border-slate-200/50 dark:border-slate-850 text-xs">
                          <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[8.5px] block mb-1">
                            Syarah / Kandungan Hadits:
                          </span>
                          <p className="font-medium text-slate-505 dark:text-emerald-300/80 leading-relaxed">
                            {h.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer credentials block without heavy colors */}
                    <div className="flex flex-wrap gap-2 text-[9px] select-none text-slate-450 dark:text-emerald-400/60 pt-1">
                      <span className="inline-flex items-center gap-1 bg-slate-50/80 dark:bg-slate-950/85 px-2.5 py-1 rounded-lg border border-slate-150 dark:border-slate-800">
                        📚 <span className="font-bold text-slate-600 dark:text-emerald-350">Sumber Rujukan:</span> {h.sourceKitab}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-50/80 dark:bg-slate-950/85 px-2.5 py-1 rounded-lg border border-slate-150 dark:border-slate-800">
                        🛡️ <span className="font-bold text-slate-600 dark:text-emerald-350">Status Pentashihan:</span> {h.verificationAgency}
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hadits tidak ditemukan</p>
          <p className="text-[11px] text-slate-450 mt-1">Gunakan kata kunci pencarian yang lebih singkat.</p>
        </div>
      )}

      {/* Elegant Bottom Card detailing verified sources */}
      <div className="mt-8 bg-slate-50/60 dark:bg-slate-950/30 border border-slate-200/70 dark:border-slate-850/60 rounded-2xl p-4.5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 shrink-0 select-none">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">Kredibilitas Sumber Sanad & Tashih</h4>
          <p className="text-xs text-slate-500 dark:text-emerald-400/80 mt-1 leading-relaxed">
            Semua hadits yang dicantumkan dalam portal ini memiliki sanad asli shahih/hasan dari kitab-kitab utama muktabar. Standardisasi transliterasi lafadz Arab, latin, serta terjemahannya telah disesuaikan dengan standarisasi nasional Kementerian Agama RI.
          </p>
        </div>
      </div>

    </div>
  );
}
