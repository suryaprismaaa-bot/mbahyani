/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Volume2, Sparkles, Smile, ArrowRight, RotateCcw, Heart, CheckCircle2, BookOpenCheck, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAbsoluteAyah } from './TajweedLearning';

interface TilawatiLetter {
  hijaiyah: string;
  latin: string;
  ruleDetail: string;
  phoneticGuide: string;
  surah?: number;
  ayah?: number;
}

interface JilidMaterial {
  title: string;
  subtitle: string;
  introRule: string;
  letters: TilawatiLetter[];
}

const JILID_MATERIALS: Record<number, JilidMaterial> = {
  1: {
    title: "Tilawati Jilid 1",
    subtitle: "Mengenal Huruf Hijaiyah Tunggal Harokat Fathah",
    introRule: "Ketentuan: Dibaca pendek, lugas, cepat satu ketukan (tidak boleh diseret/dipanjangkan). Selesaikan seluruh 29 huruf hijaiyah berikut.",
    letters: [
      { hijaiyah: 'اَ', latin: 'A', ruleDetail: 'Alif Fathah dibaca A (pendek)', phoneticGuide: 'Ah' },
      { hijaiyah: 'بَ', latin: 'Ba', ruleDetail: 'Ba Fathah dibaca Ba (pendek)', phoneticGuide: 'Bah' },
      { hijaiyah: 'تَ', latin: 'Ta', ruleDetail: 'Ta Fathah dibaca Ta (pendek)', phoneticGuide: 'Tah' },
      { hijaiyah: 'ثَ', latin: 'Tsa', ruleDetail: 'Tsa Fathah dibaca Tsa (ujung lidah digigit)', phoneticGuide: 'Tsah' },
      { hijaiyah: 'جَ', latin: 'Ja', ruleDetail: 'Jim Fathah dibaca Ja (bersih)', phoneticGuide: 'Jah' },
      { hijaiyah: 'حَ', latin: 'Ha', ruleDetail: 'Ha Fathah dibaca Ha (halus/pedas di tenggorokan)', phoneticGuide: 'Hah' },
      { hijaiyah: 'خَ', latin: 'Kho', ruleDetail: 'Kho Fathah dibaca Kho (tebal berdesis)', phoneticGuide: 'Khoh' },
      { hijaiyah: 'دَ', latin: 'Da', ruleDetail: 'Dal Fathah dibaca Da (pendek)', phoneticGuide: 'Dah' },
      { hijaiyah: 'ذَ', latin: 'Dza', ruleDetail: 'Dzal Fathah dibaca Dza (lunak)', phoneticGuide: 'Dzah' },
      { hijaiyah: 'رَ', latin: 'Ro', ruleDetail: 'Ro Fathah dibaca Ro (tebal)', phoneticGuide: 'Roh' },
      { hijaiyah: 'زَ', latin: 'Za', ruleDetail: 'Za Fathah dibaca Za (berdesis tajam)', phoneticGuide: 'Zah' },
      { hijaiyah: 'سَ', latin: 'Sa', ruleDetail: 'Sin Fathah dibaca Sa (berdesis lembut)', phoneticGuide: 'Sah' },
      { hijaiyah: 'شَ', latin: 'Sya', ruleDetail: 'Syin Fathah dibaca Sya (tebal memenuhi mulut)', phoneticGuide: 'Siyah' },
      { hijaiyah: 'صَ', latin: 'Sho', ruleDetail: 'Shod Fathah dibaca Sho (bulat mengembung)', phoneticGuide: 'Shor' },
      { hijaiyah: 'ضَ', latin: 'Dho', ruleDetail: 'Dhod Fathah dibaca Dho (tebal di sisi lidah)', phoneticGuide: 'Dhoh' },
      { hijaiyah: 'طَ', latin: 'Tho', ruleDetail: 'Tho Fathah dibaca Tho (kuat meletup)', phoneticGuide: 'Thoh' },
      { hijaiyah: 'ظَ', latin: 'Zho', ruleDetail: 'Zho Fathah dibaca Zho (lunak tebal)', phoneticGuide: 'Zhoh' },
      { hijaiyah: 'عَ', latin: '‘A', ruleDetail: '‘Ain Fathah dibaca ‘A (tengah tenggorokan)', phoneticGuide: 'Ah' },
      { hijaiyah: 'غَ', latin: 'Gho', ruleDetail: 'Ghoin Fathah dibaca Gho (atas tenggorokan)', phoneticGuide: 'Ghoh' },
      { hijaiyah: 'فَ', latin: 'Fa', ruleDetail: 'Fa Fathah dibaca Fa (gigi atas di bibir bawah)', phoneticGuide: 'Fah' },
      { hijaiyah: 'قَ', latin: 'Qo', ruleDetail: 'Qof Fathah dibaca Qo (tebal pangkal lidah)', phoneticGuide: 'Qoh' },
      { hijaiyah: 'كَ', latin: 'Ka', ruleDetail: 'Kaf Fathah dibaca Ka (halus)', phoneticGuide: 'Kah' },
      { hijaiyah: 'لَ', latin: 'La', ruleDetail: 'Lam Fathah dibaca La (cepat)', phoneticGuide: 'Lah' },
      { hijaiyah: 'مَ', latin: 'Ma', ruleDetail: 'Mim Fathah dibaca Ma (bibir tertutup)', phoneticGuide: 'Mah' },
      { hijaiyah: 'نَ', latin: 'Na', ruleDetail: 'Nun Fathah dibaca Na (pendek)', phoneticGuide: 'Nah' },
      { hijaiyah: 'وَ', latin: 'Wa', ruleDetail: 'Wau Fathah dibaca Wa (membulat)', phoneticGuide: 'Wah' },
      { hijaiyah: 'هَ', latin: 'Ha', ruleDetail: 'Ha Fathah dibaca Ha (besar/bawah dada)', phoneticGuide: 'Hah' },
      { hijaiyah: 'ءَ', latin: 'A', ruleDetail: 'Hamzah Fathah dibaca A (pangkal tenggorokan)', phoneticGuide: 'Ah' },
      { hijaiyah: 'يَ', latin: 'Ya', ruleDetail: 'Ya Fathah dibaca ya', phoneticGuide: 'Yah' }
    ]
  },
  2: {
    title: "Tilawati Jilid 2",
    subtitle: "Harokat Kasrah, Dhommah, dan Mad Alif (Panjang)",
    introRule: "Ketentuan: Kasrah berbunyi 'I', Dhommah berbunyi 'U', Mad Alif dibaca panjang 2 ketukan. Berikut tambahan materi kosakata lengkap mirip buku mukaddimah fisik.",
    letters: [
      { hijaiyah: 'اَ - اِ - اُ', latin: 'A - I - U', ruleDetail: 'Perubahan bunyi dasar Fathah, Kasrah, Dhommah', phoneticGuide: 'A, I, U' },
      { hijaiyah: 'بَ - بِ - بُ', latin: 'Ba - Bi - Bu', ruleDetail: 'Konsonan Ba: Ba, Bi, Bu (pendek)', phoneticGuide: 'Ba, Bi, Bu' },
      { hijaiyah: 'تَ - تَ - تُ', latin: 'Ta - Ti - Tu', ruleDetail: 'Konsonan Ta: Ta, Ti, Tu (cepat)', phoneticGuide: 'Ta, Ti, Tu' },
      { hijaiyah: 'جَ - جِ - جُ', latin: 'Ja - Ji - Ju', ruleDetail: 'Konsonan Jim: Ja, Ji, Ju (jelas)', phoneticGuide: 'Ja, Ji, Ju' },
      { hijaiyah: 'دَ - دِ - دُ', latin: 'Da - Di - Du', ruleDetail: 'Konsonan Dal: Da, Di, Du', phoneticGuide: 'Da, Di, Du' },
      { hijaiyah: 'سَ - سِ - سُ', latin: 'Sa - Si - Su', ruleDetail: 'Konsonan Sin: Sa, Si, Su', phoneticGuide: 'Sa, Si, Su' },
      { hijaiyah: 'بَا', latin: 'Baa (2 Harokat)', ruleDetail: 'Mad Alif Al-Baqarah 2:125', phoneticGuide: 'Baa', surah: 2, ayah: 125 },
      { hijaiyah: 'تَا', latin: 'Taa (2 Harokat)', ruleDetail: 'Mad Alif At-Tin 95:1', phoneticGuide: 'Taa', surah: 95, ayah: 1 },
      { hijaiyah: 'جَاۤءَ', latin: 'Jaaa (2 Harokat)', ruleDetail: 'Mad Alif An-Nasr 110:1', phoneticGuide: 'Jaa', surah: 110, ayah: 1 },
      { hijaiyah: 'خَلَقَ', latin: 'Kho-la-qo', ruleDetail: 'Al-Alaq 96:1 - Kho-la-qo (Menciptakan)', phoneticGuide: 'Kholaqo', surah: 96, ayah: 1 },
      { hijaiyah: 'فَعَلَ', latin: 'Fa-\'a-la', ruleDetail: 'Al-Fil 105:1 - Fa-\'a-la (Telah berbuat)', phoneticGuide: 'Fa ala', surah: 105, ayah: 1 },
      { hijaiyah: 'كَتَبَ', latin: 'Ka-ta-ba', ruleDetail: 'Al-Baqarah 2:183 - Ka-ta-ba (Telah diwajibkan)', phoneticGuide: 'Kataba', surah: 2, ayah: 183 },
      { hijaiyah: 'صَدَقَ', latin: 'Sho-da-qo', ruleDetail: 'Ali Imran 3:95 - Sho-da-qo (Benarlah)', phoneticGuide: 'Shodaqo', surah: 3, ayah: 95 },
      { hijaiyah: 'عَبَدَ', latin: '‘A-ba-da', ruleDetail: 'Al-Kafirun 109:3 - ‘Abada (Menyembah)', phoneticGuide: 'Abada', surah: 109, ayah: 3 },
      { hijaiyah: 'جَعَلَ', latin: 'Ja-\'a-la', ruleDetail: 'Al-Fil 105:2 - Ja-\'a-la (Menjadikan)', phoneticGuide: 'Jaala', surah: 105, ayah: 2 },
      { hijaiyah: 'كَفَرَ', latin: 'Ka-fa-ro', ruleDetail: 'Al-Bayyinah 98:6 - Ka-fa-ro (Orang-orang kafir)', phoneticGuide: 'Kafaro', surah: 98, ayah: 6 },
      { hijaiyah: 'دَخَلَ', latin: 'Da-kho-la', ruleDetail: 'An-Nasr 110:2 - Da-kho-la (Masuk)', phoneticGuide: 'Dakhola', surah: 110, ayah: 2 },
      { hijaiyah: 'وَلَدَ', latin: 'Wa-la-da', ruleDetail: 'Al-Ikhlas 112:3 - Wa-la-da (Melahirkan)', phoneticGuide: 'Walada', surah: 112, ayah: 3 },
      { hijaiyah: 'طَبَعَ', latin: 'Tho-ba-\'a', ruleDetail: 'At-Tawbah 9:93 - Tho-ba-\'a (Telah mengunci)', phoneticGuide: 'Thoba\'a', surah: 9, ayah: 93 }
    ]
  },
  3: {
    title: "Tilawati Jilid 3",
    subtitle: "Mengenal Tanwin dan Mad Thabi'i Wawu & Ya Sukun",
    introRule: "Ketentuan: Tanwin berbunyi 'an, in, un'. Mad Thabi'i (Ya/Wawu sukun) dibaca panjang 2 ketukan. Dipandu panduan visual latin dan tatanan makhraj murni.",
    letters: [
      { hijaiyah: 'اَنْ - اِنْ - اُنْ', latin: 'An - In - Un', ruleDetail: 'Suara tanwin mengalun di akhir, dibaca pendek', phoneticGuide: 'An, In, Un' },
      { hijaiyah: 'بَنْ - بِنْ - بُنْ', latin: 'Ban - Bin - Bun', ruleDetail: 'Konsonan Ba dengan Tanwin', phoneticGuide: 'Ban, Bin, Bun' },
      { hijaiyah: 'تَنْ - تِنْ - تُنْ', latin: 'Tan - Tin - Tun', ruleDetail: 'Konsonan Ta dengan Tanwin', phoneticGuide: 'Tan, Tin, Tun' },
      { hijaiyah: 'خَنْ - خِنْ - خُنْ', latin: 'Khon - Khin - Khun', ruleDetail: 'Konsonan Kho Tanwin (tebal)', phoneticGuide: 'Khon, Khin, Khun' },
      { hijaiyah: 'بِيْ', latin: 'Bii', ruleDetail: 'Mad Ya Sukun (panjang 2 ketukan)', phoneticGuide: 'Bii' },
      { hijaiyah: 'تِيْ', latin: 'Tii', ruleDetail: 'Mad Ya Sukun (panjang 2 ketukan)', phoneticGuide: 'Tii' },
      { hijaiyah: 'بُوْ', latin: 'Buu', ruleDetail: 'Mad Wawu Sukun (panjang 2 ketukan)', phoneticGuide: 'Buu' },
      { hijaiyah: 'تُوْ', latin: 'Tuu', ruleDetail: 'Mad Wawu Sukun (panjang 2 ketukan)', phoneticGuide: 'Tuu' },
      { hijaiyah: 'عَلِيْمٌ', latin: '\'Aliimun', ruleDetail: 'Al-Baqarah 2:29 - \'Aliimun (Maha Mengetahui)', phoneticGuide: 'Alimun', surah: 2, ayah: 29 },
      { hijaiyah: 'غَفُوْرٌ', latin: 'Ghofuurun', ruleDetail: 'Al-Baqarah 2:173 - Ghofuurun (Maha Pengampun)', phoneticGuide: 'Ghofurun', surah: 2, ayah: 173 },
      { hijaiyah: 'حَكِيْمٌ', latin: 'Hakiimun', ruleDetail: 'Al-Baqarah 2:32 - Hakiimun (Maha Bijaksana)', phoneticGuide: 'Hakimun', surah: 2, ayah: 32 },
      { hijaiyah: 'كَرِيْمٌ', latin: 'Kariimun', ruleDetail: 'Al-Infitar 82:6 - Kariimun (Maha Mulia)', phoneticGuide: 'Karimun', surah: 82, ayah: 6 },
      { hijaiyah: 'شَكُوْرٌ', latin: 'Syakuurun', ruleDetail: 'At-Taghabun 64:17 - Syakuurun (Maha Mensyukuri)', phoneticGuide: 'Syakurun', surah: 64, ayah: 17 },
      { hijaiyah: 'سَمِيْعٌ', latin: 'Samii\'un', ruleDetail: 'Al-Isra 17:1 - Samii\'un (Maha Mendengar)', phoneticGuide: 'Sami\'un', surah: 17, ayah: 1 },
      { hijaiyah: 'بَصِيْرٌ', latin: 'Boshiirun', ruleDetail: 'Al-Isra 17:1 - Boshiirun (Maha Melihat)', phoneticGuide: 'Boshirun', surah: 17, ayah: 1 },
      { hijaiyah: 'رَحِيْمٌ', latin: 'Rahiimun', ruleDetail: 'Al-Fatihah 1:3 - Rahiimun (Maha Penyayang)', phoneticGuide: 'Rahimun', surah: 1, ayah: 3 },
      { hijaiyah: 'قَدِيْرٌ', latin: 'Qadiirun', ruleDetail: 'Al-Baqarah 2:20 - Qadiirun (Maha Kuasa)', phoneticGuide: 'Qodirun', surah: 2, ayah: 20 },
      { hijaiyah: 'شَدِيْدٌ', latin: 'Syadiidun', ruleDetail: 'Al-Baqarah 2:165 - Syadiidun (Amat bersangatan)', phoneticGuide: 'Syadidun', surah: 2, ayah: 165 },
      { hijaiyah: 'لَطِيْفٌ', latin: 'Lathiifun', ruleDetail: 'Al-Mulk 67:14 - Lathiifun (Maha Lembut)', phoneticGuide: 'Lotifun', surah: 67, ayah: 14 }
    ]
  },
  4: {
    title: "Tilawati Jilid 4",
    subtitle: "Mengenal Sukun (Huruf Mati), Qolqolah, dan Alif Lam Qomariyah",
    introRule: "Ketentuan: Sukun adalah huruf mati. Qolqolah dipantulkan ringan (Ba, Ju, Di, To, Ko). Izhar Al (Lam dibaca jelas). Disusun berbasis panduan visual tanpa contoh suara.",
    letters: [
      { hijaiyah: 'اَبْ', latin: 'Ab (Memantul)', ruleDetail: 'Al-Masad 111:1 - Qolqolah Ba mati memantul', phoneticGuide: 'Ab', surah: 111, ayah: 1 },
      { hijaiyah: 'اَدْ', latin: 'Ad (Memantul)', ruleDetail: 'Al-Ikhlas 112:1 - Qolqolah Dal mati memantul', phoneticGuide: 'Ad', surah: 112, ayah: 1 },
      { hijaiyah: 'اَقْ', latin: 'Aq (Tebal)', ruleDetail: 'Al-Falaq 113:1 - Qolqolah Qof mati memantul tebal', phoneticGuide: 'Aq', surah: 113, ayah: 1 },
      { hijaiyah: 'اَلْحَمْدُ', latin: 'Al-hamdu', ruleDetail: 'Al-Fatihah 1:2 - Alif Lam Qomariyah lam dibaca jelas', phoneticGuide: 'Alhamdu', surah: 1, ayah: 2 },
      { hijaiyah: 'تَجْرِيْ', latin: 'Tajrii', ruleDetail: 'Al-Baqarah 2:25 - Qolqolah Jim mati bersambung Mad Ya', phoneticGuide: 'Tajrii', surah: 2, ayah: 25 },
      { hijaiyah: 'وَالْفَتْحُ', latin: 'Wal-fathu', ruleDetail: 'An-Nasr 110:1 - Alif Lam terang dan Tsa sukun berdesis', phoneticGuide: 'Walfathu', surah: 110, ayah: 1 },
      { hijaiyah: 'رَزَقْنٰكُمْ', latin: 'Rozaqnaakum', ruleDetail: 'Al-Baqarah 2:57 - Qolqolah Qof di lafadz rezki', phoneticGuide: 'Rozaqnakum', surah: 2, ayah: 57 },
      { hijaiyah: 'وَالْعَصْرِ', latin: 'Wal-\'asri', ruleDetail: 'Al-Asr 103:1 - Alif Lam Qomariyah dan Shod sukun', phoneticGuide: 'Walasri', surah: 103, ayah: 1 },
      { hijaiyah: 'يَدْخُلُوْنَ', latin: 'Yadkhuluuna', ruleDetail: 'An-Nasr 110:2 - Qolqolah Dal dan Mad Wawu', phoneticGuide: 'Yadkhuluna', surah: 110, ayah: 2 },
      { hijaiyah: 'وَالْقَمَرِ', latin: 'Wal-qomari', ruleDetail: 'Al-Qamar 54:1 - Alif Lam Qomariyah yang bermakna bulan', phoneticGuide: 'Walqomari', surah: 54, ayah: 1 },
      { hijaiyah: 'يَشْرَبُوْنَ', latin: 'Yasyrabuuna', ruleDetail: 'Al-Insan 76:5 - Syin mati menebarkan hembusan nafas', phoneticGuide: 'Yasyrabuna', surah: 76, ayah: 5 },
      { hijaiyah: 'يَعْمَلُوْنَ', latin: 'Ya\'maluuna', ruleDetail: 'Al-Baqarah 2:75 - ‘Ain mati di tengah kata berharokat sukun', phoneticGuide: 'Yamaluna', surah: 2, ayah: 75 },
      { hijaiyah: 'يُبْدِئُ', latin: 'Yubdi-u', ruleDetail: 'Al-Buruj 85:13 - Qolqolah Ba dipantulkan pendek menghentak', phoneticGuide: 'Yubdiu', surah: 85, ayah: 13 }
    ]
  },
  5: {
    title: "Tilawati Jilid 5",
    subtitle: "Menerapkan Tasydid, Ghunnah Musyaddadah, dan Alif Lam Syamsiyah",
    introRule: "Ketentuan: Tasydid ditekan kuat. Ghunnah berdengung merdu pada Nun/Mim tasydid ditahan 2-3 ketukan. Al Syamsiyah melebur bersih.",
    letters: [
      { hijaiyah: 'اِنَّ', latin: 'Inna (Dengung)', ruleDetail: 'Al-Kautsar 108:3 - Ghunnah dengung pada Nun tasydid', phoneticGuide: 'Inna', surah: 108, ayah: 3 },
      { hijaiyah: 'رَبِّ', latin: 'Rabbi', ruleDetail: 'Al-Fatihah 1:2 - Penekanan tasydid huruf Ba murni', phoneticGuide: 'Rabbi', surah: 1, ayah: 2 },
      { hijaiyah: 'اَلصَّلَاةُ', latin: 'As-sholaatu', ruleDetail: 'Al-Baqarah 2:3 - Alif Lam Syamsiyah langsung ke Shod', phoneticGuide: 'Assholatu', surah: 2, ayah: 3 },
      { hijaiyah: 'جَاۤءَ', latin: 'Jaa-a (Panjang)', ruleDetail: 'An-Nasr 110:1 - Mad Wajib bendera panjang 5 ketukan', phoneticGuide: 'Jaa a', surah: 110, ayah: 1 },
      { hijaiyah: 'وَلَا الضَّاۤلِّيْنَ', latin: 'Waladh-dhaalliin', ruleDetail: 'Al-Fatihah 1:7 - Mad Lazim panjang 6 ketukan bersambung tasydid', phoneticGuide: 'Waladhdholliin', surah: 1, ayah: 7 },
      { hijaiyah: 'اَلنَّاسُ', latin: 'An-naasu', ruleDetail: 'An-Nas 114:1 - Alif Lam Syamsiyah dan Ghunnah mendengung', phoneticGuide: 'Annasu', surah: 114, ayah: 1 },
      { hijaiyah: 'يَوَدُّ', latin: 'Yawaddu', ruleDetail: 'Al-Baqarah 2:96 - Tekanan kuat ganda huruf Dal', phoneticGuide: 'Yawaddu', surah: 2, ayah: 96 },
      { hijaiyah: 'مِنْ شَرِّ', latin: 'Min syarri', ruleDetail: 'Al-Falaq 113:4 - Ikhfa diikuti penekanan tipis Ro', phoneticGuide: 'Min syarri', surah: 113, ayah: 4 },
      { hijaiyah: 'يَوْمَئِذٍ لَّخَبِيْرٌ', latin: 'Yauma-idzil-lakhabiir', ruleDetail: 'Al-Adiyat 100:11 - Idgham Bilaghunnah melebur tanpa dengung', phoneticGuide: 'Yaumaidzil lakhabir', surah: 100, ayah: 11 },
      { hijaiyah: 'اَلرَّحْمٰنِ', latin: 'Ar-rohmaani', ruleDetail: 'Al-Fatihah 1:1 - Al Syamsiyah melebur bulat ke huruf Ra', phoneticGuide: 'Arrohmaan', surah: 1, ayah: 1 },
      { hijaiyah: 'تَبَّتْ', latin: 'Tabbat', ruleDetail: 'Al-Masad 111:1 - Tasydid Ba disusul Ta sukun berdesis', phoneticGuide: 'Tabbat', surah: 111, ayah: 1 },
      { hijaiyah: 'جَنَّاتِ', latin: 'Jannaatin', ruleDetail: 'Al-Buruj 85:11 - Dengung lebur Nun tasydid panjang 2 ketukan', phoneticGuide: 'Jannaat', surah: 85, ayah: 11 }
    ]
  },
  6: {
    title: "Tilawati Jilid 6",
    subtitle: "Panduan Waqaf (Henti), Saktah, dan Istilah Bacaan Ghorib",
    introRule: "Ketentuan: Cara waqaf berhenti di akhir ayat, saktah diam sejenak tanpa bernafas, dan lafadz khusus yang asing dibaca berbeda (Ghorib).",
    letters: [
      { hijaiyah: 'أَحَدٌ 👉... أَحَدْ', latin: 'Ahadun menjadi Ahad', ruleDetail: 'Al-Ikhlas 112:1 - Waqaf mematikan huruf akhir menjadi Qolqolah pantul', phoneticGuide: 'Ahad', surah: 112, ayah: 1 },
      { hijaiyah: 'مُسْتَقِيْمٍ 👉... مُسْتَقِيْمْ', latin: 'Mustaqiim (Waqaf)', ruleDetail: 'Al-Fatihah 1:6 - Mad Arid Lissukun dibaca panjang 2, 4, 6 ketukan', phoneticGuide: 'Mustaqiim', surah: 1, ayah: 6 },
      { hijaiyah: 'عِوَجًا ۜ قَيِّمًا', latin: 'Saktah (Henti Nafas)', ruleDetail: 'Al-Kahf 18:1-2 - Saktah berhenti sejenak tanpa nafas baru', phoneticGuide: 'Iwajaa qoyyimaa', surah: 18, ayah: 1 },
      { hijaiyah: 'بِئْسَ الِاسْمُ', latin: 'Bi\'sal-ismu (Naql)', ruleDetail: 'Al-Hujurat 49:11 - Ghorib Naql dibaca menjadi Bi\'sal-ismu', phoneticGuide: 'Bisal ismu', surah: 49, ayah: 11 },
      { hijaiyah: 'مَجْرٰ۪ىهَا', latin: 'Majreeha (Imalah)', ruleDetail: 'Hud 11:41 - Ghorib Imalah mencondongkan Fathah ke Kasrah (Ree)', phoneticGuide: 'Majreha', surah: 11, ayah: 41 },
      { hijaiyah: 'ءَاَعْجَمِيٌّ', latin: 'A-a\'jamiyyun (Tashil)', ruleDetail: 'Fussilat 41:44 - Ghorib Tashil hamzah kedua dibaca samar ringan', phoneticGuide: 'A-ajamiyyun', surah: 41, ayah: 44 },
      { hijaiyah: 'لَا تَأْمَنَّا', latin: 'Laa Ta\'mannaa (Isymam)', ruleDetail: 'Yusuf 12:11 - Isymam mencucu bibir tanpa suara di sela dengung', phoneticGuide: 'Laa tamanna', surah: 12, ayah: 11 },
      { hijaiyah: 'سَلٰسِلَا۟', latin: 'Salaasila (Qoshr)', ruleDetail: 'Al-Insan 76:4 - Qoshr alif tambahan tidak panjang ketika washol', phoneticGuide: 'Salasila', surah: 76, ayah: 4 }
    ]
  }
};

