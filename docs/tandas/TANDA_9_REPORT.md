# Tanda 9 — Bolsa de Trabajo Report

## Resumen

Implementación completa de la página `/bolsa-de-trabajo` con formulario de postulación, carga de CV en memoria, envío por email vía Resend, rate limiting dedicado y verificación Turnstile.

---

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/sanity/schemas/jobPosting.ts` | Schema Sanity: título localizado, descripción localizada, ciudad (guadalajara/colima), área (17 opciones), isActive, publishedAt, closingDate, odooRef |
| `src/sanity/types.ts` | Tipos `CitySlug`, `AreaSlug`, `JobPosting` |
| `src/lib/schemas/jobApplication.ts` | Zod schema + `validateCvFile()` (PDF, máx 5 MB) + `JobApplicationFormState` |
| `src/lib/email/job-application-template.tsx` | Template HTML con `escapeHtml()` en todos los campos del usuario |
| `src/lib/actions/jobApplication.ts` | Server Action: CV → Zod → honeypot → rate limit → Turnstile → Sanity → Buffer → Resend |
| `src/components/forms/JobApplicationForm.tsx` | Client component con dropdown de vacantes, auto-fill ciudad/área, file upload validado, Turnstile widget |
| `src/app/[locale]/bolsa-de-trabajo/page.tsx` | Página: hero + formulario en tarjeta blanca |
| `src/types/turnstile.d.ts` | Declaraciones globales de Turnstile (centraliza para evitar conflictos entre componentes) |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/sanity/schemas/index.ts` | Registro de `jobPosting` |
| `sanity.config.ts` | Ítem "Vacantes" en estructura del Studio |
| `src/sanity/queries.ts` | `ACTIVE_JOB_POSTINGS_QUERY` |
| `src/lib/ratelimit.ts` | `jobApplicationRatelimit` — `slidingWindow(3, '1 d')` |
| `src/lib/email/resend.ts` | `sendJobApplicationEmail()` con adjunto PDF |
| `src/lib/env.ts` | `JOB_BOARD_EMAIL` validado con Zod |
| `src/messages/es.json` | Namespace `jobBoard` completo |
| `src/messages/en.json` | Namespace `jobBoard` completo (paridad exacta con ES) |
| `src/components/forms/ContactForm.tsx` | Eliminadas declaraciones globales de Turnstile (movidas a `turnstile.d.ts`) |
| `src/components/forms/JobApplicationForm.tsx` | Ídem |

---

## Seguridad / LFPDPPP

- **PDF en memoria únicamente:** `Buffer.from(cvFile.arrayBuffer())` → adjunto al email → descartado. Nunca toca disco.
- **Rate limit:** 3 solicitudes / IP / día (`ratelimit:jobapp`).
- **Turnstile:** verificación server-side antes de procesar.
- **Honeypot:** campo `_honeypot` oculto; si viene relleno, responde `ok: true` silenciosamente.
- **XSS:** `escapeHtml()` en todos los campos interpolados en el template HTML del email.
- **Validación Zod:** campos del form + `validateCvFile()` antes de cualquier acción.

---

## Variables de entorno necesarias

Añadir manualmente en `.env.local`:

```
JOB_BOARD_EMAIL=eortega@onkimia.com
```

---

## Validación

```
pnpm tsc --noEmit  →  0 errores
pnpm build         →  /[locale]/bolsa-de-trabajo compilado (ƒ Dynamic)
diff JSON keys     →  0 diferencias entre es.json y en.json
```

---

## Pendiente futuro

- **Tanda 9b:** Crear applicant en Odoo HR (`submitJobApplication` tiene `TODO` marcado).
- **Footer:** El link `/bolsa-de-trabajo` ya existía — no requirió cambios.
