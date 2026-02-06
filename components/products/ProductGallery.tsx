"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setActiveIdx(index);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] min-w-full md:min-w-0 snap-center bg-stone-100 group"
            >
              <Image
                src={img}
                alt={`${name} - view ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 transition-all duration-300 ${activeIdx === idx ? "w-6 bg-brand" : "w-2 bg-stone-200"
                }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:flex gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              scrollRef.current?.scrollTo({ left: scrollRef.current.clientWidth * idx, behavior: 'smooth' });
              setActiveIdx(idx);
            }}
            className={`relative w-20 aspect-[3/4] border-b-2 transition-all ${activeIdx === idx ? "border-brand opacity-100" : "border-transparent opacity-50 hover:opacity-100"
              }`}
          >
            <Image src={img} alt="thumbnail" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}