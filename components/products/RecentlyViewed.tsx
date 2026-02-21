"use client";
import { useEffect, useState } from "react";
import { useProducts, useCategories } from "@/lib/api/hooks";
import type { ApiProduct } from "@/lib/api/types";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({ currentProductSlug }: { currentProductSlug?: string }) {
    const { products } = useProducts();
    const { categories } = useCategories();
    const [viewedProducts, setViewedProducts] = useState<ApiProduct[]>([]);

    useEffect(() => {
        if (products.length === 0) return;
        const slugs: string[] = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
        const filteredSlugs = slugs.filter((slug) => slug !== currentProductSlug);
        const foundProducts = filteredSlugs
            .map((slug) => products.find(p => p.slug === slug))
            .filter((p): p is ApiProduct => !!p);
        setViewedProducts(foundProducts);
    }, [currentProductSlug, products]);

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
