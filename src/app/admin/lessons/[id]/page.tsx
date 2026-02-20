export const runtime = 'edge';

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, ListChecks, FileText, Mic, Target, Plus, X } from "lucide-react";
import Link from "next/link";

export default function LessonEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const isNew = id === "new";
    const router = useRouter();
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        chapter: 1,
        type: "story",
        title: "",
        content: "" as any
    });

    useEffect(() => {
        if (!isNew) {
            fetch("/api/admin/lessons")
                .then(res => res.json())
                .then(data => {
                    const lesson = data.find((l: any) => l.id === id);
                    if (lesson) {
                        setForm({
                            chapter: lesson.chapter,
                            type: lesson.type,
                            title: lesson.title,
                            content: typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content
                        });
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Load lesson error:", err);
                    setLoading(false);
                });
        } else {
            // Default initial content structure
            setForm(f => ({
                ...f,
                content: { slides: [] }
            }));
        }
    }, [id, isNew]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = isNew ? "/api/admin/lessons" : `/api/admin/lessons/${id}`;
            const method = isNew ? "POST" : "PUT";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                router.push("/admin/lessons");
                router.refresh();
            } else {
                alert("Gagal menyimpan materi.");
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Terjadi kesalahan.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading editor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/lessons" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm">
                    <ArrowLeft className="h-4 w-4" /> KEMBALI
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                >
                    <Save className="h-5 w-5" /> {saving ? "MENYIMPAN..." : "SIMPAN MATERI"}
                </button>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chapter</label>
                        <input
                            type="number"
                            value={form.chapter}
                            onChange={e => setForm({ ...form, chapter: parseInt(e.target.value) })}
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-black text-slate-700 transition-all text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Materi</label>
                        <select
                            value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-black text-slate-700 transition-all text-lg appearance-none cursor-pointer"
                        >
                            <option value="story">Story (Slider Gambar/Teks)</option>
                            <option value="quiz">Quiz (Pilihan Ganda)</option>
                            <option value="recite">Recite (Ayat Al-Qur'an)</option>
                            <option value="action">Action (Misi Lapangan)</option>
                            <option value="chapter">Interactive Chapter (5-Part Structure)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Materi</label>
                    <input
                        type="text"
                        placeholder="Misal: Perjalanan Hijrah Nabi"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-black text-slate-700 transition-all text-xl"
                    />
                </div>

                <div className="pt-8 border-t-2 border-slate-50">
                    <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                        {form.type === 'story' && <FileText className="h-5 w-5 text-blue-500" />}
                        {form.type === 'quiz' && <ListChecks className="h-5 w-5 text-amber-500" />}
                        {form.type === 'recite' && <Mic className="h-5 w-5 text-emerald-500" />}
                        {form.type === 'action' && <Target className="h-5 w-5 text-red-500" />}
                        {form.type === 'chapter' && <ListChecks className="h-5 w-5 text-indigo-500" />}
                        Konten {form.type.charAt(0).toUpperCase() + form.type.slice(1)}
                    </h3>

                    {/* Chapter Editor (5-Part Structure) */}
                    {form.type === 'chapter' && (
                        <div className="space-y-12">
                            {/* 1. Pre-test Section */}
                            <div className="space-y-6">
                                <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">1</span>
                                    Pre-test (Pemanasan)
                                </h4>
                                <div className="space-y-4">
                                    {(form.content.preTest || []).map((q: any, idx: number) => (
                                        <div key={idx} className="p-6 rounded-2xl border-2 border-slate-100 space-y-4 bg-slate-50/50">
                                            <div className="flex items-center justify-between">
                                                <select
                                                    value={q.type || "multiple_choice"}
                                                    onChange={e => {
                                                        const newPre = [...form.content.preTest];
                                                        newPre[idx] = { ...q, type: e.target.value };
                                                        setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                    }}
                                                    className="p-2 rounded-lg border-2 border-white focus:border-primary outline-none text-xs font-bold"
                                                >
                                                    <option value="multiple_choice">Pilihan Ganda</option>
                                                    <option value="pair_matching">Pasang Mencocokkan</option>
                                                    <option value="sentence_arrange">Susun Kalimat</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        const newPre = form.content.preTest.filter((_: any, i: number) => i !== idx);
                                                        setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                    }}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Specific inputs based on question type */}
                                            {q.type === 'multiple_choice' && (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Pertanyaan..."
                                                        value={q.question || ""}
                                                        onChange={e => {
                                                            const newPre = [...form.content.preTest];
                                                            newPre[idx] = { ...q, question: e.target.value };
                                                            setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                        }}
                                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {(q.options || ["", "", "", ""]).map((opt: string, optIdx: number) => (
                                                            <div key={optIdx} className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    checked={q.correctAnswer === optIdx}
                                                                    onChange={() => {
                                                                        const newPre = [...form.content.preTest];
                                                                        newPre[idx] = { ...q, correctAnswer: optIdx };
                                                                        setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                                    }}
                                                                    className="accent-primary"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Opsi ${optIdx + 1}`}
                                                                    value={opt}
                                                                    onChange={e => {
                                                                        const newPre = [...form.content.preTest];
                                                                        const newOpts = [...(q.options || ["", "", "", ""])];
                                                                        newOpts[optIdx] = e.target.value;
                                                                        newPre[idx] = { ...q, options: newOpts };
                                                                        setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                                    }}
                                                                    className="flex-1 p-2 rounded-lg border-2 border-white focus:border-primary outline-none text-xs font-medium"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {q.type === 'pair_matching' && (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Judul Pasangan..."
                                                        value={q.title || ""}
                                                        onChange={e => {
                                                            const newPre = [...form.content.preTest];
                                                            newPre[idx] = { ...q, title: e.target.value };
                                                            setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                        }}
                                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                                    />
                                                    <div className="space-y-2">
                                                        {(q.pairs || []).map((pair: any, pIdx: number) => (
                                                            <div key={pIdx} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Kiri"
                                                                    value={pair.left}
                                                                    onChange={e => {
                                                                        const newPre = [...form.content.preTest];
                                                                        const newPairs = [...q.pairs];
                                                                        newPairs[pIdx] = { ...pair, left: e.target.value };
                                                                        newPre[idx] = { ...q, pairs: newPairs };
                                                                        setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                                    }}
                                                                    className="flex-1 p-2 rounded-lg border-2 border-white focus:border-primary outline-none text-xs font-medium"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Kanan"
                                                                    value={pair.right}
                                                                    onChange={e => {
                                                                        const newPre = [...form.content.preTest];
                                                                        const newPairs = [...q.pairs];
                                                                        newPairs[pIdx] = { ...pair, right: e.target.value };
                                                                        newPre[idx] = { ...q, pairs: newPairs };
                                                                        setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                                    }}
                                                                    className="flex-1 p-2 rounded-lg border-2 border-white focus:border-primary outline-none text-xs font-medium"
                                                                />
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newPre = [...form.content.preTest];
                                                                const newPairs = [...(q.pairs || []), { id: Date.now().toString(), left: "", right: "" }];
                                                                newPre[idx] = { ...q, pairs: newPairs };
                                                                setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                            }}
                                                            className="text-[10px] font-black text-primary uppercase"
                                                        >
                                                            + Tambah Pasangan
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {q.type === 'sentence_arrange' && (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Instruksi..."
                                                        value={q.question || ""}
                                                        onChange={e => {
                                                            const newPre = [...form.content.preTest];
                                                            newPre[idx] = { ...q, question: e.target.value };
                                                            setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                        }}
                                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Kalimat Benar..."
                                                        value={q.correctSentence || ""}
                                                        onChange={e => {
                                                            const newPre = [...form.content.preTest];
                                                            newPre[idx] = { ...q, correctSentence: e.target.value };
                                                            setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                        }}
                                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Pilihan Kata (pisahkan dengan koma)..."
                                                        value={(q.words || []).join(", ")}
                                                        onChange={e => {
                                                            const newPre = [...form.content.preTest];
                                                            newPre[idx] = { ...q, words: e.target.value.split(",").map(w => w.trim()) };
                                                            setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                                        }}
                                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newPre = [...(form.content.preTest || []), { type: "multiple_choice", question: "", options: ["", "", "", ""], correctAnswer: 0 }];
                                            setForm({ ...form, content: { ...form.content, preTest: newPre } });
                                        }}
                                        className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" /> Tambah Pertanyaan Pre-test
                                    </button>
                                </div>
                            </div>

                            {/* 2. Material Section */}
                            <div className="space-y-6 pt-12 border-t-2 border-slate-50">
                                <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">2</span>
                                    Materi Pembelajaran (Drive)
                                </h4>
                                <div className="space-y-4">
                                    {(Array.isArray(form.content.material) ? form.content.material : [form.content.material || {}]).map((mat: any, idx: number) => (
                                        <div key={idx} className="p-6 rounded-2xl border-2 border-slate-100 space-y-4 bg-slate-50/50 relative">
                                            {form.content.material && Array.isArray(form.content.material) && (
                                                <button
                                                    onClick={() => {
                                                        const newMat = form.content.material.filter((_: any, i: number) => i !== idx);
                                                        setForm({ ...form, content: { ...form.content, material: newMat } });
                                                    }}
                                                    className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                            <input
                                                type="text"
                                                placeholder="Judul Materi..."
                                                value={mat.title || ""}
                                                onChange={e => {
                                                    const materials = Array.isArray(form.content.material) ? [...form.content.material] : [mat];
                                                    materials[idx] = { ...mat, title: e.target.value };
                                                    setForm({ ...form, content: { ...form.content, material: materials.length > 1 ? materials : materials[0] } });
                                                }}
                                                className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                            />
                                            <div className="flex gap-4">
                                                <select
                                                    value={mat.type || "pdf"}
                                                    onChange={e => {
                                                        const materials = Array.isArray(form.content.material) ? [...form.content.material] : [mat];
                                                        materials[idx] = { ...mat, type: e.target.value };
                                                        setForm({ ...form, content: { ...form.content, material: materials.length > 1 ? materials : materials[0] } });
                                                    }}
                                                    className="p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-xs"
                                                >
                                                    <option value="pdf">PDF</option>
                                                    <option value="video">Video</option>
                                                    <option value="image">Gambar</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="URL Embed Drive..."
                                                    value={mat.url || ""}
                                                    onChange={e => {
                                                        const materials = Array.isArray(form.content.material) ? [...form.content.material] : [mat];
                                                        materials[idx] = { ...mat, url: e.target.value };
                                                        setForm({ ...form, content: { ...form.content, material: materials.length > 1 ? materials : materials[0] } });
                                                    }}
                                                    className="flex-1 p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const current = Array.isArray(form.content.material) ? form.content.material : (form.content.material ? [form.content.material] : []);
                                            const newMat = [...current, { title: "", type: "pdf", url: "" }];
                                            setForm({ ...form, content: { ...form.content, material: newMat } });
                                        }}
                                        className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" /> Tambah Materi Sesi
                                    </button>
                                </div>
                            </div>

                            {/* 3. Mastery Quiz Section */}
                            <div className="space-y-6 pt-12 border-t-2 border-slate-50">
                                <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">3</span>
                                    Kuis Penguasaan (Mastery Quiz)
                                </h4>
                                <div className="space-y-4">
                                    {(form.content.quiz || []).map((q: any, idx: number) => (
                                        <div key={idx} className="p-6 rounded-2xl border-2 border-slate-100 space-y-4 bg-slate-50/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Pilihan Ganda</span>
                                                <button
                                                    onClick={() => {
                                                        const newQuiz = form.content.quiz.filter((_: any, i: number) => i !== idx);
                                                        setForm({ ...form, content: { ...form.content, quiz: newQuiz } });
                                                    }}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Pertanyaan..."
                                                value={q.question || ""}
                                                onChange={e => {
                                                    const newQ = [...form.content.quiz];
                                                    newQ[idx] = { ...q, question: e.target.value };
                                                    setForm({ ...form, content: { ...form.content, quiz: newQ } });
                                                }}
                                                className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                            />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {(q.options || ["", "", "", ""]).map((opt: string, optIdx: number) => (
                                                    <div key={optIdx} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            checked={q.correctAnswer === optIdx}
                                                            onChange={() => {
                                                                const newQ = [...form.content.quiz];
                                                                newQ[idx] = { ...q, correctAnswer: optIdx };
                                                                setForm({ ...form, content: { ...form.content, quiz: newQ } });
                                                            }}
                                                            className="accent-primary"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder={`Opsi ${optIdx + 1}`}
                                                            value={opt}
                                                            onChange={e => {
                                                                const newQ = [...form.content.quiz];
                                                                const newOpts = [...(q.options || ["", "", "", ""])];
                                                                newOpts[optIdx] = e.target.value;
                                                                newQ[idx] = { ...q, options: newOpts };
                                                                setForm({ ...form, content: { ...form.content, quiz: newQ } });
                                                            }}
                                                            className="flex-1 p-2 rounded-lg border-2 border-white focus:border-primary outline-none text-xs font-medium"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newQuiz = [...(form.content.quiz || []), { type: "multiple_choice", question: "", options: ["", "", "", ""], correctAnswer: 0 }];
                                            setForm({ ...form, content: { ...form.content, quiz: newQuiz } });
                                        }}
                                        className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" /> Tambah Pertanyaan Kuis Master
                                    </button>
                                </div>
                            </div>

                            {/* 4. Amalan Yaumi Section */}
                            <div className="space-y-6 pt-12 border-t-2 border-slate-50">
                                <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">4</span>
                                    Amalan Yaumi (Checklist Harian)
                                </h4>
                                <div className="p-6 rounded-2xl border-2 border-slate-100 space-y-4 bg-slate-50/50">
                                    <input
                                        type="text"
                                        placeholder="Judul Grup Amalan (Misal: Amalan Pekan 1)"
                                        value={form.content.amalan?.title || ""}
                                        onChange={e => setForm({ ...form, content: { ...form.content, amalan: { ...(form.content.amalan || {}), title: e.target.value } } })}
                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                    />
                                    <div className="space-y-2">
                                        {(form.content.amalan?.items || []).map((item: any, iIdx: number) => (
                                            <div key={iIdx} className="flex gap-2 items-center">
                                                <select
                                                    value={item.icon}
                                                    onChange={e => {
                                                        const newItems = [...form.content.amalan.items];
                                                        newItems[iIdx] = { ...item, icon: e.target.value };
                                                        setForm({ ...form, content: { ...form.content, amalan: { ...form.content.amalan, items: newItems } } });
                                                    }}
                                                    className="p-2 rounded-lg border-2 border-white outline-none text-[10px] font-bold"
                                                >
                                                    <option value="sholat">Sholat</option>
                                                    <option value="quran">Quran</option>
                                                    <option value="sunnah">Sunnah</option>
                                                    <option value="sedekah">Sedekah</option>
                                                    <option value="study">Belajar</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Nama Amalan..."
                                                    value={item.label}
                                                    onChange={e => {
                                                        const newItems = [...form.content.amalan.items];
                                                        newItems[iIdx] = { ...item, label: e.target.value };
                                                        setForm({ ...form, content: { ...form.content, amalan: { ...form.content.amalan, items: newItems } } });
                                                    }}
                                                    className="flex-1 p-2 rounded-lg border-2 border-white focus:border-primary outline-none text-xs font-medium"
                                                />
                                                <select
                                                    value={item.category}
                                                    onChange={e => {
                                                        const newItems = [...form.content.amalan.items];
                                                        newItems[iIdx] = { ...item, category: e.target.value };
                                                        setForm({ ...form, content: { ...form.content, amalan: { ...form.content.amalan, items: newItems } } });
                                                    }}
                                                    className="p-2 rounded-lg border-2 border-white outline-none text-[10px] font-bold"
                                                >
                                                    <option value="wajib">Wajib</option>
                                                    <option value="sunnah">Sunnah</option>
                                                    <option value="other">Lainnya</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        const newItems = form.content.amalan.items.filter((_: any, i: number) => i !== iIdx);
                                                        setForm({ ...form, content: { ...form.content, amalan: { ...form.content.amalan, items: newItems } } });
                                                    }}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newItems = [...(form.content.amalan?.items || []), { id: Date.now().toString(), label: "", icon: "sholat", category: "wajib" }];
                                                setForm({ ...form, content: { ...form.content, amalan: { ...(form.content.amalan || {}), items: newItems } } });
                                            }}
                                            className="text-[10px] font-black text-violet-500 uppercase"
                                        >
                                            + Tambah Item Amalan
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Tadarus Section */}
                            <div className="space-y-6 pt-12 border-t-2 border-slate-50">
                                <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">5</span>
                                    Tadarus (Tarteel Style)
                                </h4>
                                <div className="p-6 rounded-2xl border-2 border-slate-100 space-y-4 bg-slate-50/50">
                                    <input
                                        type="text"
                                        placeholder="Nama Surat (Misal: Al-Mulk)"
                                        value={form.content.tadarus?.surahName || ""}
                                        onChange={e => setForm({ ...form, content: { ...form.content, tadarus: { ...(form.content.tadarus || {}), surahName: e.target.value } } })}
                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold text-sm"
                                    />
                                    <textarea
                                        rows={2}
                                        placeholder="Teks Ayat (Arab)..."
                                        value={form.content.tadarus?.verseText || ""}
                                        onChange={e => setForm({ ...form, content: { ...form.content, tadarus: { ...(form.content.tadarus || {}), verseText: e.target.value } } })}
                                        className="w-full p-4 rounded-xl border-2 border-white outline-none font-bold text-right text-xl font-arabic resize-none"
                                        dir="rtl"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Target Bacaan (Latin)..."
                                        value={form.content.tadarus?.targetString || ""}
                                        onChange={e => setForm({ ...form, content: { ...form.content, tadarus: { ...(form.content.tadarus || {}), targetString: e.target.value } } })}
                                        className="w-full p-3 rounded-xl border-2 border-white outline-none font-bold text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Terjemahan..."
                                        value={form.content.tadarus?.translation || ""}
                                        onChange={e => setForm({ ...form, content: { ...form.content, tadarus: { ...(form.content.tadarus || {}), translation: e.target.value } } })}
                                        className="w-full p-3 rounded-xl border-2 border-white outline-none font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Story Editor (Legacy/Existing) */}
                    {form.type === 'story' && (
                        <div className="space-y-4">
                            {(form.content.slides || []).map((slide: any, idx: number) => (
                                <div key={idx} className="p-6 rounded-2xl border-2 border-slate-100 flex gap-4 items-start bg-slate-50/50">
                                    <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-xs shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <input
                                            type="text"
                                            placeholder="URL Gambar (opsional)"
                                            value={slide.image || ""}
                                            onChange={e => {
                                                const newSlides = [...form.content.slides];
                                                newSlides[idx] = { ...slide, image: e.target.value };
                                                setForm({ ...form, content: { ...form.content, slides: newSlides } });
                                            }}
                                            className="w-full p-3 rounded-xl border-2 border-white focus:border-primary/20 outline-none font-bold text-sm"
                                        />
                                        <textarea
                                            placeholder="Narasi cerita..."
                                            rows={3}
                                            value={slide.text || ""}
                                            onChange={e => {
                                                const newSlides = [...form.content.slides];
                                                newSlides[idx] = { ...slide, text: e.target.value };
                                                setForm({ ...form, content: { ...form.content, slides: newSlides } });
                                            }}
                                            className="w-full p-3 rounded-xl border-2 border-white focus:border-primary/20 outline-none font-bold text-sm resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newSlides = form.content.slides.filter((_: any, i: number) => i !== idx);
                                            setForm({ ...form, content: { ...form.content, slides: newSlides } });
                                        }}
                                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newSlides = [...(form.content.slides || []), { image: "", text: "" }];
                                    setForm({ ...form, content: { ...form.content, slides: newSlides } });
                                }}
                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Plus className="h-5 w-5" /> Tambah Slide Cerita
                            </button>
                        </div>
                    )}

                    {/* Quiz Editor */}
                    {form.type === 'quiz' && (
                        <div className="space-y-6">
                            {(form.content.questions || []).map((q: any, idx: number) => (
                                <div key={idx} className="p-6 rounded-2xl border-2 border-slate-100 space-y-4 bg-slate-50/50">
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                                            {idx + 1}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newQs = form.content.questions.filter((_: any, i: number) => i !== idx);
                                                setForm({ ...form, content: { ...form.content, questions: newQs } });
                                            }}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Pertanyaan..."
                                        value={q.question || ""}
                                        onChange={e => {
                                            const newQs = [...form.content.questions];
                                            newQs[idx] = { ...q, question: e.target.value };
                                            setForm({ ...form, content: { ...form.content, questions: newQs } });
                                        }}
                                        className="w-full p-3 rounded-xl border-2 border-white focus:border-primary outline-none font-bold"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(q.options || ["", "", "", ""]).map((opt: string, optIdx: number) => (
                                            <div key={optIdx} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${idx}`}
                                                    checked={q.correctIndex === optIdx}
                                                    onChange={() => {
                                                        const newQs = [...form.content.questions];
                                                        newQs[idx] = { ...q, correctIndex: optIdx };
                                                        setForm({ ...form, content: { ...form.content, questions: newQs } });
                                                    }}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={`Opsi ${String.fromCharCode(65 + optIdx)}`}
                                                    value={opt}
                                                    onChange={e => {
                                                        const newQs = [...form.content.questions];
                                                        const newOpts = [...(q.options || ["", "", "", ""])];
                                                        newOpts[optIdx] = e.target.value;
                                                        newQs[idx] = { ...q, options: newOpts };
                                                        setForm({ ...form, content: { ...form.content, questions: newQs } });
                                                    }}
                                                    className="flex-1 p-2 rounded-lg border-2 border-white focus:border-primary outline-none text-sm font-medium"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newQs = [...(form.content.questions || []), { question: "", options: ["", "", "", ""], correctIndex: 0 }];
                                    setForm({ ...form, content: { ...form.content, questions: newQs } });
                                }}
                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Plus className="h-5 w-5" /> Tambah Pertanyaan Quiz
                            </button>
                        </div>
                    )}

                    {/* Recite Editor */}
                    {form.type === 'recite' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Surat & Ayat</label>
                                <input
                                    type="text"
                                    placeholder="Misal: QS Al-Fatihah : 1"
                                    value={form.content.surahName || ""}
                                    onChange={e => setForm({ ...form, content: { ...form.content, surahName: e.target.value } })}
                                    className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teks Ayat (Arab)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Copas Teks Arab di sini..."
                                    value={form.content.verseText || ""}
                                    onChange={e => setForm({ ...form, content: { ...form.content, verseText: e.target.value } })}
                                    className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-bold text-right text-2xl font-arabic resize-none"
                                    dir="rtl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Pelafalan (Transliterasi Latin)</label>
                                <input
                                    type="text"
                                    placeholder="Misal: Bismillahir rahmaanir rahiim"
                                    value={form.content.targetString || ""}
                                    onChange={e => setForm({ ...form, content: { ...form.content, targetString: e.target.value } })}
                                    className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terjemahan (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Terjemahan ayat..."
                                    value={form.content.translation || ""}
                                    onChange={e => setForm({ ...form, content: { ...form.content, translation: e.target.value } })}
                                    className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-bold"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Editor */}
                    {form.type === 'action' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Misi / Judul Tantangan</label>
                                <input
                                    type="text"
                                    placeholder="Misal: Sedekah Subuh"
                                    value={form.content.mission || ""}
                                    onChange={e => setForm({ ...form, content: { ...form.content, mission: e.target.value } })}
                                    className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Tugas</label>
                                <textarea
                                    rows={4}
                                    placeholder="Apa yang harus dilakukan santri?"
                                    value={form.content.challenge || ""}
                                    onChange={e => setForm({ ...form, content: { ...form.content, challenge: e.target.value } })}
                                    className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-bold resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Poin XP yang Didapat</label>
                                <input
                                    type="number"
                                    placeholder="100"
                                    value={form.content.points || 100}
                                    onChange={e => setForm({ ...form, content: { ...form.content, points: parseInt(e.target.value) } })}
                                    className="w-32 p-4 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-bold"
                                />
                            </div>
                        </div>
                    )}

                    {/* Raw JSON Fallback (Optional, but hidden if specific editor is shown) */}
                    <div className="mt-8 pt-8 border-t-2 border-slate-50">
                        <details className="cursor-pointer group">
                            <summary className="text-[10px] font-black text-slate-300 uppercase tracking-widest list-none group-open:mb-4">Edisi JSON Mentah (Klik untuk Toggle)</summary>
                            <textarea
                                value={JSON.stringify(form.content, null, 2)}
                                onChange={e => {
                                    try {
                                        setForm({ ...form, content: JSON.parse(e.target.value) });
                                    } catch (e) { }
                                }}
                                className="w-full h-40 p-4 rounded-xl border-2 border-slate-100 font-mono text-xs bg-slate-50 focus:border-primary outline-none"
                                placeholder="Edit JSON mentah untuk sementara..."
                            />
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
