"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useCategories } from "@/lib/api/hooks";
import { useCurrency, type CurrencyCode } from "@/app/context/CurrencyContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, ChevronDown, Menu, X, User, LogOut, Shield } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsCartOpen, cart } = useCart();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(true);
  const { categories } = useCategories();

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

  const currencies: CurrencyCode[] = ["PLN", "UAH", "USD", "EUR"];

  const headerBg = isMenuOpen
    ? "bg-white"
    : isHome
      ? (isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5")
      : "bg-white/95 backdrop-blur-sm shadow-sm py-3 border-b border-stone-100";

  const textColor = "text-stone-900";

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
          <div
            className="relative"
            onMouseEnter={() => setIsShopDropdownOpen(true)}
            onMouseLeave={() => setIsShopDropdownOpen(false)}
          >
            <Link href="/shop" className="flex items-center gap-1 hover:text-brand transition-colors">
              Shop
              <ChevronDown
                size={12}
                className={`transition-transform duration-300 ${isShopDropdownOpen ? "rotate-180" : ""}`}
              />
            </Link>

            <div className={`absolute left-0 top-full pt-3 transition-all duration-200 ${isShopDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}`}>
              <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-stone-100 min-w-[180px] py-1">
                <Link
                  href="/shop"
                  className={`block px-5 py-3 text-[11px] uppercase tracking-widest transition-colors ${pathname === "/shop" ? "text-brand bg-stone-50" : "text-stone-600 hover:bg-stone-50 hover:text-brand"}`}
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?cat=${cat.slug}`}
                    className="block px-5 py-3 text-[11px] uppercase tracking-widest text-stone-600 hover:bg-stone-50 hover:text-brand transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/care" className="hover:text-brand transition-colors">Care Guide</Link>
          <Link href="/contact-us" className="hover:text-brand transition-colors">Contact Us</Link>
        </nav>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <div className="relative w-[100px] h-[40px] md:w-[120px] md:h-[45px]">
              <Image
                src="/images/logo.png"
                alt="Ole Knitwear Logotype"
                fill
                className={`object-contain transition-all duration-300`}
                priority
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-6">

          {!authLoading && (
            <Link
              href={user ? (user.role === "admin" ? "/admin" : "/profile") : "/login"}
              className="hidden md:flex items-center group"
              title={user ? user.email : "Sign in"}
            >
              <User
                size={20}
                strokeWidth={1.5}
                className={`transition-colors ${user ? "text-brand" : "group-hover:text-brand"}`}
              />
            </Link>
          )}

          <button className="relative group flex items-center" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag
              size={20}
              strokeWidth={1.5}
              className="group-hover:text-brand transition-colors"
            />
            <span className={`absolute -top-2 -right-2 bg-brand text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-transform group-hover:scale-110`}>
              {cart.length}
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
                  {currencies.map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[12px] uppercase tracking-widest transition-colors flex hover:cursor-pointer justify-between items-center ${currency === code ? "text-brand bg-stone-50" : "text-stone-600 hover:bg-stone-50 hover:text-brand"
                        }`}
                    >
                      <span>{code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
      <div className={`
        fixed inset-0 top-0 bg-white z-70 transition-transform duration-500 ease-in-out md:hidden overflow-auto
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:cursor-pointer">
            <X size={28} className="text-stone-900" />
          </button>
        </div>

        <nav className="flex flex-col p-8 gap-8 mt-10">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center justify-between">
              <Link href="/shop" className="text-3xl font-serif text-stone-900">Shop</Link>
              <button
                onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                className="p-2 hover:cursor-pointer"
              >
                <ChevronDown
                  size={22}
                  className={`text-stone-400 transition-transform duration-300 ${isMobileShopOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isMobileShopOpen ? "max-h-60 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-col gap-3 pl-4">
                <Link href="/shop" className="text-base text-stone-500 hover:text-brand transition-colors">
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?cat=${cat.slug}`}
                    className="text-base text-stone-500 hover:text-brand transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/care" className="text-3xl font-serif text-stone-900 border-b border-stone-100 pb-4">Care Guide</Link>
          <Link href="/contact-us" className="text-3xl font-serif text-stone-900 border-b border-stone-100 pb-4">Contact Us</Link>

          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-6">Change Currency</p>
            <div className="flex gap-6">
              {currencies.map(code => (
                <button
                  key={code}
                  onClick={() => { setCurrency(code); setIsMenuOpen(false); }}
                  className={`text-sm font-bold tracking-widest ${currency === code ? "text-brand border-b-2 border-brand" : "text-stone-500"}`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {!authLoading && (
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-6">Account</p>
              {user ? (
                <div className="space-y-4">
                  <Link href="/profile" className="flex items-center gap-3 text-sm text-stone-600 hover:text-brand transition-colors">
                    <User size={16} className="text-brand" />
                    <span>{user.full_name || user.email}</span>
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="flex items-center gap-3 text-sm text-stone-900 font-medium hover:text-brand transition-colors">
                      <Shield size={16} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={async () => { await logout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-sm text-stone-500 hover:text-red-600 transition-colors hover:cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link href="/login" className="flex items-center gap-3 text-sm text-stone-900 font-medium hover:text-brand transition-colors">
                    <User size={16} />
                    Sign In
                  </Link>
                  <Link href="/register" className="flex items-center gap-3 text-sm text-stone-500 hover:text-brand transition-colors">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}