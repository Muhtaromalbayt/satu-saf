export const MONITORING_ASPECTS = [
    {
        id: "ibadah",
        label: "Ibadah",
        color: "rose",
        tasks: [
            "Sholat Subuh",
            "Sholat Dzuhur",
            "Sholat Ashar",
            "Sholat Maghrib",
            "Sholat Isya",
            "Sholat Rawatib",
            "Sholat Dhuha",
            "Tadarus Al-Quran (1 Halaman)",
            "Subuh Caller",
            "Masjid Hunter",
            "Quranic Explorer",
            "Secret Sadaqah",
            "Digital Detox"
        ]
    },
    {
        id: "orang_tua",
        label: "Bakti Orang Tua",
        color: "amber",
        tasks: [
            "Membantu Pekerjaan Rumah",
            "Mendoakan Orang Tua Sehabis Sholat",
            "The Unplugged Chat",
            "Master Chef",
            "Undercover Helper"
        ]
    },
    {
        id: "lingkungan",
        label: "Lingkungan",
        color: "emerald",
        tasks: [
            "Infaq Harian",
            "Menjaga Kebersihan Sekitar",
            "Zero Waste Day",
            "Green Thumb",
            "Plastic Bounty Hunter"
        ]
    },
    {
        id: "diri_sendiri",
        label: "Diri Sendiri",
        color: "indigo",
        tasks: [
            "Belajar Mandiri",
            "Olahraga Harian (15 Menit)",
            "Tidur Tepat Waktu (Sebelum Jam 10 Malam)",
            "Brain Gain",
            "Skill Up",
            "Mindful Journaling"
        ]
    }
];

export type MonitoringAspectId = "ibadah" | "orang_tua" | "lingkungan" | "diri_sendiri";
