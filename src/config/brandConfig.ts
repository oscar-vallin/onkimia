// Canonical sub-brand detection from a pathname. Both Header (via
// useHeaderAppearance) and Footer independently re-implemented this exact
// startsWith chain — kept here as the single source so a new sub-brand only
// needs one new entry instead of two.
//
// This does NOT unify the other brand-scoping mechanisms in the codebase
// (PageHero's ACCENT map, the Tailwind `@source inline(...)` safelist in
// globals.css, PageTheme's headerTheme) — those solve different problems
// (a static color-class lookup, JIT-scanner visibility for classes built
// from template strings, and scroll-driven header state) and don't reduce
// to a shared runtime config.
export type BrandSlug = 'onkimia' | 'endos' | 'cuidare' | 'doctors';

export function getBrandFromPath(pathname: string): BrandSlug {
  if (pathname.startsWith('/onkimia-doctors')) return 'doctors';
  if (pathname.startsWith('/endos')) return 'endos';
  if (pathname.startsWith('/cuidare')) return 'cuidare';
  return 'onkimia';
}
