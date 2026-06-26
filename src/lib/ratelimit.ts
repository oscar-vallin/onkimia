import 'server-only';

/**
 * In-memory sliding window rate limiter.
 * Stores per-IP timestamps; entries outside the window are discarded on each
 * check. Resets on server restart and is not shared across processes — fine
 * for this site's single-process deployment.
 */

interface RateLimiter {
  limit(key: string): { success: boolean };
}

function createSlidingWindowLimiter(max: number, windowMs: number): RateLimiter {
  const store = new Map<string, number[]>();

  return {
    limit(key: string) {
      const now = Date.now();
      const windowStart = now - windowMs;

      const timestamps = (store.get(key) ?? []).filter((t) => t > windowStart);
      timestamps.push(now);
      store.set(key, timestamps);

      return { success: timestamps.length <= max };
    },
  };
}

// 5 requests per hour — contact form
export const contactRatelimit = createSlidingWindowLimiter(5, 60 * 60 * 1_000);

// 3 requests per day — job application form
export const jobApplicationRatelimit = createSlidingWindowLimiter(3, 24 * 60 * 60 * 1_000);

export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}
