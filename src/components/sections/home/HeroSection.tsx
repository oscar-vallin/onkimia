import { getTranslations } from 'next-intl/server';
import { HeroHome } from '@/components/sections/HeroHome';
import type { SectionProps } from '@/components/sections/registry';

export async function HeroSection({}: SectionProps) {
  const t = await getTranslations('home');

  return (
    <>
      {/* Hero image preload — LCP critical path.
          Next.js App Router hoists <link> RSC elements to <head>.
          imageSrcSet/imageSizes mirror the <img> in HeroHome.tsx exactly, so the
          browser preloads the same DPR-aware variant it will render. */}
      <link
        rel="preload"
        as="image"
        type="image/webp"
        imageSrcSet="/heros/hero-main-750.webp 750w, /heros/hero-main-1170.webp 1170w, /heros/hero-main-1920.webp 1920w"
        imageSizes="100vw"
        fetchPriority="high"
      />

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
