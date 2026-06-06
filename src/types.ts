/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: {
    [key: string]: string; // URL for different audio streams e.g. "01", "02" etc
  };
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: {
    [key: string]: string;
  };
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
}

export interface DoaItem {
  id: string;
  judul: string;
  arab: string;
  latin: string;
  terjemahan: string;
  kategori: string;
  sumber?: string;
}

export interface AsmaulHusnaItem {
  urutan: number;
  arab: string;
  latin: string;
  arti: string;
}

export interface PrayerTimes {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit?: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface WorshipTrack {
  subuh: boolean;
  dzuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
  dhuha: boolean;
  tahajjud: boolean;
  tilawahPages: number;
  sedekah: boolean;
  dzikirPagi: boolean;
  dzikirPetang: boolean;
}

export type ActiveTab = 'home' | 'qibla' | 'quran' | 'tasbih' | 'doa' | 'jadwal' | 'asmaul' | 'amal';
