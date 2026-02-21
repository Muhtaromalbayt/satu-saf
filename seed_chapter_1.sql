
DELETE FROM lessons WHERE id = 'chapter-1-main';
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'chapter-1-main',
    1,
    'chapter',
    'Bab 1: Niat & Keikhlasan',
    '{
  "preTest": [
    {
      "type": "multiple_choice",
      "question": "Apa niat utama kita saat berangkat ke masjid?",
      "options": ["Mencari teman", "Hanya ikut-ikutan", "Mendekatkan diri kepada Allah", "Menghindari pekerjaan"],
      "correctAnswer": 2
    },
    {
      "type": "pair_matching",
      "title": "Hubungkan Adab & Artinya",
      "pairs": [
        {"id": "1", "left": "Ikhlas", "right": "Murni karena Allah"},
        {"id": "2", "left": "Sidiq", "right": "Jujur dalam Niat"},
        {"id": "3", "left": "Ittiba", "right": "Mengikuti Sunnah"}
      ]
    },
    {
      "type": "sentence_arrange",
      "question": "Susun Niat Beramal:",
      "correctSentence": "Innamal a''malu bin niyat",
      "words": ["niyat", "Innamal", "bin", "a''malu"]
    }
  ],
  "material": [
    {
      "title": "Visi SATU SAF",
      "description": "Memahami pentingnya i''tikaf dan kebersihan hati di masjid.",
      "type": "video",
      "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      "title": "Panduan Adab Masjid",
      "description": "Pelajari tata krama sebelum melangkah masuk ke rumah Allah.",
      "type": "pdf",
      "url": "https://satusaf.com/adab-masjid.pdf"
    }
  ],
  "quiz": [
    {
      "type": "sorting",
      "title": "Urutan Melangkah Masuk Masjid",
      "description": "Urutkan langkah yang benar agar berkah.",
      "items": [
        {"id": "1", "text": "Berdoa Keluar Rumah"},
        {"id": "2", "text": "Melangkah Kaki Kanan"},
        {"id": "3", "text": "Membaca Doa Masuk Masjid"},
        {"id": "4", "text": "Sholat Tahiyatul Masjid"}
      ]
    }
  ],
  "amalan": {
    "title": "Tantangan Kebaikan Hari Ini",
    "items": [
      {"id": "sholat", "label": "Sholat Berjamaah", "icon": "mosque"},
      {"id": "tadarus", "label": "Tadarus Quran", "icon": "quran", "isSpecial": true},
      {"id": "sedekah", "label": "Sedekah Subuh", "icon": "heart"},
      {"id": "sandal", "label": "Rapikan Sandal", "icon": "sparkles"},
      {"id": "dzikir", "label": "Dzikir Pagi", "icon": "moon"}
    ]
  },
  "tadarus": {
    "surahName": "QS. Al-Insyirah : 1",
    "verseText": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
    "targetString": "Alam nasyrah laka shadrak",
    "translation": "Bukankah Kami telah melapangkan dadamu (Muhammad)?"
  }
}',
    datetime('now')
);
