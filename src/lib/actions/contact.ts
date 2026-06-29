// lib/actions/contact.ts
'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type ContactFormState } from '@/lib/schemas/contact';
import { contactRatelimit, getClientIp } from '@/lib/ratelimit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { verifyTurnstile } from '@/lib/turnstile'; // TODO: re-enable with Turnstile block
import { createLead } from '@/lib/odoo/contact';

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

  // ─── 2. Honeypot — silently succeed to confuse bots ──
  if (parsed.data._honeypot) {
    return { ok: true, message: 'success.sent' };
  }

  // ─── 3. Rate limit ────────────────────────────────
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);
  const { success: rateLimitOk } = await contactRatelimit.limit(ip);

  if (!rateLimitOk) {
    console.warn('[Contact] Rate limit exceeded for IP:', ip);
    return { ok: false, message: 'error.rateLimit' };
  }

  // ─── 4. Turnstile ─────────────────────────────────
  // DESHABILITADO TEMPORALMENTE — 2026-06-29
  // Motivo: pruebas de integración en entornos sin dominio registrado
  // TODO: RE-HABILITAR ANTES DEL GO-LIVE
  // const turnstileToken = formData.get('cf-turnstile-response')?.toString() ?? '';
  // const turnstileOk    = await verifyTurnstile(turnstileToken, ip);
  // if (!turnstileOk) {
  //   return { ok: false, message: 'error.turnstile' };
  // }

  // ─── 5. Odoo CRM — bloqueante ─────────────────────
  // Odoo es el destino único. Si falla, el usuario es notificado.
  try {
    await createLead({
      name:    parsed.data.name,
      email:   parsed.data.email,
      phone:   parsed.data.phone,
      comment: parsed.data.comment,
    });
  } catch (err) {
    console.error('[Odoo] Error al crear lead de contacto:', {
      error: err instanceof Error ? err.message : String(err),
      name:  parsed.data.name,
      email: parsed.data.email,
    });
    return { ok: false, message: 'error.submit' };
  }

  return { ok: true, message: 'success.sent' };
}
