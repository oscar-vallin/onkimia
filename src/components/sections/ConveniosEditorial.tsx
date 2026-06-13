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
    <div className="group bg-white border border-line rounded-2xl min-h-[90px] flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(26,122,110,0.15)] hover:border-teal-soft/40 cursor-pointer">
      {/* Content */}
      <div className="px-4 py-3 flex items-center justify-center">
        {insurance.logo?.asset ? (
          <Image
            src={urlFor(insurance.logo).height(80).url()}
            alt={insurance.name}
            width={120}
            height={40}
            className="object-contain max-h-10 opacity-60 transition-all duration-300 group-hover:opacity-100 [filter:grayscale(1)_drop-shadow(0_2px_8px_rgba(0,0,0,0.22))] group-hover:[filter:grayscale(0)_drop-shadow(0_2px_4px_rgba(0,0,0,0.10))]"
          />
        ) : (
          <span className="font-medium text-gray-warm text-sm text-center">
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
