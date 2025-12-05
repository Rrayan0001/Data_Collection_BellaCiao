"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Search, Download, LogOut, Star, MessageSquare } from "lucide-react";

interface GuestEntry {
    id: string;
    name: string;
    phoneNumber: string;
    area: string | null;
    tableNumber: string | null;
    rating: number | null;
    tags: string | null;
    feedback: string | null;
    createdAt: string;
}

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [entries, setEntries] = useState<GuestEntry[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const fetchEntries = async () => {
        try {
            const params = new URLSearchParams({
                search,
                filter,
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            const response = await fetch(`/api/entries?${params}`);
            const data = await response.json();

            if (data.success) {
                setEntries(data.entries);
                setPagination(data.pagination);
            } else {
                if (response.status === 401) {
                    router.push("/admin-login");
                }
            }
        } catch (error) {
            console.error("Error fetching entries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [pagination.page, search, filter]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
        });
        router.push("/admin-login");
    };

    const handleExportCSV = () => {
        const csvData = entries.map((entry) => ({
            Name: entry.name,
            Phone: entry.phoneNumber,
            Area: entry.area || "",
            Rating: entry.rating || "",
            Tags: entry.tags || "",
            Feedback: entry.feedback || "",
            Time: format(new Date(entry.createdAt), "yyyy-MM-dd HH:mm"),
        }));

        const csv = [
            Object.keys(csvData[0]).join(","),
            ...csvData.map((row) => Object.values(row).map(val => `"${val}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bella-ciao-entries-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-6">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-black">Dashboard</h1>
                        <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs mt-1">Bella Ciao Admin Panel</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-black rounded-lg transition-colors text-sm font-bold uppercase tracking-wider"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="SEARCH NAME OR PHONE..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPagination({ ...pagination, page: 1 });
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all uppercase placeholder:text-zinc-400 font-medium"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setPagination({ ...pagination, page: 1 });
                            }}
                            className="px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-accent focus:outline-none font-medium uppercase text-sm min-w-[140px]"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                        </select>
                        <button
                            onClick={handleExportCSV}
                            disabled={entries.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-sm shadow-md"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Loading Data...</div>
                    ) : entries.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 font-bold uppercase tracking-widest">No entries found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-50 border-b border-zinc-100">
                                    <tr>
                                        <th className="px-6 py-4 font-black uppercase tracking-wider text-xs text-zinc-500">Name / Phone</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-wider text-xs text-zinc-500">Area</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-wider text-xs text-zinc-500">Rating</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-wider text-xs text-zinc-500">Feedback</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-wider text-xs text-zinc-500 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {entries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-black uppercase">{entry.name}</div>
                                                <div className="text-zinc-500 font-mono text-xs mt-1">{entry.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 bg-zinc-100 rounded text-xs font-bold uppercase text-zinc-600">
                                                    {entry.area || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {entry.rating ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 fill-accent text-accent" />
                                                            <span className="font-bold">{entry.rating}</span>
                                                        </div>
                                                        {entry.tags && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {entry.tags.split(',').map(tag => (
                                                                    <span key={tag} className="text-[10px] uppercase bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold border border-red-100">
                                                                        {tag.replace(/-/g, ' ')}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                {entry.feedback ? (
                                                    <div className="flex items-start gap-2">
                                                        <MessageSquare className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                                                        <p className="text-zinc-600 text-xs italic leading-relaxed">"{entry.feedback}"</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-500 font-mono text-xs">
                                                {format(new Date(entry.createdAt), "MMM dd, HH:mm")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {/* Simplified pagination logic for brevity, can be expanded if needed */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-between items-center pt-4">
                        <button
                            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-500 disabled:opacity-30 hover:text-black transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-500 disabled:opacity-30 hover:text-black transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
