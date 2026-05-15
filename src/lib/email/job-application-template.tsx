interface JobApplicationEmailProps {
  vacancyTitle: string;
  customJobDescription?: string;
  city: string;
  area: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  aboutYou: string;
  submittedAt: string;
}

export function JobApplicationEmailTemplate({
  vacancyTitle,
  customJobDescription,
  city,
  area,
  firstName,
  lastName,
  email,
  phone,
  birthDate,
  aboutYou,
  submittedAt,
}: JobApplicationEmailProps): string {
  const cityLabel = city === 'guadalajara' ? 'Guadalajara' : 'Colima';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva aplicación - Onkimia</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <div style="background-color:#1E1739;padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">Nueva aplicación a vacante</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${escapeHtml(submittedAt)}</p>
    </div>

    <div style="padding:32px 40px;">

      <div style="background-color:#fef7ec;padding:16px;border-radius:8px;border-left:3px solid #F39313;margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Vacante</p>
        <p style="margin:0;color:#1f1f1f;font-size:18px;font-weight:600;">${escapeHtml(vacancyTitle)}</p>
        <p style="margin:8px 0 0;color:#8a8a8a;font-size:13px;">${escapeHtml(cityLabel)} · ${escapeHtml(area)}</p>
      </div>

      ${customJobDescription ? `
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Descripción del puesto (espontánea)</p>
        <p style="margin:0;color:#1f1f1f;font-size:14px;white-space:pre-wrap;">${escapeHtml(customJobDescription)}</p>
      </div>
      ` : ''}

      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />

      <h2 style="margin:0 0 16px;color:#1E1739;font-size:16px;">Datos del candidato</h2>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#8a8a8a;font-size:13px;width:40%;">Nombre completo</td>
          <td style="padding:8px 0;color:#1f1f1f;font-size:14px;font-weight:500;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8a8a8a;font-size:13px;">Email</td>
          <td style="padding:8px 0;color:#1f1f1f;font-size:14px;">
            <a href="mailto:${escapeHtml(email)}" style="color:#F39313;text-decoration:none;">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8a8a8a;font-size:13px;">Teléfono</td>
          <td style="padding:8px 0;color:#1f1f1f;font-size:14px;">
            <a href="tel:${escapeHtml(phone.replace(/\D/g, ''))}" style="color:#F39313;text-decoration:none;">${escapeHtml(phone)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8a8a8a;font-size:13px;">Fecha de nacimiento</td>
          <td style="padding:8px 0;color:#1f1f1f;font-size:14px;">${escapeHtml(birthDate)}</td>
        </tr>
      </table>

      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />

      <div>
        <p style="margin:0 0 8px;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Cuéntanos sobre ti</p>
        <div style="padding:16px;background-color:#f5f5f5;border-radius:8px;">
          <p style="margin:0;color:#1f1f1f;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(aboutYou)}</p>
        </div>
      </div>

      <div style="margin-top:24px;padding:12px;background-color:#fef7ec;border-radius:6px;">
        <p style="margin:0;color:#8a8a8a;font-size:12px;">📎 El CV (PDF) viene adjunto a este email.</p>
      </div>

    </div>

    <div style="padding:20px 40px;background-color:#f5f5f5;border-top:1px solid #e5e5e5;">
      <p style="margin:0;color:#8a8a8a;font-size:12px;text-align:center;">
        Este mensaje fue enviado desde la bolsa de trabajo de onkimia.com
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
