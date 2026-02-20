import { useState } from "react";
import { Plus, Tag, Pencil, Trash2, Loader2 } from "lucide-react";
import { ApiCategory } from "./types";
import { SortHeader, SortDir } from "./SortHeader";
import { CategoryModal } from "./CategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { Pagination } from "@/components/Pagination";
import { formatDate } from "./utils";

const PER_PAGE = 10;

interface CategoriesTabProps {
    search: string;
    categories: ApiCategory[];
    loading: boolean;
}

export function CategoriesTab({ search, categories, loading }: CategoriesTabProps) {
    const [sortKey, setSortKey] = useState<"name" | "created_at">("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [modalCategory, setModalCategory] = useState<ApiCategory | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ApiCategory | null>(null);
    const [page, setPage] = useState(1);

    const toggleSort = (key: typeof sortKey) => {
        if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
        setPage(1);
    };

    const filtered = categories
        .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const mul = sortDir === "asc" ? 1 : -1;
            if (sortKey === "name") return mul * a.name.localeCompare(b.name);
            return mul * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const safePage = Math.min(page, totalPages || 1);
    const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    const handleSaved = () => {
        setShowAddModal(false);
        setModalCategory(null);
    };

    const handleDeleted = () => {
        setDeleteTarget(null);
    };

    if (loading) {
        return (
            <div className="bg-white border border-stone-100 rounded flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={22} className="animate-spin text-stone-300" />
                    <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">Loading categories</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] rounded hover:bg-brand transition-colors hover:cursor-pointer"
                >
                    <Plus size={14} />
                    Add Category
                </button>
            </div>

            <div className="bg-white border border-stone-100 rounded overflow-x-auto">
                <table className="w-full min-w-[640px]">
                    <thead>
                        <tr className="border-b border-stone-100 bg-stone-50/50">
                            <SortHeader label="Name" active={sortKey === "name"} dir={sortKey === "name" ? sortDir : undefined} onClick={() => toggleSort("name")} />
                            <th className="text-left px-5 py-3 hidden sm:table-cell"><span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Description</span></th>
                            <SortHeader label="Created" active={sortKey === "created_at"} dir={sortKey === "created_at" ? sortDir : undefined} onClick={() => toggleSort("created_at")} className="hidden md:table-cell" />
                            <th className="text-right px-5 py-3"><span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((cat) => (
                            <tr key={cat.id} className="border-b border-stone-50 hover:bg-stone-50/60 transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-brand/10 to-brand/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Tag size={14} className="text-brand" />
                                        </div>
                                        <p className="text-sm font-medium text-stone-900">{cat.name}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4 hidden sm:table-cell">
                                    {cat.description ? (
                                        <p className="text-sm text-stone-500 truncate max-w-[280px]">{cat.description}</p>
                                    ) : (
                                        <span className="text-xs text-stone-300 italic">No description</span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-sm text-stone-400 tabular-nums hidden md:table-cell">{formatDate(cat.created_at)}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setModalCategory(cat)}
                                            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors hover:cursor-pointer"
                                            title="Edit"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(cat)}
                                            className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors hover:cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-20 font-serif italic text-stone-300 text-lg">No categories found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />

            {showAddModal && <CategoryModal onClose={() => setShowAddModal(false)} onSaved={handleSaved} />}
            {modalCategory && <CategoryModal category={modalCategory} onClose={() => setModalCategory(null)} onSaved={handleSaved} />}
            {deleteTarget && <DeleteCategoryModal category={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={handleDeleted} />}
        </>
    );
}
