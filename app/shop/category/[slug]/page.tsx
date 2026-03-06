import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import ShopClient from "../../ShopClient";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [products, categories, { slug }] = await Promise.all([
    getProducts(),
    getCategories(),
    params,
  ]);

  return <ShopClient products={products} categories={categories} initialCategory={slug} />;
}
