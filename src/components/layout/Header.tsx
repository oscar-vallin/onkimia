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
import { motion, AnimatePresence, Variants } from 'framer-motion';

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
  const { clinic, setClinic } = useClinic();

  const currentClinic = clinics.find((c) => c.slug === clinic) || null;

  const activeClinicSlug = pathname.includes('guadalajara') 
    ? 'guadalajara' 
    : pathname.includes('colima') 
      ? 'colima' 
      : null;
  
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
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${mobileOpen ? 'bg-transparent' : scrolled ? 'bg-brand-900/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container-onkimia">
        <div className={`flex items-center justify-between transition-all duration-300  ${scrolled ? 'lg:py-3' : ''}`}>
          {/* ─── Logo ─── */}
          <Link href="/" className="relative flex items-center gap-2">
            {settings.logo ? (
              <span // Conditional classes for size and position based on scroll
                className={`relative block transition-all duration-300
                  w-[150px] h-[80px] 
                  md:w-[200px] md:h-[107px]
                  ${scrolled ? 'lg:w-[180px] lg:h-[96px] lg:top-0' : 'lg:w-[240px] lg:h-[128px]'}
                `}
              >
                <Image
                  src={urlFor(settings.logo).height(scrolled ? 96 : 128).url()} // Adjust height based on scrolled state
                  alt={settings.title}
                  fill
                  sizes={`(max-width: 768px) 150px, (max-width: 1024px) 200px, ${scrolled ? '180px' : '240px'}`} // Adjust sizes for responsive image loading
                  priority // M-07: Removed duplicate quality prop, as it's already applied in urlFor.
                  className="object-contain object-left filter invert(1)" // Changed to white for transparent header
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
                    className="absolute left-0 right-0 bottom-1 h-0.5 bg-accent-500 rounded-full"
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
                    const isSelected = activeClinicSlug === c.slug;
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            layout // Enable Framer Motion layout animations
            className="fixed inset-0 lg:hidden bg-brand-900/40 backdrop-blur-2xl z-60 flex flex-col will-change-transform-opacity" // Added will-change
          >
            <div className="container-onkimia flex flex-col h-full">
              {/* Logo and Close Button */}
              <div className="flex justify-between items-center py-4">
                {/* Logo */}
              {settings.logo && (
                <Link href="/" onClick={() => setMobileOpen(false)} className="relative block w-[120px] h-[64px]">
                  <Image
                    src={urlFor(settings.logo).height(64).url()}
                    alt={settings.title}
                    fill
                    sizes="120px"
                    className="object-contain object-left filter invert(1)" // Invert for dark background
                  />
                </Link>
              )}
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
            <ul className="flex flex-col items-center justify-center flex-grow space-y-1 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className={`relative block text-xl font-inter font-medium transition-colors py-2 text-white ${
                      isActive(link.href)
                        ? 'text-accent-500'
                        : 'hover:text-accent-400'
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span
                        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-accent-500 rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Configuration Panel (Bottom Section) */}
            <div className="mt-auto py-8 text-center space-y-6">
              {/* Clinic Selector */}
              <div className="flex flex-col items-center text-white">
                <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4 text-white">
                  {tClinic('selectClinic')}
                </p>
                <div className="flex justify-center gap-4 ">
                  {clinics.map((c) => {

                    const isSelected = activeClinicSlug === c.slug;
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-colors mx-auto"
                aria-label={`Switch to ${otherLocale.toUpperCase()}`}
              >
                <Globe className="w-4 h-4" />
                <span>{otherLocale.toUpperCase()}</span>
              </button>
            </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
