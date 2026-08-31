import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { HeroEyebrow } from './HeroEyebrow';
import { HeroVideoBackground } from './HeroVideoBackground';

// HeroVideoBackground carries its own 'use client' directive, so importing
// it here (a Server Component) is enough for Next to create the client
// boundary at exactly that leaf — no next/dynamic needed. It returns null
// server-side (and on the client until prefers-reduced-motion resolves, or
// when no video src was passed), so there's nothing to hydrate-mismatch
// against and no SSR cost either way.

interface Stat {
  number: string;
  label: string;
}

export interface HeroHomeProps {
  eyebrowBase: string;
  eyebrowDefaultCity: string;
  eyebrowColimaCity: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: [Stat, Stat, Stat];
  /** Background video — HLS fMP4 (see HeroVideoBackground.tsx). No static
   *  fallback image behind it (removed per client request). Omit both and
   *  the hero falls back to its plain bg-primary color. */
  videoHlsSrc?: string;
  videoFallbackSrc?: string;
}

function parseHeroTitle(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*')
      ? <em key={i} className="italic font-normal">{part.slice(1, -1)}</em>
      : <span key={i}>{part}</span>
  );
}

export function HeroHome({
  eyebrowBase,
  eyebrowDefaultCity,
  eyebrowColimaCity,
  title,
  description,
  primaryCta,
  secondaryCta,
  stats,
  videoHlsSrc,
  videoFallbackSrc,
}: HeroHomeProps) {
  return (
    <section className="relative w-full min-h-[calc(100svh+4rem)] md:min-h-[calc(100svh+5rem)] overflow-hidden bg-primary text-white -mt-16 md:-mt-20">
        {/* No static fallback image — removed per client request so nothing
            shows behind the video before it starts playing (the section's
            own bg-primary color fills that gap instead). Renders nothing
            when the video sources are omitted. See HeroVideoBackground.tsx
            for the full behavior contract (HLS/MSE playback, reduced-motion
            opt-out, fade-in only once a real frame has been composited). */}
        {/* Unconditionally in the tree at a fixed JSX position — whether a
            video actually plays is decided inside HeroVideoBackground, not
            by mounting/unmounting this call site. Toggling this component
            in and out of the tree would remount its <video>, which is
            exactly the kind of src/identity change that resets
            readyState and reintroduces the black-frame problem. */}
        <HeroVideoBackground hlsSrc={videoHlsSrc ?? ''} fallbackSrc={videoFallbackSrc ?? ''} />

      {/* Overlay: gradient bottom-left → top-right for legibility of bottom-left content */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(
            to top right,
            rgba(0,0,0,0.75) 0%,
            rgba(0,0,0,0.45) 45%,
            rgba(0,0,0,0.10) 100%
          )`,
        }}
        aria-hidden="true"
      />
      {/* Bottom vignette — ensures text area always readable regardless of image */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(
            to top,
            rgba(0,0,0,0.60) 0%,
            transparent 40%
          )`,
        }}
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative z-10 container-onkimia min-h-[calc(100svh+4rem)] md:min-h-[calc(100svh+5rem)] flex flex-col pb-12 md:pb-16">

        {/* Eyebrow — top-anchored, updates when user picks a clinic */}
        <div className="pt-36 md:pt-44">
          <HeroEyebrow
            base={eyebrowBase}
            defaultCity={eyebrowDefaultCity}
            colimaCity={eyebrowColimaCity}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom row: content left + stats right */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-16">

          {/* LEFT — headline, subtitle, CTAs */}
          <div className="max-w-xl">
            <h1 className="font-serif text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.05] tracking-[-0.02em] text-white mb-5 md:mb-6">
              {parseHeroTitle(title)}
            </h1>

            {/* Visible on mobile too — this is the site's only definitional
                "what is Onkimia" sentence, and mobile-first indexing means a
                paragraph hidden on small viewports is effectively invisible
                to search/AI crawlers, not just to phone users. */}
            <p className="font-sans text-sm md:text-base text-white/75 leading-relaxed max-w-md mb-8 md:mb-10">
              {description}
            </p>

            {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <PillButton
                variant="solid-light"
                href={primaryCta.href}
                icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              >
                {primaryCta.label}
              </PillButton>
              <PillButton variant="outline-light" href={secondaryCta.href}>
                {secondaryCta.label}
              </PillButton>
            </div> */}
          </div>

          {/* RIGHT — stats bar (desktop only) */}
          {/* <div className="hidden md:flex flex-row lg:flex-row items-start lg:items-end gap-0 self-start lg:self-auto shrink-0"> */}
            {/* {stats.map((stat, i) => ( */}
              {/* <div key={i} className="flex items-stretch"> */}
                {/* Divider before every item except the first */}
                {/* {i > 0 && (
                  <div className="w-px self-stretch bg-white/20 mx-5 md:mx-7" aria-hidden="true" />
                )} */}
                {/* <div className="flex flex-col gap-1">
                  <span className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-none">
                    {stat.number}
                  </span>
                  <span className="font-sans text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-white/55 leading-snug max-w-[9ch] md:max-w-none">
                    {stat.label}
                  </span>
                </div>
              </div> */}
            {/* ))} */}
          {/* </div> */}

        </div>
      </div>

      {/* Header scroll sentinel */}
      <div id="hero-end-sentinel" className="absolute bottom-0 left-0 w-px h-px pointer-events-none" aria-hidden="true" />

    </section>
  );
}
