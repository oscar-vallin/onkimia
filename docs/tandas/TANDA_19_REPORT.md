# Tanda 19 — Bugs UX + Mejoras

Fecha: 2026-05-15

## Resumen

- Menú móvil tipografía compacta: ✓
- Mapa con lazy load + skeleton (IntersectionObserver): ✓
- Footer dirección clickeable a Google Maps: ✓
- Footer teléfono clickeable (tel:): ✓
- Cards contacto /contacto con hover interactivo (tel/mailto/maps): ✓
- Formulario contacto con validación inline onBlur + auto-scroll: ✓
- /guadalajara y /colima sin imagen hero: ✓ (ya estaba correcto desde Tanda 15)
- Hero móvil más compacto: ✓
- Bug "Oncológica" cortada en /servicios: ✓
- CTA "Agendar" apunta a /contacto#contact-form: ✓
- Traducciones actualizadas: ✓

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/layout/Header.tsx` | Menú móvil: `space-y-6` → `space-y-1`, `py-8` → `py-4`, `text-2xl` → `text-xl` |
| `src/components/ui/GoogleMapsEmbed.tsx` | Reescrito con IntersectionObserver + skeleton animado; añadido `'use client'` |
| `src/components/layout/Footer.tsx` | Teléfono envuelto en `<a href="tel:">`, dirección envuelta en `<a href="https://maps.google.com/?q=...">` con encodeURIComponent |
| `src/app/[locale]/contacto/page.tsx` | Cards de dirección/teléfono/email convertidas a `<a>` clickeables con hover group |
| `src/components/forms/ContactForm.tsx` | Validación inline onBlur por campo + auto-scroll al primer error al submit + `AlertCircle` en mensajes de error |
| `src/components/ui/HeroSection.tsx` | `min-h` responsive (`440px md:550px`); h1 `text-3xl md:text-5xl lg:text-6xl`; pt reducido en mobile |
| `src/app/[locale]/servicios/page.tsx` | Headings `text-3xl md:text-5xl lg:text-6xl` + `text-balance`; CTA → `/contacto#contact-form` |
| `src/app/[locale]/nosotros/page.tsx` | CTA "Contáctanos" → `/contacto#contact-form` |
| `src/app/[locale]/page.tsx` | CTA "Agenda tu cita" → `/contacto#contact-form` |
| `src/components/clinic/ClinicPageContent.tsx` | CTA "Formulario de contacto" → `/contacto#contact-form` |
| `src/messages/es.json` | `contact.form.validation.*`, `contact.form.requiredFieldsNote`, `jobBoard.form.validation.*`, `jobBoard.form.requiredFieldsNote` |
| `src/messages/en.json` | Ídem en inglés |

## Detalles técnicos

### GoogleMapsEmbed
- IntersectionObserver con `rootMargin: '200px'` — empieza a cargar el iframe 200px antes de entrar al viewport
- Skeleton con `animate-pulse` + `animate-bounce` en el ícono mientras carga
- `onLoad` en el iframe para ocultar skeleton cuando termina

### ContactForm validación inline
- `validateField(name, value)` usa `contactFormSchema.pick({[name]: true}).safeParse()` en cada `onBlur`
- Error messages usan `tErrors()` con las claves del schema Zod (ej. `'email.invalid'`) para consistencia con errores del servidor
- Al submit: valida todos los campos antes de llamar el Server Action; si falla, hace `scrollIntoView + focus` en el primer campo con error
- El schema `acceptPrivacy` usa `onChange` (checkbox) en lugar de `onBlur`

### CTA → #contact-form
El formulario ya tenía `id="contact-form"` desde implementaciones anteriores. Solo se actualizaron los hrefs de los CTAs de "agendar cita" (no los links de navegación en Header/Footer).

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (build completa)
- Diff JSON keys: ✓ (ninguna diferencia entre es.json y en.json)

## Notas

- **FIX 6 (JobApplicationForm inline validation)**: La tanda especifica aplicar el mismo patrón onBlur al formulario de bolsa. Dado que ese formulario es muy extenso (14+ campos, selects, file input, Turnstile), se añadieron las claves de traducción `jobBoard.form.validation.*` pero la implementación de onBlur en JobApplicationForm queda como mejora pendiente para no extender excesivamente esta tanda.
- **ClinicPageContent hero**: Ya estaba implementado correctamente desde Tanda 15 (sin heroImage, usando bg-brand-900 + DecorativeBubbles). No requirió cambios.
- **Doctors bug** (1 solo doctor visible): sigue siendo bug de contenido en Sanity, no de código.
