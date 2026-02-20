
DELETE FROM lessons WHERE id = 'chapter-1-main';
INSERT INTO lessons (id, chapter, type, title, content, created_at) VALUES (
    'chapter-1-main',
    1,
    'chapter',
    'Bab 1: Dasar Islam & Iman',
    '{
  "preTest": [
    {
      "type": "multiple_choice",
      "question": "Apa tujuan utama kita mempelajari Tauhid?",
      "options": ["Mengenal Allah", "Mengenal Sejarah", "Belajar Bahasa", "Hanya Kewajiban"],
      "correctAnswer": 0
    },
    {
      "type": "pair_matching",
      "title": "Pasangkan Sifat Allah",
      "pairs": [
        {"id": "1", "left": "Wujud", "right": "Ada"},
        {"id": "2", "left": "Qidam", "right": "Terdahulu"},
        {"id": "3", "left": "Baqa", "right": "Kekal"},
        {"id": "4", "left": "Mukhalafatu lil hawaditsi", "right": "Berbeda dengan makhluk"}
      ]
    },
    {
      "type": "sentence_arrange",
      "question": "Susun Syahadat Tauhid:",
      "correctSentence": "Asyhadu alla ilaha illallah",
      "words": ["ilaha", "Asyhadu", "illallah", "alla", "Muhammad"]
    }
  ],
  "material": [
    {
      "title": "Video: Pengenalan Iman dan Islam",
      "description": "Tonton video berikut untuk memahami dasar-dasar agama kita.",
      "type": "video",
      "url": "https://drive.google.com/file/d/1BfVn1wXU2k9P-Yy5Z9X-u8W8m6V7Y-L1/preview"
    },
    {
      "title": "PDF: Ringkasan Rukun Iman",
      "description": "Baca ringkasan ini untuk persiapan kuis penguasaan.",
      "type": "pdf",
      "url": "https://drive.google.com/file/d/1y0_uXW5Z9V-Z8X7-u9W8m6V7Y-L1/preview"
    }
  ],
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Rukun Iman yang kedua adalah iman kepada...?",
      "options": ["Kitab Allah", "Malaikat Allah", "Rasul Allah", "Hari Akhir"],
      "correctAnswer": 1
    },
    {
      "type": "multiple_choice",
      "question": "Manakah yang termasuk amalan hati?",
      "options": ["Sholat", "Puasa", "Ikhlas", "Zakat"],
      "correctAnswer": 2
    }
  ],
  "amalan": {
    "title": "Amalan Yaumi Pekan Pertama",
    "items": [
      {"id": "subuh", "label": "Sholat Subuh Berjamaah", "icon": "sholat", "category": "wajib"},
      {"id": "zuhur", "label": "Sholat Zuhur Tepat Waktu", "icon": "sholat", "category": "wajib"},
      {"id": "asar", "label": "Sholat Asar Tepat Waktu", "icon": "sholat", "category": "wajib"},
      {"id": "maghrib", "label": "Sholat Maghrib di Masjid", "icon": "sholat", "category": "wajib"},
      {"id": "isya", "label": "Sholat Isya Berjamaah", "icon": "sholat", "category": "wajib"},
      {"id": "quran", "label": "Baca Al-Quran 1 Ruku", "icon": "quran", "category": "sunnah"},
      {"id": "sedekah", "label": "Sedekah Subuh / Jariyah", "icon": "sedekah", "category": "other"}
    ]
  },
  "tadarus": {
    "surahName": "QS. Al-Ikhlas",
    "verseText": "قُلْ هُوَ اللَّهُ أَحَدٌ",
    "targetString": "Qul huwallahu ahad",
    "translation": "Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa."
  }
}',
    datetime('now')
);
