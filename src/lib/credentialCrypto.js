// SmartBuy-BD-backend/lib/credentialCrypto.js

const crypto = require('crypto');

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getEncryptionKey() {
  const raw =
    process.env.CREDENTIALS_ENCRYPTION_KEY ||
    process.env.JWT_SECRET ||
    process.env.ADMIN_SECRET ||
    "SmartBuy-BD-dev-credentials-key";
  return crypto.createHash("sha256").update(String(raw)).digest();
}

/**
 * Encrypt a JSON object using AES-256-GCM
 * @param {Object} payload - The data to encrypt
 * @returns {string} Base64 encoded encrypted string
 */
function encryptJson(payload) {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LEN);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(payload), "utf8"),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    // Format: iv (12 bytes) + tag (16 bytes) + encrypted data
    return Buffer.concat([iv, tag, encrypted]).toString("base64");
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt credentials');
  }
}

/**
 * Decrypt a Base64 encrypted string back to JSON object
 * @param {string} blob - Base64 encrypted string
 * @returns {Object} Decrypted JSON object
 */
function decryptJson(blob) {
  if (!blob) return {};
  
  try {
    const key = getEncryptionKey();
    const buf = Buffer.from(blob, "base64");
    
    if (buf.length < IV_LEN + TAG_LEN) {
      return {};
    }
    
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const data = buf.subarray(IV_LEN + TAG_LEN);
    
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString("utf8"));
  } catch (error) {
    console.error('Decryption error:', error);
    return {};
  }
}

module.exports = {
  encryptJson,
  decryptJson,
  getEncryptionKey
};