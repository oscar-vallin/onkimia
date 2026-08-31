import 'server-only';
import { Resend } from 'resend';
import { JobApplicationEmailTemplate } from './job-application-template';
import { ContactLeadEmailTemplate } from './contact-lead-template';

const resend = new Resend(process.env.RESEND_API_KEY);

function formatTimestamp(): string {
  return new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export interface SendJobApplicationParams {
  vacancyTitle: string;
  customJobDescription?: string;
  city: string;
  area: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  aboutYou?: string;
  cvBuffer: Buffer;
  cvFilename: string;
}

export async function sendJobApplicationEmail(
  params: SendJobApplicationParams
): Promise<{ ok: boolean }> {
  const html = JobApplicationEmailTemplate({
    ...params,
    aboutYou: params.aboutYou ?? '',
    submittedAt: formatTimestamp(),
  });

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.JOB_BOARD_EMAIL!,
      replyTo: params.email,
      subject: `Aplicación: ${params.vacancyTitle} — ${params.firstName} ${params.lastName}`,
      html,
      attachments: [
        {
          filename: params.cvFilename,
          content: params.cvBuffer,
        },
      ],
    });

    if (error) {
      console.error('[Resend] Error:', error);
      return { ok: false };
    }

    return { ok: true };
  } catch (err) {
    console.error('[Resend] Unexpected error:', err);
    return { ok: false };
  }
}

export interface SendContactFallbackParams {
  name: string;
  email: string;
  phone: string;
  comment: string;
  odooError: string;
}

/**
 * Respaldo del formulario de contacto cuando Odoo rechaza el lead.
 *
 * El destino es CONTACT_FALLBACK_EMAIL; si no está configurada cae en
 * JOB_BOARD_EMAIL, que al menos llega a alguien de Onkimia. Sin ninguna de las
 * dos no hay a dónde enviar y devolvemos ok:false para que el action muestre
 * el error al usuario en vez de dar por bueno un prospecto que se perdió.
 */
export async function sendContactFallbackEmail(
  params: SendContactFallbackParams
): Promise<{ ok: boolean }> {
  const to = process.env.CONTACT_FALLBACK_EMAIL ?? process.env.JOB_BOARD_EMAIL;

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !to) {
    console.error(
      '[Resend] Respaldo de contacto no configurado — se requiere RESEND_API_KEY, ' +
        'RESEND_FROM_EMAIL y CONTACT_FALLBACK_EMAIL (o JOB_BOARD_EMAIL)'
    );
    return { ok: false };
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      replyTo: params.email,
      subject: `⚠️ Prospecto sin registrar en Odoo — ${params.name}`,
      html: ContactLeadEmailTemplate({ ...params, submittedAt: formatTimestamp() }),
    });

    if (error) {
      console.error('[Resend] Error enviando respaldo de contacto:', error);
      return { ok: false };
    }

    return { ok: true };
  } catch (err) {
    console.error('[Resend] Error inesperado enviando respaldo de contacto:', err);
    return { ok: false };
  }
}
