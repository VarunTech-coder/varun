import React, { useState } from 'react';
import { Product, Store } from '../types';

interface ScannerViewProps {
  store: Store;
  products: Product[];
  subtotal: number;
  totalItemsCount: number;
  onAddToCart: (productId: string) => void;
  onGoToCart: () => void;
  onShowToast: (msg: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  store,
  products,
  subtotal,
  totalItemsCount,
  onAddToCart,
  onGoToCart,
  onShowToast,
}) => {
  const [customBarcodeInput, setCustomBarcodeInput] = useState("");
  const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null);
  const [scanSuccessFeedback, setScanSuccessFeedback] = useState(false);

  // Pure Web Audio API Beep synthesizer (no external JS dependency)
  const playRetailBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1780, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleTriggerScan = (product: Product) => {
    playRetailBeep();
    setScanSuccessFeedback(true);
    setLastScannedProduct(product);
    onShowToast(`Scanned: ${product.name.slice(0, 22)}... (${store.currency_symbol}${store.currency === "INR" ? product.base_price : product.base_price.toFixed(2)})`);

    setTimeout(() => {
      setScanSuccessFeedback(false);
    }, 600);
  };

  const handleManualDecode = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customBarcodeInput.trim();
    if (!query) return;

    const matched = products.find(p => p.barcode === query || p.sku.toLowerCase().includes(query.toLowerCase()));
    if (matched) {
      handleTriggerScan(matched);
      setCustomBarcodeInput("");
    } else {
      onShowToast(`Barcode "${query}" not recognized in ${store.name}`);
    }
  };

  return (
    <div id="scanner-view-container" className="p-4 space-y-4">
      <div className="text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">
          Shelf Barcode Scanner
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Align Barcode in Camera View
        </h3>
        <p className="text-xs text-slate-500">
          Hold physical item barcode steady in front of your camera to instantly reveal price.
        </p>
      </div>

      {/* Scanner Viewfinder Box with Pure CSS Laser */}
      <div
        id="scanner-viewfinder"
        className={`relative w-72 h-56 mx-auto rounded-3xl bg-slate-950 border-2 overflow-hidden flex flex-col items-center justify-center transition-all ${
          scanSuccessFeedback ? "border-emerald-400 css-scan-matched" : "border-emerald-500/80 shadow-2xl"
        }`}
      >
        <div className="css-scanner-laser"></div>
        
        {/* Corner Target Marks */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>

        {scanSuccessFeedback ? (
          <div className="text-center px-4 z-10 css-success-pop">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xl mx-auto mb-1">
              ✓
            </div>
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              UPC / EAN DETECTED &amp; VERIFIED!
            </span>
          </div>
        ) : (
          <div className="text-center z-10 px-4 select-none">
            <div className="text-slate-400 text-xs font-mono">
              SCANNING LIVE UPC...
            </div>
            <div className="text-slate-500 text-[10px] mt-1">
              Keep barcode within box
            </div>
          </div>
        )}
      </div>

      {/* INSTANT SCANNED ITEM REVEAL CARD */}
      {lastScannedProduct && (
        <div id="scanned-product-card" className="bg-white rounded-2xl border-2 border-emerald-500 p-4 shadow-lg css-modal-enter">
          <div className="flex items-start gap-3">
            <img
              src={lastScannedProduct.image_url}
              alt={lastScannedProduct.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                  {lastScannedProduct.aisle.split(" - ")[0]}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{lastScannedProduct.barcode}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                {lastScannedProduct.name}
              </h4>
              <div className="text-[11px] text-slate-500">{lastScannedProduct.brand}</div>
              
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-extrabold text-slate-900 font-heading">
                  {store.currency_symbol}{store.currency === "INR" ? lastScannedProduct.base_price : lastScannedProduct.base_price.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">(Verified Shelf Price)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              id="scanned-add-to-cart-btn"
              onClick={() => onAddToCart(lastScannedProduct.id)}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🛒 Add to Cart</span>
              <span className="font-normal">
                ({store.currency_symbol}{store.currency === "INR" ? lastScannedProduct.base_price : lastScannedProduct.base_price.toFixed(2)})
              </span>
            </button>
            <button
              id="scanned-view-cart-btn"
              onClick={onGoToCart}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Running Subtotal Bar */}
      <div id="scanner-running-subtotal-bar" className="bg-slate-900 text-white rounded-2xl p-3 flex items-center justify-between text-xs shadow-md">
        <div>
          <span className="text-slate-400">Current Cart Subtotal:</span>
          <div className="font-heading font-bold text-base text-emerald-400">
            {store.currency_symbol}{store.currency === "INR" ? subtotal.toFixed(2) : subtotal.toFixed(2)}
          </div>
        </div>
        <div className="text-right">
          <span className="text-slate-400 font-mono">{totalItemsCount} items</span>
          <div>
            <button
              id="scanner-go-to-cart-link"
              onClick={onGoToCart}
              className="text-emerald-400 font-bold underline text-[11px] cursor-pointer hover:text-emerald-300"
            >
              Go to Cart →
            </button>
          </div>
        </div>
      </div>

      {/* Manual Input + One-click Shelf Item Simulators */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3">
        <form onSubmit={handleManualDecode} className="flex gap-2">
          <input
            id="scanner-manual-barcode-input"
            type="text"
            placeholder="Type or paste UPC (e.g., 890123456789)"
            value={customBarcodeInput}
            onChange={(e) => setCustomBarcodeInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button
            id="scanner-manual-decode-btn"
            type="submit"
            className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Decode
          </button>
        </form>

        <div>
          <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
            Simulate scanning item from shelf:
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {products.slice(0, 4).map(p => (
              <button
                key={p.id}
                id={`simulate-scan-${p.id}`}
                onClick={() => handleTriggerScan(p)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 text-xs rounded-xl font-medium shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📷</span>
                <span className="font-bold">{p.name.split(" ")[0]}</span>
                <span className="text-emerald-700 font-bold">
                  ({store.currency_symbol}{store.currency === "INR" ? p.base_price : p.base_price.toFixed(2)})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