const MASCOTS = [
  { id: 'domba', name: "Milo Si Domba Sholeh 🐑", intro: "Milo siap menuntun tajwidmu!", text: "Mbeeek! Ayo kita pelajari detail kartunya dan berlatih melafalkannya!" },
  { id: 'kucing', name: "Zizoo Si Kucing Pintar 🐱", intro: "Zizoo akan membantumu meraih bintang!", text: "Meowww! Hebat sekali belajarnya, ayo selesaikan kuis nanti!" },
  { id: 'lebah', name: "Apin Si Lebah Rajin 🐝", intro: "Apin membawa madu ilmu Qur'an!", text: "Bzzzt! Mengaji Tilawati itu asyik, menyenangkan, dan mulia!" }
];

export default function TilawatiLearning() {
  const [activeJilid, setActiveJilid] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [activeMascotIdx, setActiveMascotIdx] = useState<number>(0);

  // Quiz states
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizRound, setQuizRound] = useState<number>(1);
  const [quizQuestion, setQuizQuestion] = useState<{ q: string; correctAns: string; options: string[] } | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ status: 'correct' | 'incorrect' | null; message: string }>({ status: null, message: '' });
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(false);

  const activeMascot = MASCOTS[activeMascotIdx];
  const material = JILID_MATERIALS[activeJilid];

  // Generate interactive quiz questions dynamically based on current selected Jilid context or entire Jilids pool
  const generateQuiz = () => {
    const lettersPool = material.letters;
    const target = lettersPool[Math.floor(Math.random() * lettersPool.length)];
    
    const uniqueOptions = new Set<string>();
    uniqueOptions.add(target.hijaiyah);
    
    const allLetterPool: string[] = [];
    Object.values(JILID_MATERIALS).forEach(j => {
      j.letters.forEach(l => allLetterPool.push(l.hijaiyah));
    });

    while (uniqueOptions.size < 4) {
      const fallbackItem = allLetterPool[Math.floor(Math.random() * allLetterPool.length)];
      uniqueOptions.add(fallbackItem);
    }
    
    setQuizQuestion({
      q: `Manakah huruf, bunyi harokat, atau lafadz/kalimah tajwid yang memiliki transliterasi latin "${target.latin}"?`,
      correctAns: target.hijaiyah,
      options: shuffleArray(Array.from(uniqueOptions))
    });
    setQuizFeedback({ status: null, message: '' });
  };

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleStartQuiz = () => {
    setQuizScore(0);
    setQuizRound(1);
    setHasCompletedQuiz(false);
    generateQuiz();
  };

  const handleAnswer = (ans: string) => {
    if (!quizQuestion) return;
    if (ans === quizQuestion.correctAns) {
      setQuizScore(prev => prev + 10);
      setQuizFeedback({
        status: 'correct',
        message: `Maa syaa Allah! Pilihanmu BENAR! Kamu hebat sekali!`
      });
    } else {
      setQuizFeedback({
        status: 'incorrect',
        message: `Opps, belum tepat ya. Jawaban yang benar adalah "${quizQuestion.correctAns}". Ayo terus mencoba, jangan menyerah!`
      });
    }
  };

  const handleNextQuestion = () => {
    if (quizRound >= 5) {
      setHasCompletedQuiz(true);
      setQuizQuestion(null);
    } else {
      setQuizRound(prev => prev + 1);
      generateQuiz();
    }
  };

  return (
    <div id="tilawati-container" className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Dynamic Bright Header */}
      <div className="text-center mb-8 relative">
        <span className="px-4 py-1.5 bg-sky-50 dark:bg-slate-900/45 text-sky-600 dark:text-sky-400 text-xs font-black uppercase tracking-widest rounded-full border border-sky-100 dark:border-sky-900 inline-flex items-center gap-1.5 shadow-xs">
          <BookOpenCheck className="w-3.5 h-3.5 text-sky-500 animate-spin" style={{ animationDuration: '4s' }} />
          🌈 Pembelajaran Seri Tilawati Lengkap (Jilid 1 - 6)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-emerald-50 mt-4 tracking-tight">
          Belajar Tilawati Interaktif
        </h1>
        <p className="text-slate-650 dark:text-emerald-300 mt-2.5 text-sm max-w-lg mx-auto leading-relaxed font-semibold">
          Didesain lengkap menyamai kurikulum buku fisik Tilawati Jilid 1 sampai 6. Dilengkapi kartu makhroj belajar lafadz mandiri terstruktur dan visual (tanpa contoh bunyi suara) bagi Keluarga Besar Mbah Yani.
        </p>
      </div>

      {/* Mascot Interaction Panel */}
      <div id="mascot-panel" className="bg-gradient-to-r from-sky-50/70 via-white to-emerald-50/60 dark:from-slate-900/35 dark:to-slate-850 p-6 border border-sky-100/60 dark:border-slate-800 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6 shadow-xs">
        <div className="text-5xl animate-bounce duration-[2000ms] select-none shrink-0">
          {activeMascot.id === 'domba' ? '🐑' : activeMascot.id === 'kucing' ? '🐱' : '🐝'}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-extrabold text-sm text-sky-700 dark:text-sky-400 font-sans">
            {activeMascot.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-sky-200 mt-1 font-semibold">
            {activeMascot.intro}
          </p>
          <div className="mt-2.5 inline-block bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 py-2.5 px-4 rounded-2xl shadow-xs relative">
            <span className="text-xs font-bold text-slate-700 dark:text-emerald-100 block leading-relaxed">
              &ldquo;{activeMascot.text}&rdquo;
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {MASCOTS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMascotIdx(idx);
              }}
              className={`p-2.5 rounded-xl border text-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                activeMascotIdx === idx
                  ? 'bg-sky-400 text-white border-sky-400'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-emerald-100 border-slate-205 dark:border-slate-800 shadow-xs hover:bg-slate-50'
              }`}
              title={`Ganti Maskot: ${m.name}`}
            >
              {m.id === 'domba' ? '🐑' : m.id === 'kucing' ? '🐱' : '🐝'}
            </button>
          ))}
        </div>
      </div>

      {/* JILID SELECTION TABS GRID 1 TO 6 */}
      <div id="jilid-selector" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {([1, 2, 3, 4, 5, 6] as const).map((num) => {
          const isSelected = activeJilid === num;
          return (
            <button
              key={num}
              onClick={() => {
                setActiveJilid(num);
              }}
              className={`py-3.5 px-3 rounded-2xl border transition-all text-center cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-450 to-emerald-500 text-white border-sky-400 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-sky-100 dark:border-slate-800 text-slate-700 dark:text-emerald-150 hover:bg-sky-50/40 shadow-xs'
              }`}
            >
              <div className={`block font-black text-md ${isSelected ? 'scale-105 font-extrabold' : ''}`}>
                Jilid {num}
              </div>
              <div className={`text-[9px] uppercase font-bold mt-1 tracking-wider ${isSelected ? 'text-sky-50' : 'text-slate-400'}`}>
                {num === 1 && 'Fathah Tunggal'}
                {num === 2 && 'I - U & Mad Alif'}
                {num === 3 && 'Tanwin & Mad'}
                {num === 4 && 'Sukun / Mati'}
                {num === 5 && 'Tasydid & Al'}
                {num === 6 && 'Waqaf & Ghorib'}
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* DETAILED EDUCATIONAL INFO SHEET ABOUT SELECTED JILID */}
      <div id="jilid-guide" className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 p-6 rounded-3xl shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 gap-3">
          <div className="text-left">
            <h2 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-emerald-605" />
              {material.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wide">{material.subtitle}</p>
          </div>
          <span className="self-start sm:self-center px-3.5 py-1 bg-amber-50 dark:bg-amber-955 text-amber-750 dark:text-amber-300 font-bold rounded-lg border border-amber-200 dark:border-amber-900 text-xxs">
            ⭐ Buku Seri Kurikulum Fisik
          </span>
        </div>
        <p className="text-slate-655 dark:text-emerald-300 text-xs leading-relaxed font-semibold italic text-left bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border-l-[4px] border-emerald-500">
          {material.introRule}
        </p>
      </div>

      {/* CARDS CONTAINER */}
      <div className="text-left pl-1 mb-4 flex items-center justify-between">
        <h3 className="text-[10px] font-extrabold text-slate-400 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Makharijul Huruf, Tanda Baca & lafadz terkait jilid:
        </h3>
      </div>
      
      <div id="letters-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {material.letters.map((item, idx) => {
          return (
            <div
              key={idx}
              id={`letter-item-${idx}`}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border text-center transition-all relative overflow-hidden flex flex-col items-center justify-between min-h-[185px] group shadow-xs border-slate-200/90 dark:border-slate-800 hover:border-sky-350 shadow-xxs"
            >
              <div className="absolute top-2.5 left-3 text-[9px] font-black font-semibold text-emerald-600 dark:text-emerald-400">
                {item.surah && item.ayah ? `📖 QS ${item.surah}:${item.ayah}` : 'Materi'}
              </div>
              <div className="absolute top-2.5 right-3 text-[9px] font-black font-mono text-slate-400">
                {idx + 1}
              </div>

              {/* Large Arabic Hijaiyah letter */}
              <div className="text-4xl font-serif text-slate-900 dark:text-white font-normal leading-normal transition-transform duration-300 mt-2 group-hover:scale-108">
                {item.hijaiyah}
              </div>

              {/* Latin & Rule details */}
              <div className="mt-4 w-full border-t border-slate-100 dark:border-slate-850 pt-2 text-center">
                <span className="block text-sm font-black text-slate-800 dark:text-emerald-100 tracking-wide">
                  {item.latin}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-emerald-355 mt-1 font-bold leading-relaxed line-clamp-2">
                  {item.ruleDetail}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KIDS QUIZ SECTION */}
      <div id="quiz-section" className="bg-gradient-to-b from-white to-sky-50/40 dark:from-slate-900 dark:to-slate-950 p-6 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-xs text-center md:text-left">
        <h3 className="font-extrabold text-lg text-slate-850 dark:text-emerald-50 flex items-center justify-center md:justify-start gap-1 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <Award className="w-6 h-6 text-amber-500 shrink-0 animate-pulse" />
          Kuis Belajar Tilawati Cerdas (Nilai Studi)
        </h3>

        {!quizQuestion && !hasCompletedQuiz ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3 animate-bounce">🎓</span>
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-emerald-50">Uji Kelancaran Mengaji Jilid Anda</h4>
            <p className="text-xs text-slate-500 dark:text-emerald-300 max-w-sm mx-auto mt-2 leading-relaxed">
              Mainkan kuis interaktif berdasarkan kurikulum Tilawati untuk mengevaluasi pemahaman harokat, huruf sukun, tasydid, dan makhroj Anda.
            </p>
            <button
              id="start-quiz-btn"
              onClick={handleStartQuiz}
              className="mt-5 px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-black rounded-2xl shadow-sm text-xs cursor-pointer active:scale-97"
            >
              MULAI MAIN KUIS &times; 5 SOAL
            </button>
          </div>
        ) : quizQuestion ? (
          <div className="text-center">
            <div className="flex justify-between items-center max-w-sm mx-auto mb-4 text-xs font-bold text-slate-500 dark:text-emerald-300">
              <span>Pertanyaan {quizRound}/5</span>
              <span className="text-amber-600 font-black">Poin Cemerlang: {quizScore}</span>
            </div>

            {/* Progress line dots */}
            <div className="flex justify-center gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx < quizRound 
                      ? 'bg-sky-500 w-6' 
                      : idx === quizRound 
                        ? 'bg-amber-400 w-8 animate-pulse' 
                        : 'bg-slate-200 dark:bg-slate-800 w-3.5'
                  }`}
                />
              ))}
            </div>

            {/* Question title */}
            <h4 className="font-extrabold text-slate-800 dark:text-emerald-50 text-md sm:text-lg mb-6 leading-relaxed max-w-xl mx-auto flex items-center justify-center gap-2 text-center">
              <HelpCircle className="w-5 h-5 text-sky-500 shrink-0" />
              <span>{quizQuestion.q}</span>
            </h4>

            {/* Feedback alert cards */}
            {quizFeedback.status && (
              <div className={`p-4 rounded-2xl border mb-6 text-xs max-w-md mx-auto animate-in zoom-in-95 duration-200 text-left ${
                quizFeedback.status === 'correct'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-rose-50 dark:bg-rose-955 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/40'
              }`}>
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className={`w-4 h-4 ${quizFeedback.status === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`} />
                  <span>{quizFeedback.status === 'correct' ? 'Alhamdulillah Hebat!' : 'Hampir Tepat!'}</span>
                </div>
                <p className="font-semibold">{quizFeedback.message}</p>
                <button
                  id="next-question-btn"
                  onClick={handleNextQuestion}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {quizRound === 5 ? 'Lihat Lembar Hasil' : 'Soal Berikutnya'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Big interactive options buttons */}
            {!quizFeedback.status && (
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-4">
                {quizQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleAnswer(option)}
                    className="p-6 bg-white dark:bg-slate-900 text-4xl font-serif rounded-3xl border border-slate-205 dark:border-slate-800 hover:border-sky-400 hover:bg-sky-50/30 dark:hover:bg-sky-950/30 cursor-pointer hover:shadow-xs active:scale-95 transition-all text-slate-900 dark:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-6">
            <span className="text-5xl block animate-bounce duration-1000">🏆</span>
            <h4 className="font-extrabold text-lg text-slate-800 dark:text-emerald-50 mt-3 animate-pulse">Laporan Hasil Uji Khatam</h4>
            
            <div className="my-6 p-5 bg-gradient-to-r from-amber-450/5 via-white to-amber-450/5 dark:from-slate-950 dark:to-slate-900 border border-amber-350 dark:border-slate-850 rounded-3xl max-w-sm mx-auto shadow-xs text-center animate-in scale-in">
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 font-sans font-black tracking-widest block rounded-md w-max mx-auto uppercase mb-2">
                Piagam Prestasi Ceria
              </span>
              <p className="font-mono text-xs text-amber-700 dark:text-amber-400 font-extrabold mt-1 animate-pulse">Nilai Ujian Akhir: {quizScore} / 50 Poin</p>
              
              {quizScore >= 40 ? (
                <p className="text-xs text-slate-650 dark:text-emerald-305 mt-2 leading-relaxed font-semibold">
                  Maa syaa Allah! Adik mendapatkan gelar bintang emas kehormatan <strong className="text-emerald-700 dark:text-emerald-400 font-bold">Penghafal Qur&apos;an Santri Cilik Cerdas</strong>. Lanjutkan belajar tilawati yang tekun ya!
                </p>
              ) : (
                <p className="text-xs text-slate-650 dark:text-emerald-305 mt-2 leading-relaxed font-semibold">
                  Hebat sekali sudah mencoba bermain! Sering-sering mengulang makhroj huruf ya, agar hafalan tajwid Al-Qur&apos;an makin fasih bercahaya!
                </p>
              )}
            </div>

            <button
              id="quiz-reset-btn"
              onClick={handleStartQuiz}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-850 hover:text-emerald-745 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-emerald-100 font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              Kembali Ulangi Kuis
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
