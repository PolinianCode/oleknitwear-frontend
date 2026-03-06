import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <ShopClient products={products} categories={categories} initialCategory={params.cat} />
    </>
  );
}
