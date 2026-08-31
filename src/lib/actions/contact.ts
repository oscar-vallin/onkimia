// lib/actions/contact.ts
'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type ContactFormState } from '@/lib/schemas/contact';
import { contactRatelimit, getClientIp } from '@/lib/ratelimit';
import { createLead } from '@/lib/odoo/contact';
import { sendContactFallbackEmail } from '@/lib/email/resend';

export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {

  // ─── 1. Zod validation ────────────────────────────
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

  // ─── 4. Odoo CRM, con respaldo por correo ─────────
  // Odoo es el destino principal. Si falla —credenciales vencidas, CRM caído—
  // el prospecto NO se descarta: se envía por correo a Onkimia. Ese correo es
  // además la única señal de que el CRM dejó de recibir, así que vale por
  // captura y por alerta al mismo tiempo.
  try {
    await createLead({
      name:    parsed.data.name,
      email:   parsed.data.email,
      phone:   parsed.data.phone,
      comment: parsed.data.comment,
    });
  } catch (err) {
    const odooError = err instanceof Error ? err.message : String(err);
    console.error('[Odoo] Error creating contact lead:', {
      error: odooError,
      name:  parsed.data.name,
      email: parsed.data.email,
    });

    const fallback = await sendContactFallbackEmail({
      name:    parsed.data.name,
      email:   parsed.data.email,
      phone:   parsed.data.phone,
      comment: parsed.data.comment,
      odooError,
    });

    if (!fallback.ok) {
      // Odoo y el correo fallaron: el prospecto sí se perdió y hay que
      // decírselo al usuario para que intente por otro canal.
      console.error('[Contact] Prospecto PERDIDO — Odoo y el respaldo fallaron:', {
        name:  parsed.data.name,
        email: parsed.data.email,
      });
      return { ok: false, message: 'error.submit' };
    }

    console.warn('[Contact] Odoo rechazó el lead; se envió por correo de respaldo.');
    // Para el usuario el mensaje sí llegó a Onkimia — porque llegó.
    return { ok: true, message: 'success.sent' };
  }

  return { ok: true, message: 'success.sent' };
}
