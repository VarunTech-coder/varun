import React, { useState } from 'react';
import { CustomerRequest, Store } from '../types';

interface RequestViewProps {
  store: Store;
  customerRequests: CustomerRequest[];
  onSubmitRequest: (newRequest: Omit<CustomerRequest, 'id' | 'time' | 'status'>) => void;
  prefillName?: string;
  prefillBrand?: string;
}

export const RequestView: React.FC<RequestViewProps> = ({
  store,
  customerRequests,
  onSubmitRequest,
  prefillName = "",
  prefillBrand = "",
}) => {
  const [form, setForm] = useState({
    itemName: prefillName,
    brand: prefillBrand,
    category: "Snacks & Drinks",
    notes: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemName.trim()) return;

    onSubmitRequest({
      itemName: form.itemName.trim(),
      brand: form.brand.trim() || "Any Brand",
      category: form.category,
      notes: form.notes,
      email: form.email
    });

    setForm({
      itemName: "",
      brand: "",
      category: "Snacks & Drinks",
      notes: "",
      email: ""
    });
  };

  return (
    <div id="request-view-container" className="p-4 space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <span>📝</span> In-Store Inventory Request
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Request an Item for Next Time
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Can't find a product on the shelf or is your favorite flavor out of stock? Submit your request directly to <strong>{store.name}</strong> inventory managers.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              id="req-input-item-name"
              type="text"
              required
              placeholder="e.g., Oatly Vanilla Ice Cream / Blue Tokai Dark Roast"
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Preference
              </label>
              <input
                id="req-input-brand"
                type="text"
                placeholder="e.g., Oatly, Epigamia, Amul"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                id="req-select-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              >
                <option>Snacks &amp; Drinks</option>
                <option>Produce</option>
                <option>Dairy &amp; Plant Milk</option>
                <option>Bakery</option>
                <option>Pantry Staples</option>
                <option>Household &amp; Care</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Size / Flavor
            </label>
            <textarea
              id="req-textarea-notes"
              rows={2}
              placeholder="Provide specific notes or dietary tags (e.g., Gluten-Free, 500g bottle)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notification Email / Mobile (Optional)
            </label>
            <input
              id="req-input-contact"
              type="text"
              placeholder="We'll notify you when it arrives on shelf"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <button
            id="req-submit-btn"
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Submit Request to Store Staff 🚀
          </button>
        </form>
      </div>

      {/* Recent Customer Requests Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Recent Requests for this Store
        </h4>
        <div className="space-y-2">
          {customerRequests.map(req => (
            <div key={req.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">{req.itemName}</div>
                <div className="text-[10px] text-slate-500">{req.brand} • {req.time}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                req.status === 'ordered' ? 'bg-emerald-100 text-emerald-700' :
                req.status === 'stocked' ? 'bg-indigo-100 text-indigo-700' :
                req.status === 'reviewed' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
