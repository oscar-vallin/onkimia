'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { X, MapPin, Globe, ArrowRight } from 'lucide-react';
import { useClinic } from '@/lib/clinic-context';
import { markAsVisited } from '@/lib/cookies-client';
import type { Locale } from '@/i18n/routing';
import type { ClinicSlug } from '@/lib/clinic-context';

interface WelcomeModalProps {
  currentLocale: Locale;
}

export function WelcomeModal({ currentLocale }: WelcomeModalProps) {
  const t = useTranslations('welcomeModal');
  const router = useRouter();
  const pathname = usePathname();
  const { setClinic } = useClinic();

  const [isOpen, setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<ClinicSlug>('guadalajara');
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(currentLocale);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Activar animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  // Focus en botón cerrar al aparecer
  useEffect(() => {
    if (isVisible) closeBtnRef.current?.focus();
  }, [isVisible]);

  function close(callback?: () => void) {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      document.body.style.overflow = '';
      callback?.();
    }, 200);
  }

  function dismiss() {
    markAsVisited();
    close();
  }

  function handleConfirm() {
    setClinic(selectedClinic);
    markAsVisited();

    close(() => {
      if (selectedLanguage !== currentLocale) {
        // next-intl maneja el prefijo de locale automáticamente.
        // pathname (de next-intl) ya viene SIN prefijo de locale.
        router.replace(pathname, { locale: selectedLanguage });
      } else {
        router.refresh();
      }
    });
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) dismiss();
  }

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
      >
        {/* Botón cerrar */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream hover:bg-cream-2 text-gray-warm flex items-center justify-center transition-colors cursor-pointer"
          aria-label={t('close')}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h2 id="welcome-modal-title" className="font-serif text-2xl md:text-3xl text-ink mb-3">
            {t('title')}
          </h2>
          <p className="text-gray-warm text-sm md:text-base">{t('subtitle')}</p>
        </div>

        {/* Clínica */}
        <div className="px-8 pb-6">
          <p className="text-sm font-medium text-gray-warm mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal" aria-hidden="true" />
            {t('clinicLabel')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(['guadalajara', 'colima'] as const).map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setSelectedClinic(slug)}
                aria-pressed={selectedClinic === slug}
                className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                  selectedClinic === slug
                    ? 'border-teal bg-teal/10'
                    : 'border-line hover:border-gray-soft'
                }`}
              >
                <p className="font-medium text-ink capitalize">{slug}</p>
                <p className="text-xs text-gray-soft mt-1">
                  {slug === 'guadalajara' ? t('clinicPrimary') : t('clinicSecondary')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Idioma */}
        <div className="px-8 pb-8">
          <p className="text-sm font-medium text-gray-warm mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal" aria-hidden="true" />
            {t('languageLabel')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'es' as Locale, label: 'Español' },
              { value: 'en' as Locale, label: 'English' },
            ]).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedLanguage(value)}
                aria-pressed={selectedLanguage === value}
                className={`p-3 rounded-lg border-2 transition-all font-medium cursor-pointer ${
                  selectedLanguage === value
                    ? 'border-teal bg-teal/10 text-ink'
                    : 'border-line hover:border-gray-soft text-gray-warm'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 pb-8">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-teal hover:bg-teal-soft text-white font-medium px-6 py-3.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 group cursor-pointer"
          >
            {t('confirm')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
