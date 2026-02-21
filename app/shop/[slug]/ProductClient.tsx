"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { Heart, Minus, Plus } from "lucide-react";
import ProductGallery from "@/components/products/ProductGallery";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { ApiProduct, ApiCategory } from "@/lib/api/types";

interface ProductClientProps {
  product: ApiProduct;
  category?: ApiCategory;
  images: string[];
}

export default function ProductClient({ product, category, images }: ProductClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, isLoading: isWishlistLoading } = useWishlist();
  const { getPrice } = useCurrency();

  const priceInfo = getPrice(product);
  const inWishlist = isInWishlist(String(product.id));

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: priceInfo.salePrice ?? priceInfo.price,
      quantity: quantity,
      image: images[0] || "/images/placeholder.png",
    });
  };

  useEffect(() => {
    const recentlyViewed: string[] = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
    const updatedList = [
      product.slug,
      ...recentlyViewed.filter((slug) => slug !== product.slug)
    ].slice(0, 4);
    localStorage.setItem("recently_viewed", JSON.stringify(updatedList));
  }, [product.slug]);

  return (
    <>
      <div className="container mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            ...(category ? [{ label: category.name, href: `/shop?cat=${category.slug}` }] : []),
            { label: product.name }
          ]}
          className="mb-8"
        />

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">

          <div className="flex-1 space-y-4">
            <ProductGallery images={images} name={product.name} />
          </div>

          <div className="lg:w-[400px]">
            <div className="lg:sticky lg:top-32 space-y-8">

              <header className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  {priceInfo.salePrice ? (
                    <>
                      <p className="text-2xl font-light text-red-500">
                        {priceInfo.symbol}{priceInfo.salePrice}
                      </p>
                      <p className="text-lg font-light text-stone-400 line-through">
                        {priceInfo.symbol}{priceInfo.price}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-light text-stone-600">
                      {priceInfo.symbol}{priceInfo.price}
                    </p>
                  )}
                </div>
              </header>

              {product.description && (
                <p className="text-stone-500 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="flex gap-4">
                <div className="flex items-center border border-stone-200 px-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2"><Plus size={14} /></button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-brand text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 shadow-lg">
                  Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(String(product.id))}
                  disabled={isWishlistLoading}
                  className={`p-4 border hover:bg-stone-50 transition-colors disabled:opacity-50 hover:cursor-pointer ${inWishlist ? "border-red-200 bg-red-50/50" : "border-stone-200"
                    }`}
                >
                  <Heart size={20} className={`transition-colors ${inWishlist ? 'text-red-500 fill-red-500' : 'text-stone-400'}`} />
                </button>
              </div>

              <div className="border-t border-stone-100 pt-6 space-y-4 pb-4">
                <div className="h-[1px] bg-stone-100" />
                {product.metadata && Object.keys(product.metadata).length > 0 && (
                  <div className="mt-8 space-y-4">
                    {Object.entries(product.metadata).map(([key, value]) => (
                      <details key={key} className="group cursor-pointer">
                        <summary className="flex justify-between items-center list-none text-[10px] font-bold uppercase tracking-widest">
                          {key}
                          <Plus
                            size={12}
                            className="group-open:rotate-45 transition-transform"
                          />
                        </summary>

                        <p className="mt-4 text-sm text-stone-500 leading-relaxed">
                          {value}
                        </p>
                      </details>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      <RecentlyViewed currentProductSlug={product.slug} />
    </>
  );
}
