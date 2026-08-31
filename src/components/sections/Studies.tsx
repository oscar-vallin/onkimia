import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { FloatingImages } from './FloatingImages';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface StudyLabel {
  title: string;
  subtitle: string;
}

interface StudiesProps {
  eyebrow: string;
  title: string;
  intro: string;
  labels: [StudyLabel, StudyLabel, StudyLabel, StudyLabel];
  gallery?: Array<{ _key: string; image: SanityImageWithLQIP; alt?: string }>;
}

export function Studies({ eyebrow, title, intro, labels, gallery }: StudiesProps) {
  const images = gallery?.length ? gallery : null;
  const count  = images ? Math.min(images.length, 5) : 5;

  // These arrays contain only serializable values — safe to pass to the client component.
  const imgSrcs  = Array.from({ length: count }).map((_, i) =>
    images ? urlFor(images[i].image).width(400).height(400).format('webp').url() : null
  );
  const imgAlts  = Array.from({ length: count }).map((_, i) =>
    images?.[i]?.alt ?? `Imagen de estudio ${i + 1}`
  );
  const imgLqips = Array.from({ length: count }).map((_, i) =>
    images?.[i]?.image?.asset?.metadata?.lqip
  );

  return (
    <Section theme="white" overflow>

      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} theme="light" align="center" />

      {/* Client component — handles animation only */}
      <FloatingImages
        count={count}
        srcs={imgSrcs}
        alts={imgAlts}
        lqips={imgLqips}
      />

      {/* Study label cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {labels.map((label) => (
          <div
            key={label.title}
            className="flex flex-col items-center text-center bg-gray-50 border border-black/[0.06] rounded-xl px-4 py-6 md:py-7"
          >
            <span className="font-serif text-xl md:text-2xl text-primary leading-tight mb-1.5">
              {label.title}
            </span>
            <span className="font-sans text-xs text-secondary leading-snug">
              {label.subtitle}
            </span>
          </div>
        ))}
      </div>

    </Section>
  );
}
