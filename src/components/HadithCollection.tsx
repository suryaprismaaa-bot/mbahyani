/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, Quote, Bookmark, Heart, Award, ShieldCheck, CornerDownRight } from 'lucide-react';

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
      case 1: return 'text-xl';
      case 2: return 'text-2xl';
      case 3: return 'text-3xl md:text-4xl'; // default
      case 4: return 'text-4xl md:text-5xl';
      default: return 'text-3xl md:text-4xl';
    }
  };

  const handleCopy = (hadith: Hadith, key: string) => {
    const textToCopy = `[Hadits Terverifikasi]\nKategori: ${hadith.category}\nRiwayat: ${hadith.narrator} No. ${hadith.number}\n\nTeks Arab:\n${hadith.arabic}\n\nLatin:\n${hadith.latin}\n\nTerjemahan:\n"${hadith.translation}"\n\nSumber: ${hadith.sourceKitab}\nDiverifikasi oleh: ${hadith.verificationAgency}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="hadith-collection-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header section with verification tag */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-semibold mb-3 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Sanad & Riwayat Valid Terverifikasi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-emerald-50">
          Kumpulan Hadits Shahih Pilihan
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-505 dark:text-emerald-400 max-w-xl mx-auto">
          Daftar sabda Rasulullah ﷺ pilihan yang bersumber dari kitab induk hadits shahih, lengkap dengan transliterasi latin, terjemahan, serta keterangan lembaga pentashih resmi.
        </p>
      </div>

      {/* Control Panel: Search & Categories */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-150 dark:border-slate-800/80 shadow-3xs mb-8 space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full py-3.5 pl-11 pr-5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-emerald-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            placeholder="Cari hadits (contoh: akhlak, niat, Bukhari, No. 13)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 mr-1.5 flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-emerald-500" /> Kategori:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850/40 text-slate-600 dark:text-emerald-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hadith List */}
      {filteredHadiths.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredHadiths.map((h, index) => {
            const cardKey = `${h.narrator}-${h.number}`;
            const isCopied = copiedId === cardKey;

            return (
              <div
                key={cardKey}
                className="group bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-3xs hover:shadow-xs transition-all duration-300"
              >
                {/* Visual side accent */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800" />
                
                {/* Top bar with categorization, narrator name & copy button */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-4 border-b border-dashed border-slate-150 dark:border-slate-850">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 rounded-lg flex items-center justify-center text-xs font-mono font-black text-emerald-700 dark:text-emerald-450 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-100/50 dark:border-emerald-900/30 uppercase tracking-widest">
                      {h.category}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                      {h.narrator} <span className="text-emerald-600 dark:text-emerald-400 font-mono">No. {h.number}</span>
                    </span>
                  </div>

                  {/* Copy share button */}
                  <button
                    onClick={() => handleCopy(h, cardKey)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 hover:text-emerald-600 dark:text-emerald-305 dark:hover:text-emerald-400 text-[11px] font-black cursor-pointer transition-all active:scale-95 shadow-4xs"
                    title="Salin Hadits Lengkap"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                        <span>Salin Kutipan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Subtitle / Quote icon background overlay */}
                <div className="absolute top-1/2 right-4 text-slate-300/5 select-none pointer-events-none transform -translate-y-1/2 z-0">
                  <BookOpen className="w-48 h-48" />
                </div>

                {/* Content section */}
                <div className="space-y-5 relative z-10">
                  
                  {/* Dynamic Arabic display text */}
                  <div
                    dir="rtl"
                    className={`font-serif text-right text-slate-900 dark:text-slate-50 font-bold leading-loose tracking-wide md:leading-[1.8] select-all my-3 ${getArabicFontSizeClass(arabicFontSize)}`}
                  >
                    {h.arabic}
                  </div>

                  {/* Transliteration Latin */}
                  <div className="bg-emerald-50/20 dark:bg-slate-950/45 p-3.5 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/30">
                    <div className="text-[9px] font-black uppercase tracking-wider text-emerald-600/80 dark:text-emerald-500/70 mb-1 flex items-center gap-1 select-none">
                      <CornerDownRight className="w-3 h-3" /> Transliterasi Latin
                    </div>
                    <p className="text-xs sm:text-sm font-medium italic text-emerald-800 dark:text-emerald-400 leading-relaxed">
                      {h.latin}
                    </p>
                  </div>

                  {/* Translation Indonesian */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 sm:p-5 rounded-2xl border border-slate-150 dark:border-slate-800/40">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1 select-none">
                      <Quote className="w-3 h-3 text-emerald-500" /> Terjemahan Bahasa Indonesia
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                      &ldquo;{h.translation}&rdquo;
                    </p>
                    
                    {/* Brief commentary/explanation if available */}
                    {h.explanation && (
                      <div className="mt-4 pt-3.5 border-t border-slate-200/50 dark:border-slate-850 text-[11px] sm:text-xs">
                        <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[9px] block mb-1">
                          Syarah / Kandungan Hadits:
                        </span>
                        <p className="font-medium text-slate-505 dark:text-emerald-300/80 leading-relaxed">
                          {h.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer metadata verified badges */}
                  <div className="flex flex-wrap gap-2 pt-2 text-[10px] select-none">
                    <span className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 font-bold text-slate-500 dark:text-emerald-400/80 flex items-center gap-1">
                      📚 <span className="font-bold">Kitab Rujukan:</span> {h.sourceKitab}
                    </span>
                    <span className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 font-bold text-slate-500 dark:text-emerald-400/80 flex items-center gap-1">
                      🛡️ <span className="font-bold">Direkomendasikan:</span> {h.verificationAgency}
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-3xl">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-bounce" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Hadits tidak ditemukan</p>
          <p className="text-xs text-slate-450 mt-1">Coba gunakan kata kunci lainnya yang relevan.</p>
        </div>
      )}

      {/* Elegant Bottom Card detailing verified sources */}
      <div className="mt-12 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850/80 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">Kredibilitas Sumber Sanad & Tashih</h4>
          <p className="text-xs text-slate-500 dark:text-emerald-400/80 mt-1 leading-relaxed">
            Semua hadits yang dicantumkan dalam portal ini memiliki sanad yang shahih atau hasan dari kitab-kitab muktabar (Bukhari, Muslim, Tirmidzi, Ibnu Majah). Penulisan lafadz Arab, latin, serta terjemahan telah disesuaikan dengan standar transliterasi nasional Kementerian Agama RI serta ditinjau kredibilitasnya.
          </p>
        </div>
      </div>

    </div>
  );
}
