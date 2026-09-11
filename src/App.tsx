/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MOCK_STORES,
  INITIAL_PRODUCTS_INR,
  INITIAL_PRODUCTS_USD,
  INITIAL_CUSTOMER_REQUESTS,
} from './data/mockData';
import {
  Product,
  OrderReceipt,
  CustomerRequest,
  ActiveTab,
  FulfillmentMode,
} from './types';
import { DesktopSidebar } from './components/DesktopSidebar';
import { PhoneHeader } from './components/PhoneHeader';
import { PhoneBottomNav } from './components/PhoneBottomNav';
import { BrowseView } from './components/BrowseView';
import { ScannerView } from './components/ScannerView';
import { RequestView } from './components/RequestView';
import { CartView } from './components/CartView';
import { ReceiptView } from './components/ReceiptView';
import { StaffPortalView } from './components/StaffPortalView';
import { AddItemModal } from './components/AddItemModal';
import { StaffLoginModal } from './components/StaffLoginModal';
import { DeliveryAddressModal } from './components/DeliveryAddressModal';

export default function App() {
  // Store Selection (Indian Stores & US Stores matching mockups)
  const [currentStoreCode, setCurrentStoreCode] = useState<string>("STORE-BLR-104");
  const store = useMemo(() => MOCK_STORES[currentStoreCode] || MOCK_STORES["STORE-BLR-104"], [currentStoreCode]);

  // Product Catalog (defaults to INR or USD based on store currency)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS_INR);

  // Synchronize initial products when store currency changes
  useEffect(() => {
    if (store.currency === "USD") {
      setProducts(INITIAL_PRODUCTS_USD);
    } else {
      setProducts(INITIAL_PRODUCTS_INR);
    }
  }, [store.currency]);

  // Fulfillment Mode: "instore" (Scan & Go) vs "delivery" (Fast 30-Min Delivery)
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>("instore");

  // Navigation Tabs: 'shop', 'scanner', 'request', 'cart', 'receipt', 'staff'
  const [activeTab, setActiveTab] = useState<ActiveTab>("shop");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Cart State: { [productId]: quantity }
  const [cart, setCart] = useState<Record<string, number>>({
    "prod-001": 1,
    "prod-003": 2,
  });
  const [cartBadgeTrigger, setCartBadgeTrigger] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Home Delivery Address State
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103"
  );
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  // Checkout flow states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lastPaidOrder, setLastPaidOrder] = useState<OrderReceipt | null>(null);

  // IRCTC-Style Security Gate Pass Countdown Timer (in seconds)
  const [passTimeLeft, setPassTimeLeft] = useState<number>(900); // 15:00
  const [liveClockString, setLiveClockString] = useState<string>("");

  // Customer Missing Item Requests
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>(INITIAL_CUSTOMER_REQUESTS);
  const [requestPrefill, setRequestPrefill] = useState<{ name: string; brand: string }>({ name: "", brand: "" });

  // Staff Portal Auth & Modals
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [showStaffLoginModal, setShowStaffLoginModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Live countdown timer for receipt exit pass
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeTab === "receipt" && lastPaidOrder) {
      interval = setInterval(() => {
        setPassTimeLeft(prev => (prev <= 1 ? 900 : prev - 1));
        const now = new Date();
        setLiveClockString(
          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, lastPaidOrder]);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(passTimeLeft / 60);
    const secs = passTimeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [passTimeLeft]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart Badge Bounce Animation Trigger
  const triggerCartBadgeAnimation = () => {
    setCartBadgeTrigger(true);
    setTimeout(() => setCartBadgeTrigger(false), 500);
  };

  // Cart Operations
  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    triggerCartBadgeAnimation();
    showToast(`Added ${product.name.slice(0, 20)}... to cart (${store.currency_symbol}${store.currency === "INR" ? product.base_price : product.base_price.toFixed(2)})`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
    triggerCartBadgeAnimation();
  };

  const totalItemsCount = useMemo(() => {
    return Object.values(cart).reduce((sum: number, qty: number) => sum + Number(qty), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum: number, [pId, qty]) => {
      const item = products.find(p => p.id === pId);
      return sum + (item ? item.base_price * Number(qty) : 0);
    }, 0);
  }, [cart, products]);

  // Handle Payment Execution
  const handleExecutePayment = (paymentMethod: string) => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const now = new Date();
      const deliveryFee = fulfillmentMode === "delivery" ? (store.currency === "INR" ? 30 : 2.99) : 0;
      const taxAmount = subtotal * store.tax_rate;
      const totalAmount = subtotal + taxAmount + deliveryFee;

      const orderReceipt: OrderReceipt = {
        orderId: (store.currency === "INR" ? "ORD-IND-" : "ORD-US-") + Math.floor(100000 + Math.random() * 900000),
        date: now.toLocaleDateString(store.currency === "INR" ? 'en-IN' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + " at " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        storeName: store.name,
        storeCode: store.store_code,
        items: Object.entries(cart).map(([pId, qty]) => {
          const p = products.find(prod => prod.id === pId)!;
          return { ...p, quantity: qty };
        }),
        fulfillmentMode,
        deliveryAddress: fulfillmentMode === "delivery" ? deliveryAddress : null,
        subtotal,
        deliveryFee,
        tax: taxAmount,
        total: totalAmount,
        paymentMethod,
        exitPassBarcode: (store.currency === "INR" ? "EXPASS-IN-" : "EXPASS-US-") + Math.random().toString(36).substring(2, 9).toUpperCase(),
        securityHash: "SEC-" + Math.random().toString(16).substring(2, 10).toUpperCase(),
        gateTerminal: "GATE-04 (WEST EXIT)",
      };

      setLastPaidOrder(orderReceipt);
      setPassTimeLeft(900);
      setLiveClockString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCart({});
      setIsCheckingOut(false);
      setActiveTab("receipt");
    }, 1200);
  };

  // Submit missing item request
  const handleCustomerRequestSubmit = (newReqData: Omit<CustomerRequest, 'id' | 'time' | 'status'>) => {
    const newReq: CustomerRequest = {
      ...newReqData,
      id: "req-" + Date.now(),
      status: "new",
      time: "Just now",
    };
    setCustomerRequests(prev => [newReq, ...prev]);
    showToast("Request submitted directly to store procurement team!");
  };

  // Add Item to Store Catalog
  const handleAddNewProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setShowAddItemModal(false);
    setActiveTab("shop");
    showToast(`Added "${newProduct.name.slice(0, 20)}..." to store shelf! 📦`);
  };

  // Toggle Product In-Stock / Out-of-Stock
  const handleUpdateProductStock = (productId: string) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const nextState = !item.is_in_stock;
          return {
            ...item,
            is_in_stock: nextState,
            stock_quantity: nextState ? 20 : 0,
          };
        }
        return item;
      })
    );
  };

  // Update Customer Request Status
  const handleUpdateRequestStatus = (requestId: string, newStatus: CustomerRequest['status']) => {
    setCustomerRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div id="retailflow-app-root" className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8 bg-slate-950 text-slate-100">
      
      {/* DESKTOP SIDEBAR: EXPLAINER & ARCHITECTURE CONTROLS */}
      <DesktopSidebar
        currentStoreCode={currentStoreCode}
        onSelectStore={(code) => setCurrentStoreCode(code)}
        productsCount={products.length}
        onOpenAddItem={() => setShowAddItemModal(true)}
        isStaffLoggedIn={isStaffLoggedIn}
        onOpenStaffLogin={() => setShowStaffLoginModal(true)}
        onStaffLogout={() => {
          setIsStaffLoggedIn(false);
          showToast("Logged out of staff session");
          if (activeTab === "staff") setActiveTab("shop");
        }}
        activeStore={store}
      />

      {/* MOBILE SCREEN FRAME */}
      <div id="mobile-viewport-shell" className="mobile-screen-frame text-slate-900 shadow-2xl">
        
        {/* Phone Header (Status Bar, In-Store Banner, Fulfillment Switcher) */}
        <PhoneHeader
          store={store}
          fulfillmentMode={fulfillmentMode}
          onSelectFulfillment={(mode) => setFulfillmentMode(mode)}
          onOpenAddItem={() => setShowAddItemModal(true)}
          isStaffLoggedIn={isStaffLoggedIn}
          activeTab={activeTab}
          onToggleStaffMode={() => setActiveTab(activeTab === "staff" ? "shop" : "staff")}
        />

        {/* Animated Toast Notification */}
        {toastMessage && (
          <div
            id="app-toast-notification"
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 css-toast-in bg-slate-900/95 text-white text-xs px-3.5 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 pointer-events-none whitespace-nowrap"
          >
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main id="mobile-main-scrollable" className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-slate-50">
          {activeTab === "shop" && (
            <BrowseView
              store={store}
              fulfillmentMode={fulfillmentMode}
              products={products}
              cart={cart}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onOpenScanner={() => setActiveTab("scanner")}
              onOpenRequest={(pName, pBrand) => {
                setRequestPrefill({ name: pName || "", brand: pBrand || "" });
                setActiveTab("request");
              }}
              onOpenAddItem={() => setShowAddItemModal(true)}
              onOpenDeliveryAddressModal={() => setShowDeliveryModal(true)}
              deliveryAddress={deliveryAddress}
            />
          )}

          {activeTab === "scanner" && (
            <ScannerView
              store={store}
              products={products}
              subtotal={subtotal}
              totalItemsCount={totalItemsCount}
              onAddToCart={handleAddToCart}
              onGoToCart={() => setActiveTab("cart")}
              onShowToast={showToast}
            />
          )}

          {activeTab === "request" && (
            <RequestView
              store={store}
              customerRequests={customerRequests}
              onSubmitRequest={handleCustomerRequestSubmit}
              prefillName={requestPrefill.name}
              prefillBrand={requestPrefill.brand}
            />
          )}

          {activeTab === "cart" && (
            <CartView
              store={store}
              fulfillmentMode={fulfillmentMode}
              deliveryAddress={deliveryAddress}
              cart={cart}
              products={products}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onBrowse={() => setActiveTab("shop")}
              onExecutePayment={handleExecutePayment}
              isCheckingOut={isCheckingOut}
              onOpenDeliveryAddressModal={() => setShowDeliveryModal(true)}
            />
          )}

          {activeTab === "receipt" && lastPaidOrder && (
            <ReceiptView
              receipt={lastPaidOrder}
              store={store}
              formattedTimer={formattedTimer}
              liveClockString={liveClockString}
              onStartNewTrip={() => setActiveTab("shop")}
            />
          )}

          {activeTab === "staff" && isStaffLoggedIn && (
            <StaffPortalView
              store={store}
              products={products}
              customerRequests={customerRequests}
              onOpenAddItem={() => setShowAddItemModal(true)}
              onUpdateProductStock={handleUpdateProductStock}
              onUpdateRequestStatus={handleUpdateRequestStatus}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* NATIVE BOTTOM NAVIGATION DOCK */}
        <PhoneBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          totalItemsCount={totalItemsCount}
          cartBadgeTrigger={cartBadgeTrigger}
        />

        {/* MODAL: ADD ITEM TO STORE INVENTORY */}
        {showAddItemModal && (
          <AddItemModal
            store={store}
            onClose={() => setShowAddItemModal(false)}
            onAddProduct={handleAddNewProduct}
          />
        )}

        {/* MODAL: STAFF PIN SECURITY VERIFICATION */}
        {showStaffLoginModal && (
          <StaffLoginModal
            onClose={() => setShowStaffLoginModal(false)}
            onLoginSuccess={() => {
              setIsStaffLoggedIn(true);
              setShowStaffLoginModal(false);
              showToast("Staff Access Granted: Inventory Management Unlocked 🔐");
            }}
          />
        )}

        {/* MODAL: HOME DELIVERY ADDRESS */}
        {showDeliveryModal && (
          <DeliveryAddressModal
            store={store}
            currentAddress={deliveryAddress}
            onClose={() => setShowDeliveryModal(false)}
            onSaveAddress={(newAddr) => {
              setDeliveryAddress(newAddr);
              setShowDeliveryModal(false);
              showToast("Delivery address updated successfully");
            }}
          />
        )}
      </div>
    </div>
  );
}
