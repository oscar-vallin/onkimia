/**
 * Prueba de integración del FORMULARIO DE CONTACTO → Odoo CRM.
 *
 *   pnpm test:contact          valida, autentica, crea un lead y lo BORRA
 *   pnpm test:contact --dry    todo menos escribir en Odoo
 *   pnpm test:contact --keep   crea el lead y NO lo borra (para inspeccionarlo)
 *
 * Ejercita exactamente la misma cadena que el Server Action
 * (src/lib/actions/contact.ts): contactFormSchema → createLead → odooCreate.
 * Lo único que no cubre es el rate limit, que es un Map en memoria del proceso
 * del servidor y no se puede observar desde fuera (ver NOTAS al final).
 *
 * Por defecto limpia lo que crea: el lead de prueba se borra con unlink al
 * terminar, así que correrlo mil veces no ensucia el CRM.
 */

import { contactFormSchema } from '@/lib/schemas/contact';
import { createLead } from '@/lib/odoo/contact';
import { getUid, odooRead, jsonRpcRaw } from '@/lib/odoo/client';
import { assert, check, fail, finish, info, pass, section, skip, warn } from './lib/report';

const DRY = process.argv.includes('--dry');
const KEEP = process.argv.includes('--keep');

/** Marca los registros de prueba para poder distinguirlos y barrerlos después. */
const RUN_ID = `QA-${Date.now()}`;

const VALID_INPUT = {
  name: 'QA Bot Onkimia',
  email: 'qa@onkimia-test.com',
  phone: '+52 33 1234 5678',
  comment: `Registro de prueba automatizada (${RUN_ID}). Puede eliminarse sin riesgo.`,
  acceptPrivacy: true,
  _honeypot: '',
};

