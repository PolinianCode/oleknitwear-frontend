import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { createProduct, updateProduct } from "@/lib/api/products";
import { uploadImage } from "@/lib/api/upload";
import type { ApiProduct, ApiCategory, MetadataEntry } from "@/lib/api/types";
import { metadataToEntries, entriesToMetadata } from "./utils";

interface ProductModalProps {
    product?: ApiProduct;
    categories: ApiCategory[];
    onClose: () => void;
    onSaved: () => void;
}

export function ProductModal({ product, categories, onClose, onSaved }: ProductModalProps) {
    const isEdit = !!product;
    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [priceUah, setPriceUah] = useState(product?.price_uah?.toString() || "");
    const [pricePln, setPricePln] = useState(product?.price_pln?.toString() || "");
    const [priceEur, setPriceEur] = useState(product?.price_eur?.toString() || "");
    const [priceUsd, setPriceUsd] = useState(product?.price_usd?.toString() || "");
    const [isNew, setIsNew] = useState(product?.is_new ?? false);
    const [isSale, setIsSale] = useState(product?.is_sale ?? false);
    const [salePriceUah, setSalePriceUah] = useState(product?.sale_price_uah?.toString() || "");
    const [salePricePln, setSalePricePln] = useState(product?.sale_price_pln?.toString() || "");
    const [salePriceEur, setSalePriceEur] = useState(product?.sale_price_eur?.toString() || "");
    const [salePriceUsd, setSalePriceUsd] = useState(product?.sale_price_usd?.toString() || "");
    const [categoryId, setCategoryId] = useState(product?.category_id?.toString() || (categories[0]?.id || ""));
    const [featured, setFeatured] = useState(product?.featured ?? false);
    const [isInStock, setIsInStock] = useState(product?.is_in_stock ?? true);
    const [isPreOrder, setIsPreOrder] = useState(product?.is_pre_order ?? false);
    const [metaEntries, setMetaEntries] = useState<MetadataEntry[]>(
        metadataToEntries(product?.metadata)
    );
    const [imageUrls, setImageUrls] = useState<string[]>(
        product?.product_images?.map((img) => img.url).filter(Boolean) || []
    );
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        setUploading(true);
        setError("");
        try {
            const urls: string[] = [];
            for (const file of Array.from(files)) {
                urls.push(await uploadImage(file));
            }
            setImageUrls((prev) => [...prev, ...urls]);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to upload image");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const addMetaEntry = () => setMetaEntries((prev) => [...prev, { key: "", value: "" }]);

    const updateMetaEntry = (index: number, field: "key" | "value", val: string) => {
        setMetaEntries((prev) => prev.map((e, i) => i === index ? { ...e, [field]: val } : e));
    };

    const removeMetaEntry = (index: number) => {
        setMetaEntries((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        const metadata = entriesToMetadata(metaEntries);

        try {
            if (isEdit) {
                await updateProduct(product.id, {
                    name,
                    description: description || undefined,
                    price_uah: parseFloat(priceUah) || 0,
                    price_pln: parseFloat(pricePln) || 0,
                    price_eur: parseFloat(priceEur) || 0,
                    price_usd: parseFloat(priceUsd) || 0,
                    is_new: isNew,
                    is_sale: isSale,
                    sale_price_uah: salePriceUah ? parseFloat(salePriceUah) : null,
                    sale_price_pln: salePricePln ? parseFloat(salePricePln) : null,
                    sale_price_eur: salePriceEur ? parseFloat(salePriceEur) : null,
                    sale_price_usd: salePriceUsd ? parseFloat(salePriceUsd) : null,
                    category_id: parseInt(categoryId),
                    featured,
                    is_in_stock: isInStock,
                    is_pre_order: isPreOrder,
                    metadata: metadata || {},
                });
            } else {
                if (imageUrls.length === 0) {
                    setError("At least one image is required");
                    setSubmitting(false);
                    return;
                }
                await createProduct({
                    name,
                    description: description || undefined,
                    price_uah: parseFloat(priceUah) || 0,
                    price_pln: parseFloat(pricePln) || 0,
                    price_eur: parseFloat(priceEur) || 0,
                    price_usd: parseFloat(priceUsd) || 0,
                    is_new: isNew,
                    is_sale: isSale,
                    sale_price_uah: salePriceUah ? parseFloat(salePriceUah) : null,
                    sale_price_pln: salePricePln ? parseFloat(salePricePln) : null,
                    sale_price_eur: salePriceEur ? parseFloat(salePriceEur) : null,
                    sale_price_usd: salePriceUsd ? parseFloat(salePriceUsd) : null,
                    category_id: parseInt(categoryId),
                    featured,
                    is_in_stock: isInStock,
                    is_pre_order: isPreOrder,
                    metadata: metadata || {},
                    images: imageUrls.map((url, i) => ({ url, sort_order: i })),
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
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full sm:max-w-xl sm:rounded-lg shadow-2xl border border-stone-100 flex flex-col max-h-screen sm:max-h-[90vh]">

                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-stone-100">
                    <h2 className="text-lg font-serif text-stone-900">
                        {isEdit ? "Edit" : "New"} <span className="italic text-brand">Product</span>
                    </h2>
                    <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors hover:cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8">

                        <fieldset className="space-y-5 mb-8">
                            <legend className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900 mb-4 block">Basic Information</legend>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Name</label>
                                <input
                                    required
                                    minLength={2}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent"
                                    placeholder="Wool Sweater"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Description</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 resize-none bg-transparent"
                                    placeholder="Handmade wool sweater..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-1">Base Prices</label>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">UAH</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={priceUah}
                                            onChange={(e) => setPriceUah(e.target.value)}
                                            className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">PLN</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={pricePln}
                                            onChange={(e) => setPricePln(e.target.value)}
                                            className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">EUR</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={priceEur}
                                            onChange={(e) => setPriceEur(e.target.value)}
                                            className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">USD</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={priceUsd}
                                            onChange={(e) => setPriceUsd(e.target.value)}
                                            className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Category</label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFeatured(!featured)}
                                        className={`relative w-10 h-5 rounded-full transition-colors hover:cursor-pointer ${featured ? "bg-brand" : "bg-stone-200"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${featured ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                        Featured Product
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsNew(!isNew)}
                                        className={`relative w-10 h-5 rounded-full transition-colors hover:cursor-pointer ${isNew ? "bg-brand" : "bg-stone-200"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isNew ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                        New Arrival
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsSale(!isSale)}
                                        className={`relative w-10 h-5 rounded-full transition-colors hover:cursor-pointer ${isSale ? "bg-brand" : "bg-stone-200"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isSale ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                        On Sale
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newVal = !isInStock;
                                            setIsInStock(newVal);
                                            if (newVal) setIsPreOrder(false);
                                        }}
                                        className={`relative w-10 h-5 rounded-full transition-colors hover:cursor-pointer ${isInStock ? "bg-brand" : "bg-stone-200"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isInStock ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                        In Stock
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newVal = !isPreOrder;
                                            setIsPreOrder(newVal);
                                            if (newVal) setIsInStock(false);
                                        }}
                                        className={`relative w-10 h-5 rounded-full transition-colors hover:cursor-pointer ${isPreOrder ? "bg-brand" : "bg-stone-200"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPreOrder ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                        Pre-Order
                                    </label>
                                </div>
                            </div>

                            {isSale && (
                                <div className="space-y-2 mt-4 pt-4 border-t border-stone-100">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-1">Sales Prices</label>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">UAH</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={salePriceUah}
                                                onChange={(e) => setSalePriceUah(e.target.value)}
                                                className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">PLN</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={salePricePln}
                                                onChange={(e) => setSalePricePln(e.target.value)}
                                                className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">EUR</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={salePriceEur}
                                                onChange={(e) => setSalePriceEur(e.target.value)}
                                                className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">USD</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={salePriceUsd}
                                                onChange={(e) => setSalePriceUsd(e.target.value)}
                                                className="w-full border-b border-stone-200 py-2 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </fieldset>



                        <fieldset className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <legend className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900">Metadata</legend>
                                <button
                                    type="button"
                                    onClick={addMetaEntry}
                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand hover:text-brand/70 transition-colors hover:cursor-pointer"
                                >
                                    <Plus size={12} /> Add Field
                                </button>
                            </div>

                            {metaEntries.length === 0 ? (
                                <div className="py-6 text-center border border-dashed border-stone-200 rounded">
                                    <p className="text-xs text-stone-400 mb-2">No metadata fields yet</p>
                                    <button
                                        type="button"
                                        onClick={addMetaEntry}
                                        className="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline hover:cursor-pointer"
                                    >
                                        Add your first field
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {metaEntries.map((entry, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={entry.key}
                                                onChange={(e) => updateMetaEntry(i, "key", e.target.value)}
                                                placeholder="Key (e.g. material)"
                                                className="flex-1 border border-stone-200 rounded px-3 py-2 text-sm font-light text-stone-900 focus:border-brand outline-none transition-colors bg-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={entry.value}
                                                onChange={(e) => updateMetaEntry(i, "value", e.target.value)}
                                                placeholder="Value (e.g. wool)"
                                                className="flex-1 border border-stone-200 rounded px-3 py-2 text-sm font-light text-stone-900 focus:border-brand outline-none transition-colors bg-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeMetaEntry(i)}
                                                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors hover:cursor-pointer flex-shrink-0"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </fieldset>

                        <fieldset className="mb-8">
                            <legend className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900 mb-4 block">
                                Images
                                {isEdit && <span className="normal-case tracking-normal font-normal text-stone-400 ml-2">(read-only after creation)</span>}
                            </legend>

                            {imageUrls.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {imageUrls.map((url, i) => {
                                        if (!url || typeof url !== 'string') return null;
                                        let isValid = false;
                                        try {
                                            new URL(url);
                                            isValid = true;
                                        } catch {
                                            if (url.startsWith("/")) isValid = true;
                                        }

                                        if (!isValid) return null;

                                        return (
                                            <div key={i} className="relative w-20 h-20 bg-stone-100 rounded overflow-hidden group">
                                                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="80px" />
                                                {!isEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:cursor-pointer"
                                                    >
                                                        <X size={16} className="text-white" />
                                                    </button>
                                                )}
                                                {i === 0 && (
                                                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center uppercase tracking-wider py-0.5 font-bold">
                                                        Cover
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {!isEdit && (
                                <>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/avif"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        disabled={uploading}
                                        onClick={() => fileRef.current?.click()}
                                        className="flex items-center gap-2 w-full justify-center px-4 py-3 border border-dashed border-stone-300 rounded text-stone-500 text-[10px] font-bold uppercase tracking-widest hover:border-brand hover:text-brand transition-colors hover:cursor-pointer disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                                        ) : (
                                            <><Upload size={14} /> Upload Images</>
                                        )}
                                    </button>
                                </>
                            )}
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
                                disabled={submitting || uploading}
                                type="submit"
                                className="flex-[2] py-3.5 bg-stone-900 text-white rounded text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all disabled:bg-stone-300 hover:cursor-pointer"
                            >
                                {submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
