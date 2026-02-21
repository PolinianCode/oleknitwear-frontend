"use client"

import { useProducts, useCategories } from "@/lib/api/hooks";
import ProductCard from "./products/ProductCard";
import { useRouter } from "next/navigation";

export default function FeaturedCollection() {
    const router = useRouter();
    const { products, isLoading } = useProducts();
    const { categories } = useCategories();

    const featuredProducts = products.filter(p => p.featured);
    const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-md">
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Featured Collection</h2>
            <p className="text-stone-500 font-sans text-sm tracking-wide">
              Meticulously handcrafted pieces designed to bring warmth and timeless style to your wardrobe.
            </p>
          </div>
          <button onClick={() => router.push('/shop')} className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-brand text-brand pb-1 hover:opacity-70 transition-opacity">
            View All Products
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 font-serif italic text-stone-400 text-xl">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} categories={categories} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
