# Onkimia Platform

Sitio web institucional de **Onkimia** — Centro oncológico integral con sedes en Guadalajara y Colima, y las sub-marcas Endos, Cuidare y Onkimia Doctors.

## Arquitectura

El proyecto es **mayormente estático**: casi todas las páginas se generan en build time (SSG) a partir de contenido editorial en Sanity y traducciones en `src/messages/`, y se sirven como HTML pre-renderizado. No hay base de datos propia ni backend interno — la única lógica de servidor real son dos integraciones externas puntuales:

- **Formulario de contacto** (`/contacto`) — un Server Action crea el lead directamente en **Odoo CRM** vía su API. No pasa por correo.
- **Bolsa de trabajo** (`/bolsa-de-trabajo`) — un Server Action envía la postulación (incluyendo el CV en PDF) por correo vía **Resend**. El archivo se procesa en memoria durante el request y nunca se persiste en disco.

Ambos formularios comparten: validación con Zod, un honeypot oculto (campo invisible que los bots suelen rellenar; si llega con contenido, la respuesta es "éxito" silencioso para no delatar el filtro), y rate limiting por IP en memoria (`src/lib/ratelimit.ts` — apropiado para una sola instancia de servidor; ver `docs/GUIA-INFRAESTRUCTURA-IT.md` si el hosting llega a escalar a varias instancias).

### Stack

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 19 |
| Lenguaje | TypeScript (strict) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| CMS | [Sanity](https://www.sanity.io/), embebido en `/studio` |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) — Español (default, sin prefijo) / Inglés (`/en/*`) |
| Forms | Server Actions + Zod, sin librería de formularios |
| CRM | Odoo (contacto) |
| Email | [Resend](https://resend.com) (bolsa de trabajo) |
| Iconos | [Lucide React](https://lucide.dev/) |
| Package manager | pnpm |

### Estructura de carpetas (resumen)

```
src/
  app/[locale]/       páginas (App Router, una carpeta por ruta)
  components/
    sections/         secciones de página (registry pattern, ver docs/GUIA-SECCIONES.md)
    ui/                componentes reutilizables (SectionHeader, PillButton, etc.)
    forms/             ContactForm, JobApplicationForm
  lib/
    actions/           Server Actions (contact.ts, jobApplication.ts)
    odoo/               cliente del API de Odoo
    email/              plantillas + envío vía Resend
  sanity/               cliente, queries GROQ, schemas del Studio
  config/               datos estáticos (clínicas, rutas)
  messages/             traducciones es.json / en.json
docs/
  GUIA-SECCIONES.md              cómo componer páginas con el sistema de secciones
  GUIA-INFRAESTRUCTURA-IT.md     despliegue self-hosted, webhook de Sanity, redirects
```

## Requisitos

- **Node.js 20.9+** (versión fijada en `.nvmrc` / `engines` de `package.json`)
- **pnpm 11+**

## Desarrollo local

```bash
# 1. Clonar el repo
git clone <url-del-repo>
cd onkimia-platform

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores reales (ver comentarios en el propio archivo)

# 4. Levantar el servidor de desarrollo
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Sanity Studio

Disponible en [http://localhost:3000/studio](http://localhost:3000/studio) — mismo servidor de Next, sin proceso aparte.

## Variables de entorno

Ver `.env.example` para la lista completa con instrucciones de dónde obtener cada valor. Resumen:

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | Conexión al proyecto Sanity |
| `SANITY_API_READ_TOKEN` | Lectura de contenido en el servidor |
| `ODOO_URL`, `ODOO_DATABASE`, `ODOO_USERNAME`, `ODOO_API_KEY` | Creación de leads del formulario de contacto |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Envío de correo de la bolsa de trabajo |
| `JOB_BOARD_EMAIL` | Destinatario de las postulaciones |
| `NEXT_PUBLIC_SITE_URL` | Dominio canónico (`https://onkimia.com`, sin `www` — ver `docs/GUIA-INFRAESTRUCTURA-IT.md`). Se hornea en build: usado en metadata, hreflang, sitemap, robots.txt y JSON-LD |

## Scripts

```bash
pnpm dev            # servidor de desarrollo (Turbopack)
pnpm build          # build de producción
pnpm start          # sirve el build de producción (después de pnpm build)
pnpm lint           # ESLint
npx tsc --noEmit    # verificación de tipos, sin emitir archivos
```

## Contenido editorial vs. traducciones

Dos sistemas distintos, no lo mismo:

- **Sanity** (`/studio`) — contenido que cambia con frecuencia y no requiere deploy: doctores, testimoniales, vacantes, aseguradoras, FAQs, imágenes de sección.
- **`src/messages/{es,en}.json`** — todo el copy de UI (títulos, botones, microcopy). Cambiarlo requiere editar el JSON y hacer deploy. **Siempre editar ambos idiomas juntos** para no desincronizar `es`/`en`.

El webhook de Sanity (`/api/revalidate`) invalida la caché cuando se publica contenido nuevo — ver `docs/GUIA-INFRAESTRUCTURA-IT.md` sección 3 para configurarlo.

## Despliegue

El proyecto usa `output: 'standalone'` en `next.config.ts`, pensado para self-hosting (no depende de Vercel):

```bash
pnpm build
# copiar a donde corra el servidor:
#   .next/standalone/          → server.js + deps de producción
#   .next/static/  → .next/standalone/.next/static/
#   public/        → .next/standalone/public/
node .next/standalone/server.js
```

Instrucciones completas para el equipo de infraestructura (variables de entorno en el servidor, reverse proxy, webhook de Sanity, redirects de migración SEO, rate limiting, escenario multi-instancia) están en **`docs/GUIA-INFRAESTRUCTURA-IT.md`**.

## Documentación adicional

- **`docs/GUIA-SECCIONES.md`** — cómo funciona el sistema de secciones modulares: qué secciones existen, cómo componer una página nueva, cómo abrir una clínica nueva.
- **`docs/GUIA-INFRAESTRUCTURA-IT.md`** — todo lo operativo: deploy, variables de entorno, webhook de Sanity, redirects 301 de la migración desde el sitio anterior, rate limiting, y qué cambia si el hosting escala a múltiples instancias.
