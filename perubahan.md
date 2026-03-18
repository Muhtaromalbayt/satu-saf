Prompt Instruksi Perubahan Proyek

Subjek: Refactoring SATU SAF - Sistem Monitoring Santri 14 Hari & Integrasi Google Sheets

Konteks Proyek:
Saya sedang membangun platform SATU SAF menggunakan Next.js 15 (App Router), Drizzle ORM, Cloudflare D1, dan Better-Auth. Aplikasi ini akan diubah dari sistem "10 Gates" berbasis tema menjadi sistem monitoring intensif selama 14 hari.

Instruksi Perubahan:

    Struktur Map & Chapter:

        Ubah total Core Learning Engine dari 10 Chapter menjadi 14 Chapter yang merepresentasikan 14 hari kegiatan.

        Setiap Chapter (Hari) harus berisi 5 aspek monitoring tetap: Ibadah, Berbakti kepada Orang Tua, Lingkungan, Diri Sendiri, dan Setoran Hafalan.

    Mekanisme Login (Tanpa Password - Spreadsheets Based):

        Rombak sistem login. Pengguna login dengan memilih Nama dan Kelompok melalui komponen Dropdown/Select.

        Data referensi harus divalidasi secara real-time dari Google Sheets (ID: 1RmQaicVsMyie50lHpQPb68pVVmrYBr9jlJuJ5-0T2TY).

        Keamanan: Pastikan ada pengecekan di database D1 agar satu identitas (Nama + Kelompok) tidak bisa login secara ganda atau digunakan di sesi yang berbeda secara bersamaan.

    Skema Database (Drizzle & Cloudflare D1):

        Update skema users untuk menyimpan metadata dari spreadsheet (ID, Nama, Kelompok).

        Buat tabel daily_monitoring untuk menyimpan status checklist/nilai dari 5 aspek selama 14 hari.

        Buat tabel scores untuk mencatat: Nilai Setoran Hafalan, Tes Tulis, Tahajud, dan akumulasi poin monitoring harian.

    Sistem Leaderboard:

        Buat fungsi kalkulasi Leaderboard yang menjumlahkan bobot nilai dari:

            Total monitoring 14 hari.

            Rata-rata nilai setoran hafalan.

            Skor tes tulis.

            Keaktifan Tahajud.

    UI/UX:

        Gunakan Framer Motion untuk transisi antar hari di peta perjalanan.

        Pastikan dashboard santri menampilkan progres checklist yang belum selesai pada hari berjalan.