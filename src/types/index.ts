export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "women" | "men" | "unisex";
  rating: number;
  reviewCount: number;
  description: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  volumes: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVolume: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "processing" | "shipped" | "delivered";
  paymentMethod: "bank_transfer" | "cod";
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  date: string;
}

export enum PathCategory {
  women = "/categories/women",
  men = "/categories/men",
  unisex = "/categories/unisex",
}
