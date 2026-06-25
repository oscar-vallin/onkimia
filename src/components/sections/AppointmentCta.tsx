import Image from 'next/image';
import { ClipboardCheck, UserSearch, CalendarCheck } from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { urlFor } from '@/sanity/image';

interface AppointmentCtaProps {
  title: string;
  description: string;
  step1: string;
  step2: string;
  step3: string;
  cta: string;
  ctaHref: string;
  backgroundImage?: SanityImageWithLQIP;
}

const STEPS = [
  { Icon: ClipboardCheck, key: 'step1' as const },
  { Icon: UserSearch,     key: 'step2' as const },
  { Icon: CalendarCheck,  key: 'step3' as const },
];

export function AppointmentCta({
  title,
  description,
  step1,
  step2,
  step3,
  cta,
  ctaHref,
  backgroundImage,
}: AppointmentCtaProps) {
  const steps = { step1, step2, step3 };

  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-28">
      {backgroundImage?.asset && (
        <Image
          src={urlFor(backgroundImage).width(1920).height(1080).format('webp').quality(80).url()}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          placeholder={backgroundImage.asset?.metadata?.lqip ? 'blur' : 'empty'}
          blurDataURL={backgroundImage.asset?.metadata?.lqip ?? undefined}
        />
      )}
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-primary"
        style={{ opacity: backgroundImage?.asset ? 0.78 : 1 }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-onkimia">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] text-white leading-tight tracking-[-0.02em] mb-5">
            {title}
          </h2>
          <p className="font-sans text-sm md:text-base text-white/65 leading-relaxed mb-14">
            {description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            {STEPS.map(({ Icon, key }, index) => (
              <div key={key} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-white/80" aria-hidden="true" />
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

          <PillButton variant="solid-light" href={ctaHref}>
            {cta}
          </PillButton>
        </div>
      </div>
    </section>
  );
}
