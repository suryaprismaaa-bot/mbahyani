/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Volume2, Award, ArrowRight, BookMarked, Play, Pause, RefreshCw, Star, Info, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TajweedExample {
  arabic: string;
  latin: string;
  explanation: string;
  meaning: string;
  phoneticGuide: string;
  surah: number;
  ayah: number;
}

interface TajweedRuleItem {
  name: string;
  definition: string;
  howToRead: string;
  examples: TajweedExample[];
}

interface TajweedCategory {
  title: string;
  icon: string;
  desc: string;
  rules: TajweedRuleItem[];
}

// 114 Surah verse counts for absolute index calculations
const SURAH_VERSE_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 11, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  11, 4, 5, 6
];

export function getAbsoluteAyah(surah: number, ayah: number): number {
  let count = 0;
  for (let i = 0; i < surah - 1; i++) {
    count += SURAH_VERSE_COUNTS[i];
  }
  return count + ayah;
}

const TAJWEED_DATA: Record<string, TajweedCategory> = {
  nunsukun: {
    title: "Nun Sukun & Tanwin",
    icon: "🟢",
    desc: "Hukum yang berlaku ketika ada Nun Mati (نْ) atau Tanwin (ــًـ, ــٍـ, ــٌـ) bertemu dengan salah satu huruf hijaiyah.",
    rules: [
      {
        name: "Izhar Halqi (اِظْهَار حَلْقِي)",
        definition: "Membaca huruf Nun mati atau Tanwin secara jelas dan terang tanpa dengung, apabila bertemu salah satu dari 6 huruf tenggorokan (Halqi).",
        howToRead: "Suara 'N' dibaca pendek, tegak lurus, dan bersih.",
        examples: [
          { arabic: "مِنْ حَيْثُ", latin: "Min Haitsu", explanation: "Nun sukun bertemu huruf Ha (ح)", meaning: "dari arah mana saja", phoneticGuide: "Min haitsu", surah: 2, ayah: 150 },
          { arabic: "خَلْقٍ جَدِيْدٍ", latin: "Kholqin Jadiidin", explanation: "Tanwin kasroh bertemu huruf Jim (ج)", meaning: "penciptaan yang baru", phoneticGuide: "Kholqin jadiidin", surah: 34, ayah: 7 },
          { arabic: "مَنْ اٰمَنَ", latin: "Man 'Aamana", explanation: "Nun sukun bertemu huruf Alif (أ)", meaning: "barang siapa yang beriman", phoneticGuide: "Man aamana", surah: 2, ayah: 62 },
          { arabic: "عَذَابٌ اَلِيْمٌ", latin: "'Adzaabun 'Aliim", explanation: "Tanwin dhommatain bertemu Alif (أ)", meaning: "siksaan yang teramat pedih", phoneticGuide: "Adzabun alim", surah: 2, ayah: 10 }
        ]
      },
      {
        name: "Idgham Bighunnah (اِدْغَام بِغُنَّة)",
        definition: "Meleburkan suara Nun mati atau Tanwin ke dalam huruf di depannya disertai dengung (Ghunnah) yang ditahan 2-3 ketukan.",
        howToRead: "Suara dengung harus mengalir halus ke rongga hidung.",
        examples: [
          { arabic: "مَنْ يَّقُوْلُ", latin: "May-yaquulu", explanation: "Nun sukun bertemu huruf Ya (ي)", meaning: "orang yang berkata", phoneticGuide: "May yaquulu", surah: 2, ayah: 8 },
          { arabic: "لَهَبٍ وَّتَبَّ", latin: "Lahabiw-wa tabba", explanation: "Tanwin kasroh bertemu huruf Wawu (و)", meaning: "gejolak api dan binasalah dia", phoneticGuide: "Lahabiw watabbb", surah: 111, ayah: 1 },
          { arabic: "مِنْ مَّاءٍ", latin: "Mim-maai", explanation: "Nun sukun bertemu huruf Mim (م)", meaning: "dari air mani murni", phoneticGuide: "Miim maai", surah: 86, ayah: 5 },
          { arabic: "خَيْرٌ وَّأَبْقَىٰ", latin: "Khoiruw-wa abqoo", explanation: "Tanwin dhommah bertemu huruf Wawu (و)", meaning: "lebih baik dan lebih kekal", phoneticGuide: "Khoiruw wa abqoo", surah: 87, ayah: 17 }
        ]
      },
      {
        name: "Idgham Bilaghunnah (اِدْغَام بِلَاغُنَّة)",
        definition: "Meleburkan suara Nun mati atau Tanwin langsung ke dalam huruf Lam atau Ra tanpa disertai dengung sedikit pun.",
        howToRead: "Suara melebur cepat dan bersih tanpa ditahan.",
        examples: [
          { arabic: "مِنْ لَّدُنْهُ", latin: "Mil-ladunhu", explanation: "Nun sukun bertemu huruf Lam (ل)", meaning: "dari sisi-Nya langsung", phoneticGuide: "Mil ladunhu", surah: 18, ayah: 2 },
          { arabic: "غَفُوْرٌ رَّحِيْمٌ", latin: "Ghofuurur-rohiim", explanation: "Tanwin dhommah bertemu huruf Ra (ر)", meaning: "Maha Pengampun lagi Maha Penyayang", phoneticGuide: "Ghofuurur rohiim", surah: 2, ayah: 173 },
          { arabic: "مِنْ رَّبِّهِمْ", latin: "Mir-robbihim", explanation: "Nun sukun bertemu huruf Ra (ر)", meaning: "dari Tuhan pemelihara mereka", phoneticGuide: "Mir robbihim", surah: 2, ayah: 5 }
        ]
      },
      {
        name: "Iqlab (اِقْلَاب)",
        definition: "Mengganti atau membalikkan suara Nun mati atau Tanwin menjadi suara Mim (مْ) disertai dengung pelan yang ditahan apabila bertemu huruf Ba (ب).",
        howToRead: "Bibir atas dan bibir bawah menutup lembut, bersuara 'M' dengung.",
        examples: [
          { arabic: "مِنْ بَعْدِ", latin: "Mim-ba'di", explanation: "Nun sukun bertemu huruf Ba (ب)", meaning: "setelah berlalu kejadian itu", phoneticGuide: "Mim baadi", surah: 2, ayah: 56 },
          { arabic: "سَمِيْعٌۢ بَصِيْرٌ", latin: "Samii'um-bashiir", explanation: "Tanwin dhommah bertemu huruf Ba (ب)", meaning: "Maha Mendengar lagi Maha Melihat", phoneticGuide: "Sami'um bashiir", surah: 17, ayah: 1 },
          { arabic: "لَنَسْفَعًاۢ بِالنَّاصِيَةِ", latin: "Lanasfa'am-binnashiyah", explanation: "Tanwin fathah diganti Mim bertemu Ba (ب)", meaning: "sungguh niscaya Kami tarik ubun-ubunnya", phoneticGuide: "Lanasfa'am binnashiyah", surah: 96, ayah: 15 }
        ]
      },
      {
        name: "Ikhfa Haqiqi (اِخْفَاء حَقِيقِي)",
        definition: "Menyamarkan suara Nun mati atau Tanwin di antara jelas dan dengung, ditiupkan bersiap mengucap huruf di depannya (15 huruf).",
        howToRead: "Dengung samar ditahan merdu sepanjang 2 ketukan.",
        examples: [
          { arabic: "مِنْ دُوْنِ", latin: "Min-duuni", explanation: "Nun sukun bertemu huruf Dal (د)", meaning: "selain dari diri-Nya", phoneticGuide: "Min-duni", surah: 2, ayah: 23 },
          { arabic: "شَهَادَةً عِنْدَهُۥ", latin: "Syahaadatan 'indahu", explanation: "Nun mati bertemu huruf Dal (د)", meaning: "kesaksian di sisi-Nya", phoneticGuide: "Syahadatan indahu", surah: 2, ayah: 140 },
          { arabic: "أَنْفُسَكُمْ", latin: "Anfusakum", explanation: "Nun sukun bertemu huruf Fa (ف)", meaning: "dirimu sekalian", phoneticGuide: "Anfusakum", surah: 2, ayah: 54 },
          { arabic: "مِنْ طَيِّبَاتِ", latin: "Min-thoyyibaati", explanation: "Nun sukun bertemu huruf Tho (ط)", meaning: "dari kebaikan rezeki", phoneticGuide: "Min thoyyibaati", surah: 2, ayah: 57 }
        ]
      }
    ]
  },
  mimsukun: {
    title: "Hukum Mim Sukun",
    icon: "🔵",
    desc: "Hukum tajwid apabila ada huruf Mim Mati (مْ) bertemu dengan salah satu huruf Hijaiyah.",
    rules: [
      {
        name: "Ikhfa Syafawi (اِخْفَاء شَفَوِي)",
        definition: "Menyembunyikan atau menyamarkan suara Mim sukun ke dalam bibir disertai dengung saat bertemu dengan huruf Ba (ب).",
        howToRead: "Kedua bibir merapat lembut dengan celah halus mengalun dengung.",
        examples: [
          { arabic: "تَرْمِيْهِمْ بِحِجَارَةٍ", latin: "Tarmiihim-bihijaaroh", explanation: "Mim sukun bertemu huruf Ba (ب)", meaning: "melempari mereka dengan batu sijjil", phoneticGuide: "Tarmihim bihijaaroh", surah: 105, ayah: 4 },
          { arabic: "وَصَبَّحَهُمْ بُكْرَةً", latin: "Washobbahahum-bukrotan", explanation: "Mim sukun bertemu huruf Ba (ب)", meaning: "menimpa mereka pagi hari", phoneticGuide: "Washobbahahum bukrotan", surah: 54, ayah: 38 }
        ]
      },
      {
        name: "Idgham Mithli / Mimi (اِدْغَام مِثْلِي)",
        definition: "Memasukkan suara Mim sukun ke dalam huruf Mim bertasydid di depannya secara sempurna disertai dengung dengungan kuat.",
        howToRead: "Suara merapat kencang layaknya dobel Mim.",
        examples: [
          { arabic: "لَهُمْ مَّا يَشَاءُوْنَ", latin: "Lahum-maa yasyaauun", explanation: "Mim sukun bertemu huruf Mim (م)", meaning: "bagi mereka apa yang dikehendaki", phoneticGuide: "Lahummaa yasya'un", surah: 50, ayah: 35 },
          { arabic: "أَطْعَمَهُمْ مِنْ جُوْعٍ", latin: "Ath'amahum-min juuu'", explanation: "Mim sukun bertemu huruf Mim (م)", meaning: "memberi mereka makan dari kelaparan", phoneticGuide: "Ath'amahum min juuu'", surah: 106, ayah: 4 }
        ]
      },
      {
        name: "Izhar Syafawi (اِظْهَار شَفَوِي)",
        definition: "Membaca suara Mim sukun dengan sangat jelas, terang, dan singkat tanpa dengung sedikit pun bertemu selain huruf Ba & Mim.",
        howToRead: "Suara bibir tertutup cepat dan tidak boleh mengayun.",
        examples: [
          { arabic: "لَكُمْ دِيْنُكُمْ", latin: "Lakum diinukum", explanation: "Mim sukun bertemu huruf Dal (د)", meaning: "untukmu agamamu", phoneticGuide: "Lakum dinukum", surah: 109, ayah: 6 },
          { arabic: "أَلَمْ تَرَ", latin: "Alam taro", explanation: "Mim sukun bertemu huruf Ta (ت)", meaning: "apakah kamu tidak memperhatikan", phoneticGuide: "Alam taro", surah: 105, ayah: 1 },
          { arabic: "هُمْ فِيْهَا", latin: "Hum fiihaa", explanation: "Mim sukun bertemu huruf Fa (ف)", meaning: "mereka kekal di dalamnya", phoneticGuide: "Hum fiiha", surah: 2, ayah: 39 }
        ]
      }
    ]
  },
  mad: {
    title: "Hukum Al-Mad (Panjang)",
    icon: "🟡",
    desc: "Hukum memperpanjang ucapan huruf hijaiyah karena bertemu dengan huruf-huruf Mad (Alif, Wawu, Ya).",
    rules: [
      {
        name: "Mad Thabi'i (مَدّ طَبِيْعِي)",
        definition: "Mad murni yang dibaca panjang sepanjang 2 ketukan standar karena ada Alif setelah Fathah, Ya sukun setelah Kasrah, atau Wawu sukun setelah Dhommah.",
        howToRead: "Satu ayunan panjang yang stabil dan lembut.",
        examples: [
          { arabic: "قَالَ", latin: "Qoola", explanation: "Alif bertemu huruf berharokat fathah Qo", meaning: "Dia telah berkata", phoneticGuide: "Qoola", surah: 2, ayah: 30 },
          { arabic: "قِيْلَ", latin: "Qiila", explanation: "Ya sukun bertemu huruf berharokat kasrah Qi", meaning: "Telah diperintahkan", phoneticGuide: "Qiila", surah: 2, ayah: 11 },
          { arabic: "يَقُوْلُ", latin: "Yaquulu", explanation: "Wawu sukun bertemu huruf dhommah Qu", meaning: "Dia sedang berkata", phoneticGuide: "Yaquulu", surah: 2, ayah: 8 }
        ]
      },
      {
        name: "Mad Wajib Muttasil (مَدْ وَاجِب مُتَّصِل)",
        definition: "Mad Thabi'i bertemu dengan huruf Hamzah (ء) dalam satu kata utuh. Ditandai garis lengkung bendera.",
        howToRead: "Wajib dibaca tebal dan panjang sepanjang 4 sampai 5 ketukan.",
        examples: [
          { arabic: "جَاۤءَ", latin: "Jaaa-a", explanation: "Mad Thabi'i bertemu Hamzah di satu lafadz", meaning: "Telah datang pertolongan", phoneticGuide: "Jaaaa a", surah: 110, ayah: 1 },
          { arabic: "السَّمَاۤءِ", latin: "As-samaaa-i", explanation: "Mad Thabi'i bertemu Hamzah di lafadz langit", meaning: "Atas nama langit", phoneticGuide: "Assamaaa i", surah: 82, ayah: 1 }
        ]
      },
      {
        name: "Mad Jaiz Munfasil (مَدْ جَائِZ مُنْFاصِل)",
        definition: "Mad Thabi'i bertemu Hamzah di kata terpisah berbeda. Lebih longgar ketimbang wajib.",
        howToRead: "Boleh dibaca sepanjang 2, 4, atau 5 ketukan merdu.",
        examples: [
          { arabic: "يَاۤ أَيُّهَا", latin: "Yaaa-ayyuhal", explanation: "Yaa bertemu Ayyuha di kata terpisah", meaning: "Wahai sekalian manusia", phoneticGuide: "Yaaaa ayyuhal", surah: 2, ayah: 21 },
          { arabic: "إِنَّاۤ أَنْزَلْنَاهُ", latin: "Innaaa-anzalnaah", explanation: "Innaa bertemu Anzalnaah", meaning: "Sesungguhnya Kami menurunkannya", phoneticGuide: "Innnaaa anzalnahu", surah: 97, ayah: 1 }
        ]
      }
    ]
  },
  qalqalah: {
    title: "Qalqalah (Pantulan)",
    icon: "🔥",
    desc: "Melafalkan huruf-huruf tertentu (Qof, Tho, Ba, Jim, Dal - baju di toko) dengan nada memantul kuat jika berstatus mati.",
    rules: [
      {
        name: "Qalqalah Sughra (قَلْقَلَة صُغْرَى)",
        definition: "Huruf qalqalah mati/sukun asli yang terletak di tengah-tengah kata kalimat.",
        howToRead: "Pantulan diucapkan tipis dan mengalir tanpa menghentikan nafas berlebihan.",
        examples: [
          { arabic: "يَدْخُلُوْنَ", latin: "Yad-khuluun", explanation: "Huruf Dal (د) mati di tengah kata", meaning: "Mereka masuk secara bersamaan", phoneticGuide: "Yadkhuluna", surah: 110, ayah: 2 },
          { arabic: "يَقْضِيْ", latin: "Yaq-dhii", explanation: "Huruf Qof (ق) sukun tengah lafadz", meaning: "Dia memutuskan perkara", phoneticGuide: "Yaqdhii", surah: 40, ayah: 20 },
          { arabic: "تَجْرِيْ", latin: "Taj-rii", explanation: "Huruf Jim (ج) mati tengah kalimat", meaning: "Air sungai yang mengalir", phoneticGuide: "Tajrii", surah: 2, ayah: 25 }
        ]
      },
      {
        name: "Qalqalah Kubra (قَلْقَلَة كُبْرَى)",
        definition: "Huruf qalqalah mati karena dihentikan (di-waqafkan) terletak di ujung ayat kalimat.",
        howToRead: "Pantulan diucapkan kuat, kokoh, menekuk tebal.",
        examples: [
          { arabic: "اَحَدٌ", latin: "Ahad", explanation: "Dal di akhir waqaf dibaca pantul besar", meaning: "Maha Esa", phoneticGuide: "Ahad", surah: 112, ayah: 1 },
          { arabic: "وَّتَبَّ", latin: "Watabb", explanation: "Ba bertasydid waqaf dipantulkan sangat tebal", meaning: "dan sungguh binasalah dia", phoneticGuide: "Watabbb", surah: 111, ayah: 1 },
          { arabic: "خَلَقَ", latin: "Kholaq", explanation: "Qof hidup mati karena waqaf meletup kuat", meaning: "Dia telah menciptakan", phoneticGuide: "Kholaq", surah: 113, ayah: 2 }
        ]
      }
    ]
  }
};

