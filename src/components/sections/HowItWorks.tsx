import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { PillButton } from '@/components/ui/PillButton';

interface Step {
  number: string;
  title: string;
  description: string;
  image?: SanityImageWithLQIP;
}

interface HowItWorksProps {
  eyebrow: string;
  title: string;
  intro: string;
  cta: string;
  ctaHref: string;
  steps: [Step, Step, Step];
}

export function HowItWorks({
  eyebrow,
  title,
  intro,
  cta,
  ctaHref,
  steps,
}: HowItWorksProps) {
  return (
    <Section theme="white">

      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} theme="light" align="center">
        <PillButton variant="outline-dark" href={ctaHref}>
          {cta}
        </PillButton>
      </SectionHeader>

      {/* Steps grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step) => (
          <article
            key={step.number}
            className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-black/[0.06] shadow-sm"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-100 shrink-0">
              {step.image ? (
                <Image
                  src={urlFor(step.image).width(800).height(600).format('webp').url()}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                /* Placeholder shown until image is uploaded in Sanity */
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="font-serif text-6xl text-gray-300 select-none">
                    {step.number}
                  </span>
                </div>
              )}
            </div>

            {/* Text block */}
            <div className="flex flex-col flex-1 p-6 md:p-7 bg-gray-50/70">
              <span className="font-sans text-xs font-medium text-secondary/70 tracking-[0.14em] mb-3">
                {step.number}
              </span>
              <h3 className="font-serif text-xl md:text-2xl text-primary leading-snug tracking-[-0.01em] mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-sm text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          </article>
        ))}
      </div>

    </Section>
  );
}
