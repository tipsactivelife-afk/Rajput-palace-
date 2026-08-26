// Uses the Web Crypto API (globalThis.crypto.subtle) rather than Node's
// `crypto` module on purpose — this file is imported from both regular
// route handlers (Node runtime) AND `src/middleware.ts` (Edge runtime),
// and Web Crypto is the one API available in both.

export const ADMIN_COOKIE_NAME = "rp_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment variables (see .env.example).",
    );
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

/** Builds the signed cookie value: "<expiryTimestamp>.<hmacSignature>" */
export async function createAdminSessionValue(): Promise<string> {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${await sign(payload)}`;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Verifies a cookie value's signature and expiry. */
export async function isAdminSessionValid(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = await sign(payload);
  if (!timingSafeEqualHex(expectedSignature, signature)) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() < expires;
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_MAX_AGE_SECONDS;

