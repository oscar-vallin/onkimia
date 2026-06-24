import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { WellCard } from './WellCard';

// Values must match the dropdown list in siteSettings.ts → wellbeingList[].icon
export type WellIconName = 'sparkles' | 'zap' | 'heart' | 'shopping-bag' | 'bar-chart' | 'lightbulb' | 'dna' | 'activity';

export interface WellbeingItem {
  icon: WellIconName | string;
  title: string;
  description: string;
}

interface WellnessProps {
  eyebrow: string;
  title: string;
  intro: string;
  items: WellbeingItem[];
  backgroundImage?: SanityImageWithLQIP;
}

export function Wellness({ eyebrow, title, intro, items, backgroundImage }: WellnessProps) {
  const bgSrc = backgroundImage
    ? urlFor(backgroundImage).width(1920).height(1080).format('webp').url()
    : null;
  const lqip = backgroundImage?.asset?.metadata?.lqip;

  return (
    <section className="relative py-20 md:py-28 bg-primary overflow-hidden">

      {/* Background image + overlay */}
      {bgSrc && (
        <>
          <Image
            src={bgSrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            placeholder={lqip ? 'blur' : 'empty'}
            blurDataURL={lqip}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        </>
      )}

      {/* Content sits above the overlay */}
      <div className="relative z-10 container-onkimia max-w-6xl mx-auto">

        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} theme="dark" align="center" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((item) => (
            <WellCard key={item.title} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}
