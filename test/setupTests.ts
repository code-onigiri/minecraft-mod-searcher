import '@testing-library/jest-dom/vitest';

if (!globalThis.crypto) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	globalThis.crypto = require('node:crypto').webcrypto;
}
