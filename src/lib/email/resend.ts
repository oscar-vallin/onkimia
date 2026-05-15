import { Resend } from 'resend';
import { env } from '../env';
import { ContactEmailTemplate } from './contact-template';
import { JobApplicationEmailTemplate } from './job-application-template';

const resend = new Resend(env.RESEND_API_KEY);

interface SendContactEmailParams {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

/**
 * Envía email de notificación de contacto al equipo de Onkimia.
 * Retorna ok=true si Resend acepta el envío.
 */
export async function sendContactEmail(
  params: SendContactEmailParams
): Promise<{ ok: boolean; error?: string }> {
  const submittedAt = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const html = ContactEmailTemplate({ ...params, submittedAt });

  try {
    const { data, error } = await resend.emails.send({
      from: `Onkimia Contacto <${env.RESEND_FROM_EMAIL}>`,
      to: env.RESEND_TO_EMAIL,
      replyTo: params.email,
      subject: `Nuevo contacto: ${params.name}`,
      html,
    });

    if (error) {
      console.error('[Resend] Send error:', error);
      return { ok: false, error: error.message };
    }

    console.log('[Resend] Email sent, id:', data?.id);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Resend] Exception:', message);
    return { ok: false, error: message };
  }
}

interface SendJobApplicationParams {
  vacancyTitle: string;
  customJobDescription?: string;
  city: string;
  area: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  aboutYou: string;
  cvBuffer: Buffer;
  cvFilename: string;
}

/**
 * Envía aplicación de bolsa de trabajo con CV adjunto.
 * El PDF se adjunta al email y NO se persiste en servidor (LFPDPPP compliance).
 */
export async function sendJobApplicationEmail(
  params: SendJobApplicationParams
): Promise<{ ok: boolean; error?: string }> {
  const submittedAt = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const html = JobApplicationEmailTemplate({ ...params, submittedAt });

  try {
    const { data, error } = await resend.emails.send({
      from: `Onkimia Bolsa de Trabajo <${env.RESEND_FROM_EMAIL}>`,
      to: env.JOB_BOARD_EMAIL,
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
      console.error('[Resend Jobs] Send error:', error);
      return { ok: false, error: error.message };
    }

    console.log('[Resend Jobs] Email sent, id:', data?.id);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Resend Jobs] Exception:', message);
    return { ok: false, error: message };
  }
}
