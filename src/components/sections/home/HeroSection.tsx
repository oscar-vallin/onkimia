import { getTranslations } from 'next-intl/server';
import { HeroHome } from '@/components/sections/HeroHome';
import type { SectionProps } from '@/components/sections/registry';

// The client's facility walkthrough footage (79.8s, no audio, full original
// bitrate — never recompressed at any point in this pipeline), packaged as
// HLS fMP4 by scripts/build-hero-hls.sh from the 9 original segments in
// public/heros/segments/. See HeroVideoBackground.tsx for why HLS/MSE
// replaced the earlier double-buffered MP4 segment-swapping approach (that
// caused a black frame at every segment boundary — a single MSE decode
// timeline has no boundaries to flash on).
const HERO_VIDEO_HLS_SRC = '/heros/hls/hero.m3u8';
const HERO_VIDEO_FALLBACK_SRC = '/heros/hls/hero.mp4';

export async function HeroSection({}: SectionProps) {
  const t = await getTranslations('home');

  return (
      <HeroHome
        videoHlsSrc={HERO_VIDEO_HLS_SRC}
        videoFallbackSrc={HERO_VIDEO_FALLBACK_SRC}
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
