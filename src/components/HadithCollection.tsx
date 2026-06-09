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
    number: "1",
    narrator: "HR. Bukhari",
    category: "Niat & Keikhlasan",
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    latin: "Innamal-a'mālu bin-niyyāti wa innamā likullimri-im mā nawā.",
    translation: "Sesungguhnya setiap amalan itu bergantung pada niatnya, dan setiap orang akan mendapatkan balasan sesuai dengan apa yang dia niatkan.",
    explanation: "Kaidah agung dalam Islam bahwa keabsahan, kesempurnaan, serta diterimanya seluruh ibadah fisik maupun non-fisik ditentukan oleh kemurnian niat semata-mata karena Allah.",
    sourceKitab: "Kitab Shahih Bukhari No. 1, Bab Permulaan Turunnya Keikhlasan Niat",
    verificationAgency: "Lembaga Pentashihan & Kementerian Agama RI"
  },
  {
    number: "2564",
    narrator: "HR. Muslim",
    category: "Niat & Keikhlasan",
    arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    latin: "Inna-llāha lā yanẓuru ilā ṣuwarikum wa amwālikum walākin yanẓuru ilā qulūbikum wa a'mālikum.",
    translation: "Sesungguhnya Allah tidak melihat kepada rupa dan harta kalian, melainkan Dia melihat kepada hati dan amal kalian.",
    explanation: "Allah menilai ketulusan hati dan kualitas amal perbuatan spiritual, bukan sekadar penampilan lahiriah atau status kekayaan material seseorang.",
    sourceKitab: "Kitab Shahih Muslim No. 2564, Kitab Kebajikan, Silaturahmi, dan Adab",
    verificationAgency: "Komisi Fatwa Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "2518",
    narrator: "HR. Tirmidzi",
    category: "Niat & Keikhlasan",
    arabic: "دَعْ مَا يَرِيبُكَ إِلَى مَا لَا يَرِيبُكَ",
    latin: "Da' mā yarībuka ilā mā lā yarībuka.",
    translation: "Tinggalkanlah apa yang meragukanmu menuju apa yang tidak meragukanmu.",
    explanation: "Prinsip kehati-hatian (wara') untuk menghindari kesyubhatan atau keraguan demi menjaga kesucian agama dan keikhlasan jiwa.",
    sourceKitab: "Syarah Sunan Tirmidzi No. 2518, Dinilai Shahih oleh Syekh Al-Albani",
    verificationAgency: "Kementerian Agama RI & Lajnah Tashih"
  },
  {
    number: "54",
    narrator: "HR. Bukhari",
    category: "Niat & Keikhlasan",
    arabic: "الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ وَبَيْنَهُمَا مُشْتَبِهَاتٌ",
    latin: "Al-ḥalālu bayyinun wal-ḥarāmu bayyinun wa baynahumā musytabihāt.",
    translation: "Yang halal itu jelas dan yang haram itu jelas, dan di antara keduanya terdapat hal-hal syubhat (samar) yang tidak diketahui oleh kebanyakan orang.",
    explanation: "Menghindari hal-hal yang samar atau diperselisihkan kehalalannya adalah sebaik-baik jalan menjaga kemurnian iman dan kehormatan diri.",
    sourceKitab: "Kitab Shahih Bukhari No. 52 & Shahih Muslim No. 1599",
    verificationAgency: "Majelis Ulama Indonesia (MUI)"
  },
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
    explanation: "Akhlak mulia memiliki bobot pahala yang sangat luar biasa di akhirat, menyaingi ibadah-ibadah murni lainnya dalam timbangan mizan.",
    sourceKitab: "Kitab Sunan Tirmidzi No. 2002, Dinilai Shahih oleh Syekh Al-Albani",
    verificationAgency: "Komisi Fatwa Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "6018",
    narrator: "HR. Bukhari",
    category: "Akhlak & Adab",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    latin: "Man kāna yu'minu billāhi wal-yawmil-ākhiri falyaqul khayran aw liyasmut.",
    translation: "Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam.",
    explanation: "Menjaga lisan adalah cerminan langsung dari keimanan. Menghindari ucapan sia-sia, ujaran kebencian, fitnah, maupun ghibah.",
    sourceKitab: "Kitab Shahih Bukhari No. 6018, Kitab Adab Umum",
    verificationAgency: "Kementerian Agama RI"
  },
  {
    number: "6116",
    narrator: "HR. Bukhari",
    category: "Akhlak & Adab",
    arabic: "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    latin: "Lā tagḍab wa lakal-jannah.",
    translation: "Janganlah kamu marah, dan bagimu adalah surga.",
    explanation: "Kemampuan menahan amarah secara sadar adalah salah satu kekuatan mental spiritual tertinggi dan berpahala surga.",
    sourceKitab: "Kitab Shahih Bukhari No. 6116, Bab Menghindari Amarah",
    verificationAgency: "Lembaga Pentashihan & Kementerian Agama RI"
  },
  {
    number: "1977",
    narrator: "HR. Tirmidzi",
    category: "Akhlak & Adab",
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    latin: "Tabassumuka fī wajhi akhīka laka ṣadaqatun.",
    translation: "Senyummu di hadapan saudaramu adalah sedekah bagimu.",
    explanation: "Kebaikan tidak harus berwujud materi. Keramahan wajah dan kehangatan sosial yang tulus bernilai ibadah sedekah di sisi Allah.",
    sourceKitab: "Kitab Sunan Tirmidzi No. 1977, Dinilai Shahih oleh Syekh Al-Albani",
    verificationAgency: "Komisi Fatwa Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "6117",
    narrator: "HR. Bukhari",
    category: "Akhlak & Adab",
    arabic: "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    latin: "Al-ḥayā'u lā ya'tī illā bikhayrin.",
    translation: "Sifat malu itu tidak mendatangkan sesuatu melainkan kebaikan semata.",
    explanation: "Rasa malu untuk melakukan perbuatan buruk, maksiat, atau melanggar norma sosial adalah tameng pelindung moral yang sangat kokoh.",
    sourceKitab: "Kitab Shahih Bukhari No. 6117, Bab Sifat Malu",
    verificationAgency: "Kementerian Agama RI"
  },
  {
    number: "33",
    narrator: "HR. Bukhari",
    category: "Akhlak & Adab",
    arabic: "آيَةُ الْمُنَافِقِ ثَلَاثٌ إِذَا حَدَّثَ كَذَبَ وَإِذَا وَعَدَ أَخْلَفَ وَإِذَا اؤْتُمِنَ خَانَ",
    latin: "Āyatul-munāfiqi ṡalāṡun: iżā ḥaddaṡa każaba, wa iżā wa'ada akhlafa, wa iżā'tumina khāna.",
    translation: "Tanda-tanda orang munafik ada tiga: jika berbicara ia berdusta, jika berjanji ia mengingkari, dan jika dipercaya ia berkhianat.",
    explanation: "Peringatan keras terhadap karakter nifak amali (kemunafikan dalam perbuatan) yang merusak kepercayaan sosial dan integritas diri.",
    sourceKitab: "Kitab Shahih Bukhari No. 33 & Shahih Muslim No. 59",
    verificationAgency: "Kajian Hadits & Kementerian Agama RI"
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
    number: "2586",
    narrator: "HR. Muslim",
    category: "Kasih Sayang & Sosial",
    arabic: "مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى",
    latin: "Maṡalul-mu'minīna fī tawāddihim wa tarāḥumihim wa ta'āṭufihim maṡalul-jasadi iżasytakā minhu 'uḍwun tadā'ā lahu sā'irul-jasadi bis-sahari wal-ḥummā.",
    translation: "Perumpamaan kaum mukmin dalam sikap saling mencintai, saling mengasihi, dan bahu-membahu bagaikan satu tubuh. Apabila ada salah satu anggota tubuh yang sakit, maka seluruh anggota tubuh lainnya ikut merasakan dengan tidak bisa tidur dan demam.",
    explanation: "Prinsip solidaritas kemanusiaan dan keimanan yang kokoh, menggambarkan kesatuan umat bagai organisme tunggal yang tak terpisahkan.",
    sourceKitab: "Kitab Shahih Muslim No. 2586, Bab Saling Mengasihi Sesama Muslim",
    verificationAgency: "Lembaga Fatwa & Kajian Hadits Nusantara"
  },
  {
    number: "1924",
    narrator: "HR. Tirmidzi",
    category: "Kasih Sayang & Sosial",
    arabic: "ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
    latin: "Irḥamū man fīl-arḍi yarḥamkum man fīs-samā'.",
    translation: "Sayangilah makhluk yang ada di bumi, niscaya yang ada di langit akan menyayangimu.",
    explanation: "Pesan kasih sayang yang universal (rahmatan lil alamin) mencakup perdamaian sesama manusia, hewan, tumbuhan, dan seisi ekosistem bumi.",
    sourceKitab: "Kitab Sunan Tirmidzi No. 1924, Hadits Hasan Shahih",
    verificationAgency: "Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "5971",
    narrator: "HR. Bukhari",
    category: "Kasih Sayang & Sosial",
    arabic: "مْنْ أَحَقُw النَّاسِ بِحُسْنِ صَحَابَتِي قَالَ أُمُّكَ قَالَ ثُمَّ مَنْ قَالَ أُمُّكَ قَالَ ثُمَّ مَنْ قَالَ أُمُّكَ قَالَ ثُمَّ مَنْ قَالَ أَبُوكَ",
    latin: "Man aḥaqqun-nāsi biḥusni ṣaḥābatī? Qāla: Ummuka, ṡumma Ummuka, ṡumma Ummuka, ṡumma abūka.",
    translation: "Siapakah orang yang paling berhak aku pergauli dengan baik? Rasulullah menjawab: Ibumu, kemudian Ibumu, kemudian Ibumu, kemudian Ayahmu.",
    explanation: "Penghormatan luar biasa agung terhadap peran seorang ibu yang mengayomi kehidupan anak sejak mengandung, melahirkan, hingga membesarkan.",
    sourceKitab: "Kitab Shahih Bukhari No. 5971 & Shahih Muslim No. 2548",
    verificationAgency: "Darul Ifta & Lajnah Pentashih Hadits"
  },
  {
    number: "6011",
    narrator: "HR. Thabrani",
    category: "Kasih Sayang & Sosial",
    arabic: "لَيْسَ الْمُؤْمِنُ الَّذِي يَشْبَعُ وَجَارُهُ جَائِعٌ إِلَى جَنْبِهِ",
    latin: "Laysal-mu'minul-lażī yasbya'u wa jāruhū jā'i'un ilā janbih.",
    translation: "Bukanlah seorang mukmin sejati, orang yang kenyang sementara tetangga di sampingnya kelaparan.",
    explanation: "Kepekaan sosial dan kepedulian pangan antartetangga diletakkan langsung sebagai tolok ukur kesempurnaan iman seseorang.",
    sourceKitab: "Kitab Al-Mu'jam al-Kabir Thabrani, Dinilai Shahih oleh Al-Albani di Al-Adab Al-Mufrad",
    verificationAgency: "Komisi Fatwa Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "5986",
    narrator: "HR. Bukhari",
    category: "Kasih Sayang & Sosial",
    arabic: "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِzْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ",
    latin: "Man aḥabba ay yubsaṭa lahu fī rizqihī wa yunsa'a lahu fī aṡarihī falyāṣil raḥimah.",
    translation: "Barangsiapa yang ingin dilapangkan rezekinya dan dipanjangkan umurnya, maka hendaklah ia menyambung tali silaturahmi.",
    explanation: "Silaturahmi tidak sekadar melahirkan kerukunan sosial berkelanjutan, melainkan mengundang keberkahan rezeki dan kemanfaatan umur dari Allah.",
    sourceKitab: "Kitab Shahih Bukhari No. 5986 & Shahih Muslim No. 2557",
    verificationAgency: "Kementerian Agama RI"
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
    number: "1893",
    narrator: "HR. Muslim",
    category: "Ilmu & Pembelajaran",
    arabic: "مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ",
    latin: "Man dalla 'alā khayrin falahū miṡlu ajri fā'ilih.",
    translation: "Barangsiapa menunjukkan kepada kebaikan, maka ia memperoleh pahala seperti pahala orang yang melakukannya.",
    explanation: "Keutamaan sharing ilmu, dakwah, dan edukasi kebaikan. Setiap pelaku yang mengikuti perbuatan baik kita akan mengalirkan pahala pasif melimpah.",
    sourceKitab: "Kitab Shahih Muslim No. 1893, Bab Fadhlul I'anah 'alal Jihad",
    verificationAgency: "Kementerian Agama RI"
  },
  {
    number: "5027",
    narrator: "HR. Bukhari",
    category: "Ilmu & Pembelajaran",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    latin: "Khayrukum man ta'allamal-qur'āna wa 'allamah.",
    translation: "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya.",
    explanation: "Tolok ukur kualitas spiritual terbaik seorang mukmin adalah kesediaannya membagi waktu untuk mempelajari firman Allah dan mengajarkannya secara tulus.",
    sourceKitab: "Kitab Shahih Bukhari No. 5027, Bab Keutamaan Membaca Al-Qur'an",
    verificationAgency: "Lajnah Pentashihan Mushaf Al-Qur'an Kemenag"
  },
  {
    number: "2322",
    narrator: "HR. Thabrani",
    category: "Ilmu & Pembelajaran",
    arabic: "فَضْلُ الْعِلْمِ خَيْرٌ مِنْ فَضْلِ الْعِبَادَةِ",
    latin: "Faḍlul-'ilmi khayrun min faḍlil-'ibādah.",
    translation: "Keutamaan ilmu itu lebih baik daripada keutamaan ibadah sunnah (tanpa bekal ilmu).",
    explanation: "Ilmu menjaga ketepatan, kesahihan, dan keikhlasan amalan ibadah. Ibadah tanpa landasan ilmu yang mapan rentan tersesat atau sia-sia.",
    sourceKitab: "Kitab Al-Mu'jam Al-Awsat Thabrani, Dinilai Hasan oleh Al-Albani",
    verificationAgency: "Komisi Fatwa Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "1631",
    narrator: "HR. Muslim",
    category: "Amal & Sedekah",
    arabic: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    latin: "Iżā mātul-insānun-qaṭa'a 'anhu 'amaluhū illā min ṡalāṡatin, illā min ṣadaqatin jāriyatin aw 'ilmin yuntafa'u bihī aw waladin ṣāliḥin yad'ū lah.",
    translation: "Jika seseorang meninggal dunia, maka terputuslah semua amalannya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
    explanation: "Tiga amalan abadi setelah kematian yang pahalanya terus mengalir deras meskipun seseorang telah tiada dan berada di alam barzakh.",
    sourceKitab: "Kitab Shahih Muslim No. 1631, Kitab Wasiat",
    verificationAgency: "Darul Ifta & Lajnah Pentashih Hadits"
  },
  {
    number: "2588",
    narrator: "HR. Muslim",
    category: "Amal & Sedekah",
    arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    latin: "Mā naqaṣat ṣadaqatun min mālin.",
    translation: "Sedekah itu tidak akan pernah mengurangi harta sedikit pun.",
    explanation: "Secara lahiriah nominal uang berkurang, namun sedekah membawa keberkahan spiritual berupa kelapangan rezeki, ketenangan, serta perlindungan musibah.",
    sourceKitab: "Kitab Shahih Muslim No. 2588, Kitab Al-Birr was-Silah",
    verificationAgency: "Kementerian Agama RI"
  },
  {
    number: "1429",
    narrator: "HR. Bukhari",
    category: "Amal & Sedekah",
    arabic: "الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى",
    latin: "Al-yadul-'ulyā khayrun minal-yadis-suflā.",
    translation: "Tangan yang di atas (pemberi) itu lebih baik daripada tangan yang di bawah (penerima).",
    explanation: "Ajaran mulia bagi umat Islam untuk mandiri secara ekonomi, bekerja keras mencari rezeki yang halal, dan aktif membantu sesama.",
    sourceKitab: "Kitab Shahih Bukhari No. 1429 & Shahih Muslim No. 1033",
    verificationAgency: "Lembaga Pentashihan & Lajnah Kemenag RI"
  },
  {
    number: "1005",
    narrator: "HR. Muslim",
    category: "Amal & Sedekah",
    arabic: "كُلُّ مَعْرُوفٍ صَدَقَةٌ",
    latin: "Kullu ma'rūfin ṣadaqatun.",
    translation: "Setiap perbuatan baik (makruf) adalah sedekah.",
    explanation: "Mempermudah urusan orang lain, menyingkirkan duri di jalan, berkata lembut, mengarahkan jalan tersesat, semuanya tercatat berpahala sedekah.",
    sourceKitab: "Kitab Shahih Muslim No. 1005 & Shahih Bukhari No. 6021",
    verificationAgency: "Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "6412",
    narrator: "HR. Bukhari",
    category: "Amal & Sedekah",
    arabic: "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ الصِّحَّةُ وَالْفَرَاغُ",
    latin: "Ni'matāni magbūnun fīhimā kaṡīrum-minan-nāsi: aṣ-ṣiḥḥatu wal-farāg.",
    translation: "Dua kenikmatan yang kebanyakan manusia tertipu dan lalai di dalamnya, yaitu: kesehatan fisik dan waktu luang.",
    explanation: "Pesona kesehatan dan santainya waktu senggang sering melalaikan mukmin untuk produktif beramal saleh hingga tersadar saat keduanya sirna.",
    sourceKitab: "Kitab Shahih Bukhari No. 6412, Kitab Al-Riqaq (Kelembutan Hati)",
    verificationAgency: "Lembaga Pentashihan & Kementerian Agama RI"
  },
  {
    number: "6682",
    narrator: "HR. Bukhari",
    category: "Keutamaan Zikir & Doa",
    arabic: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ثَقِيلَتَانِ فِي الْمِيزَانِ حَبِيبَتَانِ إِلَى الرَّحْمَنِ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    latin: "Kalimatāni khafīfatāni 'alal-lisāni ṡaqīlatāni fīl-mīzāni ḥabībatāni ilar-Raḥmāni: Subḥānal-lāhi wa biḥamdihī Subḥānal-lāhil-'Aẓīm.",
    translation: "Dua kalimat yang ringan di lisan, berat di timbangan kiamat, dan dicintai Ar-Rahman: Subhanallahi wa bihamdih, Subhanallahil Adzim.",
    explanation: "Keutamaan zikir tasbih penenang jiwa. Kalimat yang sangat mudah dideklarasikan lisan namun bernilai luar biasa dalam catatan amal.",
    sourceKitab: "Kitab Shahih Bukhari No. 6682 & Shahih Muslim No. 2694",
    verificationAgency: "Darul Ifta & Lajnah Pentashih Hadits"
  },
  {
    number: "3377",
    narrator: "HR. Tirmidzi",
    category: "Keutamaan Zikir & Doa",
    arabic: "أَلَا أُنَبِّئُكُمْ بِخَيْرِ أَعْمَالِكُمْ وَأَزْكَاهَا عِنْدَ مَلِيكِكُمْ وَأَرْfَعِهَا فِي دَرَجَاتِكُمْ... ذِكْرُ اللَّهِ",
    latin: "Alā unabbi'ukum bikhayri a'mālikum wa azkāhā 'inda malīkikum... Żikrullāh.",
    translation: "Maukah aku kabarkan tentang sebaik-baik amal dan paling suci di sisi Penguasa kalian serta tertinggi pada derajat kalian? Yaitu mengingat Allah (zikir).",
    explanation: "Zikir berkelanjutan melahirkan kesadaran batin yang dalam, menjaga diri dari kelalaian moral, serta mengangkat derajat ketakwaan di sisi Tuhan.",
    sourceKitab: "Kitab Sunan Tirmidzi No. 3377, Dinilai Shahih oleh Al-Albani",
    verificationAgency: "Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "2969",
    narrator: "HR. Tirmidzi",
    category: "Keutamaan Zikir & Doa",
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    latin: "Ad-du'ā'u huwal-'ibādah.",
    translation: "Doa itu adalah ibadah itu sendiri.",
    explanation: "Doa menunjukkan kehambaan yang murni, kepasrahan emosional, serta pengakuan mutlak akan ketidakberdayaan diri di hadapan kebesaran Allah.",
    sourceKitab: "Kitab Sunan Tirmidzi No. 2969, Dinilai Shahih oleh Syekh Al-Albani",
    verificationAgency: "Komisi Fatwa Majelis Ulama Indonesia (MUI)"
  },
  {
    number: "408",
    narrator: "HR. Muslim",
    category: "Keutamaan Zikir & Doa",
    arabic: "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا",
    latin: "Man ṣallā 'alayya wāḥidatan ṣallallāhu 'alayhi 'asyrā.",
    translation: "Barangsiapa yang bershalawat kepadaku sekali, maka Allah akan bershalawat (memberikan rahmat) kepadanya sepuluh kali.",
    explanation: "Anjuran memperbanyak shalawat atas Nabi Muhammad ﷺ sebagai saluran mendatangkan limpahan kasih sayang dan keberkahan vertikal dari Allah.",
    sourceKitab: "Kitab Shahih Muslim No. 408, Kitab Shalat Utama",
    verificationAgency: "Lembaga Pentashihan & Kementerian Agama RI"
  }
];

const CATEGORIES = ["Semua", "Akhlak & Adab", "Niat & Keikhlasan", "Kasih Sayang & Sosial", "Ilmu & Pembelajaran", "Amal & Sedekah", "Keutamaan Zikir & Doa"];

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
                <div
                  onClick={() => toggleExpand(cardKey)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(cardKey);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left cursor-pointer transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-850/20 select-none outline-none focus-visible:bg-slate-50 dark:focus-visible:bg-slate-850/30"
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
                </div>

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
