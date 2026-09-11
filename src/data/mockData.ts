import { Store, Product, CustomerRequest } from '../types';

export const PRESET_GROCERY_IMAGES = [
  { label: "Amul Butter", url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&auto=format&fit=crop&q=80" },
  { label: "Tata Tea / Coffee", url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=80" },
  { label: "Alphonso Mangoes", url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&auto=format&fit=crop&q=80" },
  { label: "Artisan Sourdough", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80" },
  { label: "Greek Yogurt", url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80" },
  { label: "Popcorn / Crisps", url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=80" }
];

export const MOCK_STORES: Record<string, Store> = {
  "STORE-BLR-104": {
    id: "loc-9921-blr",
    store_code: "STORE-BLR-104",
    name: "Nature's Basket - Indiranagar, Bengaluru",
    address_line1: "100 Feet Rd, Indiranagar",
    city: "Bengaluru",
    state: "KA",
    postal_code: "560038",
    tax_rate: 0.05,
    currency: "INR",
    currency_symbol: "₹",
    aisles: [
      "Aisle 1 - Produce",
      "Aisle 2 - Bakery & Dairy",
      "Aisle 3 - Snacks & Drinks",
      "Aisle 4 - Grab & Go",
      "Aisle 5 - Pantry Staples"
    ]
  },
  "STORE-DEL-201": {
    id: "loc-1084-del",
    store_code: "STORE-DEL-201",
    name: "Modern Bazaar - Cyber Hub, Gurugram",
    address_line1: "DLF Cyber Hub, Sector 24",
    city: "Gurugram",
    state: "HR",
    postal_code: "122002",
    tax_rate: 0.05,
    currency: "INR",
    currency_symbol: "₹",
    aisles: [
      "Aisle 1 - Fresh & Organic",
      "Aisle 2 - Beverages",
      "Aisle 3 - Pantry Staples",
      "Aisle 4 - Gourmet Essentials"
    ]
  },
  "STORE-SF-042": {
    id: "loc-9921-sf",
    store_code: "STORE-SF-042",
    name: "WholeFoods Market - SoMa Central",
    address_line1: "399 4th St",
    city: "San Francisco",
    state: "CA",
    postal_code: "94107",
    tax_rate: 0.0875,
    currency: "USD",
    currency_symbol: "$",
    aisles: [
      "Aisle 1 - Produce",
      "Aisle 2 - Bakery & Dairy",
      "Aisle 3 - Snacks & Drinks",
      "Aisle 4 - Grab & Go"
    ]
  },
  "STORE-NYC-108": {
    id: "loc-1084-nyc",
    store_code: "STORE-NYC-108",
    name: "UrbanGrocer - Union Square",
    address_line1: "14 E 14th St",
    city: "New York",
    state: "NY",
    postal_code: "10003",
    tax_rate: 0.08875,
    currency: "USD",
    currency_symbol: "$",
    aisles: [
      "Aisle 1 - Fresh & Organic",
      "Aisle 2 - Beverages",
      "Aisle 3 - Pantry Staples"
    ]
  }
};

export const INITIAL_PRODUCTS_INR: Product[] = [
  {
    id: "prod-001",
    barcode: "890123456789",
    sku: "ORG-AVOCADO-HASS",
    name: "Organic Hass Avocados (Pack of 4)",
    brand: "FarmDirect Fresh",
    category: "Produce",
    aisle: "Aisle 1 - Produce",
    base_price: 349,
    image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 42,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-002",
    barcode: "890987654321",
    sku: "OAT-MILK-BARISTA",
    name: "Oat Milk Barista Edition (1L)",
    brand: "Oatly Original",
    category: "Dairy & Plant Milk",
    aisle: "Aisle 2 - Bakery & Dairy",
    base_price: 285,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 18,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-003",
    barcode: "890456123789",
    sku: "COLD-BREW-CAN",
    name: "Blue Tokai Cold Brew Can (250ml)",
    brand: "Blue Tokai Roasters",
    category: "Snacks & Drinks",
    aisle: "Aisle 3 - Snacks & Drinks",
    base_price: 165,
    image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 6,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-004",
    barcode: "890789456123",
    sku: "ARTISAN-SOURDOUGH",
    name: "Artisan Sourdough Loaf (400g)",
    brand: "The Artisanal Bakehouse",
    category: "Bakery",
    aisle: "Aisle 2 - Bakery & Dairy",
    base_price: 190,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 0,
    is_in_stock: false,
    delivery_available: true
  },
  {
    id: "prod-005",
    barcode: "890321654987",
    sku: "POPCORN-HIMALAYAN",
    name: "Himalayan Pink Salt Popcorn (85g)",
    brand: "4700BC Gourmet",
    category: "Snacks & Drinks",
    aisle: "Aisle 3 - Snacks & Drinks",
    base_price: 99,
    image_url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 24,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-006",
    barcode: "890654987321",
    sku: "KOMBUCHA-GINGER",
    name: "Raw Ginger Lemon Kombucha (330ml)",
    brand: "Atmosphere Studio",
    category: "Snacks & Drinks",
    aisle: "Aisle 3 - Snacks & Drinks",
    base_price: 249,
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 11,
    is_in_stock: true,
    delivery_available: true
  }
];

export const INITIAL_PRODUCTS_USD: Product[] = [
  {
    id: "prod-001",
    barcode: "078742351889",
    sku: "ORG-AVOCADO-HASS",
    name: "Organic Hass Avocados (Pack of 4)",
    brand: "FarmDirect Fresh",
    category: "Produce",
    aisle: "Aisle 1 - Produce",
    base_price: 4.49,
    image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 42,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-002",
    barcode: "041220894012",
    sku: "OAT-MILK-BARISTA",
    name: "Oat Milk Barista Edition (32 fl oz)",
    brand: "Oatly Original",
    category: "Dairy & Plant Milk",
    aisle: "Aisle 2 - Bakery & Dairy",
    base_price: 5.29,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 18,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-003",
    barcode: "850012398411",
    sku: "COLD-BREW-CAN",
    name: "Nitro Cold Brew Coffee (12 fl oz)",
    brand: "Stumptown Roasters",
    category: "Snacks & Drinks",
    aisle: "Aisle 3 - Snacks & Drinks",
    base_price: 3.99,
    image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 6,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-004",
    barcode: "793573189201",
    sku: "ARTISAN-SOURDOUGH",
    name: "San Francisco Rustic Sourdough Loaf",
    brand: "Boulangerie Local",
    category: "Bakery",
    aisle: "Aisle 2 - Bakery & Dairy",
    base_price: 6.99,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 0,
    is_in_stock: false,
    delivery_available: true
  },
  {
    id: "prod-005",
    barcode: "028400040112",
    sku: "POPCORN-HIMALAYAN",
    name: "Organic Himalayan Pink Salt Popcorn",
    brand: "LesserEvil",
    category: "Snacks & Drinks",
    aisle: "Aisle 3 - Snacks & Drinks",
    base_price: 3.79,
    image_url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 24,
    is_in_stock: true,
    delivery_available: true
  },
  {
    id: "prod-006",
    barcode: "818290019482",
    sku: "KOMBUCHA-GINGER",
    name: "Organic Ginger Lemon Kombucha (16 oz)",
    brand: "Health-Ade",
    category: "Snacks & Drinks",
    aisle: "Aisle 3 - Snacks & Drinks",
    base_price: 4.19,
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80",
    stock_quantity: 11,
    is_in_stock: true,
    delivery_available: true
  }
];

export const INITIAL_CUSTOMER_REQUESTS: CustomerRequest[] = [
  {
    id: "req-101",
    itemName: "Gluten-Free Multigrain Bread",
    brand: "The Health Factory",
    category: "Bakery",
    status: "reviewed",
    time: "2 hours ago"
  },
  {
    id: "req-102",
    itemName: "Cold Pressed Virgin Coconut Oil (500ml)",
    brand: "Maxcare",
    category: "Pantry Staples",
    status: "ordered",
    time: "Yesterday"
  }
];
