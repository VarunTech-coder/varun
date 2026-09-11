import React from 'react';
import { Store, FulfillmentMode, ActiveTab } from '../types';

interface PhoneHeaderProps {
  store: Store;
  fulfillmentMode: FulfillmentMode;
  onSelectFulfillment: (mode: FulfillmentMode) => void;
  onOpenAddItem: () => void;
  isStaffLoggedIn: boolean;
  activeTab: ActiveTab;
  onToggleStaffMode: () => void;
}

export const PhoneHeader: React.FC<PhoneHeaderProps> = ({
  store,
  fulfillmentMode,
  onSelectFulfillment,
  onOpenAddItem,
  isStaffLoggedIn,
  activeTab,
  onToggleStaffMode,
}) => {
  return (
    <div id="phone-header-container" className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      {/* Native Mobile Status Bar */}
      <div id="phone-status-bar" className="bg-slate-900 text-white px-7 pt-3 pb-2 flex justify-between items-center text-xs font-medium tracking-tight select-none">
        <span>9:41</span>
        <div className="w-20 h-4 bg-black rounded-full mx-auto -mt-1 flex items-center justify-center">
          <span className="w-2.5 h-2.5 bg-slate-800 rounded-full"></span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>5G</span>
          <span className="font-bold">100%</span>
        </div>
      </div>

      {/* In-Store Location Banner */}
      <header className="px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm css-live-pulse border border-emerald-300 shrink-0">
              📍
            </div>
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  In-Store Verified
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{store.store_code}</span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 truncate max-w-[170px]" title={store.name}>
                {store.name}
              </h2>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="header-quick-add-item-btn"
              onClick={onOpenAddItem}
              title="Add Item to Store Inventory"
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1 transition cursor-pointer"
            >
              <span>+</span>
              <span>Item</span>
            </button>

            {isStaffLoggedIn && (
              <button
                id="header-toggle-staff-mode-btn"
                onClick={onToggleStaffMode}
                className="px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-wide cursor-pointer hover:bg-indigo-100"
              >
                {activeTab === 'staff' ? 'Exit Staff' : 'Staff'}
              </button>
            )}
          </div>
        </div>

        {/* Fulfillment Mode Switcher: IN-STORE SCAN & GO vs FAST 30-MIN DELIVERY */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-100/80 p-1 rounded-xl">
          <button
            id="fulfillment-instore-tab"
            onClick={() => onSelectFulfillment("instore")}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              fulfillmentMode === "instore"
                ? "bg-white text-emerald-700 shadow-xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🛒</span>
            <span>In-Store Scan &amp; Go</span>
          </button>
          <button
            id="fulfillment-delivery-tab"
            onClick={() => onSelectFulfillment("delivery")}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              fulfillmentMode === "delivery"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>⚡</span>
            <span>Home Delivery (30-Min)</span>
          </button>
        </div>
      </header>
    </div>
  );
};
