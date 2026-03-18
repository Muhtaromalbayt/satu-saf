# SATU SAF: Journey to Taqwa

**SATU SAF** adalah platform pembelajaran Islam interaktif dengan pendekatan gamifikasi bergaya *Duolingo*. Aplikasi ini dirancang untuk mengubah pengalaman belajar santri menjadi sebuah perjalanan (journey) yang seru, terukur, dan melibatkan peran aktif mentor serta orang tua.

---

## 🌟 Visi Utama
Mengubah pembelajaran adab dan ibadah yang pasif menjadi sistem yang dinamis, di mana pengguna mendapatkan progres nyata melalui penguasaan materi, praktik, dan aksi sosial.

## 🚀 Fitur Lengkap

### 1. Core Learning Engine (The 10 Gates)
Peta pembelajaran vertikal yang terdiri dari 10 Chapter utama. Setiap chapter memiliki simpul (**Nodes**) yang harus diselesaikan:
- **Story Node**: Penyampaian materi adab (S-A-T-U) melalui slide interaktif.
- **Recite Node**: Praktik tilawah Juz 30 dengan teknologi *Speech-to-Text* untuk validasi bacaan.
- **Challenge Node**: Kuis interaktif (pilihan ganda, susun kata) untuk menguji pemahaman.
- **Action Node**: Misi dunia nyata (aksi sosial/akhlak) yang membutuhkan validasi dari Mentor.

### 2. Gamifikasi & Motivasi
- **HP/Heart System**: Pengguna memiliki 5 "Hati". Kesalahan dalam kuis akan mengurangi hati.
- **Streak System**: Melacak konsistensi belajar harian dengan ikon api (🔥).
- **XP & Leaderboard**: Poin pengalaman (XP) dikumpulkan untuk bersaing di papan peringkat "Shaf Terbaik".
- **Dynamic Feedback**: Animasi confetti dan maskot interaktif untuk merayakan pencapaian.

### 3. Monitoring Amalan Yaumi (Habit Tracker)
Fitur pelacakan habit harian yang mencakup 4 aspek kebaikan:
- **Kepada Allah**: Sholat 5 waktu, Tadarus, Dzikir.
- **Kepada Orang Tua**: Berbakti, mendoakan, izin & salim.
- **Bagi Lingkungan**: Sedekah, menjaga kebersihan, senyum & salam.
- **Untuk Diri Sendiri**: Belajar, olahraga, tidur awal.

### 4. Portal Multi-Role
- **Dashboard Santri**: Fokus pada jalannya petualangan dan pelaporan habit.
- **Dashboard Mentor**: Validasi misi dunia nyata (Action Nodes) dan monitoring progres grup.
- **Dashboard Orang Tua**: Verifikasi amalan yaumi anak dan pemberian catatan motivasi.

---

## 🛠️ Detail Teknis (Tech Stack)

| Komponen | Teknologi |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **UI Components** | Shadcn UI, Radix UI, Lucide Icons |
| **Database** | Cloudflare D1 (SQLite) |
| **ORM** | Drizzle ORM |
| **Authentication** | Better-Auth |
| **Deployment** | Cloudflare Pages (Edge Runtime) |

---

## 📂 Struktur Proyek
- `src/app`: Routing dan halaman aplikasi (Next.js App Router).
- `src/components`: Komponen UI modular (HabitTracker, Map, Lesson).
- `src/lib/db`: Skema database dan konfigurasi Drizzle.
- `src/api`: Endpoint API teroptimasi untuk Edge Runtime.

---

> [!TIP]
> **SATU SAF** dioptimalkan untuk performa maksimal menggunakan infrastruktur Cloudflare, memastikan aplikasi tetap ringan dan responsif bahkan saat diakses oleh banyak santri secara bersamaan.
