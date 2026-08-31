import { ArrowRight } from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';

interface ContactCTAProps {
  titleUnderlined: string;
  titleSuffix: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export function ContactCTA({
  titleUnderlined,
  titleSuffix,
  description,
  buttonLabel,
  buttonHref,
}: ContactCTAProps) {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="container-onkimia text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          <em className="italic not-italic text-white/80">{titleUnderlined}</em>
          {titleSuffix && ` ${titleSuffix}`}
        </h2>
        <p className="text-white/70 text-lg leading-relaxed mb-10">{description}</p>
        <PillButton
          variant="solid-light"
          href={buttonHref}
          icon={<ArrowRight className="w-5 h-5" aria-hidden="true" />}
        >
          {buttonLabel}
        </PillButton>
      </div>
    </section>
  );
}
