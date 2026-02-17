-- Seeding Lessons Table from mockData.ts
-- Using JSON string for content_json as expected by the schema

INSERT INTO lessons (id, chapter_day, node_type, content_json) VALUES 
('ch-1-pretest', 1, 'quiz', '{"question": "Apa niat utama kita beri''tikaf di masjid?", "options": ["Mencari ketenangan tidur", "Mendapat pujian teman", "Mendekatkan diri kepada Allah", "Menghindari tugas rumah"], "correctIndex": 2}'),
('ch-1-materi', 1, 'pair_matching', '{"title": "Jodohkan Kata & Makna", "pairs": [{"id": "1", "left": "Niat", "right": "Menyengaja melakukan sesuatu karena Allah"}, {"id": "2", "left": "Ikhlas", "right": "Murni / Tanpa pamrih"}, {"id": "3", "left": "Taqwa", "right": "Menjalankan perintah & menjauhi larangan"}, {"id": "4", "left": "Itikaf", "right": "Berdiam diri di masjid untuk ibadah"}]}'),
('ch-1-posttest', 1, 'quiz', '{"question": "Apa arti dari ''Ikhlasul Amal''?", "options": ["Beramal karena terpaksa", "Beramal hanya mengharap ridho Allah", "Beramal agar dilihat orang", "Beramal sisa tenaga"], "correctIndex": 1}'),
('ch-1-checklist', 1, 'checklist', '{"title": "Amalan Hari Ke-1", "items": [{"id": "sholat", "label": "Sholat 5 Waktu Berjamaah"}, {"id": "rawatib", "label": "Sholat Sunnah Rawatib"}, {"id": "sandal", "label": "Merapikan Sandal Jamaah"}]}'),
('ch-1-tadarus', 1, 'recite', '{"surahName": "QS Ad-Dhuha : 1", "verseText": "وَالضُّحَىٰ", "targetString": "Wad dhuha", "translation": "Demi waktu dhuha."}'),
('ch-2-pretest', 2, 'quiz', '{"question": "Apa yang harus kita lakukan jika tidak bisa berkata baik?", "options": ["Berkata kasar", "Diam", "Berteriak", "Bergosip"], "correctIndex": 1}'),
('ch-2-materi', 2, 'pair_matching', '{"title": "Jodohkan Lisan & Akhlak", "pairs": [{"id": "1", "left": "Ghibah", "right": "Membicarakan aib orang lain"}, {"id": "2", "left": "Namimah", "right": "Adu domba"}, {"id": "3", "left": "Sidiq", "right": "Berkata Jujur"}, {"id": "4", "left": "Lisan", "right": "Indra perasa & alat bicara"}]}'),
('ch-2-posttest', 2, 'quiz', '{"question": "Siapakah orang yang paling mulia lisannya menurut Rasulullah?", "options": ["Yang paling banyak bicara", "Yang paling diam", "Yang paling baik perkataannya", "Yang keras suaranya"], "correctIndex": 2}'),
('ch-2-checklist', 2, 'checklist', '{"title": "Amalan Hari Ke-2", "items": [{"id": "no_ghibah", "label": "Tidak Bergosip Hari Ini"}, {"id": "tilawah", "label": "Tilawah 1 Juz"}, {"id": "istighfar", "label": "Istighfar 100x"}]}'),
('ch-2-tadarus', 2, 'recite', '{"surahName": "QS Al-Insyirah : 1", "verseText": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", "targetString": "Alam nasyrah laka shadrak", "translation": "Bukankah Kami telah melapangkan dadamu (Muhammad)?"}');
