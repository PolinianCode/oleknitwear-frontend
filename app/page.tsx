import HeroSlider from "@/components/HeroSlider"

const slides = [
  {
    id: 1,
    src: "/images/slide3.png",
    alt: "Уютный вязаный свитер",
    title: "Warmth You Can Feel",
    subtitle: "HANDMADE WITH LOVE"
  },
  {
    id: 2,
    src: "/images/slide2.png",
    alt: "Уютный вязаный свитер",
  }
]

export default function Home() {
  return (
    <>
      <HeroSlider slides={slides} />
    </>
  )
}