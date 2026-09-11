import React, { useState } from 'react';

interface StaffLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123" || password === "retail2025" || password === "1234") {
      onLoginSuccess();
    } else {
      setError("Invalid staff security PIN. (Hint: admin123)");
    }
  };

  return (
    <div id="staff-login-modal-overlay" className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-6 css-drawer-enter">
      <div id="staff-login-dialog" className="bg-white w-full rounded-3xl p-5 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Staff Security Access
          </div>
          <button
            id="close-staff-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Store Associate Verification
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Enter staff passcode to access stock management, inventory updates, and order queues.
        </p>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            id="staff-pin-input"
            type="password"
            autoFocus
            placeholder="Enter PIN (e.g. admin123)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-center tracking-widest font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {error && (
            <div className="text-[11px] text-rose-600 font-medium text-center">
              {error}
            </div>
          )}

          <button
            id="authorize-staff-btn"
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow hover:bg-indigo-700 transition cursor-pointer"
          >
            Authorize Staff Session 🔓
          </button>
        </form>
      </div>
    </div>
  );
};
