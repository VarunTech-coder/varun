export interface Store {
  id: string;
  store_code: string;
  name: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  tax_rate: number;
  currency: "INR" | "USD";
  currency_symbol: string;
  aisles: string[];
}

export interface Product {
  id: string;
  barcode: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  aisle: string;
  base_price: number;
  image_url: string;
  stock_quantity: number;
  is_in_stock: boolean;
  delivery_available?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderReceipt {
  orderId: string;
  date: string;
  storeName: string;
  storeCode: string;
  items: CartItem[];
  fulfillmentMode: "instore" | "delivery";
  deliveryAddress: string | null;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  exitPassBarcode: string;
  securityHash: string;
  gateTerminal: string;
}

export interface CustomerRequest {
  id: string;
  itemName: string;
  brand: string;
  category: string;
  status: "new" | "reviewed" | "ordered" | "stocked";
  time: string;
  notes?: string;
  email?: string;
}

export type ActiveTab = "shop" | "scanner" | "request" | "cart" | "receipt" | "staff";
export type FulfillmentMode = "instore" | "delivery";
