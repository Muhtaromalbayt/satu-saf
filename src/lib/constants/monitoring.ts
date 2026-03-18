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
            "Sholat Tahajud",
            "Sholat Dhuha",
            "Sholat Tahiyatul Masjid",
            "Tadarus Al-Quran (1 Halaman)"
        ]
    },
    {
        id: "orang_tua",
        label: "Bakti Orang Tua",
        color: "amber",
        tasks: [
            "Membantu Pekerjaan Rumah",
            "Berkata Lembut & Sopan",
            "Mendoakan Orang Tua"
        ]
    },
    {
        id: "lingkungan",
        label: "Lingkungan",
        color: "emerald",
        tasks: [
            "Menjaga Kebersihan",
            "Infaq Harian",
            "Membantu Teman/Tetangga"
        ]
    },
    {
        id: "diri_sendiri",
        label: "Diri Sendiri",
        color: "indigo",
        tasks: [
            "Belajar Mandiri",
            "Olahraga Harian",
            "Menjaga Kebersihan Diri",
            "Tidur Tepat Waktu"
        ]
    }
];

export type MonitoringAspectId = "ibadah" | "orang_tua" | "lingkungan" | "diri_sendiri";
