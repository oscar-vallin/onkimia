/**
 * Reporte compartido por los scripts de prueba de formularios.
 * Acumula resultados y decide el exit code: 1 si algo falló, para que
 * estos scripts sirvan tanto a mano como en CI.
 */

let passed = 0;
let failed = 0;
let skipped = 0;

const RULE = '─'.repeat(62);

export function section(title: string): void {
  console.log(`\n${RULE}\n${title}\n${RULE}`);
}

export function pass(label: string, detail?: string): void {
  passed++;
  console.log(`  ✅ ${label}${detail ? ` — ${detail}` : ''}`);
}

export function fail(label: string, err: unknown): void {
  failed++;
  const msg = err instanceof Error ? err.message : String(err);
  console.log(`  ❌ ${label} — ${msg}`);
}

export function skip(label: string, why: string): void {
  skipped++;
  console.log(`  ⏭️  ${label} — ${why}`);
}

export function info(msg: string): void {
  console.log(`     ${msg}`);
}

export function warn(msg: string): void {
  console.log(`  ⚠️  ${msg}`);
}

/** Corre una aserción síncrona o async y la registra. */
export async function check(label: string, fn: () => unknown | Promise<unknown>): Promise<boolean> {
  try {
    await fn();
    pass(label);
    return true;
  } catch (err) {
    fail(label, err);
    return false;
  }
}

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function finish(): never {
  console.log(
    `\n${RULE}\n` +
      `  ${passed} pasaron · ${failed} fallaron · ${skipped} omitidos\n` +
      RULE +
      '\n'
  );
  process.exit(failed > 0 ? 1 : 0);
}
