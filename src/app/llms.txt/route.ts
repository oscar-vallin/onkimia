import { ROUTES } from '@/config/routes';

// llms.txt — emerging convention (llmstxt.org) for pointing LLM crawlers at
// a site's key pages with a one-line description each, markdown-formatted.
// Static and manually curated: this list doesn't need to track Sanity
// content, only the fixed set of top-level routes (mirrors sitemap.ts's
// STATIC_PAGES, kept separate since that file emits XML, not this format).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com').replace(/\/$/, '');

// Route Handlers default to dynamic in the App Router (unlike the special
// robots.ts/sitemap.ts metadata-file conventions, which Next treats as
// static automatically) — this content has no per-request input, so force
// it back to a build-time-generated static response.
export const dynamic = 'force-static';

const PAGES: Array<{ path: string; title: string; description: string }> = [
  { path: ROUTES.home, title: 'Inicio', description: 'Clínica oncológica privada en Guadalajara y Colima, México: quimioterapia, cirugía oncológica, cuidados paliativos, detección temprana y atención médica especializada.' },
  { path: ROUTES.nosotros, title: 'Nosotros', description: 'Misión, enfoque de atención integral y equipo médico de Onkimia.' },
  { path: ROUTES.services, title: 'Servicios', description: 'Catálogo de servicios oncológicos, especialidades clínicas y unidades de apoyo.' },
  { path: ROUTES.endos, title: 'Endos', description: 'Unidad de procedimientos endoscópicos de Onkimia (endoscopía, colonoscopía, broncoscopía, biopsias).' },
  { path: ROUTES.cuidare, title: 'Cuidare', description: 'Unidad de cuidados ambulatorios y manejo del dolor de Onkimia.' },
  { path: ROUTES.doctors, title: 'Onkimia Doctors', description: 'Programa B2B de Onkimia para médicos que buscan infraestructura clínica compartida.' },
  { path: ROUTES.colima, title: 'Onkimia Colima', description: 'Sede de Onkimia en Colima, Colima.' },
  { path: ROUTES.contact, title: 'Contacto', description: 'Datos de contacto, ubicación y formulario de agendamiento de las sedes de Onkimia.' },
  { path: ROUTES.jobBoard, title: 'Bolsa de Trabajo', description: 'Vacantes activas y formulario de postulación de Onkimia.' },
];

export async function GET() {
  const lines = [
    '# Onkimia',
    '',
    '> Clínica oncológica privada con sede en Guadalajara y Colima, México.',
    '',
    '## Páginas principales',
    '',
    ...PAGES.map((p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.description}`),
  ];

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
