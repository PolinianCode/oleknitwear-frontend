"use client";

import { products } from "@/data/products";
import { useState, use } from "react";
import { useCart } from "@/app/context/CartContex";
import Link from "next/link"
import { ChevronRight, Heart, Minus, Plus } from "lucide-react";
import ProductGallery from "@/components/products/ProductGallery";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const product = products.find((p) => p.id === Number(productId)) || products[0];
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
      image: product.images[0],
    });
  };

  const sizes = ["S", "M", "L", "Custom"];

  return (
    <main className="bg-white min-h-screen pt-24 md:pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">

        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 mb-8">
          <Link href="/shop">Shop</Link> <ChevronRight size={10} />
          <Link href={`/shop?cat=${product.category}`}>{product.category}</Link> <ChevronRight size={10} />
          <span className="text-stone-900">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">

          <div className="flex-1 space-y-4">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div className="lg:w-[400px]">
            <div className="lg:sticky lg:top-32 space-y-8">

              <header className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-2xl font-light text-stone-600">
                  {product.price} {product.currency}
                </p>
              </header>

              <p className="text-stone-500 text-sm leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Select Size</span>
                  <button className="text-[10px] text-brand border-b border-brand pb-0.5">Size Guide</button>
                </div>
                <div className="flex gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 text-xs border transition-all duration-300 ${selectedSize === size
                        ? "bg-stone-900 text-white border-stone-900"
                        : "border-stone-200 text-stone-500 hover:border-stone-900"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center border border-stone-200 px-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2"><Plus size={14} /></button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-brand text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 shadow-lg">
                  Add to Bag
                </button>
                <button className="p-4 border border-stone-200 hover:bg-stone-50 transition-colors">
                  <Heart size={20} className="text-stone-400" />
                </button>
              </div>

              <div className="border-t border-stone-100 pt-6 space-y-4">
                <details className="group cursor-pointer">
                  <summary className="flex justify-between items-center list-none text-[10px] font-bold uppercase tracking-widest">
                    Composition & Care <Plus size={12} className="group-open:rotate-45 transition-transform" />
                  </summary>
                  <p className="mt-4 text-sm text-stone-500 leading-relaxed font-sans">
                    100% Peruvian Highland Wool. Hand wash only in cool water with delicate detergent. Dry flat.
                  </p>
                </details>
                <div className="h-[1px] bg-stone-100" />
                <details className="group cursor-pointer">
                  <summary className="flex justify-between items-center list-none text-[10px] font-bold uppercase tracking-widest">
                    Shipping & Returns <Plus size={12} className="group-open:rotate-45 transition-transform" />
                  </summary>
                  <p className="mt-4 text-sm text-stone-500 leading-relaxed">
                    Free worldwide shipping on orders over €400. Each piece is knitted to order; please allow 2-3 weeks for crafting.
                  </p>
                </details>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}