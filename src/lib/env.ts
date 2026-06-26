import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  // ── SMTP (correo de candidatos / bolsa de trabajo) ──────────────────────────
  // Optional at startup — required only when the job application form is used.
  // If any var is missing, sendJobApplicationEmail throws a descriptive error.
  SMTP_HOST:     z.string().optional(),
  SMTP_PORT:     z.preprocess((v) => (v === '' || v == null ? undefined : Number(v)), z.number().int().positive().optional()),
  SMTP_SECURE:   z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  SMTP_USER:     z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM:     z.string().optional(),

  // ── Odoo CRM ─────────────────────────────────────────────────────────────────
  ODOO_URL:      z.string().url({ message: 'ODOO_URL must be a valid URL' }),
  ODOO_DATABASE: z.string().min(1, { message: 'ODOO_DATABASE is required' }),
  ODOO_USERNAME: z.string().min(1, { message: 'ODOO_USERNAME is required' }),
  ODOO_API_KEY:  z.string().min(1, { message: 'ODOO_API_KEY is required' }),

  // ── Turnstile (CAPTCHA) ───────────────────────────────────────────────────────
  TURNSTILE_SECRET_KEY: z.string().min(1, { message: 'TURNSTILE_SECRET_KEY is required' }),

  // ── Bolsa de trabajo ──────────────────────────────────────────────────────────
  JOB_BOARD_EMAIL: z.string().email({ message: 'JOB_BOARD_EMAIL must be a valid email' }),

  // ── SEO ───────────────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SITE_URL: z.string().min(1, { message: 'NEXT_PUBLIC_SITE_URL is required' }),
});

/**
 * Validated server-side environment variables.
 * Throws at startup if any required variable is missing or invalid —
 * so misconfigurations are caught on boot, not in production at request time.
 */
export const env = envSchema.parse({
  SMTP_HOST:     process.env.SMTP_HOST ?? '',
  SMTP_PORT:     process.env.SMTP_PORT ?? '',
  SMTP_SECURE:   process.env.SMTP_SECURE ?? 'false',
  SMTP_USER:     process.env.SMTP_USER ?? '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? '',
  SMTP_FROM:     process.env.SMTP_FROM ?? '',

  ODOO_URL:      process.env.ODOO_URL,
  ODOO_DATABASE: process.env.ODOO_DATABASE,
  ODOO_USERNAME: process.env.ODOO_USERNAME,
  ODOO_API_KEY:  process.env.ODOO_API_KEY,

  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,

  JOB_BOARD_EMAIL:      process.env.JOB_BOARD_EMAIL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
