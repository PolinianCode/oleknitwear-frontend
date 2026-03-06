import Advantages from "@/components/Advantages"
import FeaturedCollection from "@/components/FeaturedCollection"
import HeroSlider from "@/components/HeroSlider"
import OurHistory from "@/components/OurHistory"
import { getProducts } from "@/lib/api/products"
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
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    [products, categories] = await Promise.all([
      getProducts(),
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
    "sameAs": [
      "https://instagram.com/ole.knitwear",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${siteUrl}/contact-us`,
    },
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ole Knitwear",
    "url": siteUrl,
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
      <HeroSlider slides={slides} />
      <FeaturedCollection products={products} categories={categories} />
      <OurHistory />
      <Advantages />
    </>
  )
}