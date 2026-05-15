import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { urlFor } from '@/sanity/image';
import { InstagramIcon, FacebookIcon, XIcon } from '@/components/icons/SocialIcons';
import type { SiteSettings, Clinic } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';

interface FooterProps {
  settings: SiteSettings;
  clinics: Clinic[];
  locale: Locale;
}

export async function Footer({ settings, clinics }: FooterProps) {
  const tNav = await getTranslations('navigation');
  const tFooter = await getTranslations('footer');

  // Sede principal para datos de contacto (Beethoven 287 del Figma)
  const primaryClinic =
    clinics.find((c) => c.isPrimary) || clinics[0] || null;

  return (
    <footer className="bg-brand-900 text-neutral-100 mt-section">
      <div className="container-onkimia py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          {/* ─── Logo (col-span-2) ─── */}
          <div className="md:col-span-2 flex md:items-center">
            {settings.logo ? (
              <div className="relative h-24 w-80">
                <Image
                  src={urlFor(settings.logo).height(192).url()}
                  alt={settings.title}
                  fill
                  sizes="320px"
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
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {tNav('services')}
                </Link>
              </li>
              <li>
                <Link
                  href="/endos"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {tNav('endos')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cuidare"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {tNav('cuidare')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-neutral-300 hover:text-white transition-colors"
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
                  className="text-neutral-300 hover:text-white transition-colors"
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
                  className="text-neutral-300 hover:text-white transition-colors"
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
                  className="text-neutral-300 hover:text-white transition-colors"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="w-5 h-5" />
                </a>
              )}
            </div>

            <h3 className="text-base font-semibold text-white mb-4">
              {tNav('contact')}
            </h3>
            {primaryClinic && (
              <div className="text-sm text-neutral-300 space-y-2">
                {primaryClinic.phone && (
                  <a
                    href={`tel:${primaryClinic.phone.replace(/\s/g, '')}`}
                    className="block hover:text-accent-400 transition-colors"
                  >
                    {primaryClinic.phone}
                  </a>
                )}
                {primaryClinic.address && (() => {
                  const parts = [
                    `C. ${primaryClinic.address.street}`,
                    primaryClinic.address.neighborhood,
                    primaryClinic.address.postalCode,
                    primaryClinic.address.city,
                    primaryClinic.address.state,
                    'México',
                  ].filter(Boolean).join(', ');
                  return (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(parts)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 hover:text-accent-400 transition-colors"
                    >
                      <p>C. {primaryClinic.address.street},</p>
                      {primaryClinic.address.neighborhood && (
                        <p>
                          {primaryClinic.address.neighborhood},{' '}
                          {primaryClinic.address.postalCode}
                        </p>
                      )}
                      <p>
                        {primaryClinic.address.city},{' '}
                        {primaryClinic.address.state}.
                      </p>
                    </a>
                  );
                })()}
              </div>
            )}
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
                    href="/guadalajara"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    {tFooter('locationGuadalajara')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/colima"
                    className="text-neutral-300 hover:text-white transition-colors"
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
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    {tFooter('viewPositions')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aviso-de-privacidad"
                    className="text-neutral-300 hover:text-white transition-colors"
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