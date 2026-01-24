"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, ChevronDown } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currencies = [
    { code: "PLN"},
    { code: "UAH"},
    { code: "USD"},
  ];

  const headerBg = isHome 
    ? (isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5") 
    : "bg-white/95 backdrop-blur-sm shadow-sm py-3";

  const textColor = isHome && !isScrolled ? "text-stone-900" : "text-stone-900";

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 font-sans ${headerBg} ${textColor}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        
        <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
          <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
          <Link href="/care" className="hover:text-brand transition-colors">Care Guide</Link>
        </nav>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <div className="relative w-[100px] h-[40px] md:w-[120px] md:h-[45px]">
              <Image 
                src="/images/logo.png" 
                alt="Ole Knitwear Logo" 
                fill
                className={`object-contain transition-all duration-300`}
                priority
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          
          <button className="relative group flex items-center">
            <ShoppingBag 
              size={20} 
              strokeWidth={1.5} 
              className="group-hover:text-brand transition-colors" 
            />
            <span className={`absolute -top-2 -right-2 bg-brand text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-transform group-hover:scale-110`}>
              0
            </span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase hover:text-brand transition-colors hover:cursor-pointer"
            >
              {currency}
              <ChevronDown 
                size={12} 
                className={`transition-transform duration-300 ${isCurrencyOpen ? "rotate-180" : ""}`} 
              />
            </button>

            {isCurrencyOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsCurrencyOpen(false)} />
                
                <div className="absolute right-0 mt-4 bg-white shadow-2xl rounded-xl overflow-hidden border border-stone-100 min-w-[140px] py-1 animate-fadeIn">
                  {currencies.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setCurrency(item.code);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest transition-colors flex hover:cursor-pointer justify-between items-center ${
                        currency === item.code ? "text-brand bg-stone-50" : "text-stone-600 hover:bg-stone-50 hover:text-brand"
                      }`}
                    >
                      <span>{item.code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}