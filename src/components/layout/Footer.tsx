'use client';

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { urlFor } from '@/sanity/image';
import { InstagramIcon, FacebookIcon, XIcon } from '@/components/icons/SocialIcons';
import { MessageCircle } from 'lucide-react';
import { useClinic } from '@/lib/clinic-context';
import { getClinicConfig } from '@/config/clinicConfig';
import type { SiteSettings, Clinic } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { SanityImage } from '@/components/ui/SanityImage';

interface FooterProps {
  settings: SiteSettings;
  clinics: Clinic[];
  locale: Locale;
}

export function Footer({ settings }: FooterProps) {
  const tNav = useTranslations('navigation');
  const tFooter = useTranslations('footer');
  const pathname = usePathname();
  const { clinic } = useClinic();

  const isDoctorsRoute = pathname.startsWith('/onkimia-doctors');

  // Contact data follows the globally selected clinic, not a fixed
  // "primary" location — see src/config/clinicConfig.ts.
  const clinicData = getClinicConfig(clinic);

  return (
    <footer className={`${isDoctorsRoute ? 'bg-doctors-ink' : 'bg-ink'} text-white/90 mt-section`}>
      <div className="container-onkimia py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          {/* ─── Logo (col-span-2) ─── */}
          <div className="md:col-span-2 flex md:items-start md:pt-1">
            {isDoctorsRoute ? (
              <>
                {/* Desktop: full logo */}
                <div className="relative hidden md:block h-16 w-44">
                  <Image
                    src="/ONKIMIA-DOCTORS_Logo.webp"
                    alt="Onkimia Doctors"
                    fill
                    sizes="176px"
                    className="object-contain object-left"
                  />
                </div>
                {/* Mobile: symbol */}
                <div className="relative block md:hidden h-10 w-10">
                  <Image
                    src="/simbolo-OD-clean.svg"
                    alt="Onkimia Doctors"
                    fill
                    sizes="40px"
                    className="object-contain object-left"
                  />
                </div>
              </>
            ) : settings.logo ? (
              <div className="relative w-[142px] h-[45px] md:w-[170px] md:h-[55px]">
                <SanityImage
                  src={urlFor(settings.logo).height(110).url()}
                  alt={settings.title}
                  fill
                  sizes="(max-width: 768px) 142px, 170px"
                  className="object-contain object-left invert brightness-0"
                />
              </div>
            ) : (
              <h2 className="text-4xl font-serif">{settings.title}</h2>
            )}
          </div>

          {/* ─── Menú ─── */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">
              {tFooter('menu')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {tNav('services')}
                </Link>
              </li>
              <li>
                <Link
                  href="/endos"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {tNav('endos')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cuidare"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {tNav('cuidare')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* ─── Síguenos + Contacto agrupados ─── */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">
              {tFooter('followUs')}
            </h3>
            <div className="flex items-center gap-3 mb-8">
              {settings.socialMedia?.facebook && (
                <a
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {settings.socialMedia?.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {settings.socialMedia?.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* ─── App Onkimia ─── */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-white mb-4">
                {tFooter('downloadApp')}
              </h3>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://apps.apple.com/mx/app/onkimia/id6446001299"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Onkimia en App Store"
                  className="inline-flex items-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=mx.com.center_onkimia&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Onkimia en Google Play"
                  className="inline-flex items-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3.18 23.76c.3.17.65.19.98.07l13.3-7.68-2.83-2.83-11.45 10.44zM.5 1.41C.19 1.74 0 2.24 0 2.9v18.2c0 .66.19 1.16.51 1.49l.08.08L10.36 12.7v-.23L.58 1.33l-.08.08zM20.49 10.46l-2.89-1.67-3.16 3.16 3.16 3.16 2.91-1.68c.83-.48.83-1.26-.02-1.97zM3.18.24L16.47 7.92l-2.83 2.83L2.2.31C2.53.19 2.88.07 3.18.24z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>

            <h3 className="text-base font-semibold text-white mb-4">
              {tNav('contact')}
            </h3>
            {/* Reflects the globally selected clinic (useClinic()), not a
                fixed "primary" location — switching clinics in the Header
                updates this immediately. */}
            <div className="text-sm text-white/60 space-y-2">
              <a
                href={clinicData.phoneHref}
                className="block hover:text-white transition-colors"
              >
                {clinicData.phone}
              </a>
              {clinicData.whatsappHref && (
                <a
                  href={clinicData.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{clinicData.whatsapp}</span>
                </a>
              )}
              <a
                href={clinicData.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 hover:text-white transition-colors"
              >
                {clinicData.address}
              </a>
            </div>
          </div>

          {/* ─── Sedes + Bolsa de Trabajo ─── */}
          <div className="space-y-8">
            <div>
              <h3 className="text-base font-semibold text-white mb-4">
                {tFooter('locations')}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/colima"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {tFooter('locationColima')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-4">
                {tNav('jobs')}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/bolsa-de-trabajo"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {tFooter('viewPositions')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aviso-de-privacidad"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {tFooter('privacyPolicy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
