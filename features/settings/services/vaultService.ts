type VaultScope = 'curseforge' | 'github';

type EncryptedPayload = {
  iv: string;
  data: string;
};

const STORAGE_PREFIX = 'vault:';
const SALT_KEY = `${STORAGE_PREFIX}salt`;
const SECRET = 'minecraft-mod-searcher-vault';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  if (typeof btoa === 'function') {
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
};

const fromBase64 = (value: string): Uint8Array => {
  if (typeof atob === 'function') {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(value, 'base64'));
};

const getOrCreateSalt = (): Uint8Array => {
  const stored = localStorage.getItem(SALT_KEY);
  if (stored) {
    return fromBase64(stored);
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, toBase64(salt));
  return salt;
};

const getKey = async (): Promise<CryptoKey> => {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: getOrCreateSalt(),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
};

const encrypt = async (value: string): Promise<EncryptedPayload> => {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(value),
  );

  return { iv: toBase64(iv), data: toBase64(encrypted) };
};

const decrypt = async (payload: EncryptedPayload): Promise<string> => {
  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(payload.iv) },
    key,
    fromBase64(payload.data),
  );

  return decoder.decode(decrypted);
};

export const vaultService = {
  async saveApiKey(scope: VaultScope, value: string): Promise<void> {
    const payload = await encrypt(value);
    localStorage.setItem(`${STORAGE_PREFIX}${scope}`, JSON.stringify(payload));
  },
  async getApiKey(scope: VaultScope): Promise<string | null> {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${scope}`);
    if (!stored) {
      return null;
    }

    try {
      const payload = JSON.parse(stored) as EncryptedPayload;
      return await decrypt(payload);
    } catch {
      return null;
    }
  },
  async removeApiKey(scope: VaultScope): Promise<void> {
    localStorage.removeItem(`${STORAGE_PREFIX}${scope}`);
  },
};
