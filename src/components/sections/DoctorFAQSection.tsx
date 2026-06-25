import type { FAQItem } from '@/sanity/types';
import { DoctorFAQItem } from './DoctorFAQItem';

interface DoctorFAQSectionProps {
  eyebrow: string;
  title: string;
  items: FAQItem[];
}

export function DoctorFAQSection({ eyebrow, title, items }: DoctorFAQSectionProps) {
  if (!items.length) return null;

  const titleLines = title.split('\n');

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-onkimia">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-5">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
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
