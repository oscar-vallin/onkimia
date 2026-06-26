// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';

function makeRatelimiter(prefix: string, limiter: Ratelimit['limiter']) {
  return new Ratelimit({
    redis: new Redis({
      url:   env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter,
    analytics: true,
    prefix,
  });
}

// Estos se crean la primera vez que el módulo se importa DENTRO de un request,
// no durante el bundle/compile step.
export const contactRatelimit        = makeRatelimiter('ratelimit:contact', Ratelimit.slidingWindow(5, '1 h'));
export const jobApplicationRatelimit = makeRatelimiter('ratelimit:jobapp',  Ratelimit.slidingWindow(3, '1 d'));

export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}