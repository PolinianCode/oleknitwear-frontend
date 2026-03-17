"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ApiProduct, ApiCategory } from "@/lib/api/types";
import { useCart } from "@/app/context/CartContext";
import { useCurrency } from "@/app/context/CurrencyContext";

interface ProductCardProps {
  product: ApiProduct;
  categories?: ApiCategory[];
}

export default function ProductCard({ product, categories }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { addToCart } = useCart();
  const { getPrice } = useCurrency();

  const images = product.product_images
    ?.sort((a, b) => a.sort_order - b.sort_order)
    .map(img => img.url) ?? [];

  const categoryName = categories?.find(c => String(c.id) === String(product.category_id))?.name;

  const { price, salePrice, symbol } = getPrice(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice ?? price,
      image: images[0] || "/images/placeholder.png",
      quantity: 1
    });
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group cursor-pointer animate-fade-up block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-sm">
        {product.is_new && (
          <span className="absolute top-4 left-4 z-10 bg-brand/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 uppercase tracking-[0.2em]">
            New In
          </span>
        )}

        {product.is_sale && (
          <span className="absolute top-4 right-4 z-10 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 uppercase tracking-[0.2em]">
            Sale
          </span>
        )}

        {images[0] && (
          <Image
            src={images[0]}
            alt={`${product.name}${categoryName ? ` — Handmade ${categoryName} by Ole Knitwear` : ''}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-700 ease-in-out ${isHovered && images[1] ? "opacity-0" : "opacity-100"
              }`}
          />
        )}

        {images[1] && (
          <Image
            src={images[1]}
            alt={`${product.name} — alternate view`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-700 ease-in-out ${isHovered ? "opacity-100 scale-105" : "opacity-0"
              }`}
          />
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <button onClick={handleQuickAdd} className="w-full bg-white/95 text-stone-900 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-colors duration-300 shadow-xl cursor-pointer">
            Quick Add +
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2 px-1">
        <div className="flex justify-between items-start">
          <div>
            {categoryName && (
              <p className="text-[9px] text-stone-400 uppercase tracking-[0.2em] font-sans mb-1">
                {categoryName}
              </p>
            )}
            <h3 className="font-serif text-base md:text-lg text-stone-800 leading-tight group-hover:text-brand transition-colors duration-300">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            {salePrice ? (
              <>
                <span className="font-sans text-sm font-light text-red-500">
                  {symbol}{salePrice}
                </span>
                <span className="font-sans text-xs font-light text-stone-400 line-through ml-1">
                  {symbol}{price}
                </span>
              </>
            ) : (
              <span className="font-sans text-sm font-light text-stone-500">
                {symbol}{price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
