-- Seed Data for Chapters 1-10
-- SATU SAF Platform

DELETE FROM lessons WHERE id LIKE 'ch-%';

-- CHAPTER 1: Niat & Keikhlasan
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-1', 1, 'chapter', 'Bab 1: Niat & Keikhlasan',
    '{
      "preTest": [
        {"type": "multiple_choice", "question": "Apa niat utama kita saat berangkat ke masjid?", "options": ["Mencari teman", "Hanya ikut-ikutan", "Mendekatkan diri kepada Allah", "Menghindari pekerjaan"], "correctAnswer": 2},
        {"type": "pair_matching", "title": "Hubungkan Adab & Artinya", "pairs": [{"id": "1", "left": "Ikhlas", "right": "Murni karena Allah"}, {"id": "2", "left": "Sidiq", "right": "Jujur dalam Niat"}]}
      ],
      "material": {"title": "Visi SATU SAF", "description": "Memahami pentingnya i''tikaf and kebersihan hati.", "type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
      "quiz": [{"type": "multiple_choice", "question": "Apa arti Ikhlasul Amal?", "options": ["Beramal karena terpaksa", "Beramal hanya untuk Allah", "Beramal agar dipuji", "Beramal sisa tenaga"], "correctAnswer": 1}],
      "amalan": {"title": "Target Hari Ke-1", "items": [{"id": "sholat", "label": "Sholat 5 Waktu", "icon": "mosque"}, {"id": "ikhlas", "label": "Niat Ikhlas", "icon": "sparkles"}]},
      "tadarus": {"surahName": "QS. Al-Ikhlas", "verseText": "قُلْ هُوَ اللَّهُ أَحَدٌ", "targetString": "Qul huwallahu ahad", "translation": "Katakanlah: Dialah Allah, Yang Maha Esa."}
    }',
    datetime('now')
);

-- CHAPTER 2: Lisanul Khair
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-2', 2, 'chapter', 'Bab 2: Lisanul Khair',
    '{
      "preTest": [
        {"type": "multiple_choice", "question": "Apa yang dilakukan jika tidak bisa berkata baik?", "options": ["Berkata kasar", "Berdiam diri", "Bicara seadanya", "Berteriak"], "correctAnswer": 1}
      ],
      "material": {"title": "Indahnya Kata Baik", "description": "Video tentang keutamaan menjaga lisan.", "type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
      "quiz": [{"type": "multiple_choice", "question": "Hukum Ghibah adalah?", "options": ["Boleh", "Makruh", "Haram", "Sunnah"], "correctAnswer": 2}],
      "amalan": {"title": "Target Hari Ke-2", "items": [{"id": "lisan", "label": "Jaga Lisan", "icon": "sparkles"}, {"id": "tilawah", "label": "Tilawah 1 Juz", "icon": "quran", "isSpecial": true}]},
      "tadarus": {"surahName": "QS. Al-Falaq", "verseText": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "targetString": "Qul a'udzu birabbil falaq", "translation": "Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh."}
    }',
    datetime('now')
);

-- CHAPTER 3: Al-Amanah
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-3', 3, 'chapter', 'Bab 3: Al-Amanah',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Apa itu Amanah?", "options": ["Titipan", "Hadiah", "Pemberian", "Pinjaman"], "correctAnswer": 0}],
      "material": {"title": "Menjadi Pribadi Terpercaya", "description": "Materi PDF tentang sifat Al-Amin.", "type": "pdf", "url": "https://satusaf.com/materi/amanah.pdf"},
      "quiz": [{"type": "multiple_choice", "question": "Salah satu ciri orang munafik adalah?", "options": ["Sering Sholat", "Berkhianat saat dipercaya", "Suka sedekah", "Rajin belajar"], "correctAnswer": 1}],
      "amalan": {"title": "Target Hari Ke-3", "items": [{"id": "titipan", "label": "Jaga Titipan", "icon": "heart"}, {"id": "jujur", "label": "Berkata Jujur", "icon": "sparkles"}]},
      "tadarus": {"surahName": "QS. An-Nas", "verseText": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", "targetString": "Qul a'udzu birabbin nas", "translation": "Katakanlah: Aku berlindung kepada Tuhannya manusia."}
    }',
    datetime('now')
);

