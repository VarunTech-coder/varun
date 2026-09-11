import React from 'react';
import { Product, Store, CustomerRequest } from '../types';

interface StaffPortalViewProps {
  store: Store;
  products: Product[];
  customerRequests: CustomerRequest[];
  onOpenAddItem: () => void;
  onUpdateProductStock: (productId: string) => void;
  onUpdateRequestStatus: (requestId: string, newStatus: CustomerRequest['status']) => void;
  onShowToast: (msg: string) => void;
}

export const StaffPortalView: React.FC<StaffPortalViewProps> = ({
  store,
  products,
  customerRequests,
  onOpenAddItem,
  onUpdateProductStock,
  onUpdateRequestStatus,
  onShowToast,
}) => {
  return (
    <div id="staff-portal-container" className="p-4 space-y-4">
      {/* Associate Header */}
      <div className="bg-indigo-900 text-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
            Store Associate Console
          </span>
          <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-mono">
            LIVE SYNC
          </span>
        </div>
        <h3 className="text-base font-bold mt-1">Inventory &amp; Demand Management</h3>
        <p className="text-xs text-indigo-200 mt-0.5">{store.name}</p>

        {/* Dedicated Add Product Action Inside Staff Portal */}
        <div className="mt-3 pt-3 border-t border-indigo-800/60">
          <button
            id="staff-add-item-cta-btn"
            onClick={onOpenAddItem}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="text-sm">➕</span>
            <span>Add New Product to Store Catalog</span>
          </button>
        </div>
      </div>

      {/* Customer Missing Item Requests Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Customer Item Requests ({customerRequests.length})
          </h4>
          <span className="text-[10px] text-indigo-600 font-bold">Auto-queued from app</span>
        </div>

        <div className="space-y-2.5">
          {customerRequests.map(req => (
            <div key={req.id} id={`staff-req-${req.id}`} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-slate-900">{req.itemName}</div>
                  <div className="text-[10px] text-slate-500">Brand: {req.brand} • {req.time}</div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                  req.status === 'ordered' ? 'bg-emerald-100 text-emerald-700' :
                  req.status === 'stocked' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Quick Staff Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  id={`staff-order-${req.id}`}
                  onClick={() => {
                    onUpdateRequestStatus(req.id, "ordered");
                    onShowToast(`Status updated: ${req.itemName} marked as Ordered from Supplier`);
                  }}
                  className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700 cursor-pointer"
                >
                  Order from Supplier
                </button>
                <button
                  id={`staff-stock-${req.id}`}
                  onClick={() => {
                    onUpdateRequestStatus(req.id, "stocked");
                    onShowToast(`Item restocked to shelf`);
                  }}
                  className="px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded hover:bg-slate-300 cursor-pointer"
                >
                  Mark Stocked
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stock Level Toggles */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Quick Stock Override ({products.length} items)
          </h4>
          <button
            id="staff-add-more-link"
            onClick={onOpenAddItem}
            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            + Add More
          </button>
        </div>
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} id={`staff-prod-row-${p.id}`} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 text-xs">
              <div className="truncate max-w-[170px]">
                <div className="font-bold text-slate-800 truncate">{p.name}</div>
                <div className="text-[10px] text-slate-400">
                  {p.aisle} • {store.currency_symbol}{store.currency === "INR" ? p.base_price : p.base_price.toFixed(2)}
                </div>
              </div>
              <button
                id={`staff-toggle-stock-${p.id}`}
                onClick={() => onUpdateProductStock(p.id)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer ${
                  p.is_in_stock
                    ? "bg-emerald-100 text-emerald-700 hover:bg-rose-100 hover:text-rose-700"
                    : "bg-rose-100 text-rose-700 hover:bg-emerald-100 hover:text-emerald-700"
                }`}
              >
                {p.is_in_stock ? "In Stock" : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
