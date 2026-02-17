Ini adalah **PRD Lengkap V2.0** yang menggabungkan konsep **SATU SAF** dengan mekanik **Duolingo**, dioptimalkan untuk performa **Cloudflare Pages + D1**.

---

# Product Requirement Document (PRD) V2.0 - SATU SAF

**Nama Proyek:** SATU SAF: Journey to Taqwa

**Konsep:** Gamified Islamic Learning Path (Duolingo Style)

**Target:** Santri (11-18 tahun), Mentor, & Orang Tua

**Tech Stack:** Next.js (App Router), Tailwind CSS, Shadcn UI, Cloudflare Pages, Cloudflare D1 (Database).

---

## 1. Visi Produk

Mengubah pengalaman pesantren kilat yang pasif menjadi perjalanan interaktif di mana santri "naik level" melalui penguasaan materi adab, praktik tilawah, dan pembuktian akhlak nyata.

---

## 2. Arsitektur Konten: "The 10 Gates"

Ada 10 Chapter (Gerbang) utama. Setiap Chapter terdiri dari beberapa **Nodes** (Langkah) yang harus diselesaikan secara berurutan:

| Tipe Node | Fungsi | Mekanik |
| --- | --- | --- |
| **Story Node** | Materi Adab (S-A-T-U) | Slide interaktif (Teks + Gambar/Video). |
| **Recite Node** | Praktik Tilawah (Juz 30) | **Speech-to-Text**: Santri membaca, sistem memvalidasi. |
| **Challenge Node** | Post-Test (Quiz) | Pilihan ganda, menyusun kata, menjodohkan. |
| **Action Node** | Misi Dunia Nyata | Input laporan aksi sosial/akhlak untuk di-acc Mentor. |

---

## 3. Fitur Utama & Spesifikasi Fungsional

### A. Core Engine (Duolingo Style)

1. **HP/Heart System:** Santri memiliki 5 "Hati". Salah menjawab di *Challenge Node* mengurangi 1 Hati.
2. **Streak System:** Menghitung hari aktif berturut-turut.
3. **XP & Leaderboard:** XP didapat dari penyelesaian Node. Masuk ke tabel peringkat "Shaf Terbaik".
4. **Path Map UI:** Tampilan vertikal jalur belajar dengan ikon yang bisa diklik. Node yang terkunci berwarna abu-abu.

### B. Speech Recognition (Recite Node)

* Menggunakan **Web Speech API** (tanpa biaya server).
* Sistem membandingkan output suara dengan string ayat target.
* Akurasi moderat (fokus pada kelancaran, bukan tajwid kompleks tingkat lanjut karena keterbatasan browser).

### C. Portal Mentor (Validator)

* Halaman khusus untuk melihat antrean **Action Node**.
* Tombol "Luluskan" atau "Bimbing Lagi" untuk misi dunia nyata.
* Poin dari *Action Node* adalah poin terbesar (+50 XP).

---

## 4. Skema Database (Cloudflare D1 - SQLite)

### Tabel: `users`

| Column | Type | Description |
| --- | --- | --- |
| `id` | TEXT (PK) | Clerk ID / Firebase Auth ID |
| `name` | TEXT | Nama Santri |
| `role` | TEXT | 'santri', 'mentor', 'parent' |
| `xp` | INTEGER | Total XP yang terkumpul |
| `hearts` | INTEGER | Sisa hati (Max 5) |
| `last_active` | TIMESTAMP | Untuk menghitung Streak |

### Tabel: `lessons`

| Column | Type | Description |
| --- | --- | --- |
| `id` | TEXT (PK) | ID Node (e.g., 'ch1-quiz-1') |
| `chapter` | INTEGER | 1 sampai 10 |
| `type` | TEXT | 'story', 'recite', 'quiz', 'action' |
| `content` | JSON | Data soal, teks ayat, atau materi |

### Tabel: `user_progress`

| Column | Type | Description |
| --- | --- | --- |
| `user_id` | TEXT | FK ke users |
| `lesson_id` | TEXT | FK ke lessons |
| `status` | TEXT | 'completed', 'pending_approval' |

---

## 5. UI/UX Design Requirements

### Tampilan Santri (Student View):

* **Header:** Bar progres, ikon Hati (❤️), dan ikon Api (🔥) untuk Streak.
* **Main Path:** Jalur meliuk ke bawah dengan tombol bulat besar untuk tiap langkah.
* **Quiz Screen:** Fullscreen dengan progress bar di atas, tombol "Periksa" di bawah yang berubah hijau (Benar) atau merah (Salah).

### Tampilan Mentor (Mentor View):

* **Notification Badge:** Menunjukkan jumlah laporan santri yang belum di-acc.
* **Quick Scan:** Daftar aksi nyata santri dengan foto/deskripsi singkat.

---

## 6. Strategi Deployment (Cloudflare Pages)

1. **Environment Variables:** Simpan `DATABASE_ID` dan API Key lainnya di Cloudflare Dashboard (bukan di repo publik).
2. **Binding:** Gunakan `wrangler.toml` untuk menghubungkan aplikasi Next.js ke database D1.
3. **Edge Runtime:** Semua API Routes menggunakan `export const runtime = 'edge'` untuk menghindari error 500 dan mendukung D1.

---

## 7. Roadmap Implementasi

* **Minggu 1 (Setup):** Inisialisasi repo, setup D1, sistem auth dasar.
* **Minggu 2 (Core):** Pembuatan UI Path Map dan mesin Quiz (pilihan ganda).
* **Minggu 3 (Advanced):** Implementasi Web Speech API dan Dashboard Mentor.
* **Minggu 4 (Final):** Penyelarasan data orang tua dan stress test sebelum Ramadhan.

---

**Langkah selanjutnya yang bisa saya bantu:**
Apakah kamu ingin saya buatkan **contoh struktur file `JSON` untuk materi dan soal (Chapter 1)** agar kamu punya gambaran bagaimana data dimasukkan ke database?