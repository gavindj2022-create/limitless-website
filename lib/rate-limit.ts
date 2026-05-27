/**
 * In-memory rate limiter for serverless environments.
 * Uses a Map with automatic cleanup to prevent memory leaks.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  }
}

function check(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const key = `${identifier}`;
  const existing = store.get(key);

  // If no entry or window expired, start fresh
  if (!existing || now >= existing.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      reset: resetAt,
    };
  }

  // Increment count
  existing.count += 1;

  if (existing.count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: existing.resetAt,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    reset: existing.resetAt,
  };
}

/** Preset configurations */
export const rateLimitConfigs = {
  /** General API: 60 requests per minute */
  api: { maxRequests: 60, windowMs: 60_000 } satisfies RateLimitConfig,
  /** Auth endpoints: 10 requests per minute */
  auth: { maxRequests: 10, windowMs: 60_000 } satisfies RateLimitConfig,
  /** Contact form: 5 requests per minute */
  contact: { maxRequests: 5, windowMs: 60_000 } satisfies RateLimitConfig,
} as const;

export const rateLimit = {
  check,
};

export type { RateLimitConfig, RateLimitResult };