-- CHAPTER 4: Birrul Walidain
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-4', 4, 'chapter', 'Bab 4: Birrul Walidain',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Redha Allah terletak pada?", "options": ["Guru", "Teman", "Orang Tua", "Pemimpin"], "correctAnswer": 2}],
      "material": {"title": "Surga di Telapak Kaki Ibu", "description": "Kisah inspiratif tentang bakti anak.", "type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
      "quiz": [{"type": "multiple_choice", "question": "Bakti kepada orang tua disebut?", "options": ["Ukhuwah", "Amanah", "Birrul Walidain", "Sidiq"], "correctAnswer": 2}],
      "amalan": {"title": "Target Hari Ke-4", "items": [{"id": "bantu_ortu", "label": "Bantu Orang Tua", "icon": "heart"}, {"id": "doa_ortu", "label": "Doakan Orang Tua", "icon": "sparkles"}]},
      "tadarus": {"surahName": "QS. Al-Lahab", "verseText": "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", "targetString": "Tabbat yada abi lahabiw watab", "translation": "Binasalah kedua tangan Abu Lahab and sesungguhnya dia akan binasa."}
    }',
    datetime('now')
);

-- CHAPTER 5: Khusyukul Ibadah
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-5', 5, 'chapter', 'Bab 5: Khusyukul Ibadah',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Kapan kita harus paling khusyuk?", "options": ["Makan", "Bermain", "Sholat", "Tidur"], "correctAnswer": 2}],
      "material": {"title": "Merasakan Kehadiran-Nya", "description": "Tips mencapai kekhusyukan dalam ibadah.", "type": "pdf", "url": "https://satusaf.com/materi/khusyuk.pdf"},
      "quiz": [{"type": "multiple_choice", "question": "Apa itu Ihsan?", "options": ["Beribadah seakan melihat Allah", "Berbuat baik pada teman", "Menolong orang", "Membayar zakat"], "correctAnswer": 0}],
      "amalan": {"title": "Target Hari Ke-5", "items": [{"id": "sholat_awal", "label": "Sholat Awal Waktu", "icon": "clock"}, {"id": "dzikir", "label": "Dzikir Khusyuk", "icon": "sparkles"}]},
      "tadarus": {"surahName": "QS. An-Nasr", "verseText": "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", "targetString": "Idza ja'a nashrullahi wal fath", "translation": "Apabila telah datang pertolongan Allah and kemenangan."}
    }',
    datetime('now')
);

-- CHAPTER 6: Ukhuwah Islamiyah
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-6', 6, 'chapter', 'Bab 6: Ukhuwah Islamiyah',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Muslim dengan muslim lainnya adalah?", "options": ["Saingan", "Bersaudara", "Musuh", "Asing"], "correctAnswer": 1}],
      "material": {"title": "Indahnya Berbagi", "description": "Video tentang ukhuwah di bulan Ramadhan.", "type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
      "quiz": [{"type": "multiple_choice", "question": "Salah satu hak muslim adalah?", "options": ["Menghina", "Menjawab Salam", "Membiarkan sakit", "Berdebat"], "correctAnswer": 1}],
      "amalan": {"title": "Target Hari Ke-6", "items": [{"id": "berbagi", "label": "Berbagi Ta''jil", "icon": "heart"}, {"id": "salam", "label": "Tebarkan Salam", "icon": "sparkles"}]},
      "tadarus": {"surahName": "QS. Al-Kafirun", "verseText": "قُلْ يَا أَيُّهَا الْكَافِرُونَ", "targetString": "Qul ya ayyuhal kafirun", "translation": "Katakanlah: Wahai orang-orang kafir!"}
    }',
    datetime('now')
);

-- CHAPTER 7: Digital Adab
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-7', 7, 'chapter', 'Bab 7: Digital Adab',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Apa itu Tabayyun?", "options": ["Percaya langsung", "Klarifikasi berita", "Menghapus berita", "Menyebarkan hoax"], "correctAnswer": 1}],
      "material": {"title": "Etika Berinternet", "description": "Panduan adab di dunia digital.", "type": "pdf", "url": "https://satusaf.com/materi/digital-adab.pdf"},
      "quiz": [{"type": "multiple_choice", "question": "Bagaimana seharusnya kita berkomentar?", "options": ["Kasar", "Sopan", "Asal-asalan", "Hinaan"], "correctAnswer": 1}],
      "amalan": {"title": "Target Hari Ke-7", "items": [{"id": "no_hoax", "label": "Cek Fakta", "icon": "sparkles"}, {"id": "positivity", "label": "Komentar Positif", "icon": "heart"}]},
      "tadarus": {"surahName": "QS. Al-Kautsar", "verseText": "إِنَّا أَعْطَيْنَاكَ الْكَوْتْثَرَ", "targetString": "Inna a'tainakal kautsar", "translation": "Sesungguhnya Kami telah memberikan kepadamu nikmat yang banyak."}
    }',
    datetime('now')
);

