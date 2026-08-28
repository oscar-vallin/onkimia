import { getTranslations } from 'next-intl/server';
import { HeroHome } from '@/components/sections/HeroHome';
import type { SectionProps } from '@/components/sections/registry';

export async function HeroSection({}: SectionProps) {
  const t = await getTranslations('home');

  return (
    <>
      {/* Hero image preloads — LCP critical path.
          Next.js App Router hoists <link> RSC elements to <head>.
          Media split mirrors the <picture> in HeroHome.tsx exactly: phones
          preload the portrait crop, desktop preloads its DPR-aware variant. */}
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href="/heros/hero-main-mobile.webp"
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        type="image/webp"
        imageSrcSet="/heros/hero-main-1170.webp 1170w, /heros/hero-main-1920.webp 1920w, /heros/hero-main-2547.webp 2547w"
        imageSizes="100vw"
        media="(min-width: 768px)"
        fetchPriority="high"
      />

      <HeroHome
        // Background video — public/heros/hero-main.mp4 is the client's
        // facility walkthrough footage (79.8s, no audio), re-encoded at
        // CRF 14 (~70 MB) — the highest quality that still fits safely under
        // GitHub's 100 MB per-file push limit. Per explicit client
        // direction, visual fidelity is the priority here ahead of load
        // time / Core Web Vitals within that constraint. See
        // HeroVideoBackground.tsx doc for the full size/quality trade-off
        // table and why this file must never approach 100 MB.
        videoSources={[{ src: '/heros/hero-main.mp4', type: 'video/mp4' }]}
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
