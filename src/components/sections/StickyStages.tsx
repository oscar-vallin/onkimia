import Image from 'next/image';
import { Users, Microscope, Activity, Heart } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';

type StageIcon = 'users' | 'microscope' | 'activity' | 'heart';

interface Stage {
  step: string;
  title: string;
  description: string;
  icon: StageIcon;
}

interface StickyStagesProps {
  eyebrow: string;
  title: string;
  lead: string;
  stages: Stage[];
  imageSrc?: string;
  imageAlt: string;
  heroImage?: SanityImageWithLQIP;
}

const ICON_MAP: Record<StageIcon, React.ReactNode> = {
  users:      <Users      className="w-6 h-6" aria-hidden="true" />,
  microscope: <Microscope className="w-6 h-6" aria-hidden="true" />,
  activity:   <Activity   className="w-6 h-6" aria-hidden="true" />,
  heart:      <Heart      className="w-6 h-6" aria-hidden="true" />,
};

function parseTitle(raw: string) {
  const parts = raw.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <em key={i} className="italic text-teal-soft">{part}</em>
      : <span key={i}>{part}</span>
  );
}

export function StickyStages({
  eyebrow,
  title,
  lead,
  stages,
  imageSrc,
  imageAlt,
  heroImage,
}: StickyStagesProps) {
  const src: string = heroImage
    ? urlFor(heroImage).width(800).height(1000).format('webp').quality(82).url()!
    : '/images/process-placeholder.jpg';
  const blur = heroImage?.asset?.metadata?.lqip ?? undefined;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-onkimia">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left — sticky image */}
          <div className="lg:sticky lg:top-[110px]">
            <div className="relative aspect-[5/5] rounded-3xl overflow-hidden bg-ink-2">
              <Image
                src={src}
                alt={imageAlt}
                fill
                priority={false}
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder={blur ? 'blur' : 'empty'}
                blurDataURL={blur}
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — header + stages */}
          <div>
            {/* Section header */}
            <div className="mb-10">
              <p className="text-teal uppercase tracking-wider font-medium text-xs mb-3">
                {eyebrow}
              </p>
              <h2 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
                {parseTitle(title)}
              </h2>
              <p className="text-gray-warm text-lg leading-relaxed mt-6">
                {lead}
              </p>
            </div>

            {/* Stages */}
            <div>
              {stages.map((stage) => (
                <div key={stage.step} className="border-b border-line py-10 last:border-b-0">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-teal-soft)]/15 text-teal mb-5">
                    {ICON_MAP[stage.icon]}
                  </span>
                  <p className="text-xs font-medium tracking-wider uppercase text-teal mb-2">
                    {stage.step}
                  </p>
                  <h3 className="font-serif text-2xl text-ink mb-3">
                    {stage.title}
                  </h3>
                  <p className="text-gray-warm text-base leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
