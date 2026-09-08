import { SanityImage as Image } from '@/components/ui/SanityImage';
import { PillButton } from '@/components/ui/PillButton';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { urlFor } from '@/sanity/image';

interface AppointmentCtaProps {
  title: string;
  cta: string;
  ctaHref: string;
  backgroundImage?: SanityImageWithLQIP;
}

export function AppointmentCta({
  title,
  cta,
  ctaHref,
  backgroundImage,
}: AppointmentCtaProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-12 mt-18">
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
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3rem] text-white leading-tight tracking-[-0.02em] mb-40">
            {title}
          </h2>

          <PillButton variant="solid-light" href={ctaHref} className='mb-20 mt-10'>
            {cta}
          </PillButton>
        </div>
      </div>
    </section>
  );
}
