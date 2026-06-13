import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

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
    <section className="bg-ink py-20 md:py-28">
      <div className="container-onkimia text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          <em className="italic text-teal-soft not-italic">{titleUnderlined}</em>
          {titleSuffix && ` ${titleSuffix}`}
        </h2>
        <p className="text-white/70 text-lg leading-relaxed mb-10">{description}</p>
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-2 bg-teal hover:bg-teal-soft text-white font-medium px-8 py-4 rounded-full transition-colors duration-200 text-lg"
        >
          {buttonLabel}
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
