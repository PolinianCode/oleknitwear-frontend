import { useState } from "react";
import { X } from "lucide-react";
import { ApiError } from "@/lib/api";
import { createCategory, updateCategory } from "@/lib/api/categories";
import type { ApiCategory } from "@/lib/api/types";

interface CategoryModalProps {
    category?: ApiCategory;
    onClose: () => void;
    onSaved: () => void;
}

export function CategoryModal({ category, onClose, onSaved }: CategoryModalProps) {
    const isEdit = !!category;
    const [name, setName] = useState(category?.name || "");
    const [description, setDescription] = useState(category?.description || "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            if (isEdit) {
                await updateCategory(category.id, {
                    name,
                    description: description || undefined,
                });
            } else {
                await createCategory({
                    name,
                    description: description || undefined,
                });
            }
            onSaved();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full sm:max-w-md sm:rounded shadow-2xl border border-stone-100 my-0 sm:my-8 min-h-screen sm:min-h-0">

                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-stone-100">
                    <h2 className="text-lg font-serif text-stone-900">
                        {isEdit ? "Edit" : "New"} <span className="italic text-brand">Category</span>
                    </h2>
                    <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors hover:cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                    <fieldset className="space-y-5 mb-8">
                        <legend className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900 mb-4 block">Category Information</legend>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Name</label>
                            <input
                                required
                                minLength={2}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent"
                                placeholder="Sweaters"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Description</label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 resize-none bg-transparent"
                                placeholder="Optional description for this category..."
                            />
                        </div>
                    </fieldset>

                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 border border-stone-200 rounded text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:bg-stone-50 transition-colors hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={submitting}
                            type="submit"
                            className="flex-[2] py-3.5 bg-stone-900 text-white rounded text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all disabled:bg-stone-300 hover:cursor-pointer"
                        >
                            {submitting ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
