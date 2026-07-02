import { getTranslations } from 'next-intl/server';
import { HeroHome } from '@/components/sections/HeroHome';
import type { SectionProps } from '@/components/sections/registry';

export async function HeroSection({}: SectionProps) {
  const t = await getTranslations('home');

  return (
    <>
      {/* Hero image preloads — LCP critical path.
          Next.js App Router hoists <link> RSC elements to <head>.
          media attrs mirror the <picture> in HeroHome.tsx exactly so
          the browser downloads only the variant it will display. */}
      <link rel="preload" as="image" href="/heros/hero-main-750.webp"  type="image/webp" media="(max-width: 749px)"                          fetchPriority="high" />
      <link rel="preload" as="image" href="/heros/hero-main-1280.webp" type="image/webp" media="(min-width: 750px) and (max-width: 1279px)"  fetchPriority="high" />
      <link rel="preload" as="image" href="/heros/hero-main-1920.webp" type="image/webp" media="(min-width: 1280px)"                         fetchPriority="high" />

      <HeroHome
        eyebrowBase={t('homeHero.eyebrowBase')}
        eyebrowDefaultCity={t('homeHero.eyebrowDefaultCity')}
        eyebrowColimaCity={t('homeHero.eyebrowColimaCity')}
        title={t('homeHero.title')}
        description={t('homeHero.description')}
        primaryCta={{ label: t('homeHero.cta.primary.label'), href: t('homeHero.cta.primary.href') }}
        secondaryCta={{ label: t('homeHero.cta.secondary.label'), href: t('homeHero.cta.secondary.href') }}
        stats={[
          { number: t('homeHero.stats.specialists.number'), label: t('homeHero.stats.specialists.label') },
          { number: t('homeHero.stats.detection.number'), label: t('homeHero.stats.detection.label') },
          { number: t('homeHero.stats.guide.number'), label: t('homeHero.stats.guide.label') },
        ]}
      />
    </>
  );
}
