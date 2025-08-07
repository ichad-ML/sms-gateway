import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto
  .createHash('sha256')
  .update(String(process.env.OTP_SALT || 'default_secret_key'))
  .digest();

// AES stands for Advanced Encryption Standard
export function encryptAES(data: string): { iv: string; encrypted: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final(),
  ]);
  return {
    iv: iv.toString('hex'),
    encrypted: encrypted.toString('hex'),
  };
}

export function decryptAES(encrypted: string, iv: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(iv, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
