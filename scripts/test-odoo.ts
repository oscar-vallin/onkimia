// scripts/test-odoo.ts

import "dotenv/config";   // levanta el .env.local
import { getUid, odooCreate, odooRead, jsonRpcRaw } from "@/lib/odoo/client";

const SEPARATOR = "─".repeat(50);

async function runTests() {
  console.log("\n🔍 PRUEBAS DE INTEGRACIÓN — ODOO 18 QA\n" + SEPARATOR);
  console.log("\n▶ Test 0: Diagnóstico de conexión y credenciales");

// 1. Verificar que las variables de entorno llegaron
console.log("  Variables de entorno cargadas:");
console.log(`    ODOO_URL:      ${process.env.ODOO_URL      ?? "❌ undefined"}`);
console.log(`    ODOO_DATABASE: ${process.env.ODOO_DATABASE ?? "❌ undefined"}`);
console.log(`    ODOO_USERNAME: ${process.env.ODOO_USERNAME ?? "❌ undefined"}`);
console.log(`    ODOO_API_KEY:  ${process.env.ODOO_API_KEY  ? "✅ presente (oculta)" : "❌ undefined"}`);

  // ── Test 1: Autenticación ────────────────────────────────────────────────
  console.log("\n▶ Test 1: Autenticación");
  try {
    const uid = await getUid();
    console.log(`  ✅ UID obtenido: ${uid}`);
  } catch (err) {
    console.error("  ❌ Falló:", err);
    process.exit(1);   // Sin auth no tiene caso seguir
  }

  // ── Test 2: Crear lead (Form 1 — Contacto) ───────────────────────────────
  console.log("\n▶ Test 2: Crear lead en crm.lead");
  let leadId: number | null = null;
  try {
    leadId = await odooCreate("crm.lead", {
      name:         "TEST — Integración Web Onkimia",
      contact_name: "QA Bot",
      email_from:   "qa@onkimia-test.com",
      phone:        "+52 33 0000 0000",
      description:  "Registro de prueba. Puede eliminarse.",
      type:         "lead",
    });
    console.log(`  ✅ Lead creado con ID: ${leadId}`);
  } catch (err) {
    console.error("  ❌ Falló:", err);
  }

  // ── Test 3: Leer el lead recién creado ───────────────────────────────────
  if (leadId) {
    console.log("\n▶ Test 3: Leer lead creado (read-back)");
    try {
      const [lead] = await odooRead("crm.lead", [leadId], [
        "name", "email_from", "phone", "description",
      ]);
      console.log("  ✅ Datos confirmados en Odoo:");
      console.table(lead);
    } catch (err) {
      console.error("  ❌ Falló:", err);
    }
  }

  // ── Test 4: Crear candidato (Form 2 — Bolsa de trabajo) ─────────────

  console.log("\n" + SEPARATOR);
  console.log("✅ Pruebas completadas. Revisa los registros en QA de Odoo.\n");

  console.log('\n▶ Test 6: Simulación completa del formulario de contacto');
try {
  const { createLead } = await import('@/lib/odoo/contact');

  const leadId = await createLead({
    name:    'María García',
    email:   'maria@onkimia-test.com',
    phone:   '+52 33 1234 5678',
    comment: 'Me gustaría información sobre tratamientos disponibles.',
  });

  console.log(`  ✅ Lead de formulario creado con ID: ${leadId}`);
} catch (err) {
  console.error('  ❌ Falló:', err);
}

// scripts/test-odoo.ts — Test 7: Verificar último lead del formulario

console.log('\n▶ Test 7: Verificar último lead creado desde el formulario');
try {
  const uid = await getUid();

  // Busca los últimos 3 leads creados por el usuario de servicio
  const leads = await jsonRpcRaw<[number, string][]>('/jsonrpc', {
    service: 'object',
    method:  'execute_kw',
    args: [
      process.env.ODOO_DATABASE,
      uid,
      process.env.ODOO_API_KEY,
      'crm.lead',
      'search_read',
      [[['create_uid', '=', uid]]],
      {
        fields: ['id', 'name', 'email_from', 'phone', 'create_date'],
        limit:  3,
        order:  'id desc',
      },
    ],
  });

  if (!leads.length) {
    console.log('  ⚠️  No se encontraron leads. ¿Ya enviaste el formulario?');
  } else {
    console.log(`  ✅ Últimos ${leads.length} lead(s) creados por api_web:`);
    console.table(leads);
  }
} catch (err) {
  console.error('  ❌ Falló:', err);
}
}



runTests().catch(console.error);