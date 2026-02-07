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
  metadataBase: new URL('https://ole-knitwear.com'),
  title: {
    default: "Ole Knitwear | Handmade Knitwear",
    template: "%s | Ole Knitwear"
  },
  description: "Handcrafted luxury knitwear created for women who don't follow trends. Bespoke woolen pieces with worldwide shipping.",
  keywords: ["luxury knitwear", "handcrafted wool", "bespoke fashion", "women knitwear", "one-of-a-kind clothing"],
  authors: [{ name: "Ole Knitwear" }],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ole-knitwear.com',
    siteName: 'Ole Knitwear',
    title: 'Ole Knitwear | Handmade Luxury Knitwear',
    description: 'Handcrafted luxury knitwear created for women who don\'t follow trends. Bespoke woolen pieces with worldwide shipping.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Ole Knitwear - Handmade Luxury Knitwear',
    }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ole Knitwear | Handmade Luxury Knitwear',
    description: 'Handcrafted luxury knitwear created for women who don\'t follow trends.',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
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