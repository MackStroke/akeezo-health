import React, { useState, useEffect } from "react";
import { Lock, Mail, ArrowRight, AlertCircle, KeyRound, ShieldAlert, Smartphone, RotateCcw, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

export const AdminLoginView: React.FC = () => {
  const { login, verifyOtp, requiresPhoneOtp, maskedPhone, error, isLoading, clearError, resendOtp } = useAuth();

  const [email, setEmail] = useState("priti@akeezo.com");
  const [password, setPassword] = useState("Akeezo@2026!");
  const [otpCode, setOtpCode] = useState("123456");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendNotice(null);
    await login(email, password);
  };

  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendNotice(null);
    await verifyOtp(otpCode);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    clearError();
    setResendNotice(null);
    const success = await resendOtp();
    if (success) {
      setResendNotice("A new 6-digit verification code has been dispatched via SMS.");
      setResendCooldown(30);
    }
  };

  const handleQuickFill = (userEmail: string) => {
    clearError();
    setResendNotice(null);
    setEmail(userEmail);
    setPassword("Akeezo@2026!");
  };

  return (
    <div className="min-h-screen bg-[#061E1B] flex items-center justify-center p-4 selection:bg-[#007A6C] selection:text-white font-sans">
      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="admin-recaptcha-container"></div>

      <div className="w-full max-w-md">
        {/* Logo & Brand Header */}
        <div className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo/logo with tagline-dark.svg"
              alt="Akeezo Health"
              className="h-16 w-auto object-contain drop-shadow-md"
            />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#00C7BE] mt-1 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Website Management & Super Admin</span>
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-teal-900/40">
          {!requiresPhoneOtp ? (
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
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none transition"
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
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? "Verifying..." : "Continue to Verification"}</span>
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
                    className="text-[10px] bg-slate-100 hover:bg-[#E6F8F6] hover:text-[#007A6C] font-semibold text-slate-600 px-2.5 py-1 rounded-md transition"
                  >
                    Super Admin (Priti)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("amit@akeezo.com")}
                    className="text-[10px] bg-slate-100 hover:bg-[#E6F8F6] hover:text-[#007A6C] font-semibold text-slate-600 px-2.5 py-1 rounded-md transition"
                  >
                    Coordinator (Amit)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* STEP 2: Phone OTP Verification */
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Phone OTP Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Firebase SMS verification sent to registered phone
                  </p>
                </div>
                <Smartphone className="w-6 h-6 text-[#007A6C]" />
              </div>

              {/* Masked Phone Badge */}
              <div className="px-3 py-2 bg-teal-50/80 border border-teal-200/60 rounded-xl flex items-center justify-between text-xs text-teal-900">
                <span className="font-medium text-slate-600">SMS sent to:</span>
                <span className="font-mono font-bold text-[#007A6C]">
                  {maskedPhone || "+91 82876 39443"}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {resendNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                  {resendNotice}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  6-Digit SMS Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg py-2.5 rounded-xl border border-slate-200 focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none transition"
                />
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-slate-400">
                    Demo bypass code: <strong className="text-slate-600">123456</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-[#007A6C] hover:text-[#005F54] font-semibold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full bg-[#007A6C] hover:bg-[#005F54] active:bg-[#061E1B] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "Verifying..." : "Verify & Sign In"}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
