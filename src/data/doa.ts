/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DoaItem } from '../types';

export const DOA_DATA: DoaItem[] = [
  {
    id: 'bangun-tidur',
    judul: 'Doa Bangun Tidur',
    arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alhamdu lillahil-ladzi ahyana ba’da ma amatana wa ilaihin-nusyur.',
    terjemahan: 'Segala puji bagi Allah yang menghidupkan kami kembali setelah mematikan kami (tidur) dan kepada-Nya kami akan dibangkitkan.',
    kategori: 'Tidur'
  },
  {
    id: 'sebelum-tidur',
    judul: 'Doa Sebelum Tidur',
    arab: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ',
    latin: 'Bismika allahumma ahya wa amut.',
    terjemahan: 'Dengan nama-Mu ya Allah aku hidup dan aku mati.',
    kategori: 'Tidur'
  },
  {
    id: 'masuk-rumah',
    judul: 'Doa Masuk Rumah',
    arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْـمَوْلِـجِ وَخَيْرَ الْـمَخْرَجِ، بِسْمِ اللَّهِ وَلَـجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    latin: 'Allahumma inni as-aluka khairal mauliji wa khairal makhraji, bismillahi walajnaa, wa bismillahi kharajnaa, wa \'alallahi rabbina tawakkalnaa.',
    terjemahan: 'Ya Allah, sesungguhnya aku memohon kepada-Mu kebaikan tempat masuk dan kebaikan tempat keluar. Dengan menyebut nama Allah kami masuk, dengan menyebut nama Allah kami keluar, dan hanya kepada Allah Tuhan kami, kami bertawakal.',
    kategori: 'Rumah'
  },
  {
    id: 'keluar-rumah',
    judul: 'Doa Keluar Rumah',
    arab: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: 'Bismillahi tawakkaltu \'alallahi laa hawla wa laa quwwata illa billah.',
    terjemahan: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.',
    kategori: 'Rumah'
  },
  {
    id: 'sebelum-makan',
    judul: 'Doa Sebelum Makan',
    arab: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: 'Allahumma barik lana fima razaqtana wa qina \'adzaban-nar.',
    terjemahan: 'Ya Allah, berkahilah rezeki yang telah Engkau berikan kepada kami, dan peliharalah kami dari siksa api neraka.',
    kategori: 'Makan & Minum'
  },
  {
    id: 'sesudah-makan',
    judul: 'Doa Sesudah Makan',
    arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latin: 'Alhamdu lillahil-ladzi ath\'amanaa wa saqaanaa wa ja\'alanaa muslimiin.',
    terjemahan: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami termasuk golongan orang-orang muslim.',
    kategori: 'Makan & Minum'
  },
  {
    id: 'bepergian',
    judul: 'Doa Bepergian (Naik Kendaraan)',
    arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    latin: 'Subhaanal-ladzii sakh-khara lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa rabbinaa lamunqalibuun.',
    terjemahan: 'Maha Suci Allah yang telah menundukkan semua kendaran ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    kategori: 'Perjalanan'
  },
  {
    id: 'masuk-masjid',
    judul: 'Doa Masuk Masjid',
    arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allahummaf-tahlii abwaaba rahmatik.',
    terjemahan: 'Ya Allah, bukakanlah bagiku pintu-pintu rahmat-Mu.',
    kategori: 'Masjid'
  },
  {
    id: 'keluar-masjid',
    judul: 'Doa Keluar Masjid',
    arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allahumma inni as-aluka min fadhlik.',
    terjemahan: 'Ya Allah, sesungguhnya aku memohon keutamaan dari-Mu.',
    kategori: 'Masjid'
  },
  {
    id: 'kedua-orang-tua',
    judul: 'Doa Kedua Orang Tua (Birrul Walidain)',
    arab: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbighfir lii waliwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    terjemahan: 'Ya Tuhanku, ampunilah dosa-dosaku dan dosa kedua orang tuaku, dan sayangilah mereka berdua sebagaimana mereka berdua telah mendidik aku di waktu kecil.',
    kategori: 'Keluarga'
  },
  {
    id: 'sapu-jagad',
    judul: 'Doa Kebaikan Dunia Akhirat (Sapu Jagad)',
    arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbana aatina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina \'adzaban-nar.',
    terjemahan: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab siksa neraka.',
    kategori: 'Utama'
  },
  {
    id: 'ilmu-bermanfaat',
    judul: 'Doa Mohon Ilmu yang Bermanfaat & Rezeki Baik',
    arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    latin: 'Allahumma inni as-aluka \'ilman naafi\'an, wa rizqan thayyiban, wa \'amalan mutaqabbalan.',
    terjemahan: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik (halal), dan amal yang diterima.',
    kategori: 'Utama'
  }
];
