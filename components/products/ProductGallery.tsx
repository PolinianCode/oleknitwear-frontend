"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const nextImg = () => setActiveIdx((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <div className="relative group aspect-[3/4] w-full overflow-hidden bg-stone-100 border border-stone-50">

        <button
          onClick={prevImg}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronLeft size={20} className="text-stone-900" />
        </button>

        <button
          onClick={nextImg}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronRight size={20} className="text-stone-900" />
        </button>

        <div
          className="relative w-full h-full cursor-zoom-in"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={images[activeIdx]}
            alt={`${name} - view ${activeIdx + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover transition-transform duration-200 ease-out"
            style={{
              transform: isHovered ? "scale(2)" : "scale(1)",
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-2"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 md:w-24 aspect-[3/4] flex-shrink-0 snap-start transition-all duration-300 ${activeIdx === idx
                ? "ring-1 ring-stone-900 opacity-100"
                : "opacity-40 hover:opacity-100"
                }`}
            >
              <Image
                src={img}
                alt={`${name} thumb ${idx}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 md:hidden mt-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 transition-all duration-300 ${activeIdx === idx ? "w-6 bg-stone-900" : "w-1.5 bg-stone-200"
              }`}
          />
        ))}
      </div>
    </div>
  );
}