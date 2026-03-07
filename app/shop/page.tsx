import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShopClient from "./ShopClient";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const [products, categories, params] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ole Knitwear Collection",
    "url": `${siteUrl}/shop`,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${siteUrl}/shop/${product.slug}`,
      "name": product.name,
    })),
  };

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <Breadcrumbs className="mb-6" />
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-4">The <span className="italic">Shop</span></h1>
        <p className="text-stone-500 font-sans text-sm leading-relaxed max-w-2xl mb-12">
          Discover our collection of handcrafted luxury knitwear. Each piece is hand-knitted from premium Italian wool in our family workshop in Ukraine. Free worldwide shipping on every order.
        </p>
        <ShopClient products={products} categories={categories} initialCategory={params.cat} />
      </div>
    </main>
  );
}
