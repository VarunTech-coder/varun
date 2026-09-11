import React from 'react';
import { Product, Store, FulfillmentMode } from '../types';

interface BrowseViewProps {
  store: Store;
  fulfillmentMode: FulfillmentMode;
  products: Product[];
  cart: Record<string, number>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
  onOpenScanner: () => void;
  onOpenRequest: (prefillName?: string, prefillBrand?: string) => void;
  onOpenAddItem: () => void;
  onOpenDeliveryAddressModal: () => void;
  deliveryAddress: string;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  store,
  fulfillmentMode,
  products,
  cart,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onRemoveFromCart,
  onOpenScanner,
  onOpenRequest,
  onOpenAddItem,
  onOpenDeliveryAddressModal,
  deliveryAddress,
}) => {
  const categories = ["All", "Produce", "Dairy & Plant Milk", "Snacks & Drinks", "Bakery", "Pantry Staples"];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="browse-view-container" className="p-4 space-y-4">
      {/* Mode-Specific Header Banner */}
      {fulfillmentMode === "instore" ? (
        <div id="banner-express-checkout" className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
              <span>⚡</span> Express Self-Checkout
            </div>
            <h3 className="text-base font-bold leading-snug">
              Scan as you shop. Skip register queues.
            </h3>
            <p className="text-xs text-emerald-100 mt-1">
              Add items directly into your bag, pay on your phone, and show digital exit receipt at door.
            </p>
          </div>
        </div>
      ) : (
        <div id="banner-home-delivery" className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2">
              <span>🚀</span> Fast 30-Min Store Dispatch
            </div>
            <h3 className="text-base font-bold leading-snug">
              Search &amp; Order Entire Catalog to Home
            </h3>
            <p className="text-xs text-indigo-100 mt-1">
              All shelf items and warehouse stocks delivered directly to your doorstep. Free delivery over {store.currency_symbol}500!
            </p>
            <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] bg-white/15 p-2 rounded-xl">
              <div className="flex items-center gap-1.5 truncate">
                <span>📍</span>
                <span className="truncate font-medium">{deliveryAddress}</span>
              </div>
              <button
                id="change-address-btn"
                onClick={onOpenDeliveryAddressModal}
                className="text-[10px] bg-white text-indigo-700 font-bold px-2 py-0.5 rounded shrink-0 hover:bg-indigo-50 cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar + Barcode Scanner Trigger */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            id="shelf-search-input"
            type="text"
            placeholder={store.currency === "INR" ? "Search shelf items or barcode..." : "Search shelf items or UPC..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <button
          id="trigger-scanner-tab-btn"
          onClick={onOpenScanner}
          className="px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-sm transition shrink-0 cursor-pointer"
        >
          <span>📷</span>
          <span>Scan Barcode</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            id={`category-pill-${cat.toLowerCase().replace(/[\s&]+/g, '-')}`}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Store Inventory Management Quick Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛒</span>
          <div>
            <div className="text-xs font-bold text-emerald-950">Store Inventory Management</div>
            <div className="text-[10px] text-emerald-700">Add new shelf stock or products instantly</div>
          </div>
        </div>
        <button
          id="browse-add-item-btn"
          onClick={onOpenAddItem}
          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
        >
          <span>+ Add Item</span>
        </button>
      </div>

      {/* Missing Item Request Callout */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-indigo-900">Can't find an item?</div>
          <div className="text-[11px] text-indigo-600">Request it directly to our store manager</div>
        </div>
        <button
          id="browse-request-item-btn"
          onClick={() => onOpenRequest()}
          className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 transition shrink-0 cursor-pointer"
        >
          Request Item +
        </button>
      </div>

      {/* Store Shelf Product Grid */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Shelf Items ({filteredProducts.length})
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">Verified local prices</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => {
            const qtyInCart = cart[product.id] || 0;
            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className={`bg-white rounded-2xl border p-2.5 flex flex-col justify-between shadow-sm hover:shadow-md transition relative ${
                  !product.is_in_stock ? "border-amber-200 bg-amber-50/15" : "border-slate-200"
                }`}
              >
                <div>
                  {/* Product Thumbnail */}
                  <div className="w-full h-28 bg-slate-100 rounded-xl overflow-hidden mb-2 relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                      {product.aisle.split(" - ")[0]}
                    </span>
                    {!product.is_in_stock && (
                      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase mb-0.5">
                    <span className="truncate max-w-[90px]">{product.brand}</span>
                    <span className="font-mono text-[9px]">#{product.barcode.slice(-4)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2" title={product.name}>
                    {product.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 font-heading">
                      {store.currency_symbol}{store.currency === "INR" ? product.base_price : product.base_price.toFixed(2)}
                    </span>
                  </div>

                  {/* Add / Qty Controls */}
                  {product.is_in_stock ? (
                    qtyInCart > 0 ? (
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg p-0.5">
                        <button
                          id={`btn-dec-${product.id}`}
                          onClick={() => onRemoveFromCart(product.id)}
                          className="w-6 h-6 rounded bg-white text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-emerald-800 px-1">{qtyInCart}</span>
                        <button
                          id={`btn-inc-${product.id}`}
                          onClick={() => onAddToCart(product.id)}
                          className="w-6 h-6 rounded bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-add-${product.id}`}
                        onClick={() => onAddToCart(product.id)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>+</span> Add
                      </button>
                    )
                  ) : (
                    <button
                      id={`btn-req-out-of-stock-${product.id}`}
                      onClick={() => onOpenRequest(product.name, product.brand)}
                      className="text-[10px] text-indigo-600 font-bold underline cursor-pointer hover:text-indigo-800"
                    >
                      Request item
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
