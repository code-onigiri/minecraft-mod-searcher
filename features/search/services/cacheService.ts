type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type CacheStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const createMemoryStorage = (): CacheStorage => {
  const store = new Map<string, string>();

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
};

const storage: CacheStorage =
  typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : createMemoryStorage();

const buildKey = (params: Record<string, unknown>): string => {
  return `search:${JSON.stringify(params)}`;
};

const set = <T>(key: string, value: T, ttl: number): void => {
  const entry: CacheEntry<T> = {
    value,
    expiresAt: Date.now() + ttl,
  };

  storage.setItem(key, JSON.stringify(entry));
};

const get = <T>(key: string): T | null => {
  const raw = storage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.expiresAt) {
      storage.removeItem(key);
      return null;
    }
    return entry.value;
  } catch {
    storage.removeItem(key);
    return null;
  }
};

export const cacheService = {
  buildKey,
  set,
  get,
};
