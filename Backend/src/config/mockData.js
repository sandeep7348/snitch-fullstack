export const MOCK_PRODUCTS = [
  {
    _id: "66f1a8b9e4b01a2b3c4d5e01",
    id: "66f1a8b9e4b01a2b3c4d5e01",
    title: "Oversized Heavyweight Black Tee",
    description: "240 GSM 100% French Terry Cotton oversized t-shirt with dropped shoulders and a boxy relaxed silhouette.",
    category: "Oversized",
    price: 1299,
    stock: 25,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
  },
  {
    _id: "66f1a8b9e4b01a2b3c4d5e02",
    id: "66f1a8b9e4b01a2b3c4d5e02",
    title: "Utility Tactical Cargo Pants",
    description: "6-pocket vintage acid wash cargo pants featuring adjustable ankle drawstrings and ergonomic knee pleats.",
    category: "Cargo",
    price: 2499,
    stock: 18,
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
  },
  {
    _id: "66f1a8b9e4b01a2b3c4d5e03",
    id: "66f1a8b9e4b01a2b3c4d5e03",
    title: "Fleece Acid Wash Heavyweight Hoodie",
    description: "Heavyweight 400 GSM brushed fleece hoodie with double-layered hood, rib cuffs, and relaxed streetwear draping.",
    category: "Hoodies",
    price: 2999,
    stock: 14,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
  },
  {
    _id: "66f1a8b9e4b01a2b3c4d5e04",
    id: "66f1a8b9e4b01a2b3c4d5e04",
    title: "Vintage Biker Leather Jacket",
    description: "Premium vegan leather jacket with matte black hardware, asymmetrical zip, and quilted satin interior.",
    category: "Jackets",
    price: 4999,
    stock: 8,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
  },
  {
    _id: "66f1a8b9e4b01a2b3c4d5e05",
    id: "66f1a8b9e4b01a2b3c4d5e05",
    title: "Distressed Relaxed Straight Denim",
    description: "14oz rigid cotton denim featuring subtle knee distressing, washed vintage finish, and relaxed straight leg cut.",
    category: "Jeans",
    price: 2799,
    stock: 15,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
    isFeatured: false,
  },
  {
    _id: "66f1a8b9e4b01a2b3c4d5e06",
    id: "66f1a8b9e4b01a2b3c4d5e06",
    title: "Graphic Drop Shoulder Street Tee",
    description: "High density 3D puff print graphics on 220 GSM combed organic cotton with reinforced rib collar.",
    category: "Oversized",
    price: 1499,
    stock: 30,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
  },
  {
    _id: "66f1a8b9e4b01a2b3c4d5e07",
    id: "66f1a8b9e4b01a2b3c4d5e07",
    title: "Matte Black Puffer Down Jacket",
    description: "Water-resistant matte black puffer jacket with high loft thermal insulation and fleece-lined pockets.",
    category: "Jackets",
    price: 5499,
    stock: 10,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800",
    isFeatured: false,
  },
  {
    _id: "66f1a8b9e4b01a2b3c4d5e08",
    id: "66f1a8b9e4b01a2b3c4d5e08",
    title: "Minimalist Essential Sweatshirt",
    description: "Ultra-soft cotton blend crewneck sweatshirt in clean obsidian monochrome styling.",
    category: "Hoodies",
    price: 2199,
    stock: 20,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    isFeatured: false,
  },
];

export function searchMockProducts(query = "") {
  if (!query || typeof query !== "string") return MOCK_PRODUCTS.slice(0, 5);

  const cleanQuery = query.toLowerCase();
  
  // Extract max price if present in query like "under 2000" or "under 3000"
  const priceMatch = cleanQuery.match(/under\s*₹?\s*(\d+)/i) || cleanQuery.match(/below\s*₹?\s*(\d+)/i);
  const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : null;

  // Split query into keywords
  const keywords = cleanQuery.split(/\s+/).filter(k => k.length > 2 && !["show", "find", "me", "the", "some", "best", "give", "suggest", "under", "below"].includes(k));

  let filtered = MOCK_PRODUCTS.filter((product) => {
    if (maxPrice && product.price > maxPrice) return false;

    if (keywords.length === 0) return true;

    return keywords.some((kw) => 
      product.title.toLowerCase().includes(kw) ||
      product.description.toLowerCase().includes(kw) ||
      product.category.toLowerCase().includes(kw)
    );
  });

  if (filtered.length === 0) {
    // If no match found, fallback to all products
    filtered = MOCK_PRODUCTS;
  }

  return filtered.slice(0, 5);
}

export function getMockCategories() {
  return ["Oversized", "Cargo", "Hoodies", "Jackets", "Jeans"];
}

export function getMockProductById(id) {
  return MOCK_PRODUCTS.find(p => p._id === id || p.id === id) || MOCK_PRODUCTS[0];
}
