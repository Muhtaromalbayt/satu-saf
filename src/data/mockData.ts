import { Chapter, NodeType, Slide } from "@/lib/types";

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
