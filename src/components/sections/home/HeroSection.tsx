import { getTranslations } from 'next-intl/server';
import { HeroHome } from '@/components/sections/HeroHome';
import type { SectionProps } from '@/components/sections/registry';

// The client's facility walkthrough footage (79.8s, no audio, full original
// bitrate — never recompressed), pre-cut into 9 sequential parts and played
// back-to-back via double-buffered preloading (see HeroVideoBackground.tsx
// for why: real HLS was evaluated and rejected, since a single-rendition
// HLS stream buys nothing extra without re-encoding into multiple bitrates).
// Order matters — these play in array order, looping back to index 0.
const HERO_VIDEO_SEGMENTS = [
  '/heros/segments/hero-part-01.mp4',
  '/heros/segments/hero-part-02.mp4',
  '/heros/segments/hero-part-03.mp4',
  '/heros/segments/hero-part-04.mp4',
  '/heros/segments/hero-part-05.mp4',
  '/heros/segments/hero-part-06.mp4',
  '/heros/segments/hero-part-07.mp4',
  '/heros/segments/hero-part-08.mp4',
  '/heros/segments/hero-part-09.mp4',
];

export async function HeroSection({}: SectionProps) {
  const t = await getTranslations('home');

  return (
      <HeroHome
        videoSegments={HERO_VIDEO_SEGMENTS}
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
  );
}
