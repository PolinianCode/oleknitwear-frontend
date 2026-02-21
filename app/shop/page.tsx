"use client";

import { Suspense, useState, useMemo, useEffect, useCallback } from "react";
import { useProducts, useCategories } from "@/lib/api/hooks";
import ProductCard from "@/components/products/ProductCard";
import { SlidersHorizontal, X, Check } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Pagination } from "@/components/Pagination";
import { useSearchParams } from "next/navigation";

const PER_PAGE = 9;

const FilterLabel = ({ title }: { title: string }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-900">{title}</h3>
);

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("cat");

  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (categoryFromUrl && categories.length > 0) {
      const match = categories.find(c => c.slug === categoryFromUrl);
      if (match) {
        setActiveCategory(match.slug);
      }
    }
  }, [categoryFromUrl, categories]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    const cat = categories.find(c => c.slug === activeCategory);
    if (!cat) return products;
    return products.filter((p) => String(p.category_id) === String(cat.id));
  }, [activeCategory, products, categories]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const safePage = Math.min(page, totalPages || 1);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isLoading = productsLoading || categoriesLoading;

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Breadcrumbs className="mb-6" />
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-12">The <span className="italic">Shop</span></h1>

        <div className="flex flex-col lg:flex-row gap-12">

          <aside className="hidden lg:block w-64 space-y-12 animate-fade-in">

            <div>
              <FilterLabel title="Category" />
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`text-left text-sm transition-colors cursor-pointer ${activeCategory === "all" ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`text-left text-sm transition-colors cursor-pointer ${activeCategory === cat.slug ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setActiveCategory("all"); }}
              className="text-[9px] uppercase tracking-widest text-stone-400 hover:text-brand border-b border-stone-200 pb-1 transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          </aside>

          <div className="flex-1">
            <button
              onClick={() => setIsFilterMobileOpen(true)}
              className="lg:hidden flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-8 py-2 px-4 border border-stone-200 rounded-full cursor-pointer"
            >
              <SlidersHorizontal size={14} /> Filter & Sort
            </button>

            {isLoading ? (
              <div className="text-center py-20 font-serif italic text-stone-400 text-xl">
                Loading products...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} categories={categories} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-20 font-serif italic text-stone-400 text-xl">
                    No items match your selection.
                  </div>
                )}

                <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            )}
          </div>
        </div>
      </div>

      {isFilterMobileOpen && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-fadeIn flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-stone-100">
            <h2 className="font-serif text-2xl italic">Filters</h2>
            <button
              onClick={() => setIsFilterMobileOpen(false)}
              className="p-2 cursor-pointer hover:bg-stone-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-10 pb-32">

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-400">Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${activeCategory === "all"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${activeCategory === cat.slug
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-500 border-stone-200"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={() => { setActiveCategory("all"); }}
              className="w-full text-[10px] uppercase tracking-widest text-brand font-bold py-4 border-t border-stone-100 mt-4"
            >
              Clear all filters
            </button>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100">
            <button
              onClick={() => setIsFilterMobileOpen(false)}
              className="w-full bg-brand text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
