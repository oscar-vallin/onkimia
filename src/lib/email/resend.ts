import 'server-only';
import { Resend } from 'resend';
import { JobApplicationEmailTemplate } from './job-application-template';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const submittedAt = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const html = JobApplicationEmailTemplate({
    ...params,
    aboutYou: params.aboutYou ?? '',
    submittedAt,
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
