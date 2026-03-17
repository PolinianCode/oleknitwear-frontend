"use client";
import { useEffect, useState } from "react";
import { useCategories } from "@/lib/api/hooks";
import { getProductBySlug } from "@/lib/api/products";
import type { ApiProduct } from "@/lib/api/types";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({ currentProductSlug }: { currentProductSlug?: string }) {
    const { categories } = useCategories();
    const [viewedProducts, setViewedProducts] = useState<ApiProduct[]>([]);

    useEffect(() => {
        const slugs: string[] = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
        const filtered = slugs.filter((s) => s !== currentProductSlug).slice(0, 4);
        if (filtered.length === 0) return;

        Promise.allSettled(filtered.map((slug) => getProductBySlug(slug))).then((results) => {
            const found = results
                .filter((r): r is PromiseFulfilledResult<ApiProduct> => r.status === "fulfilled")
                .map((r) => r.value);
            setViewedProducts(found);
        });
    }, [currentProductSlug]);

    if (viewedProducts.length === 0) return null;

    return (
        <section className="py-12 md:py-20 border-t border-stone-100 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-8 md:mb-12 text-center">
                    Recently Viewed
                </h2>

                <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory">
                    {viewedProducts.map((product) => (
                        <div key={product.id} className="min-w-[200px] w-[70%] md:w-auto snap-start">
                            <ProductCard product={product} categories={categories} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
