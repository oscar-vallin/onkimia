import type { Section } from './whatsapp';

/**
 * Identifica la sección actual a partir del pathname.
 * Usado por WhatsAppButton para smart routing.
 */
export function getSectionFromPath(pathname: string): Section {
  // Normalizar: quitar locale prefix si existe
  const normalized = pathname.replace(/^\/(es|en)/, '') || '/';

  if (normalized === '/' || normalized === '') return 'home';
  if (normalized.startsWith('/nosotros') || normalized.startsWith('/about'))
    return 'about';
  if (normalized.startsWith('/servicios') || normalized.startsWith('/services'))
    return 'services';
  if (normalized.startsWith('/endos')) return 'endos';
  if (normalized.startsWith('/cuidare')) return 'cuidare';
  if (normalized.startsWith('/onkimia-doctors')) return 'onkimia-doctors';
  if (normalized.startsWith('/contacto') || normalized.startsWith('/contact'))
    return 'contact';
  if (
    normalized.startsWith('/bolsa-de-trabajo') ||
    normalized.startsWith('/careers')
  )
    return 'jobs';

  // Páginas de clínica: /guadalajara, /colima
  if (normalized.startsWith('/guadalajara') || normalized.startsWith('/colima'))
    return 'clinic-page';

  return 'home';
}