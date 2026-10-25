import React, { useState, useEffect } from "react";
import { ShieldCheck, KeyRound, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Smartphone, RotateCcw } from "lucide-react";
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
      <div id="recaptcha-container"></div>

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
            <ShieldCheck className="w-4 h-4" />
            <span>Case Operations & Partner ERP</span>
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
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:bg-white transition"
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
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? "Authenticating..." : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Firebase Phone Number OTP Verification */
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Phone OTP Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Firebase SMS verification sent to registered mobile.
                  </p>
                </div>
                <Smartphone className="w-6 h-6 text-[#007A6C]" />
              </div>

              {/* Masked Phone Badge */}
              <div className="px-3 py-2 bg-teal-50/80 border border-teal-200/60 rounded-lg flex items-center justify-between text-xs text-teal-900">
                <span className="font-medium text-slate-600">SMS sent to:</span>
                <span className="font-mono font-bold text-[#007A6C]">
                  {maskedPhone || "+91 82876 39443"}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {resendNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                  {resendNotice}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  6-Digit SMS Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:bg-white transition"
                />
                <div className="flex items-center justify-between mt-1.5 text-[10px]">
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
                className="w-full py-2.5 bg-[#007A6C] hover:bg-[#005F54] active:bg-[#061E1B] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? "Verifying..." : "Verify & Enter Workspace"}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#FF6B00]" />
              <span>Quick Login (Demo Staff)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill("priti@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-[#007A6C] hover:bg-[#E6F8F6] transition"
              >
                <div className="font-bold text-slate-800">Priti (CEO)</div>
                <div className="text-[10px] text-[#007A6C] font-semibold">OTP: +91 98765 43210</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("priya@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-[#007A6C] hover:bg-[#E6F8F6] transition"
              >
                <div className="font-bold text-slate-800">Priya Sharma</div>
                <div className="text-[10px] text-[#007A6C] font-semibold">OTP: +91 98765 43211</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("yogesh@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-[#007A6C] hover:bg-[#E6F8F6] transition"
              >
                <div className="font-bold text-slate-800">Yogesh (CTO)</div>
                <div className="text-[10px] text-[#007A6C] font-semibold">OTP: +91 82876 39443</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("rajesh@akeezo.com")}
                className="p-2 text-left rounded border border-slate-200 hover:border-[#007A6C] hover:bg-[#E6F8F6] transition"
              >
                <div className="font-bold text-slate-800">Rajesh Kumar</div>
                <div className="text-[10px] text-[#007A6C] font-semibold">OTP: +91 98765 43213</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Compliance Footer */}
        <div className="text-center pt-4 text-[11px] text-teal-400/80">
          Protected by Firebase Phone Authentication & DPDP Act 2023 Access Governance
        </div>
      </div>
    </div>
  );
};
