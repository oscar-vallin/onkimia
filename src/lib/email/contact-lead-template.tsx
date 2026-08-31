interface ContactLeadEmailProps {
  name: string;
  email: string;
  phone: string;
  comment: string;
  submittedAt: string;
  /** Motivo por el que Odoo no aceptó el lead — se incluye para que IT lo diagnostique. */
  odooError: string;
}

/**
 * Correo de respaldo del formulario de contacto.
 *
 * Solo se envía cuando Odoo rechaza el alta del lead. Cumple dos funciones a la
 * vez: el prospecto no se pierde, y alguien se entera de que el CRM está caído
 * en el momento en que ocurre (ver src/lib/actions/contact.ts).
 */
export function ContactLeadEmailTemplate({
  name,
  email,
  phone,
  comment,
  submittedAt,
  odooError,
}: ContactLeadEmailProps): string {
  const row = (label: string, value: string) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#6b7280;font-size:13px;width:130px;vertical-align:top;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#111827;font-size:14px;">${value}</td>
      </tr>`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prospecto sin registrar en Odoo — Onkimia</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <div style="background-color:#b91c1c;padding:24px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">⚠️ Prospecto sin registrar en Odoo</h1>
    </div>

    <div style="padding:24px 32px;">
      <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
        Este contacto llegó por el formulario del sitio, pero <strong>Odoo rechazó el alta</strong>.
        Los datos van abajo para capturarlos a mano. Avisar a IT: mientras el error persista,
        ningún prospecto se está registrando en el CRM.
      </p>

      <table style="width:100%;border-collapse:collapse;">
        ${row('Nombre', name)}
        ${row('Correo', `<a href="mailto:${email}" style="color:#1a7a6e;">${email}</a>`)}
        ${row('Teléfono', `<a href="tel:${phone.replace(/[^\d+]/g, '')}" style="color:#1a7a6e;">${phone}</a>`)}
        ${row('Enviado', submittedAt)}
      </table>

      <p style="margin:24px 0 6px;color:#6b7280;font-size:13px;">Mensaje</p>
      <div style="background-color:#f9fafb;border-radius:8px;padding:16px;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${comment}</div>

      <p style="margin:24px 0 6px;color:#6b7280;font-size:13px;">Error de Odoo (para IT)</p>
      <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;color:#991b1b;font-family:monospace;font-size:12px;word-break:break-word;">${odooError}</div>
    </div>

  </div>
</body>
</html>`;
}
