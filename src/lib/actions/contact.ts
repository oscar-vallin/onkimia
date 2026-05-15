'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type ContactFormState } from '@/lib/schemas/contact';
import { contactRatelimit, getClientIp } from '@/lib/ratelimit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendContactEmail } from '@/lib/email/resend';

/**
 * Server Action para envío de formulario de contacto.
 *
 * Flujo:
 * 1. Validación Zod (incluye honeypot)
 * 2. Rate limit por IP (5/hora)
 * 3. Verificación Cloudflare Turnstile
 * 4. Envío de email vía Resend
 *
 * TODO Tanda 8C: integración Odoo CRM
 */
export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  // ─── 1. Extraer y validar datos ────────────────────
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    comment: formData.get('comment'),
    acceptPrivacy: formData.get('acceptPrivacy') === 'on',
    _honeypot: formData.get('_honeypot') || '',
  };

  const parsed = contactFormSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors: NonNullable<ContactFormState['errors']> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof NonNullable<ContactFormState['errors']>;
      if (key) errors[key] = issue.message;
    });

    return { ok: false, errors, message: 'validation.failed' };
  }

  // Honeypot disparado → silently succeed
  if (parsed.data._honeypot && parsed.data._honeypot.length > 0) {
    return { ok: true, message: 'success.sent' };
  }

  // ─── 2. Rate limit por IP ──────────────────────────
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);

  const { success: rateLimitOk } = await contactRatelimit.limit(ip);

  if (!rateLimitOk) {
    console.warn('[Contact] Rate limit exceeded for IP:', ip);
    return { ok: false, message: 'error.rateLimit' };
  }

  // ─── 3. Verificar Turnstile ────────────────────────
  const turnstileToken = formData.get('cf-turnstile-response')?.toString() ?? '';
  const turnstileOk = await verifyTurnstile(turnstileToken, ip);

  if (!turnstileOk) {
    return { ok: false, message: 'error.turnstile' };
  }

  // ─── 4. Enviar email ───────────────────────────────
  try {
    const result = await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      comment: parsed.data.comment,
    });

    if (!result.ok) {
      return { ok: false, message: 'error.email' };
    }

    // TODO Tanda 8C: crear lead en Odoo CRM aquí
    // Si Odoo falla, NO retornar error al usuario (email ya fue enviado)

    return { ok: true, message: 'success.sent' };
  } catch (err) {
    console.error('[Contact] Unexpected error:', err);
    return { ok: false, message: 'error.unexpected' };
  }
}
