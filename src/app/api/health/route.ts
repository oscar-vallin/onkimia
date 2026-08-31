import { NextResponse } from 'next/server';
import { getUid } from '@/lib/odoo/client';

/**
 * Health check de las integraciones que pueden romperse en silencio.
 *
 * Pensado para que un monitor de uptime (UptimeRobot, Better Stack, o un cron
 * con curl en el propio servidor) lo consulte cada pocos minutos:
 *
 *   200 → todo operativo
 *   503 → alguna integración caída; el cuerpo dice cuál
 *
 * Existe porque el fallo de credenciales de Odoo no produce ningún síntoma
 * visible: el sitio sigue en pie y solo se pierden los prospectos, uno por uno,
 * sin que nadie se entere.
 *
 * NO expone credenciales ni detalles internos: solo el nombre de la integración
 * y su estado, porque la ruta es pública.
 */

export const dynamic = 'force-dynamic';

interface CheckResult {
  status: 'ok' | 'error';
  detail?: string;
}

async function checkOdoo(): Promise<CheckResult> {
  try {
    const uid = await getUid();
    if (!uid) return { status: 'error', detail: 'authentication returned no uid' };
    return { status: 'ok' };
  } catch (err) {
    return {
      status: 'error',
      detail: err instanceof Error ? err.message : 'unknown error',
    };
  }
}

/** Solo comprueba configuración: enviar un correo real en cada ping sería absurdo. */
function checkEmailConfig(): CheckResult {
  const missing = [
    !process.env.RESEND_API_KEY && 'RESEND_API_KEY',
    !process.env.RESEND_FROM_EMAIL && 'RESEND_FROM_EMAIL',
    !process.env.JOB_BOARD_EMAIL && 'JOB_BOARD_EMAIL',
  ].filter(Boolean);

  return missing.length
    ? { status: 'error', detail: `missing env: ${missing.join(', ')}` }
    : { status: 'ok' };
}

export async function GET() {
  const [odoo, email] = [await checkOdoo(), checkEmailConfig()];

  const healthy = odoo.status === 'ok' && email.status === 'ok';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: {
        odoo,        // formulario de contacto → CRM
        email,       // bolsa de trabajo → correo
      },
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  );
}