export default function TajweedLearning() {
  const [activeCategory, setActiveCategory] = useState<string>('nunsukun');
  const [activeRuleIdx, setActiveRuleIdx] = useState<number>(0);
  
  const category = TAJWEED_DATA[activeCategory] || TAJWEED_DATA.nunsukun;
  const activeRule = category.rules[activeRuleIdx] || category.rules[0] || null;

  return (
    <div id="tajweed-container" className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      
      {/* Banner Tajwid Premium */}
      <div className="text-center mb-8">
        <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-900 inline-flex items-center gap-1.5 shadow-xs">
          <BookMarked className="w-3.5 h-3.5" />
          Kajian Tajwid Al-Qur'an Fashih & Tartil
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 dark:text-emerald-50 mt-4 tracking-tight">
          Belajar Ilmu Tajwid Lengkap
        </h1>
        <p className="text-slate-500 dark:text-emerald-350 mt-2.5 text-sm max-w-xl mx-auto leading-relaxed font-semibold">
          Pedoman hukum bacaan Al-Qur'an lengkap disertai tulisan ayat, transliterasi, arti lengkap secara tertulis, serta panduan visual makhraj fashih (tanpa contoh bunyi suara) bagi Keluarga Besar Mbah Yani.
        </p>
      </div>

      {/* Grid Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {Object.entries(TAJWEED_DATA).map(([key, cat]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveCategory(key);
                setActiveRuleIdx(0);
              }}
              className={`p-4 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-650 text-white border-emerald-400 shadow-md shadow-emerald-500/10'
                  : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <div className="text-2xl mb-1.5">{cat.icon}</div>
              <h3 className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight">
                {cat.title}
              </h3>
              <p className={`text-[10px] truncate mt-1 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                {cat.rules.length} Hukum Utama
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Category Intro Banner */}
      <div className="bg-emerald-50/55 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-950 p-5 rounded-2xl mb-8 text-left flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          ✓
        </div>
        <div>
          <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
            Kategori Terpilih: {category.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-emerald-300 mt-1 leading-relaxed">
            {category.desc}
          </p>
        </div>
      </div>

      {/* Two-Column Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Rule Navigation List */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="block text-[10px] font-extrabold text-slate-450 dark:text-emerald-400 uppercase tracking-wider text-left mb-2 pl-1">
            DAFTAR HUKUM BACAAN
          </span>
          {category.rules.map((rule, idx) => {
            const isRuleActive = activeRuleIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveRuleIdx(idx);
                }}
                className={`w-full p-4.5 rounded-2xl border text-left transition-all flex justify-between items-center group cursor-pointer ${
                  isRuleActive
                    ? 'bg-slate-100 dark:bg-slate-900 border-emerald-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <h5 className={`text-xs font-black uppercase tracking-wide transition-colors ${isRuleActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-705 dark:text-emerald-200'}`}>
                    {rule.name.split(' (')[0]}
                  </h5>
                  <span className="block text-[10px] text-slate-400 dark:text-emerald-400/50 mt-1">
                    Ketuk untuk ulasan & contoh
                  </span>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRuleActive ? 'text-emerald-500 translate-x-1' : 'text-slate-300 group-hover:translate-x-0.5'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Showcase Core Detail & Examples */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-left">
          {activeRule ? (
            <div className="space-y-6">
              
              {/* Rule Title & Definition */}
              <div>
                <span className="text-[9px] font-black tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-1 rounded border border-emerald-100/55 dark:border-emerald-900 uppercase">
                  Ulasan Definitif
                </span>
                <h2 className="text-xl font-serif font-extrabold text-slate-900 dark:text-emerald-50 mt-3.5 mb-2.5">
                  {activeRule.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-emerald-355 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border-l-[4px] border-emerald-500 font-medium">
                  {activeRule.definition}
                </p>
              </div>

              {/* How to study reading guidelines */}
              <div className="bg-amber-50/50 dark:bg-amber-955 border border-amber-900/10 px-4 py-3.5 rounded-xl flex items-center gap-2 text-xxs">
                <span className="text-base">📢</span>
                <div className="font-bold text-amber-805 dark:text-amber-300">
                  <span className="uppercase text-[9px] block">CARA MEMBACA:</span>
                  {activeRule.howToRead}
                </div>
              </div>

              {/* LIST OF INTERACTIVE EXAMPLES */}
              <div className="space-y-4">
                <span className="block text-[10px] font-extrabold text-slate-450 dark:text-emerald-400 uppercase tracking-widest mb-1.5 pl-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                  Contoh Potongan Ayat Al-Qur'an:
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeRule.examples.map((ex, exIdx) => {
                    return (
                      <div
                        key={exIdx}
                        className="p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[145px] hover:shadow-xs bg-slate-50/45 dark:bg-slate-950/45 border-slate-150 dark:border-slate-800 hover:border-slate-205"
                      >
                        {/* Arabic script container */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-450 mt-2" />
                          <div className="text-2xl font-serif text-slate-950 dark:text-white leading-loose hover:scale-105 origin-right transition-transform font-bold">
                            {ex.arabic}
                          </div>
                        </div>

                        {/* Pronunciation metadata details */}
                        <div className="border-t border-slate-100 dark:border-slate-850 mt-3.5 pt-2.5 text-xs text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-800 dark:text-emerald-100 tracking-wide">
                              {ex.latin}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                              QS. {ex.surah}:{ex.ayah}
                            </span>
                          </div>
                          <span className="block text-[10px] text-emerald-650 dark:text-emerald-400 font-bold mt-1 line-clamp-1">
                            {ex.explanation}
                          </span>
                          <span className="block text-[10px] text-slate-400 dark:text-emerald-400/50 italic font-semibold truncate mt-0.5">
                            &ldquo;{ex.meaning}&rdquo;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <HelpCircle className="w-12 h-12 mx-auto stroke-1" />
              <p className="mt-2 text-sm">Pilih hukum tajwid pada daftar untuk menampilkan materi lengkap.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
