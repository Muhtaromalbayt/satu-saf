"use client";

import { useState, useEffect } from "react";
import {
    Plus, Trash2, Save, GripVertical,
    Loader2, ChevronLeft, LayoutGrid, Heart, User, Globe, Star, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

import { MONITORING_ASPECTS } from "@/lib/constants/monitoring";

const ASPECT_ICONS: Record<string, any> = {
    ibadah: Heart,
    orang_tua: User,
    lingkungan: Globe,
    diri_sendiri: Star,
    setoran: BookOpen,
};

const ASPECTS = MONITORING_ASPECTS.map(aspect => ({
    ...aspect,
    icon: ASPECT_ICONS[aspect.id] || LayoutGrid
}));

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeAspect, setActiveAspect] = useState(ASPECTS[0].id);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/tasks");
            if (!res.ok) throw new Error("Failed to fetch admin tasks");
            const text = await res.text();
            if (!text) return;
            const data = JSON.parse(text);
            setTasks(data.tasks || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = () => {
        const newTask = {
            id: `temp-${Date.now()}`,
            aspectId: activeAspect,
            label: "Tugas Baru",
            isActive: true,
            displayOrder: tasks.filter(t => t.aspectId === activeAspect).length,
            isNew: true
        };
        setTasks([...tasks, newTask]);
    };

    const handleSaveTask = async (task: any) => {
        setSaving(true);
        try {
            const method = task.isNew ? "POST" : "PATCH";
            const res = await fetch("/api/admin/tasks", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            if (res.ok) {
                await fetchTasks();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTask = async (id: number | string) => {
        if (typeof id === "string" && id.startsWith("temp-")) {
            setTasks(tasks.filter(t => t.id !== id));
            return;
        }

        if (!confirm("Hapus tugas ini?")) return;

        setSaving(true);
        try {
            await fetch("/api/admin/tasks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            await fetchTasks();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const filteredTasks = tasks.filter(t => t.aspectId === activeAspect);

    return (
        <div className="space-y-8 max-w-5xl">
            <header>
                <h1 className="text-3xl font-black text-slate-800">Manajemen Tugas</h1>
                <p className="text-slate-500 font-medium">Atur daftar amalan harian untuk setiap aspek kebaikan.</p>
            </header>

            {/* Aspect Selector */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {ASPECTS.map(aspect => {
                    const colorMap: Record<string, string> = {
                        rose: "bg-rose-500 border-rose-500",
                        amber: "bg-amber-500 border-amber-500",
                        emerald: "bg-emerald-500 border-emerald-500",
                        indigo: "bg-indigo-500 border-indigo-500",
                        violet: "bg-violet-500 border-violet-500",
                    };
                    const activeClass = colorMap[aspect.color] || colorMap.rose;

                    return (
                        <button
                            key={aspect.id}
                            onClick={() => setActiveAspect(aspect.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all border-2",
                                activeAspect === aspect.id
                                    ? cn(activeClass, "text-white shadow-lg")
                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                            )}
                        >
                            <aspect.icon className="h-4 w-4" />
                            {aspect.label}
                        </button>
                    );
                })}
            </div>

            {/* Tasks List Card */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b-2 border-slate-100 flex justify-between items-center sm:flex-row flex-col gap-4">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest"> Daftar Tugas ({filteredTasks.length}) </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={async () => {
                                if (!confirm("Ingin menyinkronkan tugas dari Peta? Ini akan menambahkan daftar tugas default jika belum ada.")) return;
                                setSaving(true);
                                try {
                                    const res = await fetch("/api/admin/tasks/seed", { method: "POST" });
                                    if (res.ok) {
                                        await fetchTasks();
                                    }
                                } catch (err) {
                                    console.error(err);
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            disabled={saving}
                            className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all border-2 border-amber-100 outline-none"
                        >
                            <Save className="h-3.5 w-3.5" /> Sinkron Peta
                        </button>
                        <button
                            onClick={handleAddTask}
                            className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all border-b-4 border-primary/50 shadow-lg shadow-primary/20 outline-none"
                        >
                            <Plus className="h-3.5 w-3.5" /> Tambah Task
                        </button>
                    </div>
                </div>

                <div className="min-h-[400px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Memuat database...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-20">
                            <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-slate-100/50">
                                <LayoutGrid className="h-10 w-10 text-slate-200" />
                            </div>
                            <h3 className="text-slate-800 font-black text-xl mb-2">Database Kosong</h3>
                            <p className="text-slate-400 text-sm font-medium mb-8 max-w-xs">Tugas untuk aspek ini belum tersimpan di database. Klik tombol di bawah untuk mengambil dari peta.</p>
                            <button
                                onClick={async () => {
                                    setSaving(true);
                                    try {
                                        const res = await fetch("/api/admin/tasks/seed", { method: "POST" });
                                        if (res.ok) await fetchTasks();
                                    } catch (err) { console.error(err); } finally { setSaving(false); }
                                }}
                                className="bg-emerald-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 border-b-4 border-emerald-700 outline-none active:translate-y-1 active:border-b-0"
                            >
                                Ambil Tugas dari Peta Sekarang
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y-2 divide-slate-50">
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="p-5 flex items-center gap-4 hover:bg-slate-50/30 transition-colors group">
                                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-300 group-hover:text-slate-400 group-hover:bg-slate-200 transition-colors">
                                        <GripVertical className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={task.label}
                                        onChange={(e) => {
                                            setTasks(tasks.map(t => t.id === task.id ? { ...t, label: e.target.value } : t));
                                        }}
                                        className="flex-1 bg-transparent border-none focus:ring-0 font-black text-slate-700 placeholder:text-slate-200 text-lg outline-none"
                                        placeholder="Nama Tugas..."
                                    />
                                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleSaveTask(task)}
                                            disabled={saving}
                                            title="Simpan Perubahan"
                                            className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all border-2 border-emerald-100 active:scale-95 shadow-sm shadow-emerald-500/10"
                                        >
                                            <Save className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            disabled={saving}
                                            title="Hapus Tugas"
                                            className="h-11 w-11 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border-2 border-rose-100 active:scale-95 shadow-sm shadow-rose-500/10"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
