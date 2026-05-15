import { z } from 'zod';

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, { message: 'RESEND_API_KEY is required' }),
  RESEND_FROM_EMAIL: z.string().email({ message: 'RESEND_FROM_EMAIL must be valid email' }),
  RESEND_TO_EMAIL: z.string().email({ message: 'RESEND_TO_EMAIL must be valid email' }),
  TURNSTILE_SECRET_KEY: z.string().min(1, { message: 'TURNSTILE_SECRET_KEY is required' }),
  UPSTASH_REDIS_REST_URL: z.string().min(1, { message: 'UPSTASH_REDIS_REST_URL must be valid URL' }),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, { message: 'UPSTASH_REDIS_REST_TOKEN is required' }),
  // Bolsa de trabajo
  JOB_BOARD_EMAIL: z.string().email({ message: 'JOB_BOARD_EMAIL must be valid email' }),
  // SEO
  NEXT_PUBLIC_SITE_URL: z.string().min(1, { message: 'NEXT_PUBLIC_SITE_URL is required' }),
});

/**
 * Validated server-side environment variables.
 * Throws at startup if any required var is missing or invalid.
 */
export const env = envSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_TO_EMAIL: process.env.RESEND_TO_EMAIL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  JOB_BOARD_EMAIL: process.env.JOB_BOARD_EMAIL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
