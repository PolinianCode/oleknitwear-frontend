"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useMemo } from "react";
import ProductCard from "@/components/products/ProductCard";
import { SlidersHorizontal, X, Check } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSearchParams } from "next/navigation";

const FilterLabel = ({ title }: { title: string }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-900">{title}</h3>
);

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("cat");

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "All");
  const [activeLength, setActiveLength] = useState<string | null>(null);
  const [activeSeason, setActiveSeason] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchLength = !activeLength || p.length === activeLength;
      const matchSeason = !activeSeason || p.season === activeSeason;
      const matchStatus = !activeStatus || p.status === activeStatus;
      return matchCat && matchLength && matchSeason && matchStatus;
    });
  }, [activeCategory, activeLength, activeSeason, activeStatus]);

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Breadcrumbs className="mb-6" />
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-12">The <span className="italic">Shop</span></h1>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* DESKTOP */}
          <aside className="hidden lg:block w-64 space-y-12 animate-fade-in">

            <div>
              <FilterLabel title="Category" />
              <div className="flex flex-col gap-3">
                {["All", "Cardigans", "Sweaters", "Accessories"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left text-sm transition-colors cursor-pointer ${activeCategory === cat ? "text-brand font-medium" : "text-stone-500 hover:text-stone-900"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FilterLabel title="Length" />
              <div className="flex flex-col gap-3">
                <FilterButton label="Long" active={activeLength === 'long'} onClick={() => setActiveLength(activeLength === 'long' ? null : 'long')} />
                <FilterButton label="Short" active={activeLength === 'short'} onClick={() => setActiveLength(activeLength === 'short' ? null : 'short')} />
              </div>
            </div>

            <div>
              <FilterLabel title="Season" />
              <div className="flex flex-col gap-3">
                <FilterButton label="Winter / Autumn" active={activeSeason === 'winter/autumn'} onClick={() => setActiveSeason(activeSeason === 'winter/autumn' ? null : 'winter/autumn')} />
                <FilterButton label="Summer / Spring" active={activeSeason === 'summer/spring'} onClick={() => setActiveSeason(activeSeason === 'summer/spring' ? null : 'summer/spring')} />
              </div>
            </div>

            <div>
              <FilterLabel title="Availability" />
              <div className="flex flex-col gap-3">
                <FilterButton label="In Stock" active={activeStatus === 'in-stock'} onClick={() => setActiveStatus(activeStatus === 'in-stock' ? null : 'in-stock')} />
                <FilterButton label="Pre-order" active={activeStatus === 'pre-order'} onClick={() => setActiveStatus(activeStatus === 'pre-order' ? null : 'pre-order')} />
              </div>
            </div>

            <button
              onClick={() => { setActiveCategory("All"); setActiveLength(null); setActiveSeason(null); setActiveStatus(null); }}
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
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 font-serif italic text-stone-400 text-xl">
                No items match your selection.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
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
                {["All", "Cardigans", "Sweaters", "Accessories"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-sans rounded-full border transition-all ${activeCategory === cat
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-500 border-stone-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-400">Length</h3>
              <div className="space-y-3">
                <FilterButton label="Long" active={activeLength === 'long'} onClick={() => setActiveLength(activeLength === 'long' ? null : 'long')} />
                <FilterButton label="Short" active={activeLength === 'short'} onClick={() => setActiveLength(activeLength === 'short' ? null : 'short')} />
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-400">Season</h3>
              <div className="space-y-3">
                <FilterButton label="Winter / Autumn" active={activeSeason === 'winter/autumn'} onClick={() => setActiveSeason(activeSeason === 'winter/autumn' ? null : 'winter/autumn')} />
                <FilterButton label="Summer / Spring" active={activeSeason === 'summer/spring'} onClick={() => setActiveSeason(activeSeason === 'summer/spring' ? null : 'summer/spring')} />
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-stone-400">Availability</h3>
              <div className="space-y-3">
                <FilterButton label="In Stock" active={activeStatus === 'in-stock'} onClick={() => setActiveStatus(activeStatus === 'in-stock' ? null : 'in-stock')} />
                <FilterButton label="Pre-order" active={activeStatus === 'pre-order'} onClick={() => setActiveStatus(activeStatus === 'pre-order' ? null : 'pre-order')} />
              </div>
            </section>

            <button
              onClick={() => { setActiveCategory("All"); setActiveLength(null); setActiveSeason(null); setActiveStatus(null); }}
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

function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 text-sm transition-all cursor-pointer ${active ? "text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
    >
      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${active ? "bg-brand border-brand" : "border-stone-300"}`}>
        {active && <Check size={10} className="text-white" />}
      </div>
      <span className={active ? "font-medium" : "font-normal"}>{label}</span>
    </button>
  );
}