import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShopClient from "../../ShopClient";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com";

interface CategorySearchParams {
  page?: string;
  is_new?: string;
  is_sale?: string;
  is_in_stock?: string;
  is_pre_order?: string;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export const revalidate = 3600;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CategorySearchParams>;
}) {
  const [categories, { slug }, sp] = await Promise.all([
    getCategories(),
    params,
    searchParams,
  ]);

  const page = Math.max(1, Number(sp.page) || 1);
  const isNew = sp.is_new === "true";
  const isSale = sp.is_sale === "true";
  const isInStock = sp.is_in_stock === "true";
  const isPreOrder = sp.is_pre_order === "true";

  const category = categories.find(c => c.slug === slug);
  const categoryId = category ? Number(category.id) : undefined;

  const { data: products, meta } = await getProducts({
    page,
    limit: 10,
    categoryId,
    isNew: isNew || undefined,
    isSale: isSale || undefined,
    isInStock: isInStock || undefined,
    isPreOrder: isPreOrder || undefined,
  });

  const itemListJsonLd = category ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} — Ole Knitwear`,
    "url": `${siteUrl}/shop/category/${category.slug}`,
    "description": category.description || `Browse our handcrafted ${category.name.toLowerCase()} collection.`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": meta.total,
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": (page - 1) * 10 + index + 1,
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
        <ShopClient
          products={products}
          categories={categories}
          meta={meta}
          currentFilters={{
            category: slug,
            isNew,
            isSale,
            isInStock,
            isPreOrder,
          }}
        />
      </div>
    </main>
  );
}
