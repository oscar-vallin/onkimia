// lib/odoo/client.ts
import 'server-only';
import { env } from '../env';
export { jsonRpc as jsonRpcRaw };

const ODOO_URL      = env.ODOO_URL;
const ODOO_DATABASE = env.ODOO_DATABASE;
const ODOO_USERNAME = env.ODOO_USERNAME;
const ODOO_API_KEY  = env.ODOO_API_KEY;

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
      params,  // ← params always goes here
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

// ── Authentication — using /jsonrpc (API endpoint, not the UI one) ───────────

let cachedUid: number | null = null;

export async function getUid(): Promise<number> {
  if (cachedUid) return cachedUid;

  // On Odoo 18, server-to-server auth uses /jsonrpc with service: "common"
  const uid = await jsonRpc<number>("/jsonrpc", {
    service: "common",
    method:  "authenticate",
    args:    [ODOO_DATABASE, ODOO_USERNAME, ODOO_API_KEY, {}],
  });

  if (!uid || typeof uid !== "number") {
    throw new Error(
      "Odoo: authentication failed — check ODOO_DATABASE, ODOO_USERNAME and ODOO_API_KEY"
    );
  }

  cachedUid = uid;
  return uid;
}

// ── Create record ─────────────────────────────────────────────────────────────

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

// ── Read records ───────────────────────────────────────────────────────────────

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