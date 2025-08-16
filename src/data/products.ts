import { Product } from "../types";

export const products: Product[] = [
  {
    id: "1",
    name: "Midnight Rose",
    brand: "Élégance",
    price: 89,
    originalPrice: 120,
    image:
      "https://images.pexels.com/photos/965731/pexels-photo-965731.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "women",
    rating: 4.8,
    reviewCount: 124,
    description:
      "A captivating blend of midnight blooming roses with hints of vanilla and sandalwood. Perfect for evening wear.",
    notes: {
      top: ["Rose Petals", "Bergamot", "Pink Pepper"],
      middle: ["Damask Rose", "Jasmine", "Peony"],
      base: ["Sandalwood", "Vanilla", "Musk"],
    },
    volumes: ["30ml", "50ml", "100ml"],
    featured: true,
  },
  {
    id: "2",
    name: "Ocean Breeze",
    brand: "Azure",
    price: 75,
    image:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "men",
    rating: 4.6,
    reviewCount: 89,
    description:
      "Fresh and invigorating scent inspired by ocean waves and sea breeze. Ideal for daily wear.",
    notes: {
      top: ["Sea Salt", "Lemon", "Mint"],
      middle: ["Lavender", "Geranium", "Calone"],
      base: ["Cedarwood", "Ambergris", "Driftwood"],
    },
    volumes: ["50ml", "100ml"],
    featured: true,
  },
  {
    id: "3",
    name: "Golden Amber",
    brand: "Luxe",
    price: 95,
    image:
      "https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "unisex",
    rating: 4.9,
    reviewCount: 156,
    description:
      "Warm and sophisticated amber fragrance with spicy undertones. Perfect for any occasion.",
    notes: {
      top: ["Saffron", "Cardamom", "Orange"],
      middle: ["Rose", "Cinnamon", "Nutmeg"],
      base: ["Amber", "Oud", "Vanilla"],
    },
    volumes: ["30ml", "50ml", "100ml"],
    featured: true,
  },
  {
    id: "4",
    name: "Crystal Bloom",
    brand: "Élégance",
    price: 68,
    image:
      "https://images.pexels.com/photos/1557251/pexels-photo-1557251.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "women",
    rating: 4.7,
    reviewCount: 92,
    description:
      "Light and airy floral fragrance with crystalline freshness. Perfect for spring and summer.",
    notes: {
      top: ["Pear", "Freesia", "Lemon"],
      middle: ["Lily of the Valley", "Rose", "Magnolia"],
      base: ["White Musk", "Cedarwood", "Amber"],
    },
    volumes: ["30ml", "50ml"],
    featured: false,
  },
  {
    id: "5",
    name: "Noir Intense",
    brand: "Midnight",
    price: 110,
    image:
      "https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "men",
    rating: 4.8,
    reviewCount: 203,
    description:
      "Intense and mysterious fragrance with dark chocolate and leather notes. For the sophisticated man.",
    notes: {
      top: ["Black Pepper", "Grapefruit", "Elemi"],
      middle: ["Chocolate", "Coffee", "Rose"],
      base: ["Leather", "Patchouli", "Vanilla"],
    },
    volumes: ["50ml", "100ml"],
    featured: true,
  },
  {
    id: "6",
    name: "Velvet Dreams",
    brand: "Luxe",
    price: 85,
    image:
      "https://images.pexels.com/photos/1961794/pexels-photo-1961794.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "unisex",
    rating: 4.5,
    reviewCount: 67,
    description:
      "Soft and luxurious scent that feels like velvet against the skin. Perfectly balanced for everyone.",
    notes: {
      top: ["Bergamot", "Mandarin", "Pink Pepper"],
      middle: ["Iris", "Violet", "Jasmine"],
      base: ["Cashmere Wood", "Musk", "Tonka Bean"],
    },
    volumes: ["30ml", "50ml", "100ml"],
    featured: false,
  },
];
