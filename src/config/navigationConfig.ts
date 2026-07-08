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