-- CHAPTER 8: Nazhafah
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-8', 8, 'chapter', 'Bab 8: Nazhafah',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Kebersihan sebagian dari?", "options": ["Hobi", "Iman", "Tugas", "Amanah"], "correctAnswer": 1}],
      "material": {"title": "Masjidku Bersih", "description": "Menjaga kebersihan lingkungan masjid.", "type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
      "quiz": [{"type": "multiple_choice", "question": "Membuang sampah sebaiknya?", "options": ["Di sembarang tempat", "Pada tempatnya", "Di saku", "Di sungai"], "correctAnswer": 1}],
      "amalan": {"title": "Target Hari Ke-8", "items": [{"id": "pungut_sampah", "label": "Pungut Sampah", "icon": "sparkles"}, {"id": "bersih_mushaf", "label": "Rapikan Mushaf", "icon": "book"}]},
      "tadarus": {"surahName": "QS. Al-Ma''un", "verseText": "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", "targetString": "Ara'aytal ladzi yukadzdzibu bid din", "translation": "Tahukah kamu (orang) yang mendustakan agama?"}
    }',
    datetime('now')
);

-- CHAPTER 9: Lailatul Qadr
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-9', 9, 'chapter', 'Bab 9: Lailatul Qadr',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Lailatul Qadr lebih baik dari?", "options": ["100 bulan", "1000 bulan", "10 bulan", "1000 tahun"], "correctAnswer": 1}],
      "material": {"title": "Memburu Malam Mulia", "description": "Keutamaan 10 malam terakhir Ramadhan.", "type": "pdf", "url": "https://satusaf.com/materi/lailatul-qadr.pdf"},
      "quiz": [{"type": "multiple_choice", "question": "Itikaf dilakukan di?", "options": ["Pasar", "Rumah", "Masjid", "Sekolah"], "correctAnswer": 2}],
      "amalan": {"title": "Target Hari Ke-9", "items": [{"id": "itikaf", "label": "Itikaf", "icon": "mosque"}, {"id": "doa_malam", "label": "Doa Malam Qadr", "icon": "sparkles"}]},
      "tadarus": {"surahName": "QS. Quraisy", "verseText": "لِإِيلَافِ قُرَيْشٍ", "targetString": "Li'ilafi quraisy", "translation": "Karena kebiasaan orang-orang Quraisy."}
    }',
    datetime('now')
);

-- CHAPTER 10: Istiqaamah
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'ch-10', 10, 'chapter', 'Bab 10: Istiqaamah',
    '{
      "preTest": [{"type": "multiple_choice", "question": "Apa itu Istiqamah?", "options": ["Berubah-ubah", "Konsisten", "Berhenti", "Bosan"], "correctAnswer": 1}],
      "material": {"title": "Menjaga Semangat Keimanan", "description": "Istiqamah pasca Ramadhan.", "type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
      "quiz": [{"type": "multiple_choice", "question": "Amal yang paling dicintai Allah adalah?", "options": ["Sekali tapi banyak", "Konsisten walau sedikit", "Banyak tapi jarang", "Tidak pernah"], "correctAnswer": 1}],
      "amalan": {"title": "Target Hari Ke-10", "items": [{"id": "jadwal_ibadah", "label": "Jadwal Ibadah", "icon": "clock"}, {"id": "puasa_syawal", "label": "Niat Syawal", "icon": "sparkles"}]},
      "tadarus": {"surahName": "QS. Al-Fil", "verseText": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", "targetString": "Alam tara kaifa fa'ala rabbuka bi'ash habil fil", "translation": "Apakah kamu tidak memperhatikan bagaimana Tuhanmu telah bertindak terhadap tentara bergajah."}
    }',
    datetime('now')
);
