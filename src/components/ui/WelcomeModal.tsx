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

  // Trigger the entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  // Focus the close button when it appears
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

    // Mirrors the Header clinic selector: Colima has its own dedicated route
    // (with sections like ClinicCtaSection that never render on the generic
    // Home page composition), so picking it here must navigate there too —
    // otherwise the modal only sets context and the user stays on a page
    // that was never composed to include Colima-specific sections.
    const targetPath =
      selectedClinic === 'colima'
        ? '/colima'
        : pathname.startsWith('/colima')
        ? '/'
        : pathname;

    close(() => {
      if (selectedLanguage !== currentLocale) {
        // next-intl handles the locale prefix automatically.
        // pathname (from next-intl) already comes WITHOUT the locale prefix.
        router.replace(targetPath, { locale: selectedLanguage });
      } else if (targetPath !== pathname) {
        router.push(targetPath);
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
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" aria-hidden="true" />

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
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-secondary flex items-center justify-center transition-colors cursor-pointer"
          aria-label={t('close')}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h2 id="welcome-modal-title" className="font-serif text-2xl md:text-3xl text-primary mb-3">
            {t('title')}
          </h2>
          <p className="text-secondary text-sm md:text-base">{t('subtitle')}</p>
        </div>

        {/* Clínica */}
        <div className="px-8 pb-6">
          <p className="text-sm font-medium text-secondary mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
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
                    ? 'border-primary bg-primary/10'
                    : 'border-black/[0.07] hover:border-black/[0.15]'
                }`}
              >
                <p className="font-medium text-primary capitalize">{slug}</p>
                <p className="text-xs text-secondary mt-1">
                  {slug === 'guadalajara' ? t('clinicPrimary') : t('clinicSecondary')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Idioma */}
        <div className="px-8 pb-8">
          <p className="text-sm font-medium text-secondary mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" aria-hidden="true" />
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
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-black/[0.07] hover:border-black/[0.15] text-secondary'
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
            className="w-full bg-primary hover:bg-primary/80 text-white font-medium px-6 py-3.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 group cursor-pointer"
          >
            {t('confirm')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
