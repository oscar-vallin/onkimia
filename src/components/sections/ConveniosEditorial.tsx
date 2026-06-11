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

  // Split title: last word wrapped in <em>
  const words = title.trim().split(/\s+/);
  const lastWord = words.pop() ?? '';
  const headStart = words.join(' ');

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-onkimia">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-teal uppercase tracking-widest font-medium text-xs mb-3">
            {eyebrow}
          </p>
          <h2 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
            {headStart}{' '}
            <em className="italic text-teal-soft not-italic">{lastWord}</em>
          </h2>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_2fr] gap-12 items-center">
          {/* Left — stat */}
          <div>
            <span
              className="font-serif text-ink leading-none block"
              style={{ fontSize: 'clamp(4rem, 9vw, 6.5rem)' }}
            >
              {insurances.length}
            </span>
            <p className="text-gray-warm text-base mt-4 max-w-[300px]">
              {statLabel}
            </p>
          </div>

          {/* Right — logo grid */}
          <div className="grid grid-cols-3 gap-4">
            {visible.map((ins) => (
              <InsuranceCard key={ins._id} insurance={ins} />
            ))}

            {overflow > 0 && (
              <div className="bg-white border border-line rounded-2xl min-h-[90px] flex items-center justify-center">
                <span className="font-medium text-gray-warm text-base">
                  +{overflow} más
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
    <div className="group bg-white border border-line rounded-2xl min-h-[90px] flex items-center justify-center relative overflow-hidden transition-all duration-200 hover:-translate-y-1.5 hover:border-teal hover:shadow-[0_18px_36px_rgba(26,122,110,0.20)] cursor-pointer">
      {/* Teal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal to-teal-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Content */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-center">
        {insurance.logo?.asset ? (
          <Image
            src={urlFor(insurance.logo).height(40).url()}
            alt={insurance.name}
            width={120}
            height={40}
            className="object-contain max-h-10 group-hover:brightness-0 group-hover:invert transition-[filter] duration-200"
          />
        ) : (
          <span className="font-medium text-gray-warm text-sm text-center group-hover:text-white transition-colors duration-200">
            {insurance.name}
          </span>
        )}
      </div>
    </div>
  );

  if (insurance.website) {
    return (
      <a href={insurance.website} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return inner;
}
