import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';

interface ProcedureItem {
  key: string;
  name: string;
  duration: string;
  shortDescription: string;
  submark: 'Endos' | 'Cuidare';
  icon: React.ComponentType<{ className?: string }>;
}

interface ProcedureCarouselProps {
  eyebrow: string;
  title: string;
  lead?: string;
  backgroundImageSrc?: string;
  backgroundImage?: SanityImageWithLQIP;
  procedures: ProcedureItem[];
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
  backgroundImageSrc,
}: Pick<ProcedureItem, 'name' | 'duration' | 'shortDescription' | 'submark'> & {
  backgroundImageSrc?: string;
}) {
  const [durationNum, ...durationUnit] = duration.split(' ');
  const unitStr = durationUnit.join(' ');

  return (
    <div className="w-[300px] h-[400px] flex-shrink-0 relative rounded-3xl overflow-hidden bg-[#14463f]">
      {/* Background image */}
      {backgroundImageSrc && (
        <Image
          src={backgroundImageSrc}
          alt=""
          fill
          sizes="300px"
          className="object-cover"
          aria-hidden="true"
        />
      )}

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/15 to-ink/90" />

      {/* Top grid: duration | name */}
      <div className="absolute top-0 left-0 right-0 grid grid-cols-2 z-10">
        <div className="p-5 border-r border-white/20">
          <div className="font-serif text-3xl text-white leading-none">
            {durationNum || '—'}
          </div>
          {unitStr && (
            <div className="text-xs text-teal-soft mt-1">{unitStr}</div>
          )}
        </div>
        <div className="p-5">
          <div className="text-base font-medium text-white leading-tight">{name}</div>
          <div className="text-xs text-white/65 mt-1">
            {submark === 'Endos' ? 'Diagnóstico' : 'Cuidado'}
          </div>
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="absolute top-[94px] left-5 right-5 h-px bg-white/20 z-10" />

      {/* Bottom: badge + description */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <span className="inline-block text-[10px] tracking-wider uppercase text-teal-soft border border-teal-soft/40 rounded-full px-3 py-1 mb-2">
          {submark}
        </span>
        <p className="text-sm text-white/85 leading-relaxed">{shortDescription}</p>
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
}: ProcedureCarouselProps) {
  const bgSrc = backgroundImage
    ? urlFor(backgroundImage).width(1920).height(1080).format('webp').quality(75).url()!
    : backgroundImageSrc;

  return (
    <section className="bg-ink relative py-20 md:py-28 overflow-hidden">
      {/* Background image */}
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
        <div
          className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 50s linear infinite' }}
        >
          {/* Set A */}
          {procedures.map((p) => (
            <ProcedureCard
              key={`a-${p.key}`}
              name={p.name}
              duration={p.duration}
              shortDescription={p.shortDescription}
              submark={p.submark}
              backgroundImageSrc={bgSrc}
            />
          ))}
          {/* Set B — seamless loop */}
          {procedures.map((p) => (
            <ProcedureCard
              key={`b-${p.key}`}
              name={p.name}
              duration={p.duration}
              shortDescription={p.shortDescription}
              submark={p.submark}
              backgroundImageSrc={bgSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
