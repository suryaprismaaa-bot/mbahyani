/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Calendar, Sparkles, BookOpen, Clock, Heart, Award, ShieldAlert, Swords, History, Info, ChevronRight, Check, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HijriEvent {
  id: string;
  title: string;
  hijriDate: string;
  era: 'kerasulan' | 'kekhalifahan' | 'pra_kerasulan' | 'pasca_sahabat';
  summary: string;
  reference: string;
  iconType: 'birth' | 'death' | 'victory' | 'struggle' | 'miracle' | 'diplomacy';
}

export interface HijriMonth {
  number: number;
  name: string;
  arabic: string;
  meaning: string;
  description: string;
  isHaram: boolean;
  events: HijriEvent[];
}

export const HIJRI_MONTHS_DATA: HijriMonth[] = [
  {
    number: 1,
    name: "Muharram",
    arabic: "المحرّم",
    meaning: "Yang Diharamkan / Suci",
    isHaram: true,
    description: "Bulan pembuka tahun Hijriah. Keberadaannya termasuk dalam jajaran empat Bulan Haram (mulia) di mana dilarang keras memulai peperangan, dan seluruh amal shalih dilipatgandakan pahalanya oleh Allah SWT.",
    events: [
      {
        id: "muharram-musa",
        title: "Kemenangan Nabi Musa AS Atas Fir'aun",
        hijriDate: "10 Muharram (Hari Asyura)",
        era: "pra_kerasulan",
        iconType: "victory",
        summary: "Nabi Musa AS dan Bani Israil diselamatkan oleh Allah Ta'ala dari kejaran bala tentara Fir'aun dengan membelah Laut Merah melalui mukjizat kibasan tongkat beliau. Fir'aun dan seluruh tentaranya ditenggelamkan hidup-hidup. Rasulullah SAW menginstruksikan umat Islam untuk melaksanakan puasa sunnah Asyura sebagai wujud syukur ketaatan tauhid atas kemenangan agung ini.",
        reference: "Sahih Bukhari No. 2004, Sahih Muslim No. 1130"
      },
      {
        id: "muharram-karbala",
        title: "Tragedi Pemiluan Karbala",
        hijriDate: "10 Muharram 61 H",
        era: "pasca_sahabat",
        iconType: "struggle",
        summary: "Gugurnya cucu tercinta Rasulullah SAW, Sayyidina Husain bin Ali RA beserta keluarga dan para pengikutnya di Padang Karbala (Irak) oleh kepungan pasukan militer Yazid bin Mu'awiyah. Tragedi ini menorehkan luka duka yang mendalam dalam lembaran sejarah peradaban Islam serta menjadi simbol perjuangan pantang menyerah menegakkan kebenaran melawan kezaliman tirani.",
        reference: "Ibnu Katsir dalam Al-Bidayah wan Nihayah, Ad-Dzahabi dalam Siyar A'lam An-Nubala"
      }
    ]
  },
  {
    number: 2,
    name: "Safar",
    arabic: "صفر",
    meaning: "Kosong / Kuning",
    isHaram: false,
    description: "Bulan kedua dalam kalender Hijriah. Dinamai Safar karena kebiasaan bangsa Arab dahulu yang meninggalkan rumah-rumah mereka dalam kondisi kosong untuk bepergian mencari makan atau berperang pasca berakhirnya ketatnya aturan bulan haram Muharram.",
    events: [
      {
        id: "safar-hijrah",
        title: "Mualnya Hijrah Rasulullah Menuju Gua Tsur",
        hijriDate: "Akhir Bulan Safar 1 H",
        era: "kerasulan",
        iconType: "struggle",
        summary: "Rasulullah SAW bersama sahabat setia Sayyidina Abu Bakar Ash-Shiddiq RA keluar dari rumah secara sembunyi-sembunyi di bawah ketatnya kepungan bersenjata pemuda Quraisy Makkah yang ingin membunuh beliau. Perjalanan penyelamatan akidah ini diistirahatkan terlebih dahulu dengan bersembunyi di dalam keheningan Gua Tsur selama tiga malam demi mengecoh patroli musuh.",
        reference: "Ibnu Hisyam dalam Sirah Nabawiyah, Kitab Ar-Rahiq Al-Makhtum"
      },
      {
        id: "safar-pernikahan-khadijah",
        title: "Pernikahan Rasulullah dengan Ibunda Khadijah",
        hijriDate: "Safar (Sebelum Masa Kerasulan)",
        era: "pra_kerasulan",
        iconType: "birth",
        summary: "Pernikahan suci penuh keberkahan antara Nabi Muhammad SAW (usia 25 tahun) dan Ibunda Khadijah binti Khuwailid RA (usia 40 tahun) pasca kepulangan beliau membawa kafilah dagang dari Syam. Pernikahan agung ini kelak menjadi pilar utama serta benteng ketegaran emosional terdalam bagi perjuangan awal dakwah Islamiyah.",
        reference: "Ibnu Sa'ad dalam At-Thabaqat Al-Kubra, Ibnu Katsir dalam Al-Bidayah wan Nihayah"
      }
    ]
  },
  {
    number: 3,
    name: "Rabi'ul Awwal",
    arabic: "ربيع الأوّل",
    meaning: "Musim Semi Pertama",
    isHaram: false,
    description: "Bulan ketiga yang sangat mulia bagi memori umat Islam. Menjadi momentum lahirnya fajar pencerahan dengan ditakdirkannya kelahiran Baginda Nabi Muhammad SAW sebagai utusan pembebas belenggu kebodohan akhlak manusia.",
    events: [
      {
        id: "rabiawal-kelahiran",
        title: "Kelahiran Agung Nabi Muhammad SAW",
        hijriDate: "12 Rabi'ul Awwal (Tahun Gajah)",
        era: "pra_kerasulan",
        iconType: "birth",
        summary: "Lahirnya nabi akhir zaman pembawa misi kerahmatan alam semesta, Nabi Muhammad SAW di kota suci Makkah. Kelahiran beliau bertepatan dengan luluhnya pasukan gajah pimpinan Abrahah yang hendak merobohkan Kakbah. Kelahiran beliau menyalakan lentera tauhid yang menepis kegelapan syirik di dunia.",
        reference: "Kitab Katresnan Ar-Rahiq Al-Makhtum, Sirah Nabawiyah Ibnu Hisyam"
      },
      {
        id: "rabiawal-wafat",
        title: "Wafatnya Baginda Rasulullah SAW",
        hijriDate: "12 Rabi'ul Awwal 11 H",
        era: "kerasulan",
        iconType: "death",
        summary: "Berpulangnya kekasih Allah, Nabi Muhammad SAW ke haribaan Rafiqil A'la (Allah SWT) di pangkuan hangat ibunda Aisyah RA di Madinah dalam usia 63 tahun. Kejadian ini meninggalkan kepedihan terdalam yang tak tertandingi bagi para sahabat dan memicu tangisan pilu di seluruh penjuru kota Madinah, menandai selesainya pengembanan risalah langit di bumi.",
        reference: "Sahih Bukhari (Ghazwatul Wafat), Sahih Muslim"
      },
      {
        id: "rabiawal-masjid-quba",
        title: "Pembangunan Masjid Quba (Masjid Pertama Islam)",
        hijriDate: "Rabi'ul Awwal 1 H",
        era: "kerasulan",
        iconType: "miracle",
        summary: "Tibanya Rasulullah SAW di Quba dalam rangkaian perjalanan Hijrah akbar. Di kota persinggahan ini, beliau meletakkan batu pertama pembangunan fondasi Masjid Quba, yakni rumah ibadah pertama yang didirikan murni atas dasar takwa dakwah tauhid sebelum beliau memasuki wilayah inti Madinah.",
        reference: "Sahih Bukhari No. 3906, Al-Bidayah wan Nihayah"
      }
    ]
  },
  {
    number: 4,
    name: "Rabi'ul Akhir",
    arabic: "ربيع الآخر",
    meaning: "Musim Semi Kedua",
    isHaram: false,
    description: "Bulan keempat kalender Hijriah. Dinamakan demikian karena bertepatan dengan berakhirnya fase musim semi di tanah Arab, di mana tumbuh-tumbuhan hijau dan aliran sungai mulai mencapai titik kematangan alami.",
    events: [
      {
        id: "rabiawal-sariyah-ali",
        title: "Utusan Komando Ali bin Abi Thalib ke Kabilah Thayy",
        hijriDate: "Rabi'ul Akhir 9 H",
        era: "kerasulan",
        iconType: "diplomacy",
        summary: "Rasulullah mengirimkan 150 prajurit berkuda terpilih di bawah kepemimpinan Ali bin Abi Thalib RA untuk berdakwah serta menertibkan berhala besar bernama Al-Qullus milik kabilah Thayy. Ekspedisi strategis ini berbuah manis dan damai berkat keteladanan kepemimpinan Ali yang membuahkan keislaman tokoh ksatria mereka, Adi bin Hatim At-Tha'i.",
        reference: "Sirah Nabawiyah Ibnu Hisyam, Al-Bidayah wan Nihayah Karya Ibnu Katsir"
      },
      {
        id: "rabiawal-qardah",
        title: "Aksi Heroik Perang Dzatuq Qardah",
        hijriDate: "Rabi'ul Akhir 6 H",
        era: "kerasulan",
        iconType: "struggle",
        summary: "Ghazwah Al-Ghabah atau Dzatuq Qardah dipicu oleh penjarahan brutal kabilah Bani Fazarah terhadap kawanan unta gembalaan Rasulullah di pinggiran Madinah. Sahabat muda Salamah bin Al-Akwa RA melakukan pengejaran cepat sendirian dengan keahlian memanah berlari legendarisnya, menahan laju rombongan perampok hingga bantuan pasukan Madinah datang menyelamatkan aset umat.",
        reference: "Sahih Bukhari No. 4194, Sahih Muslim No. 1807"
      }
    ]
  },
  {
    number: 5,
    name: "Jumadil Awwal",
    arabic: "جمادى الأولى",
    meaning: "Kering / Beku Pertama",
    isHaram: false,
    description: "Bulan kelima dalam penanggalan Islam. Nama Jumada berasal dari kata 'Jamad' yang berarti beku, merujuk pada kebiasaan cuaca dingin ekstrem zaman dahulu di gurun pasir yang membuat air membeku.",
    events: [
      {
        id: "jumadiawal-mutah",
        title: "Konfrontasi Heroik Perang Mu'tah",
        hijriDate: "Jumadil Awwal 8 H",
        era: "kerasulan",
        iconType: "struggle",
        summary: "Pertempuran dahsyat di Mu'tah (Yordania) yang mempertemukan 3.000 mujahid Muslim melawan gabungan 200.000 pasukan berat kekaisaran Romawi Timur (Bizantium) dan kabilah sekutunya. Kepahlawanan tiada banding diperlihatkan tiga panglima pilihan nabi yang syahid beruntun: Zaid bin Haritsah, Ja'far bin Abi Thalib, dan Abdullah bin Rawahah, sebelum panji perang diambil alih oleh Khalid bin Walid yang berhasil mengevakuasi pasukan secara genius.",
        reference: "Sahih Bukhari No. 4261, Kitab Ar-Rahiq Al-Makhtum"
      },
      {
        id: "jumadiawal-khaibar",
        title: "Pembebasan Bentengkhaibar",
        hijriDate: "Jumadil Awwal 7 H",
        era: "kerasulan",
        iconType: "victory",
        summary: "Rasulullah memimpin langsung pengepungan wilayah Khaibar yang dipenuhi benteng pertahanan elite Yahudi yang merancang berbagai rencana makar terhadap Madinah. Ali bin Abi Thalib ditunjuk memegang bendera komando utama setelah sahabat lain menemui jalan buntu. Dengan keberanian luar biasa, Ali mendobrak gerbang pertahanan hingga kemenangan mutlak diperoleh kaum Muslim.",
        reference: "Sahih Bukhari No. 4210, Sahih Muslim No. 2406"
      }
    ]
  },
  {
    number: 6,
    name: "Jumadil Akhir",
    arabic: "جمادى الآخرة",
    meaning: "Kering / Beku Kedua",
    isHaram: false,
    description: "Bulan keenam kalender Hijriah. Menandakan akhir dari bulan-bulan musim dengan suhu dingin ekstrem di jazirah Arab sebelum mulai memasuki transisi musim panas.",
    events: [
      {
        id: "jumadiakhir-wafat-abubakar",
        title: "Wafatnya Khalifah Pertama, Sayyidina Abu Bakar Ash-Shiddiq",
        hijriDate: "22 Jumadil Akhir 13 H",
        era: "kekhalifahan",
        iconType: "death",
        summary: "Wafatnya penyelamat kekhalifahan perdana umat Islam, Abu Bakar Ash-Shiddiq RA di usia 63 tahun sesudah menderita demam parah. Beliau berjasa besar mengamankan kesatuan kaum Muslimin dari ancaman murtad dan nabi palsu, serta merintis pengumpulan naskah Al-Qur'an pertama. Sebelum wafat, musyawarah sepakat menetapkan Umar bin Khattab sebagai suksesor estafet kepemimpinannya.",
        reference: "Imam Jalaluddin As-Suyuthi dalam Tarikh Al-Khulafa, Tarikh ath-Tabari"
      },
      {
        id: "jumadiakhir-yarmuk",
        title: "Kemenangan Legendaris Perang Yarmuk",
        hijriDate: "Jumadil Akhir 13 H",
        era: "kekhalifahan",
        iconType: "victory",
        summary: "Pertempuran epik di bantaran Sungai Yarmuk antara 40.000 pasukan Muslim melawan 150.000 tentara Byzantium Romawi Timur. Panglima Khalid bin Walid menyusun taktik formasi tempur Kordos (regu-regu taktis) yang luar biasa efektif, menghancurkan dominasi Romawi di bumi Syam secara permanen.",
        reference: "Ibnu Katsir dalam Al-Bidayah wan Nihayah, Tarikh Al-Khulafa"
      }
    ]
  },
  {
    number: 7,
    name: "Rajab",
    arabic: "رجب",
    meaning: "Mulia / Agung",
    isHaram: true,
    description: "Masuk dalam kelompok empat Bulan Haram (mulia). Sering digambarkan sebagai bulan menanam benih sebelum memasuki bulan Sya'ban dan menuai hasilnya di bulan Ramadhan. Berperang di bulan ini dilarang keras sebagai penghormatan kesucian bulan.",
    events: [
      {
        id: "rajab-isra-miraj",
        title: "Peristiwa Agung Isra' Mi'raj",
        hijriDate: "27 Rajab (Tahun 10 Kerasulan)",
        era: "kerasulan",
        iconType: "miracle",
        summary: "Mukjizat agung perjalanan spiritual semalam penuh Rasulullah SAW atas kekuasaan Allah. Beliau diberangkatkan dari Masjidil Haram ke Masjidil Aqsa (Isra'), selanjutnya dinaikkan melintasi tujuh penjuru langit menuju Sidratul Muntaha (Mi'raj) untuk berdialog langsung dengan Allah SWT, menerima amanah ibadah shalat fardhu lima waktu sehari semalam.",
        reference: "Sahih Bukhari No. 349, Sahih Muslim No. 162"
      },
      {
        id: "rajab-perang-tabuk",
        title: "Perang Tabuk (Ujian Loyalitas Kaum Beriman)",
        hijriDate: "Rajab 9 H",
        era: "kerasulan",
        iconType: "struggle",
        summary: "Rasulullah memobilisasi 30.000 bala tentara terbesar dalam sejarah hidup beliau untuk berjalan sejauh 600 km ke perbatasan utara Arab menghadapi potensi agresi Bizantium. Diuji dalam kondisi paceklik buah, kemarau luar biasa terik, serta masa sulit (Sa'atul 'Usrah), kaum beriman berlomba menyumbang harta (termasuk Utsman bin Affan yang menyumbang ratusan unta dan ribuan dinar). Perang ini membersihkan Madinah dari infiltrasi kaum munafik.",
        reference: "Sahih Bukhari (Ghazwat ut-Tabuk), Tafsir Ibnu Katsir At-Taubah 117"
      },
      {
        id: "rajab-shalahuddin-aqsa",
        title: "Pembebasan Kembali Masjidil Aqsa oleh Shalahuddin",
        hijriDate: "27 Rajab 583 H",
        era: "pasca_sahabat",
        iconType: "victory",
        summary: "Sultan legendaris Shalahuddin Al-Ayyubi mengukir sejarah mulia dengan merebut kembali kota suci Yerusalem (Baitul Maqdis) dan membersihkan Masjidil Aqsa dari cengkeraman Tentara Salib setelah terjajah selama 88 tahun. Shalahuddin melarang segala bentuk pembantaian balas dendam dan menjamin kebebasan beragama penuh bagi semua warga sipil Nasrani.",
        reference: "Ibnu Atsir dalam Al-Kamil fit Tarikh, Tarikh Ibnu Khaldun"
      }
    ]
  },
  {
    number: 8,
    name: "Sya'ban",
    arabic: "شعبان",
    meaning: "Kelompok / Bercabang",
    isHaram: false,
    description: "Bulan kedelapan yang terletak di antara dua momentum raksasa Rajab dan Ramadhan. Diistimewakan sebagai bulan laporan penyerahan rekam jejak amal manusia tahunan kepada Sang Pencipta, serta dianjurkan memperbanyak amal puasa sunnah.",
    events: [
      {
        id: "syaban-kiblat",
        title: "Perpindahan Arah Kiblat ke Kakbah Makkah",
        hijriDate: "Pertengahan Sya'ban 2 H",
        era: "kerasulan",
        iconType: "miracle",
        summary: "Pengabulan doa dan harapan mendalam Rasulullah SAW oleh Allah Ta'ala. Setelah selama 16 hingga 17 bulan kaum Muslimin di Madinah melakukan sholat dengan menghadap ke Baitul Maqdis di Yerusalem, turunlah wahyu perintah pengalihan arah kiblat umat Islam agar berbalik mulia menghadap ke Kakbah (Masjidil Haram) di Makkah.",
        reference: "Sahih Bukhari No. 40, Tafsir Ibnu Katsir tentang QS. Al-Baqarah: 144"
      },
      {
        id: "syaban-kelahiran-husain",
        title: "Kelahiran Cucu Nabi, Sayyidina Husain bin Ali",
        hijriDate: "Sya'ban 3 H",
        era: "kerasulan",
        iconType: "birth",
        summary: "Lahirnya putra kedua dari pasangan Ali bin Abi Thalib RA dan Fatimah Az-Zahra RA. Kelahiran Sayyidina Husain mendatangkan sukacita luar biasa bagi Rasulullah SAW yang sering menggendong, mencium, dan mendoakan beliau bersama kakaknya, Sayyidina Hasan, agar dicintai oleh Allah SWT.",
        reference: "Imam At-Tirmidzi dalam Sunan At-Tirmidzi, Siyar A'lam An-Nubala"
      }
    ]
  },
  {
    number: 9,
    name: "Ramadhan",
    arabic: "رمضان",
    meaning: "Pembakaran / Panas Menyengat",
    isHaram: false,
    description: "Mahkota dari seluruh bulan Hijriah. Dinamakan Ramadhan karena panasnya pembersihan dosa-dosa kaum Muslimin yang menjalankan ibadah puasa fardhu sebulan penuh, mengosongkan perut dan menghidupkan malamnya dengan tarawih serta tadarus Al-Qur'an.",
    events: [
      {
        id: "ramadhan-nuzululquran",
        title: "Turunnya Al-Qur'an Pertama Kali (Nuzulul Qur'an)",
        hijriDate: "17 Ramadhan (Sebelum Hijrah)",
        era: "pra_kerasulan",
        iconType: "miracle",
        summary: "Diturunkannya wahyu pembuka Al-Qur'an (Surah Al-Alaq: 1-5) kepada Rasulullah SAW oleh Malaikat Jibril AS ketika beliau sedang tafakur mengasingkan diri di kesunyian Gua Hira. Peristiwa luhur ini menandai penobatan resmi beliau sebagai petunjuk bimbingan akhir zaman untuk seisi bumi.",
        reference: "Sahih Bukhari No. 3 (Awalul Wahyi), Sahih Muslim"
      },
      {
        id: "ramadhan-badar",
        title: "Kemenangan Fantastis Perang Badar Al-Kubra",
        hijriDate: "17 Ramadhan 2 H",
        era: "kerasulan",
        iconType: "victory",
        summary: "Pertempuran berdarah pertama pasca hijrah (Yaumul Furqan). 313 pejuang mukminin bersenjata seadanya dengan keteguhan iman yang membara mengalahkan 1.000 pasukan tempur elite kaum musyrikin Quraisy Makkah. Melalui munajat doa panjang nabi di tenda komando, Allah menurunkan bantuan pertahanan nyata berupa barisan ribuan malaikat perang.",
        reference: "Sahih Bukhari No. 3950, Sirah Ibnu Hisyam"
      },
      {
        id: "ramadhan-fathumakkah",
        title: "Penaklukan Damai Kota Makkah (Fathu Makkah)",
        hijriDate: "20 Ramadhan 8 H",
        era: "kerasulan",
        iconType: "victory",
        summary: "Pembebasan agung tanah kelahiran nabi dari kemusyrikan dan intimidasi jahiliyah tanpa setetes pun pertumpahan darah. Rasulullah memimpin 10.000 prajurit mengepung Makkah secara terstruktur. Beliau menghancurkan 360 berhala di sekeliling Kakbah, mengumumkan ampunan umum (amnesti) bagi para mantan penentang bersenjata, dan melarang keras penjarahan.",
        reference: "Sahih Bukhari No. 4280, Sahih Muslim"
      }
    ]
  },
  {
    number: 10,
    name: "Syawwal",
    arabic: "شوّال",
    meaning: "Peningkatan",
    isHaram: false,
    description: "Bulan kesepuluh Hijriah. Dinamai Syaywal (peningkatan) sebagai penanda bagi kaum Muslimin agar senantiasa meningkatkan derajat ketaatan spiritual dan ketakwaan sosial pasca lulus dari kurikulum penggemblengan bulan Ramadhan.",
    events: [
      {
        id: "syawwal-uhud",
        title: "Perang Uhud (Ujian Ketundukan Komando)",
        hijriDate: "Syawwal 3 H",
        era: "kerasulan",
        iconType: "struggle",
        summary: "Pertempuran sengit mempertahankan Madinah di kaki Gunung Uhud. Strategi jitu nabi menempatkan 50 pemanah mahir di atas bukit sempat membuat musuh kocar-kacir. Namun, godaan fana terhadap rampasan perang (ghanimah) membuat sebagian besar pemanah melanggar sabda nabi dan turun bukit, yang dimanfaatkan Khalid bin Walid untuk menusuk dari belakang. Mengakibatkan gugurnya 70 syuhada mulia termasuk Sayyidina Hamzah.",
        reference: "Sahih Bukhari No. 4043, Kitab Ar-Rahiq Al-Makhtum"
      },
      {
        id: "syawwal-hunain",
        title: "Perang Hunain (Teguran Atas Sifat Ujub)",
        hijriDate: "Syawwal 8 H",
        era: "kerasulan",
        iconType: "struggle",
        summary: "Pertempuran pasca Fathu Makkah melawan sisa-sisa sekutu kabilah Hawazin dan Tsaqif di Lembah Hunain. Pasukan Muslim sempat terdesak dan lari akibat jebakan panji musuh karena merasa sombong atas jumlah mereka yang melimpah (12.000 prajurit). Melalui kegigihan pidato keberanian nabi, mental pasukan bangkit kembali meraih kemenangan mutlak.",
        reference: "Sahih Bukhari No. 4315, Al-Qur'an Surah At-Taubah: 25-26"
      }
    ]
  },
  {
    number: 11,
    name: "Dzulqa'dah",
    arabic: "ذو القعدة",
    meaning: "Pemilik Istirahat / Duduk",
    isHaram: true,
    description: "Bulan kesebelas dan termasuk Bulan Haram (mulia). Sesuai arti namanya (pemilik duduk/diam), bangsa Arab terdahulu memanfaatkan bulan ini untuk menghentikan segala jenis perselisihan bersenjata demi duduk merajut persaudaraan dan menyambut tamu-tamu haji.",
    events: [
      {
        id: "dzulqadah-hudaibiyah",
        title: "Monumen Diplomasi Perjanjian Hudaibiyah",
        hijriDate: "Dzulqa'dah 6 H",
        era: "kerasulan",
        iconType: "diplomacy",
        summary: "1.400 kaum Muslimin bertolak damai tanpa senjata perang menuju Makkah untuk berumrah, namun diadang sepihak di batas Hudaibiyah. Melalui proses diplomasi yang tenang dan ulet mementingkan keselamatan nyawa, disepakatilah klausul perdamaian gencatan senjata sepuluh tahun. Walau terkesan berat sebelah di awal, perjanjian ini menghasilkan kestabilan politik luar biasa dan membuka pintu masuknya dakwah ke hati para pembesar Quraisy.",
        reference: "Sahih Bukhari No. 2731, Sirah Nabawiyah Ibnu Hisyam"
      },
      {
        id: "dzulqadah-khandaq",
        title: "Pertahanan Total Perang Khandaq / Ahzab",
        hijriDate: "Dzulqa'dah 5 H",
        era: "kerasulan",
        iconType: "miracle",
        summary: "Pengepungan kota Madinah oleh koalisi raksasa Al-Ahzab berisi 10.000 gabungan tentara Quraisy, kabilah Badui, dan pengkhianat internal Yahudi. Berdasarkan ide brilian Salman Al-Farisi RA, umat Islam menggali parit raksasa melingkari kota sebagai benteng pertahanan mutakhir pertama di Arab. Allah menyudahi ketegangan maut sebulan penuh ini dengan mendatangkan pertolongan mukjizat badai pasir es yang meluluhlantakkan logistik perkemahan sekutu musuh.",
        reference: "Sahih Bukhari No. 4103, Tafsir Ibnu Katsir Al-Ahzab: 9-25"
      }
    ]
  },
  {
    number: 12,
    name: "Dzulhijjah",
    arabic: "ذو الحجة",
    meaning: "Pemilik Haji",
    isHaram: true,
    description: "Bulan penutup tahun Hijriah sekaligus puncak peribadatan spiritual. Dinamai demikian karena menjadi satu-satunya bulan penyelenggaraan ibadah rukun Islam kelima, Haji ke Baitullah, serta dirayakannya ibadah pengurbanan Idul Adha.",
    events: [
      {
        id: "dzulhijjah-hajiwada",
        title: "Khutbah Monumental Haji Wada' Rasulullah",
        hijriDate: "9-10 Dzulhijjah 10 H",
        era: "kerasulan",
        iconType: "diplomacy",
        summary: "Ibadah haji pertama sekaligus yang terakhir yang dijalankan langsung oleh Rasulullah SAW di hadapan seratus ribu lebih jemaah sahabat (Haji Wada/Perpisahan). Di bukit Arafah, beliau menyampaikan pidato akbar yang berisi penegasan persamaan hak asasi manusia, kesetaraan kedudukan derajat ras manusia, pengharaman riba komersial yang memeras rakyat miskin, serta amanat suci perlindungan harkat martabat kaum perempuan.",
        reference: "Sahih Muslim No. 1218 (Hadits Manasik Jabir), Al-Mustadrak Al-Hakim"
      },
      {
        id: "dzulhijjah-aqabah2",
        title: "Bai'at Aqabah Kedua (Fase Kelahiran Madinah)",
        hijriDate: "Zulhijjah (Tahun 13 Kerasulan)",
        era: "kerasulan",
        iconType: "diplomacy",
        summary: "Perjanjian rahasia malam hari di puncak bukit Aqabah antara Rasulullah SAW dengan 73 pria dan 2 perempuan delegasi suku Aus dan Khazraj dari Yatsrib (Madinah). Kaum Ansar bersumpah setia menyerukan persaudaraan islami dan siap menyambut serta melindungi raga Rasulullah sebagaimana menyayangi napas darah mereka sendiri. Peristiwa sakral pembuka gerbang Hijrah ini kelak melahirkan kekuatan kekhalifahan Islam Pertama.",
        reference: "Sirah Nabawiyah Ibnu Hisyam, Musnad Ahmad No. 14456"
      }
    ]
  }
];

