import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FreeDelivery from "@/components/FreeDelivery";
import PageTransition from "@/components/PageTransition";
import { CartProvider } from "./context/CartContex";
import SideCart from "@/components/Cart/SideCart";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Ole Knitwear | Handmade Knitwear",
    template: "%s | Ole Knitwear"
  },
  description: "Handcrafted luxury knitwear created for women who don’t follow trends. Bespoke woolen pieces with worldwide shipping.",
  keywords: ["luxury knitwear", "handcrafted wool", "bespoke fashion", "women knitwear", "one-of-a-kind clothing"],
  authors: [{ name: "Ole Knitwear" }],

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900">
        <CartProvider>
          <FreeDelivery />
          <Header />
          <SideCart />
          <main>
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}