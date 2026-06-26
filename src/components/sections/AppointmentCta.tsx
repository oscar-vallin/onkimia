import { SanityImage as Image } from '@/components/ui/SanityImage';
import { ClipboardCheck, CalendarCheck } from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { urlFor } from '@/sanity/image';

interface AppointmentCtaProps {
  title: string;
  step1: string;
  step3: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  backgroundImage?: SanityImageWithLQIP;
}

const STEPS = [
  { Icon: ClipboardCheck, key: 'step1' as const },
  { Icon: CalendarCheck,  key: 'step3' as const },
];

export function AppointmentCta({
  title,
  step1,
  step3,
  tagline,
  cta,
  ctaHref,
  backgroundImage,
}: AppointmentCtaProps) {
  const steps = { step1, step3 };

  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-12">
      {backgroundImage?.asset && (
        <Image
          src={urlFor(backgroundImage).width(1920).height(1080).format('webp').quality(80).url()}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
      )}
      <div
        className="absolute inset-0 bg-primary"
        style={{ opacity: backgroundImage?.asset ? 0.78 : 1 }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-onkimia">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3rem] text-white leading-tight tracking-[-0.02em] mb-5">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-xl mx-auto mb-10">
            {STEPS.map(({ Icon, key }, index) => (
              <div key={key} className="text-center mt-5">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white/80" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary border border-white/[0.12] text-white text-sm font-medium font-sans flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-sans text-base font-medium text-white/80 leading-snug">
                  {steps[key]}
                </h3>
              </div>
            ))}
          </div>

          <p className="font-serif text-2xl md:text-3xl italic text-white/70 mb-6">
            {tagline}
          </p>

          <PillButton variant="solid-light" href={ctaHref}>
            {cta}
          </PillButton>
        </div>
      </div>
    </section>
  );
}
