import React, { useState } from "react";
import { ShieldCheck, KeyRound, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
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
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mt-1">
            Partner Case Operations & ERP
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
                    Staff & Admin Sign In
                  </h2>
                  <p className="text-xs text-slate-500">
                    Restricted internal portal. All access is audited.
                  </p>
                </div>
                <Lock className="w-5 h-5 text-slate-400" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@akeezo.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-teal-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
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
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-teal-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? "Authenticating..." : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: TOTP Two-Factor Authentication */
            <form onSubmit={handleSubmit2FA} className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mandatory TOTP verification for Admin / Finance.
                  </p>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-teal-600 focus:bg-white transition"
                />
                <span className="text-[10px] text-slate-400 block mt-1 text-center">
                  Pilot bypass code: <strong className="text-slate-600">123456</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || totpCode.length !== 6}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? "Verifying..." : "Verify & Enter Workspace"}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick Login (Seeded Roles)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill("priti@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-teal-600 hover:bg-slate-50 transition"
              >
                <div className="font-bold text-slate-800">Priti (CEO)</div>
                <div className="text-[10px] text-teal-700">Role: Admin (2FA)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("priya@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-teal-600 hover:bg-slate-50 transition"
              >
                <div className="font-bold text-slate-800">Priya Sharma</div>
                <div className="text-[10px] text-teal-700">Role: Coordinator</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("yogesh@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-teal-600 hover:bg-slate-50 transition"
              >
                <div className="font-bold text-slate-800">Yogesh (CTO)</div>
                <div className="text-[10px] text-teal-700">Role: Admin (2FA)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("rajesh@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-teal-600 hover:bg-slate-50 transition"
              >
                <div className="font-bold text-slate-800">Rajesh Kumar</div>
                <div className="text-[10px] text-teal-700">Role: Finance (2FA)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Compliance Footer */}
        <div className="text-center pt-4 text-[11px] text-slate-500">
          Protected by AES-256 Encryption & DPDP Act 2023 Access Governance
        </div>
      </div>
    </div>
  );
};
