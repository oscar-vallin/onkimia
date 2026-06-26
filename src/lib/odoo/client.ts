// lib/odoo/client.ts
export { jsonRpc as jsonRpcRaw };

const ODOO_URL      = process.env.ODOO_URL!;
const ODOO_DATABASE = process.env.ODOO_DATABASE!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;
const ODOO_API_KEY  = process.env.ODOO_API_KEY!;

interface JsonRpcResponse<T = unknown> {
  jsonrpc: string;
  id:      number;
  result?: T;
  error?: {
    code:    number;
    message: string;
    data?:   { message: string };
  };
}

async function jsonRpc<T = unknown>(
  path: string,
  params: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${ODOO_URL}${path}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method:  "call",
      id:      1,
      params,  // ← params siempre va aquí
    }),
  });

  if (!res.ok) throw new Error(`Odoo HTTP error: ${res.status}`);

  const json: JsonRpcResponse<T> = await res.json();

  if (json.error) {
    throw new Error(
      `Odoo error: ${json.error.data?.message ?? json.error.message}`
    );
  }

  return json.result as T;
}

// ── Autenticación — usando /jsonrpc (endpoint para APIs, no para UI) ──────────

let cachedUid: number | null = null;

export async function getUid(): Promise<number> {
  if (cachedUid) return cachedUid;

  // En Odoo 18, para server-to-server se usa /jsonrpc con service: "common"
  const uid = await jsonRpc<number>("/jsonrpc", {
    service: "common",
    method:  "authenticate",
    args:    [ODOO_DATABASE, ODOO_USERNAME, ODOO_API_KEY, {}],
  });

  if (!uid || typeof uid !== "number") {
    throw new Error(
      "Odoo: autenticación fallida — revisa ODOO_DATABASE, ODOO_USERNAME y ODOO_API_KEY"
    );
  }

  cachedUid = uid;
  return uid;
}

// ── Crear registro ────────────────────────────────────────────────────────────

export async function odooCreate(
  model:  string,
  values: Record<string, unknown>
): Promise<number> {
  const uid = await getUid();

  return jsonRpc<number>("/jsonrpc", {
    service: "object",
    method:  "execute_kw",
    args:    [
      ODOO_DATABASE,
      uid,
      ODOO_API_KEY,
      model,
      "create",
      [values],
    ],
  });
}

// ── Leer registros ────────────────────────────────────────────────────────────

export async function odooRead(
  model:  string,
  ids:    number[],
  fields: string[]
): Promise<Record<string, unknown>[]> {
  const uid = await getUid();

  return jsonRpc("/jsonrpc", {
    service: "object",
    method:  "execute_kw",
    args:    [
      ODOO_DATABASE,
      uid,
      ODOO_API_KEY,
      model,
      "read",
      [ids],
      { fields },
    ],
  });
}