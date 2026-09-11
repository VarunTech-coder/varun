import React from 'react';
import { OrderReceipt, Store } from '../types';

interface ReceiptViewProps {
  receipt: OrderReceipt;
  store: Store;
  formattedTimer: string;
  liveClockString: string;
  onStartNewTrip: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  receipt,
  store,
  formattedTimer,
  liveClockString,
  onStartNewTrip,
}) => {
  return (
    <div id="receipt-view-container" className="p-4 space-y-4">
      <div id="exit-pass-card" className="bg-white rounded-3xl border-2 border-slate-300 p-4 shadow-xl relative text-center overflow-hidden">
        {/* Anti-Fraud Hologram Strip */}
        <div className="h-2.5 w-full css-irctc-hologram -mt-4 -mx-4 mb-3"></div>

        {/* Security Pass Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
          <div className="flex items-center gap-1.5 text-left">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
              ✓
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 leading-tight">
                DIGITAL STORE EXIT PASS
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                ANTI-FRAUD VERIFICATION ACTIVE
              </div>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
            OFFICIAL
          </span>
        </div>

        {/* PROMINENT LIVE COUNTDOWN TIMER BOX (Anti-Screenshot Security) */}
        <div className="bg-slate-950 text-white rounded-2xl p-3 mb-3 css-irctc-timer-box relative overflow-hidden">
          <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold mb-0.5">
            PASS VALIDITY COUNTDOWN (ANTI-FRAUD)
          </div>
          
          {/* Big Digital Glowing Countdown */}
          <div className="font-mono text-3xl font-extrabold tracking-wider text-white flex items-center justify-center gap-1">
            <span className="text-amber-400">⏱</span>
            <span>{formattedTimer}</span>
          </div>

          <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-center gap-2">
            <span>Show to Gate Guard at {receipt.gateTerminal}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 css-live-pulse"></span>
          </div>

          {/* Live Clock Timestamp & Security Hash */}
          <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-400">
            <span>LIVE: {liveClockString || "9:41:05 AM"}</span>
            <span className="text-amber-300">{receipt.securityHash}</span>
          </div>
        </div>

        {/* Door Security Barcode with moving laser line */}
        <div className="bg-slate-900 text-white rounded-2xl p-3 mb-3 relative overflow-hidden">
          <div className="text-[9px] uppercase font-mono tracking-widest text-slate-400 mb-1.5">
            DOOR SECURITY VERIFICATION CODE
          </div>
          
          {/* Barcode Visual Representation with Moving Laser Line */}
          <div className="bg-white p-2.5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="css-pass-barcode-scanner"></div>
            <div className="h-12 w-full flex items-center justify-between gap-[2px] px-1">
              {[3,1,4,2,1,5,2,3,1,4,2,3,1,2,4,1,3,2,5,1,2,3,1,4,2,3,1,4,2,1,3].map((w, i) => (
                <span key={i} className="h-full bg-black inline-block" style={{ width: `${w * 1.8}px` }}></span>
              ))}
            </div>
            <span className="text-slate-950 font-mono text-[10px] font-extrabold mt-1 tracking-wider">
              {receipt.exitPassBarcode}
            </span>
          </div>

          <div className="flex justify-between text-[10px] text-slate-300 mt-2">
            <span className="font-bold">{receipt.orderId}</span>
            <span>{receipt.date}</span>
          </div>
        </div>

        {/* Delivery Address if applicable */}
        {receipt.fulfillmentMode === "delivery" && receipt.deliveryAddress && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 mb-3 text-left text-xs">
            <span className="text-[10px] font-bold text-indigo-900 uppercase block">Dispatching To:</span>
            <span className="text-indigo-950 font-medium">{receipt.deliveryAddress}</span>
          </div>
        )}

        {/* Receipt Item Breakdown */}
        <div className="text-left text-xs space-y-1.5 border-t border-dashed border-slate-200 pt-2 text-slate-600">
          <div className="flex justify-between items-center font-bold text-slate-800">
            <span>Items ({receipt.items.reduce((s, i) => s + i.quantity, 0)}):</span>
            <span className="text-[10px] text-emerald-600 font-mono">PAID VIA {receipt.paymentMethod.split(" ")[0]}</span>
          </div>

          {receipt.items.map(item => (
            <div key={item.id} className="flex justify-between text-[11px]">
              <span className="truncate max-w-[190px]">{item.quantity}x {item.name}</span>
              <span className="font-medium">
                {store.currency_symbol}{(item.base_price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {receipt.fulfillmentMode === "delivery" && (
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Home Delivery Dispatch</span>
              <span>{store.currency_symbol}{receipt.deliveryFee.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Tax / GST</span>
            <span>{store.currency_symbol}{receipt.tax.toFixed(2)}</span>
          </div>

          <div className="pt-1.5 flex justify-between font-bold text-slate-900 border-t border-slate-200 text-sm">
            <span>Total Paid</span>
            <span className="text-emerald-600 font-heading">
              {store.currency_symbol}{receipt.total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          id="receipt-start-new-trip-btn"
          onClick={onStartNewTrip}
          className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
        >
          Start New In-Store Trip / Order
        </button>
      </div>
    </div>
  );
};
