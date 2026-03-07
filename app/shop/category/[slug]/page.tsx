import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShopClient from "../../ShopClient";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [products, categories, { slug }] = await Promise.all([
    getProducts(),
    getCategories(),
    params,
  ]);

  const category = categories.find(c => c.slug === slug);

  const categoryProducts = category
    ? products.filter(p => String(p.category_id) === String(category.id))
    : [];

  const itemListJsonLd = category ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} — Ole Knitwear`,
    "url": `${siteUrl}/shop/category/${category.slug}`,
    "description": category.description || `Browse our handcrafted ${category.name.toLowerCase()} collection.`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categoryProducts.length,
      "itemListElement": categoryProducts.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${siteUrl}/shop/${product.slug}`,
        "name": product.name,
      })),
    },
  } : null;

  const heading = category?.name || "Shop";
  const description = category?.description || (category ? `Explore our collection of handcrafted ${category.name.toLowerCase()}. Each piece is hand-knitted from premium wool in our family workshop in Ukraine.` : undefined);

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {itemListJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
          />
        )}
        <Breadcrumbs className="mb-6" />
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-4">
          {heading} <span className="italic">Collection</span>
        </h1>
        {description && (
          <p className="text-stone-500 font-sans text-sm leading-relaxed max-w-2xl mb-12">
            {description}
          </p>
        )}
        <ShopClient products={products} categories={categories} initialCategory={slug} />
      </div>
    </main>
  );
}
