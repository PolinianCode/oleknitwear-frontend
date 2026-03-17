import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShopClient from "./ShopClient";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com";

interface ShopSearchParams {
  cat?: string;
  page?: string;
  is_new?: string;
  is_sale?: string;
  is_in_stock?: string;
  is_pre_order?: string;
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopSearchParams> }) {
  const [categories, params] = await Promise.all([
    getCategories(),
    searchParams,
  ]);

  const page = Math.max(1, Number(params.page) || 1);
  const categorySlug = params.cat;
  const isNew = params.is_new === "true";
  const isSale = params.is_sale === "true";
  const isInStock = params.is_in_stock === "true";
  const isPreOrder = params.is_pre_order === "true";

  const matchedCategory = categorySlug ? categories.find(c => c.slug === categorySlug) : undefined;
  const categoryId = matchedCategory ? Number(matchedCategory.id) : undefined;

  const { data: products, meta } = await getProducts({
    page,
    limit: 10,
    categoryId,
    isNew: isNew || undefined,
    isSale: isSale || undefined,
    isInStock: isInStock || undefined,
    isPreOrder: isPreOrder || undefined,
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ole Knitwear Collection",
    "url": `${siteUrl}/shop`,
    "numberOfItems": meta.total,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": (page - 1) * 10 + index + 1,
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
        <ShopClient
          products={products}
          categories={categories}
          meta={meta}
          currentFilters={{
            category: categorySlug || "all",
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
