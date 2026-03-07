import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FreeDelivery from "@/components/FreeDelivery";
import PageTransition from "@/components/PageTransition";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { SWRProvider } from "./context/SWRProvider";
import SideCart from "@/components/Cart/SideCart";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  variable: "--font-serif",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ole Knitwear | Handmade Luxury Knitwear",
    template: "%s | Ole Knitwear"
  },
  description: "Handcrafted luxury knitwear made in Ukraine. Bespoke cardigans, sweaters, and accessories from premium wool with free worldwide shipping.",
  keywords: ["luxury knitwear", "handcrafted wool", "handmade cardigans", "bespoke fashion", "women knitwear", "Ukrainian knitwear", "wool sweaters", "artisan clothing"],
  authors: [{ name: "Ole Knitwear" }],
  creator: "Ole Knitwear",
  publisher: "Ole Knitwear",
  alternates: {
    canonical: baseUrl,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Ole Knitwear',
    title: 'Ole Knitwear | Handmade Luxury Knitwear',
    description: 'Handcrafted luxury knitwear made in Ukraine. Bespoke cardigans, sweaters, and accessories from premium wool with free worldwide shipping.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Ole Knitwear - Handmade Luxury Knitwear',
    }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ole Knitwear | Handmade Luxury Knitwear',
    description: 'Handcrafted luxury knitwear made in Ukraine. Bespoke woolen pieces with free worldwide shipping.',
    images: ['/og-image.png'],
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
        <SWRProvider>
          <AuthProvider>
            <CurrencyProvider>
              <WishlistProvider>
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
              </WishlistProvider>
            </CurrencyProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  );
}