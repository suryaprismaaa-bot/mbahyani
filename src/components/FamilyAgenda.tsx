import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, PlusCircle, Trash2, CheckCircle2, AlertCircle, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FamilyAgendaItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_LABELS: Record<FamilyAgendaItem['category'], { label: string; bg: string; text: string; border: string }> = {
  pengajian: { label: 'Pengajian Rutin', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-100 dark:border-emerald-900/60' },
  khitanan: { label: 'Khitanan', bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-100 dark:border-indigo-900/60' },
  pernikahan: { label: 'Pernikahan', bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-100 dark:border-rose-900/60' },
  syukuran: { label: 'Tasyakuran / Syukuran', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-100 dark:border-amber-900/60' },
  silaturahmi: { label: 'Arisan & Silaturahmi', bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-100 dark:border-sky-900/60' },
  lainnya: { label: 'Acara Lainnya', bg: 'bg-slate-50 dark:bg-slate-800/40', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-100 dark:border-slate-700' }
};

const DEFAULT_AGENDAS: FamilyAgendaItem[] = [
  {
    id: "default-1",
    title: "Pengajian Bulanan & Doa Bersama Mbah Yani",
    category: "pengajian",
    date: "2026-06-14",
    time: "19:30",
    location: "Kediaman Bp. H. Ahmad Fauzi (Sidoarjo)",
    contactPerson: "Pak Fauzi (0812-3456-7890)",
    notes: "Pembacaan Surat Yasin, Tahlil, dan doa khusyuk bersama keluarga besar. Diharapkan seluruh anggota keluarga membawa mukena/sarung masing-masing.",
    createdAt: new Date().toISOString()
  },
  {
    id: "default-2",
    title: "Silaturahmi Akbar dan Arisan Triwulan Keluarga",
    category: "silaturahmi",
    date: "2026-07-05",
    time: "10:00",
    location: "Pendopo Ageng Villa Pinus (Prigen, Pasuruan)",
    contactPerson: "Teh Laras (0857-1122-3344)",
    notes: "Arisan keluarga besar sekalian piknik santai. Konsumsi nasi kotak telah dikoordinasikan. Harap konfirmasi jumlah anggota keluarga yang ikut maksimal H-7.",
    createdAt: new Date().toISOString()
  },
  {
    id: "default-3",
    title: "Tasyakuran Syukuran Kelulusan S2 Dik Nafis",
    category: "syukuran",
    date: "2026-06-21",
    time: "12:00",
    location: "RM Sederhana Jaya, Ruang VIP B",
    contactPerson: "Ibu Nurul (0821-8899-0011)",
    notes: "Acara syukuran atas wisuda S2 Nafis. Hidangan makan siang prasmanan bersama seluruh paman, bibi, serta keponakan.",
    createdAt: new Date().toISOString()
  }
];

export default function FamilyAgenda() {
  const [agendas, setAgendas] = useState<FamilyAgendaItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<FamilyAgendaItem['category']>("pengajian");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [notes, setNotes] = useState("");
  
  // Toast & confirmation states
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load from LocalStorage or seed defaults
  useEffect(() => {
    try {
      const saved = localStorage.getItem('family_agenda_data');
      if (saved) {
        setAgendas(JSON.parse(saved));
      } else {
        setAgendas(DEFAULT_AGENDAS);
        localStorage.setItem('family_agenda_data', JSON.stringify(DEFAULT_AGENDAS));
      }
    } catch (e) {
      console.warn("Could not read localstorage", e);
      setAgendas(DEFAULT_AGENDAS);
    }
  }, []);

  // Save to LocalStorage helper
  const saveAgendas = (updated: FamilyAgendaItem[]) => {
    setAgendas(updated);
    try {
      localStorage.setItem('family_agenda_data', JSON.stringify(updated));
    } catch (e) {
      console.error("Local Storage Save Failed:", e);
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date || !time || !location.trim() || !contactPerson.trim()) {
      showToast("Harap isi semua kolom wajib (*) agar agenda dapat tersimpan.", "error");
      return;
    }

    const newItem: FamilyAgendaItem = {
      id: "agenda-" + Date.now(),
      title: title.trim(),
      category,
      date,
      time,
      location: location.trim(),
      contactPerson: contactPerson.trim(),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...agendas];
    saveAgendas(updated);
    
    // Reset Form
    setTitle("");
    setCategory("pengajian");
    setDate("");
    setTime("");
    setLocation("");
    setContactPerson("");
    setNotes("");
    setShowAddForm(false);
    
    showToast("Agenda baru berhasil ditambahkan ke jadwal keluarga!", "success");
  };

  const handleDelete = (id: string) => {
    const updated = agendas.filter(item => item.id !== id);
    saveAgendas(updated);
    setConfirmDeleteId(null);
    showToast("Agenda keluarga berhasil dihapus.", "info");
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter & sorting algorithms
  const filteredAgendas = agendas
    .filter(agenda => filterCategory === "all" || agenda.category === filterCategory)
    .sort((a, b) => {
      // Sort chronologically by date then time
      const datetimeA = new Date(`${a.date}T${a.time}`).getTime();
      const datetimeB = new Date(`${b.date}T${b.time}`).getTime();
      return datetimeA - datetimeB;
    });

  // Check if dates are in the past or upcoming
  const getStatusBadge = (agendaDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const agendaTime = new Date(agendaDate);
    agendaTime.setHours(0, 0, 0, 0);

    if (agendaTime < today) {
      return (
        <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-medium">
          Selesai / Terlampaui
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-semibold animate-pulse">
        Mendatang
      </span>
    );
  };

  const formatIndoDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-emerald-100/65 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-md">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-sm max-w-sm w-[90%] ${
              toastMsg.type === 'success' ? 'bg-emerald-500 border-emerald-650 text-white' :
              toastMsg.type === 'error' ? 'bg-rose-600 border-rose-700 text-white' :
              'bg-slate-900 border-slate-950 text-white dark:bg-slate-800'
            }`}
          >
            {toastMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            ) : toastMsg.type === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0 text-white" />
            ) : (
              <Sparkles className="w-5 h-5 shrink-0 text-amber-300" />
            )}
            <span className="font-semibold">{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with sparkles decoration */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-2.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Sinergi Rutinitas Pengingat
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📂 Agenda & Kegiatan Keluarga
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Jadwalkan kajian rutin, pengajian Yasinan/Tahlil, arisan triwulanan, syukuran, atau acara silaturahmi besar Keluarga Mbah Yani di sini.
          </p>
        </div>

        <button
          id="btn-toggle-add-agenda"
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
            showAddForm
              ? 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-rose-600/10'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-600/10'
          }`}
        >
          {showAddForm ? (
            <>Tutup Form Agenda</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Sematkan Agenda Baru
            </>
          )}
        </button>
      </div>

      {/* Accordion collapse Add Agenda Form Area */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleAddSubmit} className="bg-slate-50 dark:bg-slate-950/45 p-5 sm:p-6 rounded-2xl border border-dashed border-emerald-500/25 dark:border-emerald-800/30 gap-4 grid grid-cols-1 md:grid-cols-2">
              <h3 className="col-span-full font-bold text-sm text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-2 border-b border-emerald-500/10 pb-2">
                ✍️ Tambahkan Agenda ke Kalender Bersama
              </h3>

              <div className="flex flex-col gap-1.5 col-span-full">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Agenda / Acara <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengajian Kubro / Walimatul Ursy Mas Amir"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs md:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-emerald-100 placeholder-slate-400 dark:placeholder-slate-550 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kategori Kegiatan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FamilyAgendaItem['category'])}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs md:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-emerald-100 transition-all cursor-pointer"
                >
                  <option value="pengajian">📖 Pengajian Rutin & Kajian</option>
                  <option value="khitanan">👦 Khitanan</option>
                  <option value="pernikahan">💍 Pernikahan</option>
                  <option value="syukuran">🍲 Tasyakuran / Syukuran</option>
                  <option value="silaturahmi">🤝 Arisan & Silaturahmi</option>
                  <option value="lainnya">✨ Acara Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Sematkan Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-emerald-100 transition-all cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mulai Waktu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-emerald-100 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tempat / Rumah Lokasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Musholla Al-Ikhlas lantai 2 / Rumah Bu Aminah"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs md:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-emerald-100 placeholder-slate-400 dark:placeholder-slate-550 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Narahubung / PJ Acara <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Fatoni (0812-xxx-xxx)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs md:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-emerald-100 placeholder-slate-400 dark:placeholder-slate-550 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-full">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catatan Rincian atau Deskripsi Pendukung (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Masukkan detail bawaan, instruksi baju seragam/sarung, titipan konsumsi, atau link peta dsb."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs md:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-emerald-100 placeholder-slate-400 dark:placeholder-slate-550 transition-all resize-none"
                />
              </div>

              <div className="col-span-full flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-500/15 transition-all cursor-pointer"
                >
                  Simpan Catatan Agenda
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Tab section in responsive grid */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-450 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Kelompokkan Kategori:</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Semua Agenda (Mendatang)' },
            { id: 'pengajian', label: '📖 Pengajian' },
            { id: 'khitanan', label: '👦 Khitanan' },
            { id: 'pernikahan', label: '💍 Pernikahan' },
            { id: 'syukuran', label: '🍲 Syukuran' },
            { id: 'silaturahmi', label: '🤝 Silaturahmi' },
            { id: 'lainnya', label: '✨ Lainnya' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterCategory(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filterCategory === item.id
                  ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200/80 dark:border-slate-800/85 text-slate-650 dark:text-slate-350'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agenda Grid Layout list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAgendas.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-250 dark:border-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-6">
            <span className="text-4xl">🗓️</span>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mt-3 text-sm">Belum Ada Agenda Terdaftar</h4>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Tidak ada agenda aktif untuk kategori kelompok ini. Segera sematkan agenda atau kegiatan keluarga pertamamu!
            </p>
            {filterCategory !== 'all' && (
              <button
                onClick={() => setFilterCategory('all')}
                className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Lihat Semua Agenda
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAgendas.map((item) => {
              const catMeta = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.lainnya;
              const isExpanded = expandedId === item.id;
              const isConfirmingDelete = confirmDeleteId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout="position"
                  className={`border rounded-2xl transition-all duration-200 ${
                    isExpanded 
                      ? 'bg-slate-50/70 dark:bg-slate-950/50 border-emerald-200 dark:border-emerald-900/60 shadow-md' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/90 hover:border-slate-200 dark:hover:border-slate-750 shadow-sm'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    {/* Event metadata column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
                          {catMeta.label}
                        </span>
                        {getStatusBadge(item.date)}
                      </div>

                      <h3 
                        onClick={() => toggleExpand(item.id)}
                        className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-50 hover:text-emerald-650 dark:hover:text-emerald-450 cursor-pointer flex items-center gap-2 line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate">{formatIndoDate(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                          <span className="truncate">Pukul {item.time} WIB</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0 md:col-span-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                          <span className="truncate font-medium">{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Controls alignment block */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-600 dark:text-slate-350 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title={isExpanded ? "Sembunyikan Rincian" : "Tampilkan Rincian"}
                      >
                        <span>Detail</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex items-center gap-1">
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 p-1 rounded-xl border border-rose-100 dark:border-rose-900">
                            <span className="text-[9px] text-rose-600 dark:text-rose-450 px-1 font-extrabold animate-pulse">Hapus?</span>
                            <button
                              id={`confirm-del-${item.id}`}
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-750 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Ya
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-200 dark:bg-slate-850 text-slate-800 dark:text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`ask-delete-${item.id}`}
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-2 text-rose-500 hover:text-rose-650 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                            title="Hapus Agenda"
                          >
                            <Trash2 className="w-3.8 h-3.8" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Accordion Expand Details content with smooth motion anim */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-slate-100/80 dark:border-slate-800 bg-slate-50/45 dark:bg-slate-950/25 rounded-b-2xl"
                      >
                        <div className="p-4 sm:p-5 space-y-4">
                          {item.notes && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                📝 Catatan Tambahan:
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                                {item.notes}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-emerald-500/5 dark:bg-emerald-500/2 px-4 py-2.5 rounded-xl border border-emerald-500/10">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450 shrink-0" />
                              <span className="text-slate-520 dark:text-slate-400 truncate">
                                Penanggung Jawab: <strong className="text-slate-800 dark:text-slate-205">{item.contactPerson}</strong>
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-420 dark:text-slate-450 italic shrink-0">
                              Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
