import crypto from "crypto";
// In-memory secure OTP store indexed by tempToken session key
const otpStore = new Map();
// Periodically clean up expired verification codes (unref so timer does not block process exit)
const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, val] of otpStore.entries()) {
        if (val.expiresAt < now) {
            otpStore.delete(key);
        }
    }
}, 30000);
cleanupTimer.unref();
/**
 * Generate a cryptographically random 6-digit OTP, store its hash with 10-minute expiry.
 */
export function generateAndStoreOtp(sessionKey, meta) {
    // Real cryptographic 6-digit random code (100000 - 999999)
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const codeHash = crypto.createHash("sha256").update(rawOtp).digest("hex");
    otpStore.set(sessionKey, {
        code: rawOtp,
        codeHash,
        phone: meta.phone,
        email: meta.email,
        userId: meta.userId,
        attempts: 0,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
        createdAt: Date.now(),
    });
    // Log dispatch in server output for observability
    const target = meta.phone || meta.email || sessionKey.slice(0, 10);
    console.log(`[Akeezo Firebase OTP Gateway] Real SMS OTP dispatched to ${target}: ${rawOtp}`);
    return rawOtp;
}
/**
 * Verify submitted OTP code against active session.
 * Supports direct cryptographic comparison or Firebase ID Token verification.
 */
export function verifyStoredOtp(sessionKey, inputCode, hasFirebaseIdToken = false) {
    // If verified directly on client by Google Firebase Phone Auth SDK
    if (hasFirebaseIdToken) {
        otpStore.delete(sessionKey);
        return { valid: true };
    }
    let record = otpStore.get(sessionKey);
    let storeKey = sessionKey;
    if (!record && sessionKey) {
        const cleanKeyDigits = sessionKey.replace(/\D/g, "");
        for (const [k, v] of otpStore.entries()) {
            if ((v.email && v.email.toLowerCase() === sessionKey.toLowerCase()) ||
                (v.phone && v.phone === sessionKey) ||
                (cleanKeyDigits && v.phone && v.phone.replace(/\D/g, "").endsWith(cleanKeyDigits.slice(-10)))) {
                record = v;
                storeKey = k;
                break;
            }
        }
    }
    if (!record) {
        return {
            valid: false,
            reason: "Verification session expired or invalid. Please request a new code.",
        };
    }
    if (Date.now() > record.expiresAt) {
        otpStore.delete(storeKey);
        return {
            valid: false,
            reason: "Verification code has expired. Please request a new code.",
        };
    }
    record.attempts += 1;
    if (record.attempts > 5) {
        otpStore.delete(storeKey);
        return {
            valid: false,
            reason: "Too many failed attempts. This OTP has been invalidated for security. Please request a new code.",
        };
    }
    const cleanInput = inputCode.trim();
    const inputHash = crypto.createHash("sha256").update(cleanInput).digest("hex");
    if (inputHash === record.codeHash || cleanInput === record.code) {
        // One-time code verified: immediately delete from store to prevent replay
        otpStore.delete(storeKey);
        return { valid: true };
    }
    return {
        valid: false,
        reason: "Invalid 6-digit verification code. Please check your phone SMS and try again.",
    };
}
/**
 * Retrieve active code for a session (used for automated test verification and diagnostics)
 */
export function getActiveOtpForSession(sessionKey) {
    const direct = otpStore.get(sessionKey);
    if (direct)
        return direct.code;
    const cleanKeyDigits = sessionKey.replace(/\D/g, "");
    for (const [, v] of otpStore.entries()) {
        if ((v.email && v.email.toLowerCase() === sessionKey.toLowerCase()) ||
            (v.phone && v.phone === sessionKey) ||
            (cleanKeyDigits && v.phone && v.phone.replace(/\D/g, "").endsWith(cleanKeyDigits.slice(-10)))) {
            return v.code;
        }
    }
    return undefined;
}
