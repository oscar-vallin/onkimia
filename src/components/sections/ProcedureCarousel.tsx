import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { Procedure, SanityImageWithLQIP } from '@/sanity/types';
import { ProcedureMarquee } from './ProcedureMarquee';

interface ProcedureCarouselProps {
  eyebrow: string;
  title: string;
  lead?: string;
  backgroundImageSrc?: string;
  backgroundImage?: SanityImageWithLQIP;
  procedures: Procedure[];
  badgeEndos: string;
  badgeCuidare: string;
  categoryEndos: string;
  categoryCuidare: string;
}

interface ProcedureCardProps extends Procedure {
  badgeEndos: string;
  badgeCuidare: string;
  categoryEndos: string;
  categoryCuidare: string;
}

function parseTitle(raw: string) {
  const parts = raw.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <em key={i} className="italic text-teal-soft">{part}</em>
      : <span key={i}>{part}</span>
  );
}

function ProcedureCard({
  name,
  duration,
  shortDescription,
  submark,
  image,
  badgeEndos,
  badgeCuidare,
  categoryEndos,
  categoryCuidare,
}: ProcedureCardProps) {
  const hasDuration = !!duration;
  const [durationNum, ...durationUnit] = hasDuration ? duration!.split(' ') : [];
  const unitStr = durationUnit?.join(' ') ?? '';

  const cardSrc = image
    ? urlFor(image).width(800).format('webp').quality(82).url()!
    : undefined;
  const blur = image?.asset?.metadata?.lqip ?? undefined;

  return (
    <div className="w-[380px] h-[580px] flex-shrink-0 relative rounded-3xl overflow-hidden bg-[#1a2420]">
      {/* Layer 1 — blurred background (fills card, hides letterbox gaps) */}
      {cardSrc && (
        <Image
          src={cardSrc}
          alt=""
          fill
          sizes="380px"
          loading="lazy"
          placeholder={blur ? 'blur' : 'empty'}
          blurDataURL={blur}
          className="object-cover scale-110 blur-xl opacity-60"
          aria-hidden="true"
        />
      )}

      {/* Layer 2 — actual image, fully visible without cropping */}
      {cardSrc && (
        <Image
          src={cardSrc}
          alt={name}
          fill
          sizes="380px"
          loading="lazy"
          placeholder={blur ? 'blur' : 'empty'}
          blurDataURL={blur}
          className="object-contain"
        />
      )}

      {/* Scrim: only top and bottom for text legibility */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.60) 100%)' }}
        aria-hidden="true"
      />

      {/* ── Header — overlaid on image ── */}
      <div className="absolute top-0 left-0 right-0 z-10">
        {hasDuration ? (
          <div className="grid grid-cols-2 divide-x divide-white/25">
            <div className="px-5 pt-5 pb-4">
              <div className="font-serif text-4xl text-white leading-none">{durationNum}</div>
              {unitStr && <div className="text-[10px] text-white/55 mt-1 uppercase tracking-wider">{unitStr}</div>}
            </div>
            <div className="px-5 pt-5 pb-4">
              <div className="text-sm font-medium text-white leading-snug">{name}</div>
              <div className="text-[11px] text-white/55 mt-1">
                {submark === 'Endos' ? categoryEndos : categoryCuidare}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 pt-5 pb-4">
            <div className="text-sm font-medium text-white leading-snug">{name}</div>
            <div className="text-[11px] text-white/55 mt-1">
              {submark === 'Endos' ? categoryEndos : categoryCuidare}
            </div>
          </div>
        )}
        {/* Horizontal divider line */}
        <div className="h-px bg-white/25 mx-0" />
      </div>

      {/* ── Footer — overlaid on image ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-px bg-white/25" />
        <div className="px-5 py-4">
          <span className="inline-flex items-center text-[9px] tracking-wider uppercase font-semibold text-white bg-teal/70 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
            {submark === 'Endos' ? badgeEndos : badgeCuidare}
          </span>
          <p className="text-xs text-white/85 leading-relaxed line-clamp-2">{shortDescription}</p>
        </div>
      </div>
    </div>
  );
}

export function ProcedureCarousel({
  eyebrow,
  title,
  lead,
  backgroundImageSrc,
  backgroundImage,
  procedures,
  badgeEndos,
  badgeCuidare,
  categoryEndos,
  categoryCuidare,
}: ProcedureCarouselProps) {
  const bgSrc = backgroundImage
    ? urlFor(backgroundImage).width(1920).height(1080).format('webp').quality(75).url()!
    : backgroundImageSrc;

  return (
    <section className="bg-ink relative py-20 md:py-28 overflow-hidden">
      {/* Section background image */}
      <div className="absolute inset-0 z-0">
        {bgSrc && (
          <Image
            src={bgSrc as string}
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="object-cover opacity-25"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 to-ink/95" />
      </div>

      {/* Header */}
      <div className="relative z-10 container-onkimia">
        <p className="text-teal-soft uppercase tracking-wider font-medium text-xs mb-3">
          {eyebrow}
        </p>
        <h2 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
          {parseTitle(title)}
        </h2>
        {lead && (
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mt-6">
            {lead}
          </p>
        )}
      </div>

      {/* Marquee — full width, outside container */}
      <div className="relative z-10 mt-12 overflow-hidden py-4">
        <ProcedureMarquee>
          <div
            className="marquee-track flex gap-5 w-max"
            style={{ animation: 'marquee 80s linear infinite' }}
          >
            {/* Set A */}
            {procedures.map((p) => (
              <ProcedureCard
                key={`a-${p._id}`}
                {...p}
                badgeEndos={badgeEndos}
                badgeCuidare={badgeCuidare}
                categoryEndos={categoryEndos}
                categoryCuidare={categoryCuidare}
              />
            ))}
            {/* Set B — seamless loop */}
            {procedures.map((p) => (
              <ProcedureCard
                key={`b-${p._id}`}
                {...p}
                badgeEndos={badgeEndos}
                badgeCuidare={badgeCuidare}
                categoryEndos={categoryEndos}
                categoryCuidare={categoryCuidare}
              />
            ))}
          </div>
        </ProcedureMarquee>
      </div>
    </section>
  );
}
