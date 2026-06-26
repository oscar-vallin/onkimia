import 'server-only';
import nodemailer from 'nodemailer';
import { env } from '../env';
import { JobApplicationEmailTemplate } from './job-application-template';

function createTransport() {
  return nodemailer.createTransport({
    host:   env.SMTP_HOST,
    port:   env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
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
 * Sends a job application email with CV attachment via SMTP.
 * The PDF is attached and NOT persisted on the server (LFPDPPP compliance).
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
    const transporter = createTransport();
    await transporter.sendMail({
      from:    env.SMTP_FROM,
      to:      env.JOB_BOARD_EMAIL,
      replyTo: params.email,
      subject: `Aplicación: ${params.vacancyTitle} — ${params.firstName} ${params.lastName}`,
      html,
      attachments: [
        {
          filename: params.cvFilename,
          content:  params.cvBuffer,
        },
      ],
    });

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[SMTP] Job application email error:', message);
    return { ok: false, error: message };
  }
}
