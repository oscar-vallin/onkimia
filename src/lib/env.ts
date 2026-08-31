import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  // ── Resend (correo de candidatos / bolsa de trabajo) ─────────────────────────
  // Optional at startup — required only when the job application form is used.
  RESEND_API_KEY:    z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // ── Odoo CRM ─────────────────────────────────────────────────────────────────
  ODOO_URL:      z.string().url({ message: 'ODOO_URL must be a valid URL' }),
  ODOO_DATABASE: z.string().min(1, { message: 'ODOO_DATABASE is required' }),
  ODOO_USERNAME: z.string().min(1, { message: 'ODOO_USERNAME is required' }),
  ODOO_API_KEY:  z.string().min(1, { message: 'ODOO_API_KEY is required' }),

  // ── Bolsa de trabajo ──────────────────────────────────────────────────────────
  JOB_BOARD_EMAIL: z.string().email({ message: 'JOB_BOARD_EMAIL must be a valid email' }),

  // ── Respaldo del formulario de contacto ───────────────────────────────────────
  // Destino del correo que se envía cuando Odoo rechaza un lead. Opcional: sin
  // ella el respaldo cae en JOB_BOARD_EMAIL (ver src/lib/email/resend.ts).
  CONTACT_FALLBACK_EMAIL: z
    .string()
    .email({ message: 'CONTACT_FALLBACK_EMAIL must be a valid email' })
    .optional(),

  // ── SEO ───────────────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SITE_URL: z.string().min(1, { message: 'NEXT_PUBLIC_SITE_URL is required' }),
});

/**
 * Validated server-side environment variables.
 * Throws at startup if any required variable is missing or invalid —
 * so misconfigurations are caught on boot, not in production at request time.
 */
export const env = envSchema.parse({
  RESEND_API_KEY:    process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,

  ODOO_URL:      process.env.ODOO_URL,
  ODOO_DATABASE: process.env.ODOO_DATABASE,
  ODOO_USERNAME: process.env.ODOO_USERNAME,
  ODOO_API_KEY:  process.env.ODOO_API_KEY,

  JOB_BOARD_EMAIL:        process.env.JOB_BOARD_EMAIL,
  CONTACT_FALLBACK_EMAIL: process.env.CONTACT_FALLBACK_EMAIL,
  NEXT_PUBLIC_SITE_URL:   process.env.NEXT_PUBLIC_SITE_URL,
});
