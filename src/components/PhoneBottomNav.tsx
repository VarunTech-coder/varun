import React from 'react';
import { ActiveTab } from '../types';

interface PhoneBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  totalItemsCount: number;
  cartBadgeTrigger: boolean;
}

export const PhoneBottomNav: React.FC<PhoneBottomNavProps> = ({
  activeTab,
  onSelectTab,
  totalItemsCount,
  cartBadgeTrigger,
}) => {
  return (
    <nav id="phone-bottom-nav" className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 flex justify-between items-center absolute bottom-0 left-0 right-0 z-30 select-none">
      {/* Shelf Browse Tab */}
      <button
        id="nav-tab-browse"
        onClick={() => onSelectTab("shop")}
        className={`flex flex-col items-center gap-1 transition cursor-pointer ${
          activeTab === "shop" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <span className="text-lg">🏪</span>
        <span className="text-[10px]">Browse</span>
      </button>

      {/* Barcode Scanner Tab */}
      <button
        id="nav-tab-scanner"
        onClick={() => onSelectTab("scanner")}
        className={`flex flex-col items-center gap-1 transition cursor-pointer ${
          activeTab === "scanner" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <span className="text-lg">📷</span>
        <span className="text-[10px]">Scanner</span>
      </button>

      {/* Missing Item Request Tab */}
      <button
        id="nav-tab-request"
        onClick={() => onSelectTab("request")}
        className={`flex flex-col items-center gap-1 transition cursor-pointer ${
          activeTab === "request" ? "text-indigo-600 font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <span className="text-lg">📝</span>
        <span className="text-[10px]">Request</span>
      </button>

      {/* Cart Tab with Animated Bounce Pop */}
      <button
        id="nav-tab-cart"
        onClick={() => onSelectTab("cart")}
        className={`flex flex-col items-center gap-1 relative transition cursor-pointer ${
          activeTab === "cart" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <div className="relative">
          <span className="text-lg">🛒</span>
          {totalItemsCount > 0 && (
            <span
              id="nav-cart-badge"
              className={`absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white ${
                cartBadgeTrigger ? "css-badge-pop" : ""
              }`}
            >
              {totalItemsCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Cart</span>
      </button>
    </nav>
  );
};
