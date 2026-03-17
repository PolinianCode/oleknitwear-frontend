import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SortHeader, SortDir } from "./SortHeader";
import { Pagination } from "@/components/Pagination";
import { formatDate } from "./utils";
import { ApiUser } from "./types";

interface CustomersTableProps {
    search: string;
    users: ApiUser[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function CustomersTable({ search, users, loading, page, totalPages, onPageChange }: CustomersTableProps) {
    const [sortKey, setSortKey] = useState<"full_name" | "created_at">("created_at");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const toggleSort = (key: typeof sortKey) => {
        if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    };

    // Sort client-side on the current server page (10 items)
    const sorted = [...users].sort((a, b) => {
        const mul = sortDir === "asc" ? 1 : -1;
        if (sortKey === "full_name") return mul * a.full_name.localeCompare(b.full_name);
        return mul * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

    if (loading) {
        return (
            <div className="bg-white border border-stone-100 rounded flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={22} className="animate-spin text-stone-300" />
                    <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">Loading customers</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="bg-white border border-stone-100 rounded overflow-x-auto">
            <table className="w-full min-w-[640px]">
                <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/50">
                        <SortHeader label="Customer" active={sortKey === "full_name"} dir={sortKey === "full_name" ? sortDir : undefined} onClick={() => toggleSort("full_name")} />
                        <th className="text-left px-5 py-3 hidden sm:table-cell"><span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Role</span></th>
                        <SortHeader label="Joined" active={sortKey === "created_at"} dir={sortKey === "created_at" ? sortDir : undefined} onClick={() => toggleSort("created_at")} className="hidden md:table-cell" />
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((c) => (
                        <tr key={c.id} className="border-b border-stone-50 hover:bg-stone-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-[10px] font-bold text-stone-500">{c.full_name.split(" ").map(n => n[0]).join("")}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-stone-900">{c.full_name}</p>
                                        <p className="text-xs text-stone-400">{c.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-3.5 hidden sm:table-cell">
                                {c.role === "admin" ? (
                                    <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-stone-900 text-white rounded">Admin</span>
                                ) : (
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-stone-300">Customer</span>
                                )}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-stone-400 hidden md:table-cell">{formatDate(c.created_at)}</td>
                        </tr>
                    ))}
                    {sorted.length === 0 && (
                        <tr><td colSpan={3} className="text-center py-20 font-serif italic text-stone-300 text-lg">
                            {search ? "No customers match your search." : "No customers found."}
                        </td></tr>
                    )}
                </tbody>
            </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
    );
}