export default function HijriCalendarHistory() {
  const [selectedMonthNum, setSelectedMonthNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [eraFilter, setEraFilter] = useState<'semua' | 'pra_kerasulan' | 'kerasulan' | 'kekhalifahan' | 'pasca_sahabat'>('semua');
  const [selectedEvent, setSelectedEvent] = useState<HijriEvent | null>(null);

  // Smooth Month Navigation
  const selectedMonth = useMemo(() => {
    return HIJRI_MONTHS_DATA.find(m => m.number === selectedMonthNum) || HIJRI_MONTHS_DATA[0];
  }, [selectedMonthNum]);

  // Global search & filter over all months or just active month? Users love to view globally too!
  const [viewMode, setViewMode] = useState<'month-by-month' | 'search-all'>('month-by-month');

  // Handle all events for global search
  const allEventsWithMonths = useMemo(() => {
    const list: (HijriEvent & { monthName: string; monthNumber: number })[] = [];
    HIJRI_MONTHS_DATA.forEach(month => {
      month.events.forEach(event => {
        list.push({
          ...event,
          monthName: month.name,
          monthNumber: month.number
        });
      });
    });
    return list;
  }, []);

  // Filter events based on active tab and filters
  const filteredEvents = useMemo(() => {
    if (viewMode === 'month-by-month') {
      return selectedMonth.events.filter(event => {
        const matchesSearch = searchQuery === "" || 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.summary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEra = eraFilter === 'semua' || event.era === eraFilter;
        return matchesSearch && matchesEra;
      });
    } else {
      return allEventsWithMonths.filter(event => {
        const matchesSearch = searchQuery === "" || 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.monthName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEra = eraFilter === 'semua' || event.era === eraFilter;
        return matchesSearch && matchesEra;
      });
    }
  }, [viewMode, selectedMonth, allEventsWithMonths, searchQuery, eraFilter]);

  // Helper colors based on Event Type
  const getEventBadgeStyle = (era: string) => {
    switch(era) {
      case 'pra_kerasulan': 
        return { bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50', label: 'Zaman Pra-Kerasulan' };
      case 'kerasulan': 
        return { bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50', label: 'Zaman Kerasulan Nabi' };
      case 'kekhalifahan': 
        return { bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50', label: 'Khulafaur Rasyidin' };
      case 'pasca_sahabat': 
        return { bg: 'bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40', label: 'Pasca Sahabat / Kekhalifahan' };
      default: 
        return { bg: 'bg-slate-50 dark:bg-slate-900 text-slate-705 border-slate-200', label: 'Sejarah Islam' };
    }
  };

  const getIconColorStyle = (type: string) => {
    switch(type) {
      case 'birth': return 'bg-pink-100 dark:bg-pink-950/45 text-pink-600 dark:text-pink-400';
      case 'death': return 'bg-rose-100 dark:bg-rose-950/45 text-rose-600 dark:text-rose-400';
      case 'victory': return 'bg-amber-100 dark:bg-amber-955/45 text-amber-600 dark:text-amber-400';
      case 'struggle': return 'bg-indigo-100 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400';
      case 'miracle': return 'bg-purple-100 dark:bg-purple-950/45 text-purple-600 dark:text-purple-400';
      case 'diplomacy': return 'bg-teal-100 dark:bg-teal-950/45 text-teal-600 dark:text-teal-400';
      default: return 'bg-emerald-100 text-emerald-600';
    }
  };

  return (
    <div id="hijri-calendar-history-module" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 border border-white/10 dark:border-emerald-500/10">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none select-none flex items-center justify-center">
          <History className="w-full h-full" />
        </div>
        <div className="absolute left-4 top-4 opacity-50 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        
        <div className="relative z-10 max-w-3xl text-left">
          <span className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-widest text-emerald-100 border border-white/10 mb-4">
            📜 Sejarah & Khazanah Islamiyah Nusantara
          </span>
          <h1 className="text-2xl md:text-3.5xl font-serif font-black leading-tight mb-2.5">
            Kalender Hijriah & Peristiwa Sejarah Agung
          </h1>
          <p className="text-xs md:text-sm text-emerald-50/90 leading-relaxed max-w-xl">
            Panduan lengkap nama-nama bulan Hijriah serta rekaman utuh peristiwa sejarah masyhur di zaman Nabi Muhammad SAW dan para sahabat rasyidah, berdasarkan kitab rujukan shahih yang dapat dipertanggungjawabkan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Month Selection Sidebar (12 Months Grid/Vertical) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-4.5 rounded-2xl shadow-3xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 text-left">
              <h3 className="font-serif font-extrabold text-sm text-slate-805 dark:text-emerald-50">
                12 Bulan Hijriah
              </h3>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                Tahun Hijriah
              </span>
            </div>
            
            {/* Horizontal scroll on mobile, vertical stack on desktop */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none snap-x">
              {HIJRI_MONTHS_DATA.map((m) => {
                const isActive = selectedMonthNum === m.number && viewMode === 'month-by-month';
                return (
                  <button
                    key={m.number}
                    onClick={() => {
                      setSelectedMonthNum(m.number);
                      setViewMode('month-by-month');
                    }}
                    className={`flex items-center gap-3 w-44 lg:w-full p-2.5 rounded-xl transition-all border shrink-0 snap-align-start text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white border-transparent shadow-md font-bold'
                        : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950/30 dark:hover:bg-slate-950/60 text-slate-700 dark:text-emerald-200 border-slate-150 dark:border-slate-800/60'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {String(m.number).padStart(2, '0')}
                    </div>
                    
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="flex items-center justify-between gap-1">
                        <span className="block text-xs font-bold truncate">
                          {m.name}
                        </span>
                        {m.isHaram && (
                          <span className={`text-[8.5px] font-black uppercase tracking-wider px-1 rounded-sm ${isActive ? 'bg-white/20 text-white' : 'bg-rose-50 dark:bg-rose-955/30 text-rose-500'}`} title="Bulan Haram (Mulia)">
                            Haram
                          </span>
                        )}
                      </div>
                      <span className={`block text-[10px] truncate ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-emerald-500/60'}`} style={{ fontFamily: 'monospace' }}>
                        {m.arabic}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-850 my-4" />
            
            {/* Global Search Option Tool */}
            <button
              onClick={() => setViewMode(prev => prev === 'search-all' ? 'month-by-month' : 'search-all')}
              className={`w-full py-2.5 px-4 rounded-xl border font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === 'search-all'
                  ? 'bg-amber-500 hover:bg-amber-650 border-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-705 dark:text-emerald-250 border-slate-205 dark:border-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{viewMode === 'search-all' ? 'Kembali ke Bulan Aktif' : 'Cari Semua Peristiwa'}</span>
            </button>
          </div>

          {/* Month Intro Card (Hanya muncul jika mode month-by-month) */}
          {viewMode === 'month-by-month' && (
            <div className="bg-gradient-to-br from-amber-500/5 to-amber-550/10 dark:from-amber-955/5 dark:to-orange-955/10 border-2 border-amber-500/60 p-4.5 rounded-2xl text-left">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-650 dark:text-amber-400 shrink-0" />
                <h4 className="font-serif font-black text-xs text-slate-850 dark:text-amber-400 uppercase tracking-wider">
                  Makna & Maklumat Bulan:
                </h4>
              </div>
              <h3 className="font-serif font-black text-lg text-slate-900 dark:text-amber-350 leading-tight mb-2 flex items-baseline gap-2">
                {selectedMonth.name}
                <span className="text-xs font-normal text-slate-500 dark:text-emerald-400/70">
                  ({selectedMonth.meaning})
                </span>
              </h3>
              <p className="text-[11.5px] text-slate-650 dark:text-emerald-200/90 leading-relaxed font-sans mb-3 text-justify">
                {selectedMonth.description}
              </p>
              {selectedMonth.isHaram && (
                <div className="py-1.5 px-2.5 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-950/50 rounded-xl text-[10.5px] text-rose-700 dark:text-rose-300 font-extrabold flex items-center gap-1.5 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  Bulan ini dilipatgandakan pahala amalan sunnah!
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Search Filter and Event Cards list */}
        <div className="lg:col-span-8 space-y-4 text-left">
          
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-4 rounded-2xl shadow-3xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={viewMode === 'search-all' ? "Cari peristiwa sejarah (misal: 'Karbala', 'Badar', 'Musa')..." : `Cari peristiwa di bulan ${selectedMonth.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 dark:focus:border-emerald-600 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Era Selector dropdown */}
              <div className="relative shrink-0">
                <select
                  value={eraFilter}
                  onChange={(e) => setEraFilter(e.target.value as any)}
                  className="w-full sm:w-48 py-2 pl-3.5 pr-8 bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-emerald-200 cursor-pointer focus:outline-none appearance-none"
                >
                  <option value="semua">⏳ Semua Era Sejarah</option>
                  <option value="pra_kerasulan">⏳ Zaman Pra-Kerasulan</option>
                  <option value="kerasulan">🕌 Zaman Kerasulan Nabi</option>
                  <option value="kekhalifahan">📜 Khulafaur Rasyidin</option>
                  <option value="pasca_sahabat">⚔️ Pasca Sahabat / Dinasti</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-550">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Event Listing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-serif font-black text-slate-900 dark:text-emerald-50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                {viewMode === 'month-by-month' ? `Peristiwa Sejarah Bulan ${selectedMonth.name}` : `Semua Peristiwa Sejarah Terkait`}
                <span className="text-xs text-blue-550 font-sans font-black bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  {filteredEvents.length} Hasil
                </span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400 font-extrabold uppercase">
                UMAT NUSANTARA
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center rounded-3xl"
                >
                  <History className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-3" />
                  <h3 className="font-serif font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">
                    Tidak Ditemukan Peristiwa Sejarah
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-emerald-500/60 max-w-md mx-auto">
                    Kriteria pencarian atau filter kependudukan sejarah Anda kosong. Cobalah menggunakan kata kunci umum lain atau reset filter era.
                  </p>
                  {(searchQuery || eraFilter !== 'semua') && (
                    <button
                      onClick={() => { setSearchQuery(""); setEraFilter("semua"); }}
                      className="mt-4 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      Mulai Ulang Filter
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className="grid gap-4.5">
                  {filteredEvents.map((event) => {
                    const eraStyle = getEventBadgeStyle(event.era);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        key={event.id}
                        className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-5 rounded-2xl shadow-3xs hover:border-emerald-500/50 dark:hover:border-emerald-800 transition-all flex flex-col sm:flex-row gap-4 group"
                      >
                        {/* Event icon box */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getIconColorStyle(event.iconType)} shadow-3xs`}>
                          {event.iconType === 'birth' && <Heart className="w-5.5 h-5.5 fill-current" />}
                          {event.iconType === 'death' && <Info className="w-5.5 h-5.5 font-bold" />}
                          {event.iconType === 'victory' && <Award className="w-5.5 h-5.5 font-bold animate-pulse" />}
                          {event.iconType === 'struggle' && <Swords className="w-5.5 h-5.5" />}
                          {event.iconType === 'miracle' && <Sparkles className="w-5.5 h-5.5" />}
                          {event.iconType === 'diplomacy' && <BookOpen className="w-5.5 h-5.5" />}
                        </div>

                        {/* Content text block */}
                        <div className="min-w-0 flex-grow text-left space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg border text-[9.5px] font-black uppercase tracking-wider ${eraStyle.bg}`}>
                              {eraStyle.label}
                            </span>
                            <span className="text-[10px] font-black text-rose-650 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 px-2 py-0.5 rounded-lg border border-rose-100/30">
                              📅 {event.hijriDate}
                            </span>
                            {viewMode === 'search-all' && (
                              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg">
                                🌙 Bulan { (event as any).monthName }
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif font-extrabold text-base md:text-lg text-slate-850 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                            {event.title}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-emerald-250 leading-relaxed text-justify line-clamp-3 md:line-clamp-none font-sans">
                            {event.summary}
                          </p>

                          {/* Authentic reference citation block */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between text-[11px] text-slate-400 font-semibold gap-2">
                            <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] text-slate-450 dark:text-emerald-500">
                              📚 RUJUKAN SHAHIH: <strong className="text-slate-600 dark:text-emerald-300 font-sans tracking-tight">{event.reference}</strong>
                            </span>
                            
                            {/* Read details button */}
                            <button
                              onClick={() => setSelectedEvent(event)}
                              className="px-3.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-950/30 dark:hover:bg-slate-950/80 text-slate-500 dark:text-emerald-400 font-extrabold rounded-lg border border-slate-200 dark:border-slate-800/85 transition-all text-left flex items-center justify-center gap-1 active:scale-95 ml-auto md:ml-0 cursor-pointer"
                            >
                              <span>Baca Selengkapnya</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal Dialog: Event Details for deep storytelling */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            {/* Dark translucent backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            />

            {/* Glowing Detailed Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 rounded-3xl p-6.5 sm:p-8 shadow-2xl overflow-hidden z-[150] text-left"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:text-emerald-400/60 dark:hover:text-emerald-250 hover:bg-slate-50 dark:hover:bg-slate-950/45 cursor-pointer transition-colors active:scale-90"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Event categorization details */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-2.5 py-0.5 rounded-lg border text-[9.5px] font-black uppercase tracking-wider ${getEventBadgeStyle(selectedEvent.era).bg}`}>
                  {getEventBadgeStyle(selectedEvent.era).label}
                </span>
                <span className="text-[10px] font-black text-rose-650 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-955/20 px-2.5 py-0.5 rounded-lg border border-rose-100/30">
                  📅 {selectedEvent.hijriDate}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3.5 mb-5 select-none">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${getIconColorStyle(selectedEvent.iconType)}`}>
                  {selectedEvent.iconType === 'birth' && <Heart className="w-5 h-5 fill-current" />}
                  {selectedEvent.iconType === 'death' && <Info className="w-5 h-5 font-bold" />}
                  {selectedEvent.iconType === 'victory' && <Award className="w-5 h-5 font-bold" />}
                  {selectedEvent.iconType === 'struggle' && <Swords className="w-5 h-5" />}
                  {selectedEvent.iconType === 'miracle' && <Sparkles className="w-5 h-5" />}
                  {selectedEvent.iconType === 'diplomacy' && <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-emerald-50 leading-tight">
                    {selectedEvent.title}
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest mt-0.5 block uppercase">
                    SEJARAH PERADABAN ISLAM
                  </span>
                </div>
              </div>

              {/* Story summary details body */}
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 p-5 rounded-2xl mb-5 space-y-3 font-sans text-xs sm:text-sm text-slate-700 dark:text-emerald-200 leading-relaxed text-justify max-h-[45vh] overflow-y-auto scrollbar-thin">
                <p>{selectedEvent.summary}</p>
              </div>

              {/* Rujukan Shahih Block */}
              <div className="bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/35 p-4 rounded-xl flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="min-w-0 flex-1 leading-tight text-justify">
                  <p className="text-[10.5px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
                    Kitab Rujukan Shahih & Terpercaya:
                  </p>
                  <p className="text-xs text-slate-650 dark:text-emerald-200 font-semibold italic">
                    &ldquo;{selectedEvent.reference}&rdquo;
                  </p>
                  <p className="text-[9.5px] text-slate-400 mt-2 font-medium">
                    * Catatan sejarah ini dirangkum secara amanah berasaskan penelaahan komparatif ulama Hadits dan pakar Sirah Nabawiyah Ahlussunnah wal Jama'ah demi menjaga kesucian pemahaman akidah.
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-97"
                >
                  Selesai Membaca & Pahami
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
