'use client';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { urlFor } from '@/sanity/image';

interface AboutHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image?: SanityImageWithLQIP;
}

function parseTitle(raw: string) {
  const parts = raw.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <em key={i} className="not-italic italic text-teal-soft">{part}</em>
      : <span key={i}>{part}</span>
  );
}

// Returns inline motion props with a staggered delay — avoids Variants typing issues.
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: 'easeOut' as const, delay },
  };
}

export function AboutHero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  image,
}: AboutHeroProps) {
  const imageSrc = image
    ? urlFor(image).width(1920).quality(80).format('webp').url()
    : null;
  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-ink text-white -mt-16 md:-mt-20 flex items-end md:items-center">

      {/* ── Background image ── */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover object-[center_20%] md:object-center z-0"
          aria-hidden="true"
        />
      )}

      {/* ── Desktop: left-to-right gradient — text left, photo right ── */}
      <div
        className="absolute inset-0 z-[1] hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.70) 20%, rgba(0,0,0,0.20) 58%, rgba(0,0,0,0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Mobile: top-to-bottom gradient — faces visible top, text readable bottom ── */}
      <div
        className="absolute inset-0 z-[1] md:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.20) 35%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.92) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full container-onkimia py-32 md:py-28">
        <div className="max-w-xl">

          <motion.p
            className="text-xs font-medium tracking-[0.25em] uppercase text-white/60 mb-5"
            {...fadeUp(0)}
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6"
            {...fadeUp(0.1)}
          >
            {parseTitle(title)}
          </motion.h1>

          <motion.p
            className="text-base md:text-lg leading-relaxed text-white/75 mb-10"
            {...fadeUp(0.2)}
          >
            {description}
          </motion.p>

          <motion.div {...fadeUp(0.32)}>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
