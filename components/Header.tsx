"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, ChevronDown, Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currencies = [
    { code: "PLN" },
    { code: "UAH" },
    { code: "USD" },
  ];

  const headerBg = isMenuOpen
    ? "bg-white"
    : isHome
      ? (isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5")
      : "bg-white/95 backdrop-blur-sm shadow-sm py-3 border-b border-stone-100";

  const textColor = isHome && !isScrolled ? "text-stone-900" : "text-stone-900";

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 font-sans ${headerBg} ${textColor}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between relative">

        <button
          className="md:hidden p-2 -ml-2 hover:cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex items-center gap-8 text-[12px] uppercase tracking-[0.2em] font-bold">
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

          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 text-[12px] font-bold tracking-widest uppercase hover:text-brand transition-colors hover:cursor-pointer"
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
                      className={`w-full text-left px-4 py-3 text-[12px] uppercase tracking-widest transition-colors flex hover:cursor-pointer justify-between items-center ${currency === item.code ? "text-brand bg-stone-50" : "text-stone-600 hover:bg-stone-50 hover:text-brand"
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
      <div className={`
        fixed inset-0 top-0 bg-white z-70 transition-transform duration-500 ease-in-out md:hidden
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:cursor-pointer">
            <X size={28} className="text-stone-900" />
          </button>
        </div>

        <nav className="flex flex-col p-8 gap-8 mt-10">
          <Link href="/shop" className="text-3xl font-serif text-stone-900 border-b border-stone-100 pb-4">Shop</Link>
          <Link href="/care" className="text-3xl font-serif text-stone-900 border-b border-stone-100 pb-4">Care Guide</Link>

          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-6">Change Currency</p>
            <div className="flex gap-6">
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setIsMenuOpen(false); }}
                  className={`text-sm font-bold tracking-widest ${currency === c.code ? "text-brand border-b-2 border-brand" : "text-stone-500"}`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}