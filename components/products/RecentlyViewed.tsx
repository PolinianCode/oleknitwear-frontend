"use client";
import { useEffect, useState } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({ currentProductId }: { currentProductId?: number }) {
    const [viewedProducts, setViewedProducts] = useState<any[]>([]);

    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
        const filteredIds = ids.filter((id: number) => id !== currentProductId);
        const foundProducts = filteredIds
            .map((id: number) => products.find(p => p.id === id))
            .filter(Boolean);
        setViewedProducts(foundProducts);
    }, [currentProductId]);

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
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}