// app/api/contact/route.ts  (Form 1 — Contacto → crm.lead)

import { NextRequest, NextResponse } from "next/server";
import { odooCreate } from "@/lib/odoo/client";

export async function POST(req: NextRequest) {
  const { name, email, phone, comment } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Nombre y correo requeridos" }, { status: 400 });
  }

  try {
    const leadId = await odooCreate("crm.lead", {
      name:          `Web — ${name}`,
      contact_name:  name,
      email_from:    email,
      phone:         phone ?? "",
      description:   comment ?? "",
      type:          "lead",
    });

    return NextResponse.json({ ok: true, id: leadId });
  } catch (err) {
    console.error("[Odoo] contact error:", err);
    return NextResponse.json({ error: "Error al registrar. Intenta de nuevo." }, { status: 500 });
  }
}