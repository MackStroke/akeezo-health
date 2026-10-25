import React, { useState } from "react";
import { Lock, Mail, ArrowRight, AlertCircle, KeyRound, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

export const AdminLoginView: React.FC = () => {
  const { login, verify2FA, requires2FA, error, isLoading, clearError } = useAuth();

  const [email, setEmail] = useState("priti@akeezo.com");
  const [password, setPassword] = useState("Akeezo@2026!");
  const [totpCode, setTotpCode] = useState("123456");

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleSubmit2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    await verify2FA(totpCode);
  };

  const handleQuickFill = (userEmail: string) => {
    clearError();
    setEmail(userEmail);
    setPassword("Akeezo@2026!");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-teal-700 selection:text-white">
      <div className="w-full max-w-md">
        {/* Logo & Brand Header */}
        <div className="text-center pb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-700 text-white font-black text-2xl shadow-xl shadow-teal-950 mb-3 border border-teal-500/30">
            A
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            AKEEZO HEALTH
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mt-1 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Website Management & Super Admin</span>
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-800">
          {!requires2FA ? (
            /* STEP 1: Email & Password */
            <form onSubmit={handleSubmitLogin} className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Super Admin Sign In
                  </h2>
                  <p className="text-xs text-slate-500">
                    Restricted Website & System Administration
                  </p>
                </div>
                <Lock className="w-5 h-5 text-slate-400" />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Staff Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priti@akeezo.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-700 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-700 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? "Verifying..." : "Sign In to Admin Portal"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Fill Credentials */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Demo Accounts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("priti@akeezo.com")}
                    className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 font-semibold text-slate-600 px-2 py-1 rounded-md transition"
                  >
                    Super Admin (Priti)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("amit@akeezo.com")}
                    className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 font-semibold text-slate-600 px-2 py-1 rounded-md transition"
                  >
                    Coordinator (Amit)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* STEP 2: TOTP 2FA Verification */
            <form onSubmit={handleSubmit2FA} className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enter the 6-digit TOTP code from your authenticator app
                  </p>
                </div>
                <KeyRound className="w-5 h-5 text-teal-600" />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest font-mono text-lg py-2.5 rounded-xl border border-slate-200 focus:border-teal-700 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "Verifying..." : "Verify & Sign In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
