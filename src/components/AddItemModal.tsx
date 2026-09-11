import React, { useState } from 'react';
import { Store, Product } from '../types';
import { PRESET_GROCERY_IMAGES } from '../data/mockData';

interface AddItemModalProps {
  store: Store;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  store,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Produce");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [aisle, setAisle] = useState(store.aisles[0] || "Aisle 1 - Produce");
  const [stockQuantity, setStockQuantity] = useState("25");
  const [imageUrl, setImageUrl] = useState(PRESET_GROCERY_IMAGES[0].url);

  const handleGenerateBarcode = () => {
    const prefix = store.currency === "INR" ? "890" : "078";
    const rand9 = Math.floor(100000000 + Math.random() * 900000000);
    setBarcode(`${prefix}${rand9}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert("Please provide at least a product name and price");
      return;
    }

    const numPrice = parseFloat(price) || (store.currency === "INR" ? 99 : 2.99);
    const numQty = parseInt(stockQuantity, 10) || 15;
    const finalBarcode = barcode.trim() || (store.currency === "INR" ? `890${Math.floor(100000000 + Math.random() * 900000000)}` : `078${Math.floor(100000000 + Math.random() * 900000000)}`);

    const newProd: Product = {
      id: "prod-" + Date.now().toString(36),
      barcode: finalBarcode,
      sku: name.toUpperCase().replace(/\s+/g, '-').slice(0, 16),
      name: name.trim(),
      brand: brand.trim() || "Store Fresh",
      category,
      aisle,
      base_price: numPrice,
      image_url: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80",
      stock_quantity: numQty,
      is_in_stock: numQty > 0,
      delivery_available: true
    };

    onAddProduct(newProd);
  };

  return (
    <div id="add-item-modal-overlay" className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 css-modal-enter">
      <div id="add-item-modal-dialog" className="bg-white w-full max-h-[94%] rounded-3xl p-5 shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
              📦
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-none">Add Item to Inventory</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{store.name}</p>
            </div>
          </div>
          <button
            id="close-add-item-modal-btn"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto no-scrollbar py-3 space-y-3">
          {/* Item Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              id="new-item-name"
              type="text"
              required
              placeholder={store.currency === "INR" ? "e.g., Amul Salted Butter (500g)" : "e.g., Organic Blueberries (6 oz)"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Brand & Category Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Brand
              </label>
              <input
                id="new-item-brand"
                type="text"
                placeholder={store.currency === "INR" ? "e.g., Amul / Tata" : "e.g., FarmDirect"}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                id="new-item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option>Produce</option>
                <option>Dairy &amp; Plant Milk</option>
                <option>Snacks &amp; Drinks</option>
                <option>Bakery</option>
                <option>Pantry Staples</option>
              </select>
            </div>
          </div>

          {/* Price & Stock Qty Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Price in {store.currency} ({store.currency_symbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  {store.currency_symbol}
                </span>
                <input
                  id="new-item-price"
                  type="number"
                  required
                  min="0.1"
                  step={store.currency === "INR" ? "1" : "0.01"}
                  placeholder={store.currency === "INR" ? "275" : "4.99"}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Initial Stock Qty
              </label>
              <input
                id="new-item-stock"
                type="number"
                min="0"
                placeholder="25"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Barcode with Auto-Generate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Shelf Barcode (EAN / UPC)
              </label>
              <button
                id="auto-generate-barcode-btn"
                type="button"
                onClick={handleGenerateBarcode}
                className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>⚡</span> Auto-Generate
              </button>
            </div>
            <input
              id="new-item-barcode"
              type="text"
              placeholder={store.currency === "INR" ? "e.g. 890123456789" : "e.g. 078742351889"}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Aisle Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Store Aisle Location
            </label>
            <select
              id="new-item-aisle"
              value={aisle}
              onChange={(e) => setAisle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {store.aisles.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Preset Photo Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Preset Grocery Photo
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_GROCERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  className={`p-1 rounded-xl border text-left flex items-center gap-1.5 transition cursor-pointer ${
                    imageUrl === img.url
                      ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <img src={img.url} className="w-7 h-7 rounded-lg object-cover" alt="" />
                  <span className="text-[9px] font-medium text-slate-700 truncate leading-tight">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              id="submit-new-item-btn"
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>✓ Add Product to Live Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
