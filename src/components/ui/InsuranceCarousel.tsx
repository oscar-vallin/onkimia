import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { Insurance } from '@/sanity/types';

interface InsuranceCarouselProps {
  insurances: Insurance[];
}

export function InsuranceCarousel({ insurances }: InsuranceCarouselProps) {
  if (insurances.length === 0) return null;

  const renderItem = (insurance: Insurance, keySuffix: string) => {
    const inner = (
      <div className="flex items-center justify-center px-6 h-[100px] w-[200px] flex-shrink-0 bg-neutral-100 rounded-lg">
        {insurance.logo ? (
          <div className="relative h-[60px] w-[140px]">
            <Image
              src={urlFor(insurance.logo).width(240).url()}
              alt={insurance.name}
              fill
              sizes="140px"
              loading="eager"
              className="object-contain"
            />
          </div>
        ) : (
          <span className="text-neutral-600 font-medium text-center">
            {insurance.name}
          </span>
        )}
      </div>
    );

    return insurance.website ? (
      <a
        key={`${insurance._id}-${keySuffix}`}
        href={insurance.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={insurance.name}
        className="block"
      >
        {inner}
      </a>
    ) : (
      <div key={`${insurance._id}-${keySuffix}`}>{inner}</div>
    );
  };

  return (
    <div
      className="relative overflow-hidden insurance-carousel-fade"
      role="region"
      aria-label="Aseguradoras con las que tenemos convenio"
    >
      <div className="insurance-carousel-track flex gap-8 w-max">
        {insurances.map((ins) => renderItem(ins, 'a'))}
        <div className="flex gap-8" aria-hidden="true">
          {insurances.map((ins) => renderItem(ins, 'b'))}
        </div>
      </div>
    </div>
  );
}
