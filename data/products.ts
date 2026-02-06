export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  currency: string;
  category: string;
  length: 'long' | 'short'; 
  season: 'winter/autumn' | 'summer/spring';
  status: 'in-stock' | 'pre-order';
  images: string[];
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Wool Cardigan",
    price: 240,
    currency: "USD",
    category: "Cardigans",
    length: "long",
    season: "winter/autumn",
    status: "in-stock",
    images: ["/products/cardigan-1.png", "/products/cardigan-2.png"],
    isNew: true,
    description: "Classic Wool Cardigan"
  },
  {
    id: 2,
    name: "Oversized Mohair Sweater",
    price: 180,
    currency: "USD",
    category: "Sweaters",
    length: "short",
    season: "winter/autumn",
    status: "pre-order",
    images: ["/products/cardigan-1.png", "/products/cardigan-2.png"],
    description: "Oversized Mohair Sweater"
  },
  {
    id: 3,
    name: "Soft Cashmere Beanie",
    price: 65,
    currency: "USD",
    category: "Accessories",
    length: "short",
    season: "winter/autumn",
    status: "in-stock",
    images: ["/products/cardigan-1.png", "/products/cardigan-2.png"],
    description: "Soft Cashmere Beanie"
  },
  {
    id: 4,
    name: "Handmade Chunky Scarf",
    price: 90,
    currency: "USD",
    category: "Accessories",
    length: "long",
    season: "winter/autumn",
    status: "in-stock",
    images: ["/products/cardigan-1.png", "/products/cardigan-2.png"],
    isNew: true,
    description: "Handmade Chunky Scarf"
  },
  {
    id: 5,
    name: "Light Summer Top",
    price: 120,
    currency: "USD",
    category: "Sweaters",
    length: "short",
    season: "summer/spring",
    status: "in-stock",
    images: ["/products/cardigan-1.png", "/products/cardigan-2.png"],
    description: "Light Summer Top"
  }
];