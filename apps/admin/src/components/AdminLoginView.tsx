import React, { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  Smartphone,
  RotateCcw,
  ShieldCheck,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

type LoginMethod = "email" | "phone";

export const AdminLoginView: React.FC = () => {
  const {
    login,
    loginWithPhoneOtp,
    loginWithEmailOtp,
    verifyOtp,
    requiresPhoneOtp,
    maskedPhone,
    error,
    isLoading,
    clearError,
    resendOtp,
    cancelOtp,
  } = useAuth();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmitPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendNotice(null);
    await login(email, password);
  };

  const handleSendEmailOtp = async () => {
    setResendNotice(null);
    clearError();
    const success = await loginWithEmailOtp(email);
    if (success) {
      setResendNotice("Verification code sent to your registered mobile via Firebase SMS.");
      setResendCooldown(30);
    }
  };

  const handleSubmitPhoneOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendNotice(null);
    clearError();
    const success = await loginWithPhoneOtp(phone);
    if (success) {
      setResendNotice("Firebase SMS dispatched with your 6-digit OTP code.");
      setResendCooldown(30);
    }
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
      setResendNotice("A new 6-digit verification code has been dispatched via Firebase SMS.");
      setResendCooldown(30);
    }
  };

  return (
    <div className="min-h-screen bg-[#061E1B] flex items-center justify-center p-4 selection:bg-[#007A6C] selection:text-white font-sans">
      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="admin-recaptcha-container"></div>

      <div className="w-full max-w-md">
        {/* Logo & Brand Header */}
        <div className="text-center pb-6">
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
        <div className="bg-white rounded-2xl shadow-2xl p-7 border border-teal-900/40">
          {!requiresPhoneOtp ? (
            <div>
              {/* Login Method Tabs */}
              <div className="flex border-b border-slate-200 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("email");
                    clearError();
                    setResendNotice(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                    loginMethod === "email"
                      ? "border-[#007A6C] text-[#007A6C]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("phone");
                    clearError();
                    setResendNotice(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                    loginMethod === "phone"
                      ? "border-[#007A6C] text-[#007A6C]"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone OTP</span>
                </button>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {loginMethod === "email" ? (
                /* OPTION 1: Email + Password & OTP Verification */
                <form onSubmit={handleSubmitPasswordLogin} className="space-y-4">
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Super Admin Sign In
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Restricted Website & System Administration
                      </p>
                    </div>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>

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

                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>{isLoading ? "Signing In..." : "Sign In with Email & Password"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={isLoading || !email}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-[#007A6C]" />
                      <span>Direct Email Sign In (Passwordless)</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* OPTION 2: Direct Phone Number Login without OTP */
                <form onSubmit={handleSubmitPhoneOtpLogin} className="space-y-4">
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Mobile Phone Sign In
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Direct authentication for staff. No OTP verification required.
                      </p>
                    </div>
                    <Smartphone className="w-4 h-4 text-[#007A6C]" />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none font-mono transition"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Include country code (e.g. <strong className="text-slate-600">+91</strong> for India)
                    </p>
                  </div>

                  <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl text-[11px] text-teal-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-[#007A6C]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Instant Access (OTP Disabled)</span>
                    </div>
                    <p className="text-slate-600 text-[10px] leading-relaxed">
                      OTP verification has been disabled. Authorized registered mobile numbers can sign in directly.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !phone}
                    className="w-full bg-[#007A6C] hover:bg-[#005F54] active:bg-[#061E1B] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? "Signing In..." : "Sign In with Mobile"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* STEP 2: Phone OTP Verification */
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <div className="flex items-center justify-between pb-1">
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
                  {maskedPhone || phone || "+91 82876 39443"}
                </span>
              </div>

              {Boolean((phone || "").replace(/\D/g, "").endsWith("9555970918")) && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-0.5">
                  <div className="font-bold">Firebase Test Phone Number:</div>
                  <div>Google Firebase does not dispatch carrier SMS to registered test numbers to preserve quota. Enter verification code: <strong className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950">123456</strong></div>
                </div>
              )}

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
                  placeholder="••••••"
                  className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg py-2.5 rounded-xl border border-slate-200 focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none transition"
                />
                <div className="flex items-center justify-end mt-1 text-[10px]">
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

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full bg-[#007A6C] hover:bg-[#005F54] active:bg-[#061E1B] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? "Verifying..." : "Verify & Sign In"}</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={cancelOtp}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email / Phone Number</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Compliance Footer */}
        <div className="text-center pt-4 text-[11px] text-teal-400/80">
          Protected by Firebase Phone Authentication & DPDP Act 2023 Access Governance
        </div>
      </div>
    </div>
  );
};
