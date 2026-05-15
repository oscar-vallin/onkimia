import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, DOCTORS_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import { HeroSection } from '@/components/ui/HeroSection';
import type { SiteSettings, Doctor } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildMetadata({
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    locale,
    pathname: '',
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');

  const [settings, doctors] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<Doctor[]>({
      query: DOCTORS_QUERY,
      tags: ['doctor'],
    }),
  ]);

  const heroDescription = settings.homeHeroDescription
    ? getLocalized(settings.homeHeroDescription, locale)
    : t('hero.description');

  return (
    <>
      {/* ─── HERO ─── */}
      <HeroSection
        image={settings.homeHeroImage}
        title={`${t('hero.welcome')} ${settings.title}`}
        subtitle={getLocalized(settings.tagline, locale)}
        description={heroDescription}
        align="center"
        height="lg"
        overlay="medium"
      />

      {/* ─── CUIDARTE ES NUESTRA PRIORIDAD ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 text-center mb-6">
            {t('care.title')}
          </h2>
          <p className="text-lg text-neutral-700 text-center mb-12 max-w-4xl mx-auto">
            {t('care.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TODO Tanda 4: reemplazar por query MAIN_SERVICES_QUERY */}
            {[
              { title: locale === 'es' ? 'Quimioterapia' : 'Chemotherapy' },
              { title: locale === 'es' ? 'Cirugía oncológica' : 'Oncological surgery' },
              { title: locale === 'es' ? 'Cuidados paliativos' : 'Palliative care' },
              { title: locale === 'es' ? 'Detección temprana' : 'Early detection' },
              { title: locale === 'es' ? 'Atención médica especializada' : 'Specialized medical care' },
              { title: locale === 'es' ? 'Servicios complementarios personalizados' : 'Personalized complementary services' },
              { title: locale === 'es' ? 'Acompañamiento humano y profesional' : 'Human and professional support' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-500 transition-colors"
              >
                <div className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0" />
                <span className="text-neutral-800">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONOCE A NUESTROS ESPECIALISTAS ─── */}
      {doctors.length > 0 && (
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container-onkimia">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 mb-4">
                {t('doctors.title')}
              </h2>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                {t('doctors.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {doctors.slice(0, 8).map((doctor) => (
                <article
                  key={doctor._id}
                  className="bg-white rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[3/4] bg-brand-100">
                    {doctor.photo && (
                      <Image
                        src={urlFor(doctor.photo).width(400).height(533).url()}
                        alt={doctor.fullName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-brand-900 mb-1">
                      {doctor.fullName}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {getLocalized(doctor.specialty, locale)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BIENESTAR INTEGRAL ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 mb-4">
              {t('wellness.title')}
            </h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              {t('wellness.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO Tanda 4: reemplazar por query WELLNESS_SERVICES_QUERY */}
            {[
              {
                title: locale === 'es' ? 'Técnica de relajación' : 'Relaxation technique',
                description: locale === 'es'
                  ? 'Terapia energética que reduce el estrés y promueve el equilibrio emocional durante el tratamiento.'
                  : 'Energy therapy that reduces stress and promotes emotional balance during treatment.',
              },
              {
                title: locale === 'es' ? 'Fisioterapia' : 'Physiotherapy',
                description: locale === 'es'
                  ? 'Mejora la movilidad y fortalece el cuerpo antes, durante y después del tratamiento oncológico.'
                  : 'Improves mobility and strengthens the body before, during, and after oncological treatment.',
              },
              {
                title: locale === 'es' ? 'Terapia Psicológica' : 'Psychological Therapy',
                description: locale === 'es'
                  ? 'Acompañamiento emocional especializado para enfrentar el proceso oncológico con apoyo profesional.'
                  : 'Specialized emotional support to face the oncological process with professional support.',
              },
              {
                title: locale === 'es' ? 'Boutique Oncológica' : 'Oncology Boutique',
                description: locale === 'es'
                  ? 'Productos seleccionados para tu cuidado y bienestar durante cada etapa del tratamiento.'
                  : 'Selected products for your care and well-being during each stage of treatment.',
              },
              {
                title: locale === 'es' ? 'Nutrición Clínica' : 'Clinical Nutrition',
                description: locale === 'es'
                  ? 'Planes alimenticios personalizados y suplementos para fortalecer tu cuerpo y recuperación.'
                  : 'Personalized meal plans and supplements to strengthen your body and recovery.',
              },
              {
                title: locale === 'es' ? 'Pruebas Genómicas' : 'Genomic Testing',
                description: locale === 'es'
                  ? 'Contamos con paneles genéticos que nos permiten prevenir, detectar distintos tipos de cáncer.'
                  : 'We have genetic panels that allow us to prevent and detect different types of cancer.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 hover:border-accent-500 transition-colors"
              >
                <h3 className="text-xl font-medium text-brand-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENDA TU CITA ─── */}
      <section className="bg-accent-50 py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 mb-6">
              {t('appointment.title')}
            </h2>
            <p className="text-lg text-neutral-700 mb-8">
              {t('appointment.description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-medium text-brand-900 mb-2">
                  {t('appointment.step1')}
                </h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-medium text-brand-900 mb-2">
                  {t('appointment.step2')}
                </h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-medium text-brand-900 mb-2">
                  {t('appointment.step3')}
                </h3>
              </div>
            </div>

            <Link
              href="/contacto"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg"
            >
              {t('appointment.title')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CONVENIOS ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 text-center mb-12">
            {t('insurances.title')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center">
            {/* TODO Tanda 4: reemplazar por query INSURANCES_QUERY */}
            {[
              'AXA', 'GNP', 'MAPFRE', 'VUMI',
              'INBURSA', 'BANORTE', 'BESTDOCTORS', 'MD ABROAD',
              'CIGNA', 'SURA', 'BX+', 'ZURICH',
              'SCOTIABANK', 'HEALTHCASE', 'ATLAS', 'AXA ASSISTANCE',
            ].map((insurance, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-500 transition-colors min-h-[100px]"
              >
                <span className="text-neutral-600 font-medium text-center">
                  {insurance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
