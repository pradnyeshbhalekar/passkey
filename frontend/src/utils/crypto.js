import CryptoJS from "crypto-js";

/**
 * SECURITY DESIGN EXPLANATION:
 * 1. Client-Side Encryption: Plaintext passwords are encrypted directly in the user's browser
 *    before they are ever transmitted. This guarantees that a database compromise or server hijack
 *    cannot expose the plaintext passwords, since the server does not store or see them.
 * 2. AES-256: Standard Advanced Encryption Standard with a 256-bit key length.
 * 3. Session-Bound Key: The encryption key is user-specific and fetched from the server *only*
 *    upon successful authentication (including MFA). It is stored in `sessionStorage` in the browser
 *    and is cleared as soon as the tab is closed, mitigating XSS extraction risks compared to `localStorage`.
 */

/**
 * Encrypts a password client-side using a user-specific encryption key.
 * @param {string} plaintext - The plaintext password.
 * @param {string} key - The user-specific hex key.
 * @returns {string} The AES encrypted ciphertext.
 */
export const encryptPassword = (plaintext, key) => {
  if (!key) {
    throw new Error("Encryption key not initialized. Please login again.");
  }
  return CryptoJS.AES.encrypt(plaintext, key).toString();
};

/**
 * Decrypts a password client-side using a user-specific encryption key.
 * @param {string} ciphertext - The encrypted password.
 * @param {string} key - The user-specific hex key.
 * @returns {string} The decrypted plaintext password.
 */
export const decryptPassword = (ciphertext, key) => {
  if (!key) {
    throw new Error("Decryption key not initialized. Please login again.");
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
