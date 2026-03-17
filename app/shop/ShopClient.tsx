"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import type { ApiProduct, ApiCategory, ApiPaginationMeta } from "@/lib/api/types";

const FilterLabel = ({ title }: { title: string }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-900">{title}</h3>
);

interface CurrentFilters {
  category: string;
  isNew: boolean;
  isSale: boolean;
  isInStock: boolean;
  isPreOrder: boolean;
}

interface ShopClientProps {
  products: ApiProduct[];
  categories: ApiCategory[];
  meta: ApiPaginationMeta;
  currentFilters: CurrentFilters;
}

function buildShopUrl(filters: CurrentFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.category !== "all") params.set("cat", filters.category);
  if (page > 1) params.set("page", String(page));
  if (filters.isNew) params.set("is_new", "true");
  if (filters.isSale) params.set("is_sale", "true");
  if (filters.isInStock) params.set("is_in_stock", "true");
  if (filters.isPreOrder) params.set("is_pre_order", "true");
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default function ShopClient({ products, categories, meta, currentFilters }: ShopClientProps) {
  const router = useRouter();
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<CurrentFilters>(currentFilters);

  const { category: activeCategory, isNew: showNew, isSale: showSale, isInStock: showInStock, isPreOrder: showPreOrder } = currentFilters;

  const navigate = (filters: CurrentFilters, page = 1) => {
    router.push(buildShopUrl(filters, page));
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(currentFilters, page);
  };

  const openMobilePanel = () => {
    setPendingFilters(currentFilters);
    setIsFilterMobileOpen(true);
  };

  const applyMobileFilters = () => {
    navigate(pendingFilters, 1);
    setIsFilterMobileOpen(false);
  };

  const clearAllFilters: CurrentFilters = { category: "all", isNew: false, isSale: false, isInStock: false, isPreOrder: false };

  return (
    <div className="flex-1">
      <div className="flex flex-col lg:flex-row gap-12">

        <aside className="hidden lg:block w-64 space-y-12 animate-fade-in">

          <div>
            <FilterLabel title="Category" />
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate({ ...currentFilters, category: "all" })}
                className={`text-left text-sm transition-colors cursor-pointer ${activeCategory === "all" ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate({ ...currentFilters, category: cat.slug })}
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
                onClick={() => navigate({ ...currentFilters, isNew: !showNew })}
                className={`text-left text-sm transition-colors cursor-pointer flex items-center justify-between group ${showNew ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
              >
                New Arrivals
                <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${showNew ? "bg-brand border-brand" : "border-stone-300 group-hover:border-stone-400"}`}>
                  {showNew && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
              <button
                onClick={() => navigate({ ...currentFilters, isSale: !showSale })}
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
                onClick={() => navigate({ ...currentFilters, isInStock: !showInStock, isPreOrder: !showInStock ? false : showPreOrder })}
                className={`text-left text-sm transition-colors cursor-pointer flex items-center justify-between group ${showInStock ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
              >
                In Stock
                <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${showInStock ? "bg-brand border-brand" : "border-stone-300 group-hover:border-stone-400"}`}>
                  {showInStock && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
              <button
                onClick={() => navigate({ ...currentFilters, isPreOrder: !showPreOrder, isInStock: !showPreOrder ? false : showInStock })}
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
            onClick={() => navigate(clearAllFilters)}
            className="text-[9px] uppercase tracking-widest text-stone-400 hover:text-brand border-b border-stone-200 pb-1 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </aside>

        <div className="flex-1">
          <button
            onClick={openMobilePanel}
            className="lg:hidden flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-8 py-2 px-4 border border-stone-200 rounded-full cursor-pointer"
          >
            <SlidersHorizontal size={14} /> Filter & Sort
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {products.map(product => (
              <ProductCard key={product.id} product={product} categories={categories} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20 font-serif italic text-stone-400 text-xl">
              No items match your selection.
            </div>
          )}

          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
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
                  onClick={() => setPendingFilters(f => ({ ...f, category: "all" }))}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${pendingFilters.category === "all"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setPendingFilters(f => ({ ...f, category: cat.slug }))}
                    className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${pendingFilters.category === cat.slug
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
                  onClick={() => setPendingFilters(f => ({ ...f, isNew: !f.isNew }))}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${pendingFilters.isNew
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  New Arrivals
                </button>
                <button
                  onClick={() => setPendingFilters(f => ({ ...f, isSale: !f.isSale }))}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${pendingFilters.isSale
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
                  onClick={() => setPendingFilters(f => ({ ...f, isInStock: !f.isInStock, isPreOrder: !f.isInStock ? false : f.isPreOrder }))}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${pendingFilters.isInStock
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  In Stock
                </button>
                <button
                  onClick={() => setPendingFilters(f => ({ ...f, isPreOrder: !f.isPreOrder, isInStock: !f.isPreOrder ? false : f.isInStock }))}
                  className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${pendingFilters.isPreOrder
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-500 border-stone-200"
                    }`}
                >
                  Pre-Order
                </button>
              </div>
            </section>

            <button
              onClick={() => setPendingFilters(clearAllFilters)}
              className="w-full text-[10px] uppercase tracking-widest text-brand font-bold py-4 border-t border-stone-100 mt-4"
            >
              Clear all filters
            </button>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100">
            <button
              onClick={applyMobileFilters}
              className="w-full bg-brand text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Show {meta.total} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
