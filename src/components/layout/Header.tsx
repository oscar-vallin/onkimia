'use client';

import { useState, useEffect, useCallback, startTransition } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Globe, MapPin } from 'lucide-react';
import { useClinic } from '@/lib/clinic-context';
import { getLocalized } from '@/sanity/lib/localization';
import type { SiteSettings, Clinic, OnkimiaDocsSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { LazyMotion, m, AnimatePresence, type Variants } from 'framer-motion';
import { useHeaderAppearance } from '@/hooks/useHeaderAppearance';
import { getWhatsAppNumber, buildWhatsAppUrl, type Section } from '@/lib/whatsapp';

const loadFeatures = () =>
  import('framer-motion').then((mod) => mod.domAnimation);

interface HeaderProps {
  settings: SiteSettings;
  clinics: Clinic[];
  odSettings?: OnkimiaDocsSettings;
}

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.1, 0.76, 0.55, 0.9] as [number, number, number, number],
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

const mobileLinkVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function Header({ settings, clinics }: HeaderProps) {
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Reset scroll state synchronously during the render caused by a route change,
  // before the browser paints — prevents the header from briefly showing the
  // wrong background when navigating between pages.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setScrolled(false);
  }
  const router   = useRouter();
  const locale   = useLocale() as Locale;
  const tNav     = useTranslations('navigation');
  const tClinic  = useTranslations('clinics');
  const tCommon  = useTranslations('common');
  const { clinic, setClinic } = useClinic();

  const appearance = useHeaderAppearance({ scrolled, mobileOpen, mounted });

  const currentClinic = clinics.find((c) => c.slug === clinic) || null;

  const whatsappNumber = getWhatsAppNumber({
    section: 'home' as Section,
    clinic: currentClinic,
    clinics,
    settings,
  });
  const whatsappUrl = whatsappNumber ? buildWhatsAppUrl(whatsappNumber) : null;

  const navLinks = [
    { href: '/',                label: tNav('home')     },
    { href: '/nosotros',        label: tNav('about')    },
    { href: '/servicios',       label: tNav('services') },
    { href: '/endos',           label: tNav('endos')    },
    { href: '/cuidare',         label: tNav('cuidare')  },
    { href: '/onkimia-doctors', label: tNav('doctors')  },
    { href: '/contacto',        label: tNav('contact')  },
  ];

  const otherLocale  = locale === 'es' ? 'en' : 'es';
  const switchLocale = () => router.replace(pathname, { locale: otherLocale, scroll: false });

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' || pathname === '' : pathname.startsWith(href);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150);
    const timer = setTimeout(() => onScroll(), 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 w-full z-50 ${mounted ? 'transition-colors duration-350' : ''} ${appearance.headerBg}`}
        data-scrolled={scrolled ? 'true' : 'false'}
      >
        <div className="container-onkimia">
          <div className="flex items-center justify-between py-4 md:py-5">

            {/* ─── Logo ─── */}
            <Link href="/" className="relative flex items-center gap-2">
              {appearance.showDoctorsLogo ? (
                <>
                  {/* Desktop: full OD logo */}
                  <span className="relative hidden md:block w-[150px] h-[56px] lg:w-[170px] lg:h-[64px]">
                    <Image
                      src="/ONKIMIA-DOCTORS_Logo.webp"
                      alt="Onkimia Doctors"
                      fill
                      sizes="(max-width: 1024px) 150px, 170px"
                      priority
                      className="object-contain object-left"
                    />
                  </span>
                  {/* Mobile: symbol */}
                  <span className="relative block md:hidden w-[35px] h-[35px]">
                    <Image
                      src="/simbolo-OD-clean.svg"
                      alt="Onkimia Doctors"
                      fill
                      sizes="40px"
                      priority
                      className="object-contain object-left"
                    />
                  </span>
                </>
              ) : (
                <span className="relative block w-[142px] h-[45px] md:w-[170px] md:h-[55px]">
                  <Image
                    src="/logos/onkimia-logo.webp"
                    alt="Onkimia"
                    fill
                    sizes="(max-width: 768px) 142px, 170px"
                    priority
                    className={`object-contain object-left ${appearance.logoFilter}`}
                  />
                </span>
              )}
            </Link>

            {/* ─── Nav Desktop ─── */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors py-2 ${appearance.textColor} ${
                    isActive(link.href) ? '' : appearance.hoverColor
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className={`absolute left-0 right-0 bottom-1 h-0.5 rounded-full ${appearance.activeLinkUnderline}`}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* ─── Actions ─── */}
            <div className="flex items-center gap-3">

              {/* Clinic selector */}
              <div className="hidden md:block relative">
                <button
                  type="button"
                  onClick={() => setClinicMenuOpen(!clinicMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${appearance.textColor} ${appearance.hoverColor}`}
                  aria-label={tClinic('selectClinic')}
                >
                  <MapPin className="w-4 h-4" />
                  <span>
                    {mounted
                      ? (currentClinic ? getLocalized(currentClinic.name, locale) : tClinic('selectClinic'))
                      : tClinic('selectClinic')}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${clinicMenuOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {clinicMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-primary/10 rounded-md shadow-lg overflow-hidden">
                    {clinics.map((c) => {
                      const isSelected = clinic === c.slug;
                      return (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => {
                            setClinic(c.slug as 'guadalajara' | 'colima');
                            setClinicMenuOpen(false);
                            if (c.slug === 'colima') router.push('/colima');
                          }}
                          className={`w-full text-left cursor-pointer px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-primary'
                          }`}
                        >
                          {getLocalized(c.name, locale)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Language switch */}
              <button
                type="button"
                onClick={switchLocale}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${appearance.textColor} ${appearance.hoverColor}`}
                aria-label={`Switch to ${otherLocale.toUpperCase()}`}
              >
                <Globe className="w-4 h-4" />
                <span>{otherLocale.toUpperCase()}</span>
              </button>

              {/* Hamburger — w-11 h-11 hit area, w-5 h-[18px] visual icon */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className={`lg:hidden -mr-2 w-11 h-11 flex items-center justify-center ${appearance.hamburgerColor}`}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <span className="relative w-5 h-[18px] flex flex-col justify-between">
                  <span className={`block h-0.5 w-full bg-current transition-all duration-400 ${mobileOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                  <span className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`block h-0.5 w-full bg-current transition-all duration-400 ${mobileOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Full-Screen Mobile Menu ─── */}
      <LazyMotion features={loadFeatures} strict>
        <AnimatePresence>
          {mobileOpen && (
            <m.nav
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className={`fixed inset-0 lg:hidden ${appearance.mobileMenuBg} z-60 flex flex-col overflow-y-auto will-change-transform-opacity`}
            >
              <div className="container-onkimia flex flex-col min-h-full">

                {/* Logo + close */}
                <div className="flex justify-between items-center py-2">
                  {appearance.showDoctorsLogo ? (
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="relative block w-[35px] h-[35px]"
                    >
                      <Image
                        src="/simbolo-OD-clean.svg"
                        alt="Onkimia Doctors"
                        fill
                        sizes="64px"
                        className="object-contain object-left"
                      />
                    </Link>
                  ) : (
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="relative block w-[142px] h-[45px]"
                    >
                      <Image
                        src="/logos/onkimia-logo.webp"
                        alt="Onkimia"
                        fill
                        sizes="142px"
                        className="object-contain object-left brightness-0 invert"
                      />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={toggleMobileMenu}
                    className="relative w-8 h-6 flex flex-col justify-between p-0 text-white"
                    aria-label="Close menu"
                  >
                    <span className="block h-0.5 w-full bg-current rotate-45 translate-y-[11px] transition-all duration-400" />
                    <span className="block h-0.5 w-full bg-current opacity-0 transition-opacity duration-300" />
                    <span className="block h-0.5 w-full bg-current -rotate-45 -translate-y-[11px] transition-all duration-400" />
                  </button>
                </div>

                {/* Nav links */}
                <ul className="flex flex-col items-center mt-4 gap-1">
                  {navLinks.map((link) => (
                    <m.li key={link.href} variants={mobileLinkVariants}>
                      <Link
                        href={link.href}
                        onClick={toggleMobileMenu}
                        className={`relative block font-serif text-xl md:text-2xl font-normal transition-colors py-1.5 ${
                          isActive(link.href)
                            ? appearance.mobileActiveLinkColor
                            : appearance.mobileInactiveLinkColor
                        }`}
                      >
                        {link.label}
                        {isActive(link.href) && (
                          <span
                            className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full ${appearance.mobileActiveUnderline}`}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </m.li>
                  ))}
                </ul>

                {/* Bottom panel */}
                <div className="mt-6 py-4 text-center space-y-3">

                  {/* WhatsApp CTA */}
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={toggleMobileMenu}
                      className={`flex items-center justify-center gap-2 mx-auto px-6 py-3 ${appearance.mobileWhatsAppClass} font-medium rounded-full transition-colors w-full max-w-[200px] text-sm`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span className="text-sm">{tCommon('scheduleAppointmentWhatsApp')}</span>
                    </a>
                  )}

                  {/* Clinic selector */}
                  <div className="flex flex-col items-center text-white">
                    <p className="uppercase tracking-widest text-xs mb-2 text-white/60">
                      {tClinic('selectClinic')}
                    </p>
                    <div className="flex justify-center gap-4">
                      {clinics.map((c) => {
                        const isSelected = clinic === c.slug;
                        return (
                          <button
                            key={c._id}
                            type="button"
                            onClick={() => {
                              setClinic(c.slug as 'guadalajara' | 'colima');
                              toggleMobileMenu();
                              if (c.slug === 'colima') router.push('/colima');
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? appearance.mobileClinicSelectedClass
                                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                            }`}
                          >
                            {getLocalized(c.name, locale)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Language switch */}
                  <p className="text-white/60 uppercase tracking-widest text-xs mt-6 mb-4">
                    {tClinic('selectLanguage')}
                  </p>
                  <button
                    type="button"
                    onClick={switchLocale}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-colors mx-auto"
                    aria-label={`Switch to ${otherLocale.toUpperCase()}`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>{otherLocale.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </m.nav>
          )}
        </AnimatePresence>
      </LazyMotion>
    </>
  );
}
