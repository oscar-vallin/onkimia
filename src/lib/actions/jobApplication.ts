'use server';

import { headers } from 'next/headers';
import {
  isPdfContent,
  jobApplicationFormSchema,
  validateCvFile,
  type JobApplicationFormState,
} from '@/lib/schemas/jobApplication';
import { jobApplicationRatelimit, getClientIp } from '@/lib/ratelimit';
import { sendJobApplicationEmail } from '@/lib/email/resend';
import { sanityFetch } from '@/sanity/lib/fetch';
import { groq } from 'next-sanity';
import { getLocalized } from '@/lib/localization';
import type { JobPosting } from '@/sanity/types';

const SINGLE_JOB_QUERY = groq`
  *[_type == "jobPosting" && _id == $id && isActive == true][0] {
    _id,
    title,
    city,
    area
  }
`;

const AREA_LABELS: Record<string, string> = {
  'cuentas-por-pagar': 'Cuentas por pagar',
  'facturacion': 'Facturación',
  'tesoreria': 'Tesorería',
  'boutique': 'Boutique',
  'cobranza': 'Cobranza',
  'cotizaciones': 'Cotizaciones',
  'desarrollo-organizacional': 'Desarrollo Organizacional',
  'servicios-generales': 'Servicios Generales',
  'mercadotecnia': 'Mercadotecnia',
  'tecnologias-de-la-informacion': 'Tecnologías de la Información',
  'enlace-con-aseguradoras': 'Enlace con Aseguradoras',
  'direccion-operativa': 'Dirección Operativa',
  'atencion-al-paciente': 'Atención al Paciente',
  'atencion-medica': 'Atención Médica',
  'enfermeria': 'Enfermería',
  'administracion': 'Administración',
  'sanidad-y-regulacion': 'Sanidad y Regulación',
};

/**
 * Server Action for job board submissions.
 *
 * Flow:
 * 1. CV validation (type, size)
 * 2. Zod form validation (includes honeypot)
 * 3. Rate limit per IP (3/day)
 * 4. Send email with the CV attached via Resend
 *
 * The PDF is processed in memory and discarded — never persisted to disk (LFPDPPP).
 * TODO: create the applicant in Odoo HR once credentials are available.
 */
export async function submitJobApplication(
  _prevState: JobApplicationFormState | null,
  formData: FormData
): Promise<JobApplicationFormState> {
  // ─── 1. Validate the CV ─────────────────────────────
  const cvFile = formData.get('cv') as File | null;
  const cvError = validateCvFile(cvFile);
  if (cvError) {
    return { ok: false, errors: { cv: cvError }, message: 'validation.failed' };
  }

  // ─── 2. Validate form fields ─────────────────────────
  const rawData = {
    vacancyId: formData.get('vacancyId'),
    customJobDescription: formData.get('customJobDescription') || undefined,
    city: formData.get('city'),
    area: formData.get('area'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    birthDate: formData.get('birthDate'),
    aboutYou: formData.get('aboutYou'),
    acceptPrivacy: formData.get('acceptPrivacy') === 'on',
    _honeypot: formData.get('_honeypot') || '',
  };

  const parsed = jobApplicationFormSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors: NonNullable<JobApplicationFormState['errors']> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof NonNullable<JobApplicationFormState['errors']>;
      if (key) errors[key] = issue.message;
    });
    return { ok: false, errors, message: 'validation.failed' };
  }

  // Honeypot → silently succeed
  if (parsed.data._honeypot && parsed.data._honeypot.length > 0) {
    return { ok: true, message: 'success.sent' };
  }

  // ─── 3. Rate limit per IP ────────────────────────────
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);

  const { success: rateLimitOk } = await jobApplicationRatelimit.limit(ip);
  if (!rateLimitOk) {
    return { ok: false, message: 'error.rateLimit' };
  }

  // ─── 4. Get the vacancy title ────────────────────────
  let vacancyTitle = 'Aplicación espontánea';

  if (parsed.data.vacancyId !== 'spontaneous') {
    try {
      const job = await sanityFetch<Pick<JobPosting, '_id' | 'title' | 'city' | 'area'> | null>({
        query: SINGLE_JOB_QUERY,
        params: { id: parsed.data.vacancyId },
        tags: ['jobPosting'],
      });
      if (job) vacancyTitle = getLocalized(job.title, 'es');
    } catch (err) {
      console.error('[JobApp] Sanity fetch error:', err);
    }
  }

  // ─── 5. Convert the CV to a Buffer (in memory, never persisted) ──
  const cvBytes = await cvFile!.arrayBuffer();
  const cvBuffer = Buffer.from(cvBytes);

  // El paso 1 solo miró file.type, que lo declara el cliente. Ahora que
  // tenemos los bytes, confirmamos que sean un PDF de verdad antes de
  // adjuntarlos al correo de RH.
  if (!isPdfContent(new Uint8Array(cvBytes))) {
    console.warn('[JobApp] Archivo rechazado: declara PDF pero el contenido no lo es', {
      filename: cvFile!.name,
      declaredType: cvFile!.type,
    });
    return { ok: false, errors: { cv: 'cv.invalidType' }, message: 'validation.failed' };
  }

  // ─── 6. Send the email with the attachment ───────────
  try {
    const result = await sendJobApplicationEmail({
      vacancyTitle,
      customJobDescription: parsed.data.customJobDescription,
      city: parsed.data.city,
      area: AREA_LABELS[parsed.data.area] ?? parsed.data.area,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      birthDate: parsed.data.birthDate,
      aboutYou: parsed.data.aboutYou,
      cvBuffer,
      cvFilename: cvFile!.name,
    });

    if (!result.ok) {
      return { ok: false, message: 'error.email' };
    }

    // TODO: create the applicant in Odoo HR here
    return { ok: true, message: 'success.sent' };
  } catch (err) {
    console.error('[JobApp] Unexpected error:', err);
    return { ok: false, message: 'error.unexpected' };
  }
}
