"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/data/products";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContex";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter()
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: "M",
      quantity: 1
    });
  };

  return (
    <div
      className="group cursor-pointer animate-fade-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push('/shop/' + product.id)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-sm">
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 bg-brand/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 uppercase tracking-[0.2em]">
            New In
          </span>
        )}

        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-700 ease-in-out ${isHovered && product.images[1] ? "opacity-0" : "opacity-100"
            }`}
        />

        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate`}
            fill
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
            <p className="text-[9px] text-stone-400 uppercase tracking-[0.2em] font-sans mb-1">
              {product.category}
            </p>
            <h3 className="font-serif text-base md:text-lg text-stone-800 leading-tight group-hover:text-brand transition-colors duration-300">
              {product.name}
            </h3>
          </div>
          <span className="font-sans text-sm font-light text-stone-500">
            {product.price} {product.currency}
          </span>
        </div>
      </div>
    </div>
  );
}