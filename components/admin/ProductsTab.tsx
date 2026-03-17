import { useState } from "react";
import Image from "next/image";
import { Plus, ImageIcon, Pencil, Trash2, Loader2 } from "lucide-react";
import { ApiProduct, ApiCategory } from "./types";
import { SortHeader, SortDir } from "./SortHeader";
import { ProductModal } from "./ProductModal";
import { DeleteModal } from "./DeleteModal";
import { Pagination } from "@/components/Pagination";
import { formatDate } from "./utils";
import { getProduct } from "@/lib/api/products";

interface ProductsTabProps {
    products: ApiProduct[];
    categories: ApiCategory[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function ProductsTab({ products, categories, loading, page, totalPages, onPageChange }: ProductsTabProps) {
    const [sortKey, setSortKey] = useState<"name" | "price_uah" | "category_id" | "created_at">("created_at");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [modalProduct, setModalProduct] = useState<ApiProduct | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ApiProduct | null>(null);
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

    const toggleSort = (key: typeof sortKey) => {
        if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    };

    const getCategoryName = (categoryId: number) => {
        const cat = categories.find((c) => String(c.id) === String(categoryId));
        return cat?.name || "—";
    };

    // Sort happens client-side on the current server page (10 items)
    const sorted = [...products].sort((a, b) => {
        const mul = sortDir === "asc" ? 1 : -1;
        if (sortKey === "name") return mul * a.name.localeCompare(b.name);
        if (sortKey === "price_uah") return mul * (a.price_uah - b.price_uah);
        if (sortKey === "category_id") return mul * getCategoryName(a.category_id).localeCompare(getCategoryName(b.category_id));
        return mul * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

    const handleEdit = async (product: ApiProduct) => {
        setLoadingProductId(product.id);
        try {
            const full = await getProduct(product.id);
            setModalProduct(full);
        } catch {
            setModalProduct(product);
        } finally {
            setLoadingProductId(null);
        }
    };

    const handleSaved = () => {
        setShowAddModal(false);
        setModalProduct(null);
    };

    const handleDeleted = () => {
        setDeleteTarget(null);
    };

    if (loading) {
        return (
            <div className="bg-white border border-stone-100 rounded flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={22} className="animate-spin text-stone-300" />
                    <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">Loading products</p>
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
                    Add Product
                </button>
            </div>

            <div className="bg-white border border-stone-100 rounded overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-stone-100 bg-stone-50/50">
                            <SortHeader label="Product" active={sortKey === "name"} dir={sortKey === "name" ? sortDir : undefined} onClick={() => toggleSort("name")} />
                            <SortHeader label="Category" active={sortKey === "category_id"} dir={sortKey === "category_id" ? sortDir : undefined} onClick={() => toggleSort("category_id")} className="hidden sm:table-cell" />
                            <SortHeader label="Price" active={sortKey === "price_uah"} dir={sortKey === "price_uah" ? sortDir : undefined} onClick={() => toggleSort("price_uah")} />
                            <th className="text-left px-5 py-3 hidden lg:table-cell"><span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Details</span></th>
                            <SortHeader label="Added" active={sortKey === "created_at"} dir={sortKey === "created_at" ? sortDir : undefined} onClick={() => toggleSort("created_at")} className="hidden md:table-cell" />
                            <th className="text-right px-5 py-3"><span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((product) => {
                            const img = product.product_images?.[0]?.url;
                            const meta = product.metadata ? Object.entries(product.metadata) : [];
                            return (
                                <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50/60 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-stone-100 rounded overflow-hidden flex-shrink-0 relative">
                                                {img ? (
                                                    <Image src={img} alt={product.name} fill className="object-cover" sizes="48px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon size={18} className="text-stone-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-stone-900 truncate">{product.name}</p>
                                                    {product.featured && (
                                                        <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full font-bold uppercase tracking-wider flex-shrink-0">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-400 truncate max-w-[180px] sm:max-w-[220px]">
                                                    {product.description || <span className="sm:hidden">{getCategoryName(product.category_id)}</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded">
                                            {getCategoryName(product.category_id)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-medium text-stone-900 tabular-nums">UAH {product.price_uah}</span>
                                    </td>
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        {meta.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {meta.slice(0, 3).map(([k, v]) => (
                                                    <span key={k} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-brand/8 text-brand rounded-full font-medium">
                                                        {k}: {String(v)}
                                                    </span>
                                                ))}
                                                {meta.length > 3 && (
                                                    <span className="text-[10px] text-stone-400 px-1">+{meta.length - 3}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-stone-300 italic">No metadata</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-stone-400 tabular-nums hidden md:table-cell">{formatDate(product.created_at)}</td>
                                    <td className="px-3 sm:px-5 py-4">
                                        <div className="flex items-center justify-end gap-1 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                disabled={loadingProductId === product.id}
                                                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors hover:cursor-pointer disabled:opacity-50"
                                                title="Edit"
                                            >
                                                {loadingProductId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(product)}
                                                className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors hover:cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {sorted.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-20 font-serif italic text-stone-300 text-lg">No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />

            {showAddModal && <ProductModal categories={categories} onClose={() => setShowAddModal(false)} onSaved={handleSaved} />}
            {modalProduct && <ProductModal product={modalProduct} categories={categories} onClose={() => setModalProduct(null)} onSaved={handleSaved} />}
            {deleteTarget && <DeleteModal product={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={handleDeleted} />}
        </>
    );
}
