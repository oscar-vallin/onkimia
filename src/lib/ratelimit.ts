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

/** Barrido de IPs inactivas cada N llamadas — ver el comentario en limit(). */
const SWEEP_EVERY = 500;

function createSlidingWindowLimiter(max: number, windowMs: number): RateLimiter {
  const store = new Map<string, number[]>();
  let callsSinceSweep = 0;

  return {
    limit(key: string) {
      const now = Date.now();
      const windowStart = now - windowMs;

      // Las marcas viejas de una IP se descartan al consultarla, pero una IP
      // que no vuelve nunca deja su entrada en el Map para siempre: el proceso
      // es de larga vida, así que sin barrido esto crece sin techo y basta con
      // rotar IPs de origen para agotar la memoria. Amortizado cada SWEEP_EVERY
      // llamadas para no recorrer el Map en cada request.
      if (++callsSinceSweep >= SWEEP_EVERY) {
        callsSinceSweep = 0;
        for (const [ip, times] of store) {
          if (times.every((t) => t <= windowStart)) store.delete(ip);
        }
      }

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
