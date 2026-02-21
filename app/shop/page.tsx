import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import ShopClient from "./ShopClient";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const [products, categories, params] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);

  return <ShopClient products={products} categories={categories} initialCategory={params.cat} />;
}
