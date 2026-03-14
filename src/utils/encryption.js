import CryptoJS from 'crypto-js';

// Must match backend key - normally injected via env vars in production build
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || '12345678901234567890123456789012';

export const encrypt = (text) => {
  if (!text) return text;
  const data = typeof text === 'object' ? JSON.stringify(text) : text;
  
  const iv = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
};

export const decrypt = (text) => {
  if (!text || typeof text !== 'string' || !text.includes(':')) return text;
  
  try {
    const textParts = text.split(':');
    const ivHex = textParts.shift();
    const encryptedHex = textParts.join(':');
    
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedHex)
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) return text;
    
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  } catch (err) {
    console.error('Decryption error', err);
    return text;
  }
};
