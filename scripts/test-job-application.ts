/**
 * Prueba de integración de la BOLSA DE TRABAJO → correo (Resend).
 *
 *   pnpm test:jobs          valida todo y ENVÍA un correo real a JOB_BOARD_EMAIL
 *   pnpm test:jobs --dry    valida y renderiza la plantilla, sin enviar
 *
 * Ejercita la misma cadena que el Server Action
 * (src/lib/actions/jobApplication.ts): validateCvFile →
 * jobApplicationFormSchema → JobApplicationEmailTemplate →
 * sendJobApplicationEmail.
 *
 * OJO: sin --dry esto manda un correo de verdad, con PDF adjunto, a la
 * dirección de JOB_BOARD_EMAIL. No hay modo sandbox en Resend, así que el
 * envío es observable solo abriendo esa bandeja.
 */

import {
  isPdfContent,
  jobApplicationFormSchema,
  validateCvFile,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/schemas/jobApplication';
import { JobApplicationEmailTemplate } from '@/lib/email/job-application-template';
import { sendJobApplicationEmail } from '@/lib/email/resend';
import { assert, check, fail, finish, info, pass, section, skip, warn } from './lib/report';

const DRY = process.argv.includes('--dry');
const RUN_ID = `QA-${Date.now()}`;

/** PDF mínimo válido (cabecera + un objeto), suficiente para adjuntar. */
function makePdf(sizeBytes = 2048): Buffer {
  const header = '%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n';
  const footer = '\n%%EOF\n';
  const padding = 'x'.repeat(Math.max(0, sizeBytes - header.length - footer.length));
  return Buffer.from(header + padding + footer, 'utf-8');
}

/** File sintético para validateCvFile, que solo lee size/type/name. */
function fakeFile(name: string, type: string, size: number): File {
  return { name, type, size } as File;
}

const VALID_INPUT = {
  vacancyId: 'spontaneous',
  customJobDescription: `Prueba automatizada ${RUN_ID}`,
  city: 'guadalajara' as const,
  area: 'tecnologias-de-la-informacion',
  firstName: 'QA',
  lastName: 'Bot Onkimia',
  email: 'qa@onkimia-test.com',
  phone: '3312345678',
  birthDate: '1990-05-15',
  aboutYou:
    'Este es un envío de prueba automatizado para verificar el flujo de la bolsa de trabajo.',
  acceptPrivacy: true,
  _honeypot: '',
};

async function main() {
  // ── 1. Entorno ────────────────────────────────────────────────────────────
  section('1 · Entorno');

  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.JOB_BOARD_EMAIL;

  if (process.env.RESEND_API_KEY) pass('RESEND_API_KEY', 'presente (oculta)');
  else fail('RESEND_API_KEY', 'ausente — el envío fallará');

  if (from) pass('RESEND_FROM_EMAIL', from);
  else fail('RESEND_FROM_EMAIL', 'ausente');

  if (to) pass('JOB_BOARD_EMAIL', to);
  else fail('JOB_BOARD_EMAIL', 'ausente — no hay destinatario');

  if (from === 'onboarding@resend.dev') {
    warn(
      'RESEND_FROM_EMAIL es el remitente sandbox de Resend: solo entrega al correo ' +
        'dueño de la cuenta. Antes de producción hay que verificar un dominio propio.'
    );
  }
  if (process.env.RESEND_TO_EMAIL && process.env.RESEND_TO_EMAIL !== to) {
    warn(
      `RESEND_TO_EMAIL (${process.env.RESEND_TO_EMAIL}) está en .env.local pero el ` +
        'código no la lee: resend.ts envía a JOB_BOARD_EMAIL.'
    );
  }

  // ── 2. Validación del CV ──────────────────────────────────────────────────
  section('2 · Validación del archivo (validateCvFile)');

  const cvCases: Array<[string, File | null, string | null]> = [
    ['PDF de 1 MB', fakeFile('cv.pdf', 'application/pdf', 1024 * 1024), null],
    ['PDF en el límite exacto (5 MB)', fakeFile('cv.pdf', 'application/pdf', MAX_FILE_SIZE_BYTES), null],
    ['Sin archivo', null, 'cv.required'],
    ['Archivo vacío', fakeFile('cv.pdf', 'application/pdf', 0), 'cv.required'],
    ['PDF de 6 MB', fakeFile('cv.pdf', 'application/pdf', 6 * 1024 * 1024), 'cv.tooLarge'],
    ['Word en vez de PDF', fakeFile('cv.docx', 'application/msword', 1024), 'cv.invalidType'],
    ['Imagen renombrada a .pdf', fakeFile('cv.pdf', 'image/png', 1024), 'cv.invalidType'],
  ];

  for (const [label, file, expected] of cvCases) {
    await check(`${label} → ${expected ?? 'OK'}`, () => {
      const got = validateCvFile(file);
      assert(got === expected, `esperaba ${expected ?? 'null'}, obtuve ${got ?? 'null'}`);
    });
  }

  // validateCvFile solo mira metadatos declarados por el cliente. El servidor
  // vuelve a comprobar los bytes reales antes de adjuntar el archivo.
  section('2b · Contenido real del archivo (isPdfContent)');

  const contentCases: Array<[string, Uint8Array, boolean]> = [
    ['PDF auténtico', new Uint8Array(makePdf()), true],
    ['Ejecutable disfrazado (MZ)', new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03]), false],
    ['ZIP disfrazado (PK)', new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14]), false],
    ['PNG disfrazado', new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d]), false],
    ['Archivo vacío', new Uint8Array([]), false],
    ['Más corto que la firma', new Uint8Array([0x25, 0x50]), false],
  ];

  for (const [label, bytes, expected] of contentCases) {
    await check(`${label} → ${expected ? 'aceptado' : 'rechazado'}`, () => {
      assert(isPdfContent(bytes) === expected, 'veredicto contrario al esperado');
    });
  }

  // ── 3. Validación de campos ───────────────────────────────────────────────
  section('3 · Validación del formulario (jobApplicationFormSchema)');

  await check('Payload válido pasa', () => {
    const r = jobApplicationFormSchema.safeParse(VALID_INPUT);
    assert(r.success, `rechazado: ${JSON.stringify(r.error?.issues)}`);
  });

  const rejections: Array<[string, Record<string, unknown>, string]> = [
    ['Ciudad fuera del enum', { ...VALID_INPUT, city: 'monterrey' }, 'city.required'],
    ['Email inválido', { ...VALID_INPUT, email: 'arroba-faltante' }, 'email.invalid'],
    ['Teléfono de 9 dígitos', { ...VALID_INPUT, phone: '331234567' }, 'phone.tooShort'],
    ['Teléfono con letras', { ...VALID_INPUT, phone: 'no tengo tel' }, 'phone.invalid'],
    ['Nombre de 1 carácter', { ...VALID_INPUT, firstName: 'Q' }, 'firstName.tooShort'],
    ['"Sobre ti" < 20 chars', { ...VALID_INPUT, aboutYou: 'hola' }, 'aboutYou.tooShort'],
    ['Menor de 18 años', { ...VALID_INPUT, birthDate: '2015-01-01' }, 'birthDate.invalid'],
    ['Mayor de 70 años', { ...VALID_INPUT, birthDate: '1930-01-01' }, 'birthDate.invalid'],
    ['Fecha basura', { ...VALID_INPUT, birthDate: 'ayer' }, 'birthDate.invalid'],
    ['Privacidad sin aceptar', { ...VALID_INPUT, acceptPrivacy: false }, 'privacy.required'],
    ['Honeypot lleno', { ...VALID_INPUT, _honeypot: 'bot' }, ''],
  ];

  for (const [label, input, expectedCode] of rejections) {
    await check(`${label}${expectedCode ? ` → ${expectedCode}` : ' → rechazado'}`, () => {
      const r = jobApplicationFormSchema.safeParse(input);
      assert(!r.success, 'el schema lo aceptó cuando debía rechazarlo');
      if (expectedCode) {
        const codes = r.error.issues.map((i) => i.message);
        assert(codes.includes(expectedCode), `esperaba ${expectedCode}, obtuve ${codes.join(', ')}`);
      }
    });
  }

  // ── 4. Plantilla del correo ───────────────────────────────────────────────
  // Un campo mal interpolado no rompe el envío: llega un correo con "undefined"
  // donde debía ir el teléfono del candidato. Por eso se revisa el HTML.
  section('4 · Render de la plantilla');

  const html = JobApplicationEmailTemplate({
    vacancyTitle: 'Aplicación espontánea',
    customJobDescription: VALID_INPUT.customJobDescription,
    city: VALID_INPUT.city,
    area: 'Tecnologías de la Información',
    firstName: VALID_INPUT.firstName,
    lastName: VALID_INPUT.lastName,
    email: VALID_INPUT.email,
    phone: VALID_INPUT.phone,
    birthDate: VALID_INPUT.birthDate,
    aboutYou: VALID_INPUT.aboutYou,
    submittedAt: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
  });

  await check('No quedan "undefined" / "null" en el HTML', () => {
    assert(!/\bundefined\b|\bnull\b/.test(html), 'la plantilla dejó un valor sin interpolar');
  });

  await check('No quedan placeholders `${...}` sin resolver', () => {
    assert(!/\$\{/.test(html), 'quedó una interpolación literal en el HTML');
  });

  for (const [label, needle] of [
    ['nombre del candidato', `${VALID_INPUT.firstName} ${VALID_INPUT.lastName}`],
    ['email', VALID_INPUT.email],
    ['teléfono', VALID_INPUT.phone],
    ['ciudad', 'Guadalajara'],
    ['área', 'Tecnologías de la Información'],
    ['sobre ti', VALID_INPUT.aboutYou],
  ] as const) {
    await check(`El HTML incluye ${label}`, () => {
      assert(html.includes(needle), `no encontré "${needle}"`);
    });
  }

  info(`HTML renderizado: ${html.length} bytes`);

  // ── 5. Envío real ─────────────────────────────────────────────────────────
  section('5 · Envío vía Resend');

  if (DRY) {
    skip('sendJobApplicationEmail()', '--dry activo, no se envía nada');
    finish();
  }

  const cvBuffer = makePdf();
  info(`Destinatario: ${to} · adjunto: ${cvBuffer.length} bytes`);

  try {
    const result = await sendJobApplicationEmail({
      vacancyTitle: `Prueba automatizada ${RUN_ID}`,
      customJobDescription: VALID_INPUT.customJobDescription,
      city: VALID_INPUT.city,
      area: 'Tecnologías de la Información',
      firstName: VALID_INPUT.firstName,
      lastName: VALID_INPUT.lastName,
      email: VALID_INPUT.email,
      phone: VALID_INPUT.phone,
      birthDate: VALID_INPUT.birthDate,
      aboutYou: VALID_INPUT.aboutYou,
      cvBuffer,
      cvFilename: `cv-prueba-${RUN_ID}.pdf`,
    });

    if (result.ok) {
      pass('sendJobApplicationEmail()', 'Resend aceptó el envío');
      info(`Revisa la bandeja de ${to} — asunto: "Aplicación: Prueba automatizada ${RUN_ID} — QA Bot Onkimia"`);
      warn('Resend aceptando ≠ correo entregado. La entrega solo se confirma en la bandeja.');
    } else {
      fail('sendJobApplicationEmail()', 'devolvió { ok: false } — mira el log de [Resend] arriba');
    }
  } catch (err) {
    fail('sendJobApplicationEmail()', err);
  }

  finish();
}

main().catch((err) => {
  console.error('\n💥 Error no controlado:', err);
  process.exit(1);
});

/*
 * NOTAS — qué NO cubre este script
 *
 * · Rate limit (3/día por IP): Map en memoria del proceso del servidor.
 *   Ver la nota equivalente en test-contact-form.ts.
 *
 * · Lookup de la vacante en Sanity: el action traduce vacancyId → título con
 *   SINGLE_JOB_QUERY. Aquí se usa 'spontaneous', que salta esa rama. Para
 *   cubrirla hace falta un _id real de jobPosting activo.
 *
 * · Entrega real del correo: Resend responde 200 al aceptarlo en cola. Rebotes,
 *   spam y fallos de dominio ocurren después y no se ven desde aquí.
 */
