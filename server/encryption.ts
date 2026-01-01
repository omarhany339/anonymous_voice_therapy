import crypto from "crypto";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY, "hex");

  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encrypted: string, iv: string, authTag: string): string {
  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    key,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Hash sensitive data (one-way)
 */
export function hashData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generate random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Encrypt phone number for storage
 */
export function encryptPhoneNumber(phoneNumber: string): {
  encrypted: string;
  iv: string;
  authTag: string;
} {
  return encryptData(phoneNumber);
}

/**
 * Decrypt phone number
 */
export function decryptPhoneNumber(
  encrypted: string,
  iv: string,
  authTag: string
): string {
  return decryptData(encrypted, iv, authTag);
}
