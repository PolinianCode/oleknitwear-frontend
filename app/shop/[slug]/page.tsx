import { getProducts, getProductBySlug } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import type { ApiProduct } from "@/lib/api/types";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com";

export async function generateStaticParams() {
  const { data: products } = await getProducts({ limit: 200 });
  return products.map((p) => ({ slug: p.slug }));
}

export const revalidate = 3600;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  let product: ApiProduct;
  try {
    product = await getProductBySlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  const categories = await getCategories();
  const category = categories.find(c => String(c.id) === String(product.category_id));

  const images = product.product_images
    ?.sort((a, b) => a.sort_order - b.sort_order)
    .map(img => img.url) ?? [];

  const isOnSale = product.is_sale && product.sale_price_usd;
  const price = product.price_usd ?? 0;
  const salePrice = isOnSale ? product.sale_price_usd : null;

  let relatedProducts: ApiProduct[] = [];
  if (product.category_id) {
    try {
      const { data: categoryProducts } = await getProducts({ categoryId: product.category_id, limit: 10 });
      relatedProducts = categoryProducts
        .filter(p => p.slug !== product.slug)
        .slice(0, 4);
    } catch {
      // Related products are non-critical
    }
  }

  const availability = product.is_pre_order
    ? "https://schema.org/PreOrder"
    : product.is_in_stock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images.map(img => img.startsWith("http") ? img : `${siteUrl}${img}`),
    "description": product.description || `${product.name} — handmade luxury knitwear by Ole Knitwear.`,
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": "Ole Knitwear",
      "url": siteUrl,
    },
    "category": category?.name,
    ...(product.metadata?.material && { "material": product.metadata.material }),
    ...(product.metadata?.color && { "color": product.metadata.color }),
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/shop/${product.slug}`,
      "priceCurrency": "USD",
      "price": salePrice ?? price,
      ...(isOnSale && { "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }),
      "availability": availability,
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
            "minValue": product.is_pre_order ? 14 : 1,
            "maxValue": product.is_pre_order ? 21 : 3,
            "unitCode": "DAY",
          },
        },
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": ["US", "UA", "PL"],
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
      },
    },
  };

  return (
    <main className="bg-white min-h-screen pt-24 md:pt-32 pb-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} category={category} images={images} relatedProducts={relatedProducts} categories={categories} />
    </main>
  );
}
