'use server';

import { headers } from 'next/headers';
import {
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
 * Server Action para envío de bolsa de trabajo.
 *
 * Flujo:
 * 1. Validación CV (tipo, tamaño)
 * 2. Validación Zod del form (incluye honeypot)
 * 3. Rate limit por IP (3/día)
 * 4. Envío de email con CV adjunto vía Resend
 *
 * El PDF se procesa en memoria y se descarta — no se persiste en disco (LFPDPPP).
 * TODO Tanda 9b: crear applicant en Odoo HR cuando lleguen credenciales.
 */
export async function submitJobApplication(
  _prevState: JobApplicationFormState | null,
  formData: FormData
): Promise<JobApplicationFormState> {
  // ─── 1. Validar CV ─────────────────────────────────
  const cvFile = formData.get('cv') as File | null;
  const cvError = validateCvFile(cvFile);
  if (cvError) {
    return { ok: false, errors: { cv: cvError }, message: 'validation.failed' };
  }

  // ─── 2. Validar campos del form ─────────────────────
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

  // ─── 3. Rate limit por IP ──────────────────────────
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);

  const { success: rateLimitOk } = await jobApplicationRatelimit.limit(ip);
  if (!rateLimitOk) {
    return { ok: false, message: 'error.rateLimit' };
  }

  // ─── 4. Obtener título de vacante ───────────────────
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

  // ─── 5. Convertir CV a Buffer (en memoria, no persiste) ─
  const cvBytes = await cvFile!.arrayBuffer();
  const cvBuffer = Buffer.from(cvBytes);

  // ─── 6. Enviar email con adjunto ────────────────────
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

    // TODO Tanda 9b: crear applicant en Odoo HR aquí
    return { ok: true, message: 'success.sent' };
  } catch (err) {
    console.error('[JobApp] Unexpected error:', err);
    return { ok: false, message: 'error.unexpected' };
  }
}
