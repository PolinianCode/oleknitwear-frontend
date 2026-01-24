import Advantages from "@/components/Advantages"
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
  return (
    <>
      <HeroSlider slides={slides} />
      <OurStory />
      <Advantages />
    </>
  )
}