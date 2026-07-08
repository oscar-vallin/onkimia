'use client';

import { usePathname } from '@/i18n/navigation';

// Pages where the header needs its own bg at scroll=0.
// These pages have no hero image — without this the header floats
// over a dark page background with no visible background of its own.
// To add a new page of this type: add its path here.
// Note: clinic pages (e.g. /colima) are handled dynamically via <PageTheme>
// based on whether their section config includes a hero — don't list them here.
const DARK_BG_ROUTES = ['/nosotros'] as const;

interface HeaderState {
  scrolled: boolean;
  mobileOpen: boolean;
  mounted: boolean;
}

export interface HeaderAppearance {
  // <header> element
  headerBg: string;
  // Main logo (non-doctors routes only — doctors logo has no filter)
  logoFilter: string;
  showDoctorsLogo: boolean;
  showEndosLogo: boolean;
  showCuidareLogo: boolean;
  // Desktop nav links + action buttons
  textColor: string;
  hoverColor: string;
  activeLinkUnderline: string;
  // Hamburger icon
  hamburgerColor: string;
  // Mobile full-screen menu
  mobileMenuBg: string;
  mobileActiveLinkColor: string;
  mobileInactiveLinkColor: string;
  mobileActiveUnderline: string;
  mobileWhatsAppClass: string;
  mobileClinicSelectedClass: string;
}

export function useHeaderAppearance({ scrolled, mobileOpen, mounted }: HeaderState): HeaderAppearance {
  const pathname = usePathname();

  const isDoctors     = pathname.startsWith('/onkimia-doctors');
  const isEndos       = pathname.startsWith('/endos');
  const isCuidare     = pathname.startsWith('/cuidare');
  const isDarkBgRoute = DARK_BG_ROUTES.some((r) => pathname === r);

  // ── Header background ─────────────────────────────────────────────
  // Before mount (SSR + first client paint): derive bg from pathname only,
  // ignoring scrolled — which is unreliable until the scroll effect runs.
  // This ensures DARK_BG_ROUTES always render bg-primary on first paint,
  // eliminating the flash that occurs when scrolled initialises as false
  // on the server but the page needs a non-transparent background.
  let headerBg: string;
  if (!mounted) {
    headerBg = isDarkBgRoute || isDoctors ? 'bg-primary' : 'bg-transparent';
  } else if (mobileOpen) {
    headerBg = 'bg-primary';
  } else if (isDoctors && scrolled) {
    headerBg = 'bg-doctors-ink backdrop-blur-md border-b border-white/10 shadow-sm';
  } else if (scrolled) {
    headerBg = 'bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-sm';
  } else if (isDarkBgRoute) {
    headerBg = 'bg-primary';
  } else {
    headerBg = 'bg-transparent';
  }

  // ── Logo filter (applied only to the standard Onkimia logo) ──────
  // Dark only when header has a white background; white in every other state.
  const logoFilter = scrolled && !mobileOpen ? '' : 'brightness-0 invert';

  // ── Desktop nav text ─────────────────────────────────────────────
  const textColor = mobileOpen || !scrolled || isDoctors ? 'text-white' : 'text-primary';

  const hoverColor = isDoctors
    ? 'hover:text-doctors-blue'
    : scrolled && !mobileOpen
    ? 'hover:text-primary/60'
    : 'hover:text-white/70';

  const activeLinkUnderline = isDoctors ? 'bg-doctors-blue' : scrolled ? 'bg-primary' : 'bg-white';

  // ── Hamburger ────────────────────────────────────────────────────
  const hamburgerColor = scrolled && !mobileOpen && !isDoctors ? 'text-primary' : 'text-white';

  // ── Mobile menu ──────────────────────────────────────────────────
  const mobileMenuBg = isDoctors ? 'bg-doctors-ink' : 'bg-primary';

  const mobileActiveLinkColor   = isDoctors ? 'text-doctors-blue' : 'text-white';
  const mobileInactiveLinkColor = isDoctors
    ? 'text-white hover:text-doctors-blue'
    : 'text-white/60 hover:text-white';
  const mobileActiveUnderline   = isDoctors ? 'bg-doctors-blue' : 'bg-white';

  const mobileWhatsAppClass = isDoctors
    ? 'bg-doctors-blue hover:bg-doctors-ink text-white'
    : 'border border-white/30 hover:border-white/70 text-white bg-transparent';

  const mobileClinicSelectedClass = isDoctors
    ? 'bg-doctors-blue text-white shadow-md border-transparent'
    : 'bg-white text-primary shadow-md border-transparent';

  return {
    headerBg,
    logoFilter,
    showDoctorsLogo: isDoctors,
    showEndosLogo: isEndos,
    showCuidareLogo: isCuidare,
    textColor,
    hoverColor,
    activeLinkUnderline,
    hamburgerColor,
    mobileMenuBg,
    mobileActiveLinkColor,
    mobileInactiveLinkColor,
    mobileActiveUnderline,
    mobileWhatsAppClass,
    mobileClinicSelectedClass,
  };
}
