import Advantages from "@/components/Advantages"
import FeaturedCollection from "@/components/FeaturedCollection"
import HeroSlider from "@/components/HeroSlider"
import OurStory from "@/components/OurHistory"

const slides = [
  {
    id: 1,
    src: "/images/slide3.png",
    alt: "Уютный вязаный свитер",
    title: "Warmth You Can Feel",
    subtitle: "HANDMADE WITH LOVE",
    buttonText: "Shop Collection",
    buttonLink: '/shop',
    isButtonPresent: true,
  },
  {
    id: 2,
    src: "/images/slide2.png",
    alt: "Уютный вязаный свитер",
    title: "Soft Handmaded wool",
    subtitle: "PREMIUM MATERIALS",
    buttonText: "Explore care",
    isButtonPresent: true,
    buttonLink: '/care'
  }
]

export default function Home() {

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "Ole Knitwear",
    "url": "https://ole-knitwear.com",
    "logo": "https://ole-knitwear.com/images/logo.png",
    "sameAs": [
      "https://instagram.com/ole.knitwear",
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSlider slides={slides} />
      <FeaturedCollection />
      <OurStory />
      <Advantages />
    </>
  )
}