import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const product = products.find((p) => p.slug === resolvedParams.slug);
  if (!product) notFound();

  const category = categories.find(c => String(c.id) === String(product.category_id));

  const images = product.product_images
    ?.sort((a, b) => a.sort_order - b.sort_order)
    .map(img => img.url) ?? [];

  const isOnSale = product.is_sale && product.sale_price_usd;
  const price = product.price_usd ?? 0;
  const salePrice = isOnSale ? product.sale_price_usd : null;

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
      "priceCurrency": "USD",
      "price": salePrice ?? price,
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
      <ProductClient product={product} category={category} images={images} />
    </main>
  );
}
