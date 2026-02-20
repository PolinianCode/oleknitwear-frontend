import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { deleteProduct } from "@/lib/api/products";
import type { ApiProduct } from "@/lib/api/types";

interface DeleteModalProps {
    product: ApiProduct;
    onClose: () => void;
    onDeleted: () => void;
}

export function DeleteModal({ product, onClose, onDeleted }: DeleteModalProps) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setDeleting(true);
        setError("");
        try {
            await deleteProduct(product.id);
            onDeleted();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to delete product");
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-sm rounded shadow-2xl border border-stone-100 p-8 text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Trash2 size={22} className="text-red-500" />
                </div>
                <h3 className="text-lg font-serif text-stone-900 mb-2">Delete Product</h3>
                <p className="text-sm text-stone-500 mb-1">Are you sure you want to delete</p>
                <p className="text-sm font-bold text-stone-900 mb-4">&ldquo;{product.name}&rdquo;?</p>
                <p className="text-xs text-stone-400 mb-6">This action cannot be undone. All images will be removed.</p>

                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-stone-200 rounded text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:bg-stone-50 transition-colors hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-3 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-red-700 transition-colors disabled:bg-stone-300 hover:cursor-pointer"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
