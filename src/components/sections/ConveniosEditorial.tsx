import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { Insurance } from '@/sanity/types';

interface ConveniosEditorialProps {
  insurances: Insurance[];
  eyebrow: string;
  title: string;
  statLabel: string;
}

const MAX_LOGOS = 8;

export function ConveniosEditorial({
  insurances,
  eyebrow,
  title,
  statLabel,
}: ConveniosEditorialProps) {
  const visible = insurances.slice(0, MAX_LOGOS);
  const overflow = insurances.length > MAX_LOGOS ? insurances.length - MAX_LOGOS : 0;

  const words = title.trim().split(/\s+/);
  const lastWord = words.pop() ?? '';
  const headStart = words.join(' ');

  return (
    <section className="bg-cream py-20 md:py-28 overflow-hidden">
      <div className="container-onkimia">

        {/* Eyebrow */}
        <p className="text-teal uppercase tracking-[0.22em] font-medium text-xs mb-4">
          {eyebrow}
        </p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-14 lg:gap-20 items-start">

          {/* Left — title + stat */}
          <div className="lg:sticky lg:top-32">
            <h2 className="font-serif font-normal text-4xl md:text-5xl text-ink leading-tight mb-12">
              {headStart}{' '}
              <em className="not-italic text-teal-soft">{lastWord}</em>
            </h2>

            {/* Stat */}
            <div className="border-t-2 border-teal pt-6">
              <span
                className="font-serif text-ink leading-none block"
                style={{ fontSize: 'clamp(4.5rem, 10vw, 7rem)' }}
                aria-label={`${insurances.length} ${statLabel}`}
              >
                {insurances.length}
              </span>
              <p className="text-gray-warm text-sm leading-relaxed mt-3 max-w-[260px]">
                {statLabel}
              </p>
            </div>
          </div>

          {/* Right — logo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {visible.map((ins) => (
              <InsuranceCard key={ins._id} insurance={ins} />
            ))}

            {overflow > 0 && (
              <div className="bg-cream-2 border border-line rounded-2xl min-h-[120px] flex items-center justify-center">
                <span className="font-serif text-2xl text-gray-warm">
                  +{overflow}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function InsuranceCard({ insurance }: { insurance: Insurance }) {
  const inner = (
    <div className="group bg-white border border-line rounded-2xl min-h-[120px] flex items-center justify-center relative overflow-hidden shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(26,122,110,0.13)] hover:border-teal/25">
      <div className="px-6 py-5 flex items-center justify-center w-full h-full">
        {insurance.logo?.asset ? (
          <Image
            src={urlFor(insurance.logo).height(96).format('webp').quality(90).url()}
            alt={insurance.name}
            width={130}
            height={48}
            className="object-contain max-h-11 w-auto opacity-75 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : (
          <span className="font-medium text-gray-warm text-sm text-center leading-snug px-2">
            {insurance.name}
          </span>
        )}
      </div>
    </div>
  );

  if (insurance.website) {
    return (
      <a
        href={insurance.website}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 rounded-2xl"
      >
        {inner}
      </a>
    );
  }

  return inner;
}