async function main() {
  // ── 1. Entorno ────────────────────────────────────────────────────────────
  section('1 · Entorno');

  const required = ['ODOO_URL', 'ODOO_DATABASE', 'ODOO_USERNAME', 'ODOO_API_KEY'];
  for (const key of required) {
    if (process.env[key]) pass(key, key === 'ODOO_API_KEY' ? 'presente (oculta)' : process.env[key]);
    else fail(key, 'ausente en .env.local');
  }

  const odooUrl = process.env.ODOO_URL ?? '';
  if (/\bqa\b|staging|test/i.test(odooUrl)) {
    info('Entorno QA detectado — seguro para crear registros de prueba.');
  } else {
    warn(`ODOO_URL no parece QA (${odooUrl}). Los leads se crearán en ESE entorno.`);
  }

  // ── 2. Validación (sin red) ───────────────────────────────────────────────
  // Mismo schema que corre el Server Action antes de tocar Odoo.
  section('2 · Validación del formulario (contactFormSchema)');

  await check('Payload válido pasa', () => {
    const r = contactFormSchema.safeParse(VALID_INPUT);
    assert(r.success, `rechazado: ${JSON.stringify(r.error?.issues)}`);
  });

  const rejections: Array<[string, Record<string, unknown>, string]> = [
    ['Nombre de 1 carácter', { ...VALID_INPUT, name: 'A' }, 'name.tooShort'],
    ['Email inválido', { ...VALID_INPUT, email: 'no-es-un-email' }, 'email.invalid'],
    ['Teléfono con letras', { ...VALID_INPUT, phone: 'llámame porfa' }, 'phone.invalid'],
    ['Teléfono muy corto', { ...VALID_INPUT, phone: '123' }, 'phone.tooShort'],
    ['Comentario < 10 chars', { ...VALID_INPUT, comment: 'hola' }, 'comment.tooShort'],
    ['Privacidad sin aceptar', { ...VALID_INPUT, acceptPrivacy: false }, 'privacy.required'],
  ];

  for (const [label, input, expectedCode] of rejections) {
    await check(`${label} → ${expectedCode}`, () => {
      const r = contactFormSchema.safeParse(input);
      assert(!r.success, 'el schema lo aceptó cuando debía rechazarlo');
      const codes = r.error.issues.map((i) => i.message);
      assert(codes.includes(expectedCode), `esperaba ${expectedCode}, obtuve ${codes.join(', ')}`);
    });
  }

  // El honeypot no lo bloquea el schema (es opcional): lo corta el action
  // devolviendo éxito falso. Verificamos el contrato que el action asume.
  await check('Honeypot lleno pasa el schema (lo filtra el action)', () => {
    const r = contactFormSchema.safeParse({ ...VALID_INPUT, _honeypot: 'soy-un-bot' });
    assert(r.success, 'el schema debe aceptarlo para que el action pueda simular éxito');
    assert(r.data._honeypot === 'soy-un-bot', 'el valor del honeypot debe sobrevivir al parseo');
  });

  // ── 3. Conectividad y credenciales ────────────────────────────────────────
  section('3 · Autenticación con Odoo');

  let uid: number | null = null;
  try {
    uid = await getUid();
    pass('authenticate()', `uid = ${uid}`);
  } catch (err) {
    fail('authenticate()', err);
    info('Sin autenticación no tiene sentido continuar con los tests de escritura.');
    finish();
  }

  // ── 4. Alta del lead ──────────────────────────────────────────────────────
  section('4 · Alta del lead en crm.lead');

  if (DRY) {
    skip('createLead()', '--dry activo, no se escribe en Odoo');
    finish();
  }

  let leadId: number | null = null;
  try {
    leadId = await createLead({
      name: VALID_INPUT.name,
      email: VALID_INPUT.email,
      phone: VALID_INPUT.phone,
      comment: VALID_INPUT.comment,
    });
    pass('createLead()', `id = ${leadId}`);
  } catch (err) {
    fail('createLead()', err);
    finish();
  }

  // ── 5. Read-back: ¿el mapeo de campos llegó íntegro? ──────────────────────
  // Es la parte que más silenciosamente se rompe: un rename de campo en Odoo
  // no falla el create, simplemente guarda el dato en otro lado o lo descarta.
  section('5 · Verificación del mapeo de campos (read-back)');

  try {
    const [lead] = await odooRead('crm.lead', [leadId!], [
      'name',
      'contact_name',
      'email_from',
      'phone',
      'description',
      'type',
    ]);

    assert(lead, 'el lead no se pudo leer de vuelta');

    const expected: Record<string, string> = {
      name: `Web — ${VALID_INPUT.name}`,
      contact_name: VALID_INPUT.name,
      email_from: VALID_INPUT.email,
      phone: VALID_INPUT.phone,
      type: 'lead',
    };

    for (const [field, want] of Object.entries(expected)) {
      await check(`${field} = "${want}"`, () => {
        assert(lead[field] === want, `Odoo devolvió "${String(lead[field])}"`);
      });
    }

    // description llega como HTML desde Odoo; basta con que contenga el texto.
    await check('description conserva el comentario', () => {
      const got = String(lead.description ?? '');
      assert(got.includes(RUN_ID), `no contiene el marcador ${RUN_ID}: "${got}"`);
    });
  } catch (err) {
    fail('read-back', err);
  }

  // ── 6. Limpieza ───────────────────────────────────────────────────────────
  section('6 · Limpieza');

  if (KEEP) {
    skip('unlink', `--keep activo, el lead ${leadId} queda en el CRM`);
  } else {
    try {
      await jsonRpcRaw<boolean>('/jsonrpc', {
        service: 'object',
        method: 'execute_kw',
        args: [
          process.env.ODOO_DATABASE,
          uid,
          process.env.ODOO_API_KEY,
          'crm.lead',
          'unlink',
          [[leadId]],
        ],
      });
      pass('unlink()', `lead ${leadId} eliminado — el CRM queda sin rastro`);
    } catch (err) {
      fail('unlink()', err);
      warn(`El lead ${leadId} quedó en el CRM. Bórralo a mano si estorba.`);
    }
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
 * · Rate limit: contactRatelimit es un Map en memoria del proceso del servidor
 *   (src/lib/ratelimit.ts). Importarlo aquí crearía una instancia nueva y
 *   probaría el limitador, no el que usa la app. Para verificarlo de verdad
 *   hay que golpear el formulario desplegado 6 veces en una hora desde la
 *   misma IP y esperar 'error.rateLimit' en la sexta.
 *
 * · headers()/getClientIp: solo existen dentro del request de Next.
 */
