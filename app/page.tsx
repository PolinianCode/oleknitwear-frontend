import Advantages from "@/components/Advantages"
import FeaturedCollection from "@/components/FeaturedCollection"
import HeroSlider from "@/components/HeroSlider"
import OurHistory from "@/components/OurHistory"
import { getFeaturedProducts } from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"

const slides = [
  {
    id: 1,
    src: "/images/slide3.png",
    alt: "Woman wearing a cozy hand-knitted sweater by Ole Knitwear",
    title: "Warmth You Can Feel",
    subtitle: "HANDMADE WITH LOVE",
    buttonText: "Shop Collection",
    buttonLink: '/shop',
    isButtonPresent: true,
  },
  {
    id: 2,
    src: "/images/slide2.png",
    alt: "Close-up of soft handmade wool knitwear texture",
    title: "Soft Handmade Wool",
    subtitle: "PREMIUM MATERIALS",
    buttonText: "Explore care",
    isButtonPresent: true,
    buttonLink: '/care'
  }
]

export default async function Home() {
  let products: import("@/lib/api/types").ApiProduct[] = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    [products, categories] = await Promise.all([
      getFeaturedProducts(),
      getCategories(),
    ]);
  } catch {
    // API unavailable, render page without featured products
  }

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ole Knitwear",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "description": "Handcrafted luxury knitwear made in Ukraine. Bespoke cardigans, sweaters, and accessories from premium wool.",
    "foundingDate": "2023",
    "areaServed": ["UA", "PL", "US", "EU"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UA",
    },
    "sameAs": [
      "https://instagram.com/ole.knitwear",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "ole.knitting@gmail.com",
      "url": `${siteUrl}/contact-us`,
    },
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ole Knitwear",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <h1 className="sr-only">Handmade Luxury Knitwear — Ole Knitwear, Crafted in Ukraine</h1>
      <HeroSlider slides={slides} />
      <FeaturedCollection products={products} categories={categories} />
      <OurHistory />
      <Advantages />
    </>
  )
}