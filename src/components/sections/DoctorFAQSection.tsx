import { parseEmphasis } from '@/lib/parseEmphasis';
import type { FAQItem } from '@/sanity/types';
import { DoctorFAQItem } from './DoctorFAQItem';

interface DoctorFAQSectionProps {
  eyebrow: string;
  title: string;
  items: FAQItem[];
}

export function DoctorFAQSection({ eyebrow, title, items }: DoctorFAQSectionProps) {
  if (!items.length) return null;

  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="container-onkimia">
        <div className="text-center mb-14 md:mb-16">
          <p className="text-xs font-medium tracking-widest uppercase text-teal-soft mb-4">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            {parseEmphasis(title)}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {items.map((item, i) => (
            <DoctorFAQItem key={item._key} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
