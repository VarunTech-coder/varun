import React from 'react';
import { Store } from '../types';

interface DesktopSidebarProps {
  currentStoreCode: string;
  onSelectStore: (storeCode: string) => void;
  productsCount: number;
  onOpenAddItem: () => void;
  isStaffLoggedIn: boolean;
  onOpenStaffLogin: () => void;
  onStaffLogout: () => void;
  activeStore: Store;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentStoreCode,
  onSelectStore,
  productsCount,
  onOpenAddItem,
  isStaffLoggedIn,
  onOpenStaffLogin,
  onStaffLogout,
  activeStore,
}) => {
  return (
    <div id="desktop-sidebar-container" className="w-full lg:w-96 max-w-md flex flex-col gap-5 text-slate-300 shrink-0">
      <div id="desktop-sidebar-main-card" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur">
        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            ⚡
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {activeStore.currency === "INR" ? "RetailFlow India" : "RetailFlow Hybrid"}
            </h1>
            <p className="text-xs text-slate-400">
              In-Store Self-Checkout Engine ({activeStore.currency} / {activeStore.currency_symbol})
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Scan QR at store entrance to auto-load local shelf inventory, skip billing queues, scan barcodes with instant price reveal, or order out-of-stock items for 30-min home delivery!
        </p>

        {/* QR Simulation Switcher */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Simulate QR Entrance Code
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="qr-btn-blr"
              onClick={() => onSelectStore("STORE-BLR-104")}
              className={`px-3 py-2 text-xs rounded-xl font-medium text-left transition border ${
                currentStoreCode === "STORE-BLR-104"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold">Bengaluru</div>
              <div className="text-[10px] opacity-75">STORE-BLR-104 (₹)</div>
            </button>

            <button
              id="qr-btn-del"
              onClick={() => onSelectStore("STORE-DEL-201")}
              className={`px-3 py-2 text-xs rounded-xl font-medium text-left transition border ${
                currentStoreCode === "STORE-DEL-201"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold">Delhi NCR / Gurugram</div>
              <div className="text-[10px] opacity-75">STORE-DEL-201 (₹)</div>
            </button>

            <button
              id="qr-btn-sf"
              onClick={() => onSelectStore("STORE-SF-042")}
              className={`px-3 py-2 text-xs rounded-xl font-medium text-left transition border ${
                currentStoreCode === "STORE-SF-042"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold">San Francisco</div>
              <div className="text-[10px] opacity-75">STORE-SF-042 ($)</div>
            </button>

            <button
              id="qr-btn-nyc"
              onClick={() => onSelectStore("STORE-NYC-108")}
              className={`px-3 py-2 text-xs rounded-xl font-medium text-left transition border ${
                currentStoreCode === "STORE-NYC-108"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold">New York City</div>
              <div className="text-[10px] opacity-75">STORE-NYC-108 ($)</div>
            </button>
          </div>
        </div>

        {/* Store Catalog Management Action */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Store Catalog Management
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{productsCount} Items Live</span>
          </div>
          <button
            id="sidebar-add-item-btn"
            onClick={onOpenAddItem}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 border border-emerald-400/40 transition group cursor-pointer"
          >
            <span className="text-base group-hover:scale-110 transition-transform">➕</span>
            <span>Add Item to Store Inventory</span>
          </button>
        </div>

        {/* Secure Staff Portal Entry Point */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-200">Staff Portal (Backoffice)</div>
            <div className="text-[10px] text-slate-500">
              {isStaffLoggedIn ? "Mode: Manager Active" : "Restricted to authorized team"}
            </div>
          </div>
          {isStaffLoggedIn ? (
            <button
              id="sidebar-logout-btn"
              onClick={onStaffLogout}
              className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition cursor-pointer"
            >
              Lock Out
            </button>
          ) : (
            <button
              id="sidebar-login-btn"
              onClick={onOpenStaffLogin}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition cursor-pointer"
            >
              Staff Login 🔐
            </button>
          )}
        </div>
      </div>

      {/* Architecture Specifications */}
      <div id="desktop-sidebar-architecture-box" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-2.5">
        <div className="font-semibold text-slate-200 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          Architecture Specifications
        </div>
        <div className="flex items-start gap-2 text-slate-400">
          <span className="text-emerald-400 font-bold">✓</span>
          <span><strong>Instant Barcode Scanner:</strong> Scan shelf items with instant item &amp; {activeStore.currency_symbol} price reveal with quick-add.</span>
        </div>
        <div className="flex items-start gap-2 text-slate-400">
          <span className="text-amber-400 font-bold">✓</span>
          <span><strong>IRCTC Anti-Fraud Exit Pass:</strong> Live counting down security pass with live timestamp &amp; security hash.</span>
        </div>
        <div className="flex items-start gap-2 text-slate-400">
          <span className="text-indigo-400 font-bold">✓</span>
          <span><strong>Dual Fulfillment:</strong> In-Store Scan &amp; Go or Fast 30-Min Delivery to Address for out-of-stock items.</span>
        </div>
        <div className="flex items-start gap-2 text-slate-400">
          <span className="text-emerald-400 font-bold">✓</span>
          <span><strong>Zero External JS Animations:</strong> Strict pure CSS keyframes for scan laser, hologram ribbons, and pop badges.</span>
        </div>
      </div>
    </div>
  );
};
