'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, Globe, MapPin } from 'lucide-react';
import { useClinic } from '@/lib/clinic-context';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { SiteSettings, Clinic } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, AnimatePresence, type Variants } from 'framer-motion';
import { getWhatsAppNumber, buildWhatsAppUrl, type Section } from '@/lib/whatsapp';

interface HeaderProps {
  settings: SiteSettings;
  clinics: Clinic[];
}

// Framer Motion variants for mobile menu animation
const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.1, 0.76, 0.55, 0.9] as any }
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
};


export function Header({ settings, clinics }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // Added scrolled state
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const tNav = useTranslations('navigation');
  const tClinic = useTranslations('clinics');
  const tCommon = useTranslations('common');
  const { clinic, setClinic } = useClinic();

  const isDoctorsRoute = pathname.startsWith('/onkimia-doctors');

  const currentClinic = clinics.find((c) => c.slug === clinic) || null;

  const whatsappNumber = getWhatsAppNumber({
    section: 'home' as Section,
    clinic: currentClinic,
    clinics,
    settings,
  });
  const whatsappUrl = whatsappNumber ? buildWhatsAppUrl(whatsappNumber) : null;

  const navLinks = [
    { href: '/', label: tNav('home') },
    { href: '/nosotros', label: tNav('about') },
    { href: '/servicios', label: tNav('services') },
    { href: '/endos', label: tNav('endos') },
    { href: '/cuidare', label: tNav('cuidare') },
    { href: '/onkimia-doctors', label: tNav('doctors') },
    { href: '/contacto', label: tNav('contact') },
  ];

  const otherLocale = locale === 'es' ? 'en' : 'es';

  // Detectar item activo del menú
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(href);
  };

  // Function to toggle mobile menu and control body scroll
  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => {
      const newState = !prev;
      if (newState) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = ''; // Use empty string to revert to default
      }
      return newState;
    });
  }, []);

  // Optimized effect to handle scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(prevScrolled => {
        if (isScrolled !== prevScrolled) {
          return isScrolled;
        }
        return prevScrolled;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          mobileOpen
            ? 'bg-transparent'
            : isDoctorsRoute
            ? 'bg-doctors-ink'
            : scrolled
            ? 'bg-brand-900/80 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
      <div className="container-onkimia">
        <div className="flex items-center justify-between ">
          {/* ─── Logo ─── */}
          <Link href="/" className="relative flex items-center gap-2">
            {isDoctorsRoute ? (
              <>
                <span className="relative hidden md:block w-[150px] h-[80px] lg:w-[180px] lg:h-[96px]">
                  <Image
                    src="/logo-OD.svg"
                    alt="Onkimia Doctors"
                    fill
                    sizes="(max-width: 1024px) 150px, 180px"
                    priority
                    className="object-contain object-left"
                  />
                </span>
                <span className="relative block md:hidden w-[48px] h-[48px]">
                  <Image
                    src="/simbolo-OD.svg"
                    alt="Onkimia Doctors"
                    fill
                    sizes="48px"
                    priority
                    className="object-contain object-left"
                  />
                </span>
              </>
            ) : settings.logo ? (
              <span className="relative block w-[150px] h-[80px] md:w-[180px] md:h-[96px] lg:w-[180px] lg:h-[96px]">
                <Image
                  src={urlFor(settings.logo).height(96).url()}
                  alt={settings.title}
                  fill
                  sizes="(max-width: 768px) 150px, 180px"
                  priority
                  className="object-contain object-left filter invert(1)"
                />
              </span>
            ) : (
              <span className="font-serif text-2xl text-brand-900">
                {settings.title}
              </span>
            )}
          </Link>

          {/* ─── Nav Desktop ─── */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors py-2 text-white ${ // Color de enlaces a blanco puro
                  isActive(link.href)
                    ? 'text-white' // Mantener blanco para el activo
                    : 'text-white hover:text-accent-400' // Añadido hover:text-accent-400
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className={`absolute left-0 right-0 bottom-1 h-0.5 rounded-full ${isDoctorsRoute ? 'bg-doctors-blue' : 'bg-accent-500'}`}
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
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-accent-400 transition-colors duration-300 cursor-pointer"
                aria-label={tClinic('selectClinic')}
              >
                <MapPin className="w-4 h-4" />
                <span>
                  {currentClinic
                    ? getLocalized(currentClinic.name, locale)
                    : tClinic('selectClinic')}
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    clinicMenuOpen ? 'rotate-180' : ''
                  }`}
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
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg overflow-hidden">
                  {clinics.map((c) => {
                    const isSelected = clinic === c.slug;
                    return (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => {
                        setClinic(c.slug as 'guadalajara' | 'colima');
                        setClinicMenuOpen(false);
                        router.push(`/${c.slug}`);
                      }}
                      className={`w-full text-left cursor-pointer px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                        isSelected
                          ? 'bg-accent-50 text-accent-700 font-medium'
                          : 'text-neutral-900' // Keep dark for dropdown
                      }`}
                    >
                      {getLocalized(c.name, locale)}
                    </button>
                  )})}
                </div>
              )}
            </div>

            {/* Language switch */}
            <button
              type="button"
              onClick={() => router.replace(pathname, { locale: otherLocale })}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white hover:text-accent-400 transition-colors duration-300 cursor-pointer"
              aria-label={`Switch to ${otherLocale.toUpperCase()}`}
            >
              <Globe className="w-4 h-4" />
              <span>{otherLocale.toUpperCase()}</span>
            </button>

            {/* Mobile menu toggle (keep dark for contrast on mobile menu) */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white hover:text-accent-400"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div> {/* This closes the container-onkimia div */}
      </header>

      {/* ─── Full-Screen Mobile Menu (outside main header flow for z-index) ─── */}
      <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {mobileOpen && (
          <m.nav
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            layout // Enable Framer Motion layout animations
            className={`fixed inset-0 lg:hidden ${isDoctorsRoute ? 'bg-doctors-ink' : 'bg-brand-900/40 backdrop-blur-2xl'} z-60 flex flex-col overflow-y-auto will-change-transform-opacity`}
          >
            <div className="container-onkimia flex flex-col min-h-full">
              {/* Logo and Close Button */}
              <div className="flex justify-between items-center py-2">
                {/* Logo */}
              {isDoctorsRoute ? (
                <Link href="/" onClick={() => setMobileOpen(false)} className="relative block w-[64px] h-[64px]">
                  <Image
                    src="/simbolo-OD.svg"
                    alt="Onkimia Doctors"
                    fill
                    sizes="64px"
                    className="object-contain object-left"
                  />
                </Link>
              ) : settings.logo ? (
                <Link href="/" onClick={() => setMobileOpen(false)} className="relative block w-[120px] h-[64px]">
                  <Image
                    src={urlFor(settings.logo).height(64).url()}
                    alt={settings.title}
                    fill
                    sizes="120px"
                    className="object-contain object-left filter invert(1)"
                  />
                </Link>
              ) : null}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 text-white hover:text-accent-400"
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Main Navigation Links */}
            <ul className="flex flex-col items-center">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className={`relative block text-md font-inter font-medium transition-colors py-2 text-white ${
                      isActive(link.href)
                        ? 'text-accent-500'
                        : 'hover:text-accent-400'
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span
                        className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full ${isDoctorsRoute ? 'bg-doctors-blue' : 'bg-accent-500'}`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Configuration Panel (Bottom Section) */}
            <div className=" py-6 text-center space-y-6">
              {/* WhatsApp CTA */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={toggleMobileMenu}
                  className={`flex items-center justify-center gap-2 mx-auto px-6 py-3 ${isDoctorsRoute ? 'bg-doctors-blue hover:bg-doctors-ink' : 'bg-accent-500 hover:bg-accent-600'} text-white font-medium rounded-full transition-colors w-full max-w-[200px] text-sm`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span className='text-sm'>{tCommon('scheduleAppointmentWhatsApp')}</span>
                </a>
              )}

              {/* Clinic Selector */}
              <div className="flex flex-col items-center text-white">
                <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4 text-white">
                  {tClinic('selectClinic')}
                </p>
                <div className="flex justify-center gap-4 ">
                  {clinics.map((c) => {

                    const isSelected = clinic === c.slug;
                    return (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => {
                        setClinic(c.slug as 'guadalajara' | 'colima');
                        toggleMobileMenu(); // Close menu after selection
                        router.push(`/${c.slug}`);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors  ${
                        isSelected ? 'bg-accent-500 text-white shadow-md border-transparent' : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {getLocalized(c.name, locale)}
                    </button>
                  )})}
                </div>
              </div>

              {/* Language Switch */}
              <p className="text-white uppercase tracking-widest text-xs mt-6 mb-4">
                {tClinic('selectLanguage')}
              </p>
              <button
                type="button"
                onClick={() => router.replace(pathname, { locale: otherLocale })}
                className="flex  items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-colors mx-auto"
                aria-label={`Switch to ${otherLocale.toUpperCase()}`}
              >
                <Globe className="w-4 h-4" />
                <span >{otherLocale.toUpperCase()}</span>
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
