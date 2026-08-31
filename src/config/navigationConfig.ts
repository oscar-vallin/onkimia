import type { ClinicSlug } from './clinicConfig';

/**
 * Every navigable item that can appear in the Header nav / Footer "Menú" list.
 * Add a new key here + wire it into Header.tsx / Footer.tsx once — after that,
 * enabling it per clinic below is config-only.
 */
export type NavItemKey =
  | 'home'
  | 'about'
  | 'services'
  | 'endos'
  | 'cuidare'
  | 'doctors'
  | 'contact';

/**
 * Per-clinic navigation visibility.
 *
 * 'all'     → every nav item is shown (default / unrestricted clinic).
 * string[]  → only the listed keys are shown. 'home' is always shown
 *             regardless of what's listed — no need to include it.
 *
 * Onkimia IT: to reveal a hidden page for a clinic, add its key to the
 * array below and redeploy. No changes needed in Header.tsx or Footer.tsx.
 */
export const CLINIC_NAV_VISIBILITY: Record<ClinicSlug, NavItemKey[] | 'all'> = {
  guadalajara: 'all',
  colima: [], // only Home + clinic selector + language switch remain
};

export function isNavItemVisible(clinic: ClinicSlug | null, key: NavItemKey): boolean {
  if (key === 'home') return true;
  if (!clinic) return true;
  const visibility = CLINIC_NAV_VISIBILITY[clinic];
  if (visibility === 'all') return true;
  return visibility.includes(key);
}

// Canonical link list — href + translation key per item, in display order.
// Header and Footer previously each hardcoded their own near-identical copy
// of this array; both now derive their nav from here.
const NAV_ITEMS: { href: string; key: NavItemKey }[] = [
  { href: '/',                key: 'home'     },
  { href: '/nosotros',        key: 'about'    },
  { href: '/servicios',       key: 'services' },
  { href: '/endos',           key: 'endos'    },
  { href: '/cuidare',         key: 'cuidare'  },
  { href: '/onkimia-doctors', key: 'doctors'  },
  { href: '/contacto',        key: 'contact'  },
];

/**
 * Resolves the visible nav links for a clinic, translated via `t`.
 * `includeDoctors: false` (used by the Footer, which never linked to the
 * B2B recruitment page) drops that entry regardless of clinic visibility.
 */
/**
 * ¿El href corresponde a la ruta actual? Header y Footer marcan el enlace
 * activo con esta misma regla, así que vive aquí y no duplicada en cada uno.
 *
 * '/' es exacto a propósito: con startsWith() el Home quedaría activo en
 * todas las rutas del sitio.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  return href === '/'
    ? pathname === '/' || pathname === ''
    : pathname.startsWith(href);
}

export function getNavLinks(
  clinic: ClinicSlug | null,
  t: (key: string) => string,
  { includeDoctors = true }: { includeDoctors?: boolean } = {}
): { href: string; key: NavItemKey; label: string }[] {
  return NAV_ITEMS.filter((item) => includeDoctors || item.key !== 'doctors')
    .filter((item) => isNavItemVisible(clinic, item.key))
    .map((item) => ({ ...item, label: t(item.key) }));
}
