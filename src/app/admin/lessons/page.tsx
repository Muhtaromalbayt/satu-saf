"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, BookOpen, Layers, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLessons() {
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/admin/lessons")
            .then(res => res.json())
            .then(data => {
                setLessons(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch lessons error:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus materi ini?")) return;

        try {
            const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
            if (res.ok) {
                setLessons(prev => prev.filter(l => l.id !== id));
            }
        } catch (err) {
            alert("Gagal menghapus materi.");
        }
    };

    const filteredLessons = lessons.filter(l =>
        (l.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        l.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Katalog Materi</h1>
                    <p className="text-slate-500 font-medium">Atur materi belajar, quiz, dan misi per chapter.</p>
                </div>
                <Link
                    href="/admin/lessons/new"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                    <Plus className="h-5 w-5" /> Tambah Materi
                </Link>
            </div>

            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-3xl border-2 border-slate-100 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari judul atau tipe materi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2rem]" />
                    ))}
                </div>
            ) : filteredLessons.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic">Belum ada materi yang sesuai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative"
                        >
                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/lessons/${lesson.id}`}
                                    className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-lg"
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(lesson.id)}
                                    className="p-2 bg-slate-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border-2 border-slate-100 uppercase font-black text-xs shrink-0">
                                    {lesson.type.slice(0, 2)}
                                </div>
                                <div className="pr-12">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-md uppercase tracking-wider">
                                            Chapter {lesson.chapter}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                            {lesson.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">
                                        {lesson.title || "Materi Tanpa Judul"}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
