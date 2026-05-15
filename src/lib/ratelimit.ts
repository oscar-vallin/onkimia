import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Rate limiter para formulario de contacto.
 * 5 envíos por IP por hora.
 */
export const contactRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'ratelimit:contact',
});

/**
 * Obtiene la IP del cliente desde headers de Next.js.
 * Preferencia: cf-connecting-ip (Cloudflare) > x-forwarded-for > x-real-ip > fallback.
 */
/**
 * Rate limiter para bolsa de trabajo.
 * 3 aplicaciones por IP por día (más restrictivo que contacto).
 */
export const jobApplicationRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 d'),
  analytics: true,
  prefix: 'ratelimit:jobapp',
});

export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}
