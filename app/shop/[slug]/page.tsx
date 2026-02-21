"use client";

import { useState, use, useEffect } from "react";
import { useProducts, useCategories } from "@/lib/api/hooks";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { Heart, Minus, Plus } from "lucide-react";
import ProductGallery from "@/components/products/ProductGallery";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const productSlug = resolvedParams.slug;
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, isLoading: isWishlistLoading } = useWishlist();
  const { getPrice, currency } = useCurrency();

  const product = products.find((p) => p.slug === productSlug);

  const images = product?.product_images
    ?.sort((a, b) => a.sort_order - b.sort_order)
    .map(img => img.url) ?? [];

  const category = categories.find(c => String(c.id) === String(product?.category_id));

  const priceInfo = product ? getPrice(product) : null;

  const inWishlist = product ? isInWishlist(String(product.id)) : false;

  const handleAddToCart = () => {
    if (!product || !priceInfo) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: priceInfo.salePrice ?? priceInfo.price,
      quantity: quantity,
      image: images[0] || "/images/placeholder.png",
    });
  };

  useEffect(() => {
    if (product) {
      const recentlyViewed: string[] = JSON.parse(localStorage.getItem("recently_viewed") || "[]");

      const updatedList = [
        product.slug,
        ...recentlyViewed.filter((slug) => slug !== product.slug)
      ].slice(0, 4);

      localStorage.setItem("recently_viewed", JSON.stringify(updatedList));
    }
  }, [product]);

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen pt-24 md:pt-32 pb-20 font-sans">
        <div className="container mx-auto px-4 text-center py-20 font-serif italic text-stone-400 text-xl">
          Loading...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-white min-h-screen pt-24 md:pt-32 pb-20 font-sans">
        <div className="container mx-auto px-4 text-center py-20 font-serif italic text-stone-400 text-xl">
          Product not found.
        </div>
      </main>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images.map(img => img.startsWith("http") ? img : `${siteUrl}${img}`),
    "description": product.description || `${product.name} — handmade luxury knitwear by Ole Knitwear.`,
    "brand": {
      "@type": "Brand",
      "name": "Ole Knitwear",
      "url": siteUrl,
    },
    "category": category?.name,
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/shop/${product.slug}`,
      "priceCurrency": currency,
      "price": priceInfo!.salePrice ?? priceInfo!.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Ole Knitwear",
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD",
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 14,
            "maxValue": 21,
            "unitCode": "DAY",
          },
        },
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Shop", "item": `${siteUrl}/shop` },
      ...(category ? [{ "@type": "ListItem", "position": 3, "name": category.name, "item": `${siteUrl}/shop?cat=${category.slug}` }] : []),
      { "@type": "ListItem", "position": category ? 4 : 3, "name": product.name },
    ],
  };

  return (
    <main className="bg-white min-h-screen pt-24 md:pt-32 pb-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
                  {priceInfo!.salePrice ? (
                    <>
                      <p className="text-2xl font-light text-red-500">
                        {priceInfo!.symbol}{priceInfo!.salePrice}
                      </p>
                      <p className="text-lg font-light text-stone-400 line-through">
                        {priceInfo!.symbol}{priceInfo!.price}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-light text-stone-600">
                      {priceInfo!.symbol}{priceInfo!.price}
                    </p>
                  )}
                </div>
              </header>

              {product.description && (
                <p className="text-stone-500 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Select Size</span>
                  <button className="text-[10px] text-brand border-b border-brand pb-0.5">Size Guide</button>
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
      <RecentlyViewed currentProductSlug={product.slug} />
    </main>
  );
}
