import { Chapter, NodeType, Slide, ChapterContent } from "@/lib/types";

// Helper to create nodes for each chapter
const createChapterNodes = (chapterId: string, status: 'locked' | 'active' | 'completed') => {
    return [
        { id: `${chapterId}-pretest`, type: "quiz" as NodeType, status: status, label: "Pre-Test" },
        { id: `${chapterId}-materi`, type: "pair_matching" as NodeType, status: "locked", label: "Materi" },
        { id: `${chapterId}-posttest`, type: "quiz" as NodeType, status: "locked", label: "Post-Test" },
        { id: `${chapterId}-checklist`, type: "checklist" as NodeType, status: "locked", label: "Amalan" },
        { id: `${chapterId}-tadarus`, type: "recite" as NodeType, status: "locked", label: "Tadarus" },
    ];
};

export const MOCK_CHAPTERS: Chapter[] = [
    {
        id: "ch-1",
        title: "Hari 1: Ikhlasul Amal",
        description: "Menata niat dan adab di masjid.",
        nodes: createChapterNodes("ch-1", "active") as any,
    },
    {
        id: "ch-2",
        title: "Hari 2: Lisanul Khair",
        description: "Menjaga lisan dan tilawah Al-Qur'an.",
        nodes: createChapterNodes("ch-2", "locked") as any,
    },
    {
        id: "ch-3",
        title: "Hari 3: Al-Amanah",
        description: "Menjaga wudhu dan barang amanah.",
        nodes: createChapterNodes("ch-3", "locked") as any,
    },
    {
        id: "ch-4",
        title: "Hari 4: Birrul Walidain",
        description: "Bakti kepada orang tua dan Qiyamul Lail.",
        nodes: createChapterNodes("ch-4", "locked") as any,
    },
    {
        id: "ch-5",
        title: "Hari 5: Khusyukul Ibadah",
        description: "Dzikir dan merasakan kehadiran Allah.",
        nodes: createChapterNodes("ch-5", "locked") as any,
    },
    {
        id: "ch-6",
        title: "Hari 6: Ukhuwah Islamiyah",
        description: "Indahnya berbagi saat Iftar dan Sahur.",
        nodes: createChapterNodes("ch-6", "locked") as any,
    },
    {
        id: "ch-7",
        title: "Hari 7: Digital Adab",
        description: "Berakhlak mulia di dunia maya.",
        nodes: createChapterNodes("ch-7", "locked") as any,
    },
    {
        id: "ch-8",
        title: "Hari 8: Nazhafah",
        description: "Kebersihan masjid sebagian dari iman.",
        nodes: createChapterNodes("ch-8", "locked") as any,
    },
    {
        id: "ch-9",
        title: "Hari 9: Lailatul Qadr",
        description: "Memburu malam kemuliaan.",
        nodes: createChapterNodes("ch-9", "locked") as any,
    },
    {
        id: "ch-10",
        title: "Hari 10: Istiqaamah",
        description: "Merencanakan kebaikan pasca Ramadhan.",
        nodes: createChapterNodes("ch-10", "locked") as any,
    },
];

