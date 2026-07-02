import { ArrowRight } from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';

interface CtaBlockProps {
  eyebrow: string;
  title: string;
  description: string;
  stat?: string;
  href?: string;
  buttonLabel?: string;
  grow?: boolean;
}

export function CtaBlock({
  eyebrow,
  title,
  description,
  stat,
  href,
  buttonLabel,
  grow = false,
}: CtaBlockProps) {
  return (
    <section className={`bg-primary py-20 md:py-28${grow ? ' grow' : ''}`}>
      <div className="container-onkimia">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-white/50 font-medium mb-6">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            {title}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {description}
          </p>

          {stat && (
            <div className="flex items-center justify-center gap-2 mb-10">
              <span className="w-2 h-2 rounded-full bg-white/30 flex-shrink-0" aria-hidden="true" />
              <span className="text-white/50 text-sm">{stat}</span>
            </div>
          )}

          {href && buttonLabel && (
            <PillButton
              variant="solid-light"
              href={href}
              icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            >
              {buttonLabel}
            </PillButton>
          )}
        </div>
      </div>
    </section>
  );
}
