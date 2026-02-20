"use client";

import { useEffect, useState } from "react";
import { Users, Shield, User as UserIcon, Search, Mail, Calendar, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/users")
            .then(res => res.json())
            .then(data => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch users error:", err);
                setLoading(false);
            });
    }, []);

    const handleRoleChange = async (id: string, newRole: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, role: newRole })
            });

            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
            }
        } catch (err) {
            alert("Gagal memperbarui role.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen User</h1>
                <p className="text-slate-500 font-medium">Kelola akses dan peran santri, mentor, serta pengurus.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-3xl border-2 border-slate-100 flex items-center gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border-2 border-slate-100">
                                    <UserIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black text-slate-800">{user.name}</h3>
                                        {user.role === 'admin' && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black rounded-md uppercase">Admin</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                                            <Mail className="h-3 w-3" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase border-l border-slate-200 pl-3">
                                            <Calendar className="h-3 w-3" /> {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-300 uppercase mr-2">Set Role:</span>
                                {['santri', 'mentor', 'admin'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleChange(user.id, role)}
                                        disabled={updatingId === user.id}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50",
                                            user.role === role
                                                ? role === 'admin' ? "bg-red-500 text-white" : "bg-primary text-white"
                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        )}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