export const LESSON_CONTENT: Record<string, Slide[]> = {
    // --- CHAPTER 1 CONTENT ---
    "ch-1-pretest": [
        { id: 'q1', type: 'quiz', content: { question: "Apa niat utama kita beri'tikaf di masjid?", options: ["Mencari ketenangan tidur", "Mendapat pujian teman", "Mendekatkan diri kepada Allah", "Menghindari tugas rumah"], correctIndex: 2 } },
        { id: 'q2', type: 'quiz', content: { question: "Kaki manakah yang didahulukan saat masuk masjid?", options: ["Kaki Kiri", "Kaki Kanan", "Lompat Dua Kaki", "Bebas"], correctIndex: 1 } },
    ],
    "ch-1-materi": [
        { id: 'm1', type: 'pair_matching', content: { title: "Jodohkan Kata & Makna", pairs: [{ id: '1', left: "Niat", right: "Menyengaja melakukan sesuatu karena Allah" }, { id: '2', left: "Ikhlas", right: "Murni / Tanpa pamrih" }, { id: '3', left: "Taqwa", right: "Menjalankan perintah & menjauhi larangan" }, { id: '4', left: "Itikaf", right: "Berdiam diri di masjid untuk ibadah" }] } },
    ],
    "ch-1-posttest": [
        { id: 'pq1', type: 'quiz', content: { question: "Apa arti dari 'Ikhlasul Amal'?", options: ["Beramal karena terpaksa", "Beramal hanya mengharap ridho Allah", "Beramal agar dilihat orang", "Beramal sisa tenaga"], correctIndex: 1 } },
    ],
    "ch-1-checklist": [
        { id: 'ch1', type: 'checklist', content: { title: "Amalan Hari Ke-1", items: [{ id: 'sholat', label: 'Sholat 5 Waktu Berjamaah' }, { id: 'rawatib', label: 'Sholat Sunnah Rawatib' }, { id: 'sandal', label: 'Merapikan Sandal Jamaah' }] } }
    ],
    "ch-1-tadarus": [
        { id: 'r1', type: 'recite', content: { surahName: "QS Ad-Dhuha : 1", verseText: "وَالضُّحَىٰ", targetString: "Wad dhuha", translation: "Demi waktu dhuha." } },
        { id: 'r2', type: 'recite', content: { surahName: "QS Ad-Dhuha : 2", verseText: "وَاللَّيْلِ إِذَا سَجَىٰ", targetString: "Wal laili idza saja", translation: "Dan demi malam apabila telah sunyi." } },
        { id: 'r3', type: 'recite', content: { surahName: "QS Ad-Dhuha : 3", verseText: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", targetString: "Ma wadda'aka rabbuka wa ma qala", translation: "Tuhanmu tidak meninggalkanmu dan tidak (pula) membencimu." } },
    ],

    // --- CHAPTER 2 CONTENT: Lisanul Khair ---
    "ch-2-pretest": [
        { id: 'q1', type: 'quiz', content: { question: "Apa yang harus kita lakukan jika tidak bisa berkata baik?", options: ["Berkata kasar", "Diam", "Berteriak", "Bergosip"], correctIndex: 1 } },
        { id: 'q2', type: 'quiz', content: { question: "Apa hukum membicarakan aib orang lain (Ghibah)?", options: ["Boleh saja", "Sunnah", "Haram", "Makruh"], correctIndex: 2 } },
    ],
    "ch-2-materi": [
        { id: 'm1', type: 'pair_matching', content: { title: "Jodohkan Lisan & Akhlak", pairs: [{ id: '1', left: "Ghibah", right: "Membicarakan aib orang lain" }, { id: '2', left: "Namimah", right: "Adu domba" }, { id: '3', left: "Sidiq", right: "Berkata Jujur" }, { id: '4', left: "Lisan", right: "Indra perasa & alat bicara" }] } },
    ],
    "ch-2-posttest": [
        { id: 'pq1', type: 'quiz', content: { question: "Siapakah orang yang paling mulia lisannya menurut Rasulullah?", options: ["Yang paling banyak bicara", "Yang paling diam", "Yang paling baik perkataannya", "Yang keras suaranya"], correctIndex: 2 } },
    ],
    "ch-2-checklist": [
        { id: 'ch1', type: 'checklist', content: { title: "Amalan Hari Ke-2", items: [{ id: 'no_ghibah', label: 'Tidak Bergosip Hari Ini' }, { id: 'tilawah', label: 'Tilawah 1 Juz' }, { id: 'istighfar', label: 'Istighfar 100x' }] } }
    ],
    "ch-2-tadarus": [
        { id: 'r1', type: 'recite', content: { surahName: "QS Al-Insyirah : 1", verseText: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", targetString: "Alam nasyrah laka shadrak", translation: "Bukankah Kami telah melapangkan dadamu (Muhammad)?" } },
        { id: 'r2', type: 'recite', content: { surahName: "QS Al-Insyirah : 2", verseText: "وَوَضَعْنَا عَنكَ وِزْرَكَ", targetString: "Wa wadha'na 'anka wizrak", translation: "Dan Kami pun telah menurunkan bebanmu darimu." } },
        { id: 'r3', type: 'recite', content: { surahName: "QS Al-Insyirah : 3", verseText: "الَّذِي أَنقَضَ ظَهْرَكَ", targetString: "Alladzi anqadha zhahrak", translation: "Yang memberatkan punggungmu." } },
        { id: 'r4', type: 'recite', content: { surahName: "QS Al-Insyirah : 4", verseText: "وَرَفَعْنَا لَكَ ذِكْرَكَ", targetString: "Wa rafa'na laka dzikrak", translation: "Dan Kami tinggikan sebutan (nama)mu bagimu." } },
    ],
};

export const STANDARDIZED_CHAPTER_CONTENT: Record<string, ChapterContent> = {
    "ch-1": {
        chapterId: "ch-1",
        preTest: [
            { type: 'mcq', question: "Apa niat utama kita beri'tikaf di masjid?", options: ["Mencari ketenangan tidur", "Mendapat pujian teman", "Mendekatkan diri kepada Allah", "Menghindari tugas rumah"], correct: 2 },
            { type: 'match', pairs: [{ left: "Niat", right: "Menyengaja melakukan sesuatu karena Allah" }, { left: "Ikhlas", right: "Murni / Tanpa pamrih" }] },
            { type: 'reorder', items: ["Menata Niat", "Berwudhu", "Melangkah dengan Kaki Kanan", "Berdoa"] }
        ],
        material: { driveLink: "https://docs.google.com/viewer?url=https://satusaf.com/ch1-materi.pdf", type: "pdf" },
        postQuiz: [
            { type: 'mcq', question: "Apa arti Ikhlasul Amal?", feedbackText: "Ikhlasul Amal berarti memurnikan niat beramal hanya untuk mengharap ridho Allah SWT." }
        ],
        amalanList: ["Sholat 5 Waktu Berjamaah", "Sholat Sunnah Rawatib", "Merapikan Sandal Jamaah"],
        recitation: { surahName: "Ad-Dhuha", verseRange: "1-3", transcript: "Wad dhuha wal laili idza saja ma wadda'aka rabbuka wa ma qala" }
    },
    "ch-2": {
        chapterId: "ch-2",
        preTest: [
            { type: 'mcq', question: "Jika tidak bisa berkata baik, maka sebaiknya?", options: ["Berkata kasar", "Berdiam diri", "Bicara seadanya", "Berteriak"], correct: 1 },
            { type: 'match', pairs: [{ left: "Ghibah", right: "Membicarakan aib orang lain" }, { left: "Sidiq", right: "Berkata Jujur" }] }
        ],
        material: { driveLink: "https://www.youtube.com/embed/ch2-video-id", type: "video" },
        postQuiz: [
            { type: 'mcq', question: "Hukum menjaga lisan adalah?", feedbackText: "Menjaga lisan adalah kewajiban setiap muslim untuk menjaga perasaan orang lain dan menghindari dosa." }
        ],
        amalanList: ["Tidak Bergosip", "Tilawah 1 Juz", "Istighfar 100x"],
        recitation: { surahName: "Al-Insyirah", verseRange: "1-4", transcript: "Alam nasyrah laka shadrak wa wadha'na 'anka wizrak alladzi anqadha zhahrak wa rafa'na laka dzikrak" }
    },
    "ch-3": {
        chapterId: "ch-3",
        preTest: [
            { type: 'mcq', question: "Apa yang dimaksud dengan Amanah?", options: ["Titipan", "Hadiah", "Pemberian", "Pinjaman"], correct: 0 },
            { type: 'reorder', items: ["Menerima Titipan", "Menjaga dengan Baik", "Mengembalikan sesuai Janji"] }
        ],
        material: { driveLink: "https://docs.google.com/viewer?url=https://satusaf.com/ch3-materi.pdf", type: "pdf" },
        postQuiz: [
            { type: 'mcq', question: "Tanda-tanda orang munafik salah satunya adalah?", feedbackText: "Salah satu tanda munafik adalah jika diberi amanah dia berkhianat." }
        ],
        amalanList: ["Menjaga Barang Titipan", "Jujur dalam Berkata", "Wudhu sebelum Tidur"],
        recitation: { surahName: "Al-Tin", verseRange: "1-3", transcript: "Wat tini waz zaitun wa thuri sinin wa hadzal baladil amin" }
    },
    "ch-4": {
        chapterId: "ch-4",
        preTest: [
            { type: 'mcq', question: "Apa arti Birrul Walidain?", options: ["Bakti Ibu Bapak", "Bakti kepada Guru", "Bakti kepada Negara", "Bakti kepada Teman"], correct: 0 },
            { type: 'match', pairs: [{ left: "Ibu", right: "Mulia 3x lebih utama" }, { left: "Ayah", right: "Pintu surga paling tengah" }] }
        ],
        material: { driveLink: "https://www.youtube.com/embed/ch4-video-id", type: "video" },
        postQuiz: [
            { type: 'mcq', question: "Redha Allah terletak pada?", feedbackText: "Redha Allah terletak pada redha kedua orang tua, and murka Allah ada pada murka mereka." }
        ],
        amalanList: ["Membantu Pekerjaan Rumah", "Mendoakan Orang Tua", "Qiyamul Lail"],
        recitation: { surahName: "Al-Alaq", verseRange: "1-5", transcript: "Iqra bismi rabbikal ladzi khalaq khalaqal insana min 'alaq iqra wa rabbukal akram alladzi 'allama bil qalam 'allamal insana ma lam ya'lam" }
    },
    "ch-5": {
        chapterId: "ch-5",
        preTest: [
            { type: 'mcq', question: "Khusyuk paling utama dilakukan saat?", options: ["Makan", "Tidur", "Sholat", "Bermain"], correct: 2 },
            { type: 'reorder', items: ["Tenangkan Hati", "Ingat Kebesaran Allah", "Fokus pada Bacaan"] }
        ],
        material: { driveLink: "https://docs.google.com/viewer?url=https://satusaf.com/ch5-materi.pdf", type: "pdf" },
        postQuiz: [
            { type: 'mcq', question: "Apa manfaat Dzikir?", feedbackText: "Dzikir dapat menenangkan hati and menjauhkan kita dari gangguan setan." }
        ],
        amalanList: ["Sholat Khusyuk", "Dzikir Pagi & Petang", "Istighfar Selepas Sholat"],
        recitation: { surahName: "Al-Qadr", verseRange: "1-3", transcript: "Inna anzalnahu fi lailatil qadr wa ma adraka ma lailatul qadr lailatul qadri khairum min alfi syahr" }
    },
    "ch-6": {
        chapterId: "ch-6",
        preTest: [
            { type: 'mcq', question: "Ukhuwah Islamiyah artinya?", options: ["Permusuhan", "Persaudaraan Islam", "Persaingan", "Perdebatan"], correct: 1 },
            { type: 'match', pairs: [{ left: "Muslim", right: "Bersaudara" }, { left: "Berbagi", right: "Iftar / Makanan" }] }
        ],
        material: { driveLink: "https://www.youtube.com/embed/ch6-video-id", type: "video" },
        postQuiz: [
            { type: 'mcq', question: "Salah satu hak muslim atas muslim lainnya adalah?", feedbackText: "Menjawab salam, menjenguk yang sakit, and mendoakan saat bersin." }
        ],
        amalanList: ["Berbagi Makanan Buka", "Menyapa Teman Baru", "Tebarkan Salam"],
        recitation: { surahName: "Al-Bayyinah", verseRange: "1-3", transcript: "Lam yakunil ladzina kafaru min ahlil kitabi wal musyrikina munfakkina hatta ta'tiyahumul bayyinah rasulum minallahi yatlu suhufam muthahharah fiha kutubun qayyimah" }
    },
    "ch-7": {
        chapterId: "ch-7",
        preTest: [
            { type: 'mcq', question: "Bagaimana adab di media sosial?", options: ["Menghujat", "Berbagi Kebaikan", "Pamer Harta", "Ghibah Online"], correct: 1 },
            { type: 'reorder', items: ["Cek Kebenaran", "Gunakan Bahasa Sopan", "Sebarkan Manfaat"] }
        ],
        material: { driveLink: "https://docs.google.com/viewer?url=https://satusaf.com/ch7-materi.pdf", type: "pdf" },
        postQuiz: [
            { type: 'mcq', question: "Apa itu Tabayyun?", feedbackText: "Tabayyun adalah meneliti atau mengklarifikasi kebenaran sebuah berita sebelum menyebarkannya." }
        ],
        amalanList: ["No Hoax", "Komentar Positif", "Mengurangi Waktu Screen"],
        recitation: { surahName: "Al-Zalzalah", verseRange: "1-4", transcript: "Idza zulzilatil ardhu zilzalaha wa akhrajatil ardhu atsqalaha wa qalal insanu ma laha yauma'idzin tuhadditsu akhbaraha" }
    },
    "ch-8": {
        chapterId: "ch-8",
        preTest: [
            { type: 'mcq', question: "Kebersihan adalah sebagian dari?", options: ["Hobi", "Beban", "Iman", "Tugas"], correct: 2 },
            { type: 'match', pairs: [{ left: "Masjid", right: "Rumah Allah" }, { left: "Sampah", right: "Dibuang pada tempatnya" }] }
        ],
        material: { driveLink: "https://www.youtube.com/embed/ch8-video-id", type: "video" },
        postQuiz: [
            { type: 'mcq', question: "Mengapa kita harus wangi ke masjid?", feedbackText: "Kita harus tampil terbaik and bersih saat menghadap Allah SWT and agar tidak mengganggu jamaah lain." }
        ],
        amalanList: ["Memungut Sampah", "Merapikan Mushaf", "Memakai Wangian saat Sholat"],
        recitation: { surahName: "Al-Adiyat", verseRange: "1-5", transcript: "Wal adiyati dhabha fal muriyati qadha fal mughirati subha fa atsarna bihi naq'a fa wasathna bihi jam'a" }
    },
    "ch-9": {
        chapterId: "ch-9",
        preTest: [
            { type: 'mcq', question: "Lailatul Qadr lebih baik dari?", options: ["100 hari", "10 bulan", "1000 bulan", "100 tahun"], correct: 2 },
            { type: 'reorder', items: ["Berniat Itikaf", "Memperbanyak Doa", "Membaca Al-Qur'an"] }
        ],
        material: { driveLink: "https://docs.google.com/viewer?url=https://satusaf.com/ch9-materi.pdf", type: "pdf" },
        postQuiz: [
            { type: 'mcq', question: "Malam Lailatul Qadr terjadi pada?", feedbackText: "Lailatul Qadr sering terjadi pada malam-malam ganjil di 10 hari terakhir bulan Ramadhan." }
        ],
        amalanList: ["Itikaf di Masjid", "Membaca Doa Sapu Jagad", "Sedekah di Malam Hari"],
        recitation: { surahName: "Al-Qariah", verseRange: "1-5", transcript: "Al qari'ah mal qari'ah wa ma adraka mal qari'ah yauma yakunun nasu kal farasyil mabtsuts wa takunul jibalu kal 'ihnil manfusy" }
    },
    "ch-10": {
        chapterId: "ch-10",
        preTest: [
            { type: 'mcq', question: "Apa arti Istiqaamah?", options: ["Berhenti", "Berubah", "Teguh Pendirian / Konsisten", "Berlari"], correct: 2 },
            { type: 'match', pairs: [{ left: "Amal", right: "Konsisten walau sedikit" }, { left: "Tujuan", right: "Husnul Khatimah" }] }
        ],
        material: { driveLink: "https://www.youtube.com/embed/ch10-video-id", type: "video" },
        postQuiz: [
            { type: 'mcq', question: "Bagaimana cara menjaga semangat ibadah?", feedbackText: "Berdoa memohon keteguhan hati, berteman dengan orang sholeh, and mengingat kematian." }
        ],
        amalanList: ["Membuat Jadwal Sholat Sunnah", "Puasa Syawal", "Mengikuti Kajian Rutin"],
        recitation: { surahName: "At-Takathur", verseRange: "1-3", transcript: "Alhakumut takathur hatta zurtumul maqabir kalla saufa ta'lamun" }
    }
};
