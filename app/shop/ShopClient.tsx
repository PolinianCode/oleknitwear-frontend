"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import ProductCard from "@/components/products/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Pagination } from "@/components/Pagination";
import type { ApiProduct, ApiCategory } from "@/lib/api/types";

const PER_PAGE = 9;

const FilterLabel = ({ title }: { title: string }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-900">{title}</h3>
);

interface ShopClientProps {
  products: ApiProduct[];
  categories: ApiCategory[];
  initialCategory?: string;
}

export default function ShopClient({ products, categories, initialCategory }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all");
  const [showNew, setShowNew] = useState(false);
  const [showSale, setShowSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (initialCategory && categories.length > 0) {
      const match = categories.find(c => c.slug === initialCategory);
      if (match) {
        setActiveCategory(match.slug);
      }
    }
  }, [initialCategory, categories]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat) {
        result = result.filter((p) => String(p.category_id) === String(cat.id));
      }
    }

    if (showNew) {
      result = result.filter(p => p.is_new);
    }

    if (showSale) {
      result = result.filter(p => p.is_sale);
    }

    if (showInStock) {
      result = result.filter(p => p.is_in_stock);
    }

    if (showPreOrder) {
      result = result.filter(p => p.is_pre_order);
    }

    return result;
  }, [activeCategory, showNew, showSale, showInStock, showPreOrder, products, categories]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, showNew, showSale, showInStock, showPreOrder]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const safePage = Math.min(page, totalPages || 1);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

            <div>
              <FilterLabel title="Collection" />
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowNew(!showNew)}
                  className={`text-left text-sm transition-colors cursor-pointer flex items-center justify-between group ${showNew ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
                >
                  New Arrivals
                  <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${showNew ? "bg-brand border-brand" : "border-stone-300 group-hover:border-stone-400"}`}>
                    {showNew && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
                <button
                  onClick={() => setShowSale(!showSale)}
                  className={`text-left text-sm transition-colors cursor-pointer flex items-center justify-between group ${showSale ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
                >
                  On Sale
                  <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${showSale ? "bg-brand border-brand" : "border-stone-300 group-hover:border-stone-400"}`}>
                    {showSale && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <FilterLabel title="Availability" />
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const newVal = !showInStock;
                    setShowInStock(newVal);
                    if (newVal) setShowPreOrder(false);
                  }}
                  className={`text-left text-sm transition-colors cursor-pointer flex items-center justify-between group ${showInStock ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
                >
                  In Stock
                  <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${showInStock ? "bg-brand border-brand" : "border-stone-300 group-hover:border-stone-400"}`}>
                    {showInStock && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
                <button
                  onClick={() => {
                    const newVal = !showPreOrder;
                    setShowPreOrder(newVal);
                    if (newVal) setShowInStock(false);
                  }}
                  className={`text-left text-sm transition-colors cursor-pointer flex items-center justify-between group ${showPreOrder ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
                >
                  Pre-Order
                  <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${showPreOrder ? "bg-brand border-brand" : "border-stone-300 group-hover:border-stone-400"}`}>
                    {showPreOrder && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveCategory("all");
                setShowNew(false);
                setShowSale(false);
                setShowInStock(false);
                setShowPreOrder(false);
              }}
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

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-400">Collection</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowNew(!showNew)}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${showNew
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  New Arrivals
                </button>
                <button
                  onClick={() => setShowSale(!showSale)}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${showSale
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  On Sale
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-400">Availability</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const newVal = !showInStock;
                    setShowInStock(newVal);
                    if (newVal) setShowPreOrder(false);
                  }}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${showInStock
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  In Stock
                </button>
                <button
                  onClick={() => {
                    const newVal = !showPreOrder;
                    setShowPreOrder(newVal);
                    if (newVal) setShowInStock(false);
                  }}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${showPreOrder
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  Pre-Order
                </button>
              </div>
            </section>

            <button
              onClick={() => {
                setActiveCategory("all");
                setShowNew(false);
                setShowSale(false);
                setShowInStock(false);
                setShowPreOrder(false);
              }}
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
