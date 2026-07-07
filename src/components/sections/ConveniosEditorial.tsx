import { SanityImage as Image } from '@/components/ui/SanityImage';
import { urlFor } from '@/sanity/image';
import type { Insurance } from '@/sanity/types';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface ConveniosEditorialProps {
  insurances: Insurance[];
  eyebrow: string;
  title: string;
  intro: string;
  statLabel: string;
}

export function ConveniosEditorial({
  insurances,
  eyebrow,
  title,
  intro,
  statLabel,
}: ConveniosEditorialProps) {
  const count = insurances.length;

  // Filter out any entries without an uploadded logo
  const withLogo = insurances.filter((ins) => !!ins.logo?.asset);

  return (
    <section className="bg-gray-50 py-20 md:py-28 overflow-hidden">
      <div className="container-onkimia max-w-6xl mx-auto">

        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} theme="light" align="center" />

      </div>

      {/*
        Marquee — full-width so the fade mask bleeds edge-to-edge.
        CSS classes from globals.css:
          .insurance-carousel-fade  → mask-image edge fade + hover-pause
          .insurance-carousel-track → animation: insurance-marquee 40s linear infinite
        Reduced-motion: global rule stops the animation; motion-reduce:hidden hides the
        animated track and shows the static fallback below.
      */}

      {/* Screen-reader list — always in DOM regardless of animation/motion state */}
      <ul className="sr-only" aria-label="Convenios con aseguradoras">
        {withLogo.map((ins) => (
          <li key={ins._id}>{ins.name}</li>
        ))}
      </ul>

      {/* Animated logo marquee */}
      <div
        className="insurance-carousel-fade relative motion-reduce:hidden py-4"
        aria-hidden="true"
      >
        {/* Track: two identical sets for the seamless -50% loop */}
        <div className="insurance-carousel-track flex items-center">
          {[0, 1].map((dupe) => (
            <span key={dupe} className="flex items-center shrink-0">
              {withLogo.map((ins) => (
                <span
                  key={`${dupe}-${ins._id}`}
                  className="flex items-center justify-center h-20 px-8 md:px-12 shrink-0"
                >
                  <Image
                    src={urlFor(ins.logo).height(160).format('webp').url()}
                    alt={ins.name}
                    width={240}
                    height={80}
                    loading="lazy"
                    className="h-14 md:h-16 max-w-xs w-full object-contain opacity-60 hover:opacity-90 transition-opacity duration-200"
                  />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Static fallback for prefers-reduced-motion */}
      <div
        className="hidden motion-reduce:flex flex-wrap justify-center items-center gap-x-10 gap-y-5 px-6 py-4"
        aria-label="Convenios con aseguradoras"
      >
        {withLogo.map((ins) => (
          <Image
            key={ins._id}
            src={urlFor(ins.logo).height(160).format('webp').url()}
            alt={ins.name}
            width={240}
            height={80}
            loading="lazy"
            className="h-14 max-w-xs w-full object-contain opacity-60"
          />
        ))}
      </div>

      {/* Stat line */}
      <div className="container-onkimia max-w-6xl mx-auto">
        <p className="text-center font-sans text-[10px] md:text-xs tracking-[0.22em] uppercase text-secondary/50 mt-10">
          • {count} {statLabel} •
        </p>
      </div>

    </section>
  );
}
