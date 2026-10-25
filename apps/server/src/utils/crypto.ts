import crypto from "crypto";

// 32-byte encryption key (derived from env or fallback for local dev)
const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = Buffer.from(
  (process.env.ENCRYPTION_KEY || "akeezo_secure_master_key_2026_dev_32b!").padEnd(32, "0").slice(0, 32)
);

export function encryptSensitiveField(text: string): string {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptSensitiveField(encryptedPayload: string): string {
  if (!encryptedPayload || !encryptedPayload.includes(":")) return encryptedPayload;
  try {
    const [ivHex, authTagHex, encryptedText] = encryptedPayload.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    // If decryption fails (e.g. key mismatch or raw text), return masked fallback
    return "***";
  }
}

export function maskSensitiveValue(value: string | undefined | null, visibleEndChars = 3): string {
  if (!value) return "";
  const decrypted = decryptSensitiveField(value);
  if (decrypted.length <= visibleEndChars) return decrypted;
  const maskedLength = Math.max(0, decrypted.length - visibleEndChars);
  return `${"*".repeat(maskedLength)}${decrypted.slice(-visibleEndChars)}`;
}
