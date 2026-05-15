interface ContactEmailProps {
  name: string;
  email: string;
  phone: string;
  comment: string;
  submittedAt: string;
}

/**
 * Template HTML para email de notificación de formulario de contacto.
 * Escapa todos los valores del usuario antes de insertarlos.
 */
export function ContactEmailTemplate({
  name,
  email,
  phone,
  comment,
  submittedAt,
}: ContactEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo contacto - Onkimia</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <div style="background-color:#1E1739;padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">
        Nuevo mensaje de contacto
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
        ${escapeHtml(submittedAt)}
      </p>
    </div>

    <div style="padding:32px 40px;">

      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Nombre</p>
        <p style="margin:0;color:#1f1f1f;font-size:16px;font-weight:500;">${escapeHtml(name)}</p>
      </div>

      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Email</p>
        <p style="margin:0;color:#1f1f1f;font-size:16px;">
          <a href="mailto:${escapeHtml(email)}" style="color:#F39313;text-decoration:none;">${escapeHtml(email)}</a>
        </p>
      </div>

      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Teléfono</p>
        <p style="margin:0;color:#1f1f1f;font-size:16px;">
          <a href="tel:${escapeHtml(phone.replace(/\D/g, ''))}" style="color:#F39313;text-decoration:none;">${escapeHtml(phone)}</a>
        </p>
      </div>

      <div style="margin-bottom:8px;">
        <p style="margin:0 0 8px;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Mensaje</p>
        <div style="padding:16px;background-color:#f5f5f5;border-radius:8px;border-left:3px solid #F39313;">
          <p style="margin:0;color:#1f1f1f;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(comment)}</p>
        </div>
      </div>

    </div>

    <div style="padding:20px 40px;background-color:#f5f5f5;border-top:1px solid #e5e5e5;">
      <p style="margin:0;color:#8a8a8a;font-size:12px;text-align:center;">
        Este mensaje fue enviado desde el formulario de contacto de onkimia.com
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
