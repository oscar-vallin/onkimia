// lib/actions/contact.ts
'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type ContactFormState } from '@/lib/schemas/contact';
import { contactRatelimit, getClientIp } from '@/lib/ratelimit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendContactEmail } from '@/lib/email/resend';
import { createLead } from '@/lib/odoo/contact'; // ← única línea nueva en imports

export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {

  // ─── 1. Validación Zod ────────────────────────────
  const rawData = {
    name:          formData.get('name'),
    email:         formData.get('email'),
    phone:         formData.get('phone'),
    comment:       formData.get('comment'),
    acceptPrivacy: formData.get('acceptPrivacy') === 'on',
    _honeypot:     formData.get('_honeypot') || '',
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

  // Honeypot → silently succeed
  if (parsed.data._honeypot && parsed.data._honeypot.length > 0) {
    return { ok: true, message: 'success.sent' };
  }

  // ─── 2. Rate limit ────────────────────────────────
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);
  const { success: rateLimitOk } = await contactRatelimit.limit(ip);

  if (!rateLimitOk) {
    console.warn('[Contact] Rate limit exceeded for IP:', ip);
    return { ok: false, message: 'error.rateLimit' };
  }

  // ─── 3. Turnstile ─────────────────────────────────
  const turnstileToken = formData.get('cf-turnstile-response')?.toString() ?? '';
  const turnstileOk    = await verifyTurnstile(turnstileToken, ip);

  if (!turnstileOk) {
    return { ok: false, message: 'error.turnstile' };
  }

  // ─── 4. Email ─────────────────────────────────────
  try {
    const emailResult = await sendContactEmail({
      name:    parsed.data.name,
      email:   parsed.data.email,
      phone:   parsed.data.phone,
      comment: parsed.data.comment,
    });

    if (!emailResult.ok) {
      return { ok: false, message: 'error.email' };
    }
  } catch (err) {
    console.error('[Contact] Email error:', err);
    return { ok: false, message: 'error.unexpected' };
  }

  // ─── 5. Odoo CRM — fire and forget ───────────────
  // Si Odoo falla el usuario NO se entera: el email ya fue enviado.
  // El ID del lead queda en los logs del servidor para auditoría.
  createLead({
    name:    parsed.data.name,
    email:   parsed.data.email,
    phone:   parsed.data.phone,
    comment: parsed.data.comment,
  })
    .then((leadId) => {
      console.info('[Odoo] Lead creado, ID:', leadId);
    })
    .catch((err) => {
      console.error('[Odoo] Error al crear lead (no bloqueante):', err);
    });

  return { ok: true, message: 'success.sent' };
}