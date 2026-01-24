"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from 'embla-carousel-autoplay';
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface HeroSliderProps {
    slides: {
        id: number;
        src: string;
        alt: string;
        title?: string;
        subtitle?: string;
        buttonText?: string;
        buttonLink?: string;
        buttonAction?: () => ({});
    }[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, duration: 40 }, 
        [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    return (
        <section className="relative w-full h-screen h-[100svh] overflow-hidden bg-stone-100" ref={emblaRef}>
            <div className="flex h-full">
                {slides.map((slide, index) => (
                    <div className="relative flex-[0_0_100%] min-w-0 h-full" key={slide.id}>
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                        
                        <Image 
                            src={slide.src} 
                            alt={slide.alt} 
                            fill 
                            priority={index === 0}
                            className="object-cover"
                        />

                        <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-4 text-center text-white">
                            {slide.subtitle && (
                                <span className="mb-3 text-xs uppercase tracking-[0.3em] opacity-90 font-sans">
                                    {slide.subtitle}
                                </span>
                            )}
                            <h2 className="max-w-3xl text-4xl md:text-6xl font-serif mb-8 leading-tight">
                                {slide.title}
                            </h2>
                            <button className="group relative overflow-hidden bg-white px-8 py-3.5 rounded-full text-stone-900 transition-all hover:pr-12 active:scale-95">
                                <span className="font-medium">Смотреть коллекцию</span>
                                <span className="absolute right-4 opacity-0 transition-all group-hover:opacity-100"> → </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${
                            index === selectedIndex 
                            ? "w-10 bg-white" 
                            : "w-2 bg-white/40 hover:bg-white/60"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}