import React from 'react';
import { Product, Store, FulfillmentMode } from '../types';

interface CartViewProps {
  store: Store;
  fulfillmentMode: FulfillmentMode;
  deliveryAddress: string;
  cart: Record<string, number>;
  products: Product[];
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
  onBrowse: () => void;
  onExecutePayment: (paymentMethod: string) => void;
  isCheckingOut: boolean;
  onOpenDeliveryAddressModal: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  store,
  fulfillmentMode,
  deliveryAddress,
  cart,
  products,
  onAddToCart,
  onRemoveFromCart,
  onBrowse,
  onExecutePayment,
  isCheckingOut,
  onOpenDeliveryAddressModal,
}) => {
  const totalItemsCount = Object.values(cart).reduce((sum: number, qty: number) => sum + Number(qty), 0);

  const subtotal = Object.entries(cart).reduce((sum: number, [pId, qty]) => {
    const item = products.find(p => p.id === pId);
    return sum + (item ? item.base_price * Number(qty) : 0);
  }, 0);

  const deliveryFee = fulfillmentMode === "delivery" ? (store.currency === "INR" ? 30 : 2.99) : 0;
  const taxAmount = subtotal * store.tax_rate;
  const totalAmount = subtotal + taxAmount + deliveryFee;

  return (
    <div id="cart-view-container" className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {fulfillmentMode === "delivery" ? "Home Delivery Basket" : "Your Virtual Cart"}
          </h3>
          <p className="text-[11px] text-slate-500">
            {fulfillmentMode === "delivery" ? "30-Minute Doorstep Dispatch" : "Self-Scan & Skip Checkout Lines"}
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono bg-slate-200/70 px-2 py-0.5 rounded-full">
          {totalItemsCount} items
        </span>
      </div>

      {totalItemsCount === 0 ? (
        <div id="cart-empty-state" className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="text-4xl mb-3">🛒</div>
          <h4 className="text-sm font-bold text-slate-900">Your cart is empty</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Scan items from the physical shelves as you walk through the aisles.
          </p>
          <button
            id="cart-empty-browse-btn"
            onClick={onBrowse}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Browse Store Shelf
          </button>
        </div>
      ) : (
        <>
          {/* Delivery Address Box if Delivery Mode */}
          {fulfillmentMode === "delivery" && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">🏠</span>
                <div className="truncate max-w-[210px]">
                  <div className="font-bold text-indigo-950 truncate">{deliveryAddress}</div>
                  <div className="text-[10px] text-indigo-600">Expected ETA: 25-30 mins</div>
                </div>
              </div>
              <button
                id="cart-change-address-btn"
                onClick={onOpenDeliveryAddressModal}
                className="text-[10px] bg-white text-indigo-700 font-bold px-2 py-1 rounded shadow-2xs border border-indigo-200 shrink-0 cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          {/* Cart Item List */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {Object.entries(cart).map(([productId, quantity]) => {
              const item = products.find(p => p.id === productId);
              if (!item) return null;
              return (
                <div key={productId} id={`cart-item-${productId}`} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 max-w-[140px] truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {store.currency_symbol}{store.currency === "INR" ? item.base_price : item.base_price.toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                      <button
                        id={`cart-dec-${productId}`}
                        onClick={() => onRemoveFromCart(productId)}
                        className="w-5 h-5 rounded bg-white text-slate-700 text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-1">{quantity}</span>
                      <button
                        id={`cart-inc-${productId}`}
                        onClick={() => onAddToCart(productId)}
                        className="w-5 h-5 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs font-bold text-slate-900 min-w-[55px] text-right font-heading">
                      {store.currency_symbol}
                      {store.currency === "INR"
                        ? (item.base_price * Number(quantity)).toFixed(2)
                        : (item.base_price * Number(quantity)).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Summary Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-sm text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-medium text-slate-800">
                {store.currency_symbol}{subtotal.toFixed(2)}
              </span>
            </div>

            {fulfillmentMode === "delivery" && (
              <div className="flex justify-between text-slate-500">
                <span>Doorstep Delivery Dispatch</span>
                <span className="font-medium text-slate-800">
                  {store.currency_symbol}{deliveryFee.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>
                {store.currency === "INR" ? "GST (CGST + SGST 5%)" : `Local Sales Tax (${(store.tax_rate * 100).toFixed(2)}%)`}
              </span>
              <span className="font-medium text-slate-800">
                {store.currency_symbol}{taxAmount.toFixed(2)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-emerald-600 font-extrabold font-heading text-base">
                {store.currency_symbol}{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Action Buttons */}
          <div className="space-y-2 pt-2">
            {isCheckingOut ? (
              <div className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full css-pure-spin"></div>
                <span>Securing In-Store Payment Authorization...</span>
              </div>
            ) : (
              <>
                {store.currency === "INR" ? (
                  <>
                    <button
                      id="checkout-upi-btn"
                      onClick={() => onExecutePayment("UPI (GPay / PhonePe / Paytm)")}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-black border border-emerald-500/30">
                        UPI
                      </span>
                      <span>Pay via Instant UPI (Skip Queue)</span>
                      <span className="text-emerald-400 font-semibold ml-1">₹{totalAmount.toFixed(2)}</span>
                    </button>

                    <button
                      id="checkout-card-btn"
                      onClick={() => onExecutePayment("Credit/Debit Card (Visa / RuPay)")}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>💳</span>
                      <span>Pay with Card / Net Banking</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="checkout-apple-pay-btn"
                      onClick={() => onExecutePayment("Apple Pay")}
                      className="w-full py-3 bg-black text-white hover:bg-slate-800 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Pay Instant Checkout</span>
                      <span className="text-slate-400 font-normal">(${totalAmount.toFixed(2)})</span>
                    </button>

                    <button
                      id="checkout-card-usd-btn"
                      onClick={() => onExecutePayment("Credit Card (Visa •••• 4242)")}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
                    >
                      Pay with Saved Card (Skip Line)
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
