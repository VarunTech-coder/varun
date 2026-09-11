import React, { useState } from 'react';
import { Store } from '../types';

interface DeliveryAddressModalProps {
  store: Store;
  currentAddress: string;
  onClose: () => void;
  onSaveAddress: (newAddress: string, instructions: string) => void;
}

export const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  store,
  currentAddress,
  onClose,
  onSaveAddress,
}) => {
  const [address, setAddress] = useState(currentAddress);
  const [instructions, setInstructions] = useState("Leave at door / ring bell");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    onSaveAddress(address.trim(), instructions);
  };

  return (
    <div id="delivery-address-modal-overlay" className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-6 css-modal-enter">
      <div id="delivery-address-dialog" className="bg-white w-full rounded-3xl p-5 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Home Delivery Address
          </div>
          <button
            id="close-address-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Fast 30-min doorstep dispatch directly from {store.name}.
        </p>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Delivery Address *</label>
            <textarea
              id="delivery-address-input"
              rows={3}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Drop-off Instructions</label>
            <input
              id="delivery-instructions-input"
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            id="save-delivery-address-btn"
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition cursor-pointer"
          >
            Confirm Address &amp; Delivery
          </button>
        </form>
      </div>
    </div>
  );
};
