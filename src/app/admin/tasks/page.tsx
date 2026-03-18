"use client";

import { useState, useEffect } from "react";
import {
    Plus, Trash2, Save, GripVertical,
    Loader2, ChevronLeft, LayoutGrid, Heart, User, Globe, Star, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const ASPECTS = [
    { id: "ibadah", label: "Ibadah", icon: Heart, color: "rose" },
    { id: "orang_tua", label: "Orang Tua", icon: User, color: "amber" },
    { id: "lingkungan", label: "Lingkungan", icon: Globe, color: "emerald" },
    { id: "diri_sendiri", label: "Diri Sendiri", icon: Star, color: "indigo" },
    { id: "setoran", label: "Setoran", icon: BookOpen, color: "violet" },
];

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
        <div className="min-h-screen bg-slate-50 pb-20 p-5">
            <header className="mb-8">
                <h1 className="text-2xl font-black text-slate-800">Manajemen Monitoring</h1>
                <p className="text-slate-500 text-sm">Atur tugas amalan untuk setiap aspek kebaikan.</p>
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

            {/* Tasks List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider"> Daftar Tugas ({filteredTasks.length}) </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={async () => {
                                if (!confirm("Seed default tasks from constants?")) return;
                                setSaving(true);
                                try {
                                    const res = await fetch("/api/admin/tasks/seed", { method: "POST" });
                                    if (res.ok) {
                                        alert("Default tasks seeded!");
                                        await fetchTasks();
                                    }
                                } catch (err) {
                                    console.error(err);
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            disabled={saving}
                            className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-200 transition-all border border-amber-200"
                        >
                            <Save className="h-3.5 w-3.5" /> Seed Defaults
                        </button>
                        <button
                            onClick={handleAddTask}
                            className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                        >
                            <Plus className="h-3.5 w-3.5" /> Tambah Task
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="p-20 text-center">
                            <LayoutGrid className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-400 text-sm font-medium">Belum ada tugas.</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div key={task.id} className="p-4 flex items-center gap-4 animate-in slide-in-from-left duration-300">
                                <GripVertical className="h-4 w-4 text-slate-200 cursor-grab" />
                                <input
                                    type="text"
                                    value={task.label}
                                    onChange={(e) => {
                                        setTasks(tasks.map(t => t.id === task.id ? { ...t, label: e.target.value } : t));
                                    }}
                                    className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder:text-slate-300"
                                    placeholder="Nama Tugas..."
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleSaveTask(task)}
                                        disabled={saving}
                                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                    >
                                        <Save className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        disabled={saving}
                                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center px-2">
                <button
                    onClick={() => window.location.href = "/map"}
                    className="text-slate-400 text-sm font-bold flex items-center gap-1 hover:text-slate-600 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Kembali ke Peta
                </button>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest"> Satu SAF Dashboard v2 </div>
            </div>
        </div>
    );
}
