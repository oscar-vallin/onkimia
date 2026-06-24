import { Stethoscope, Microscope, HeartHandshake } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface PriorityCareProps {
  title: string;
  subtitle: string;
  card1Title: string;
  card1Description: string;
  card2Title: string;
  card2Description: string;
  card3Title: string;
  card3Description: string;
  additionalServices: string;
}

const CARDS = [
  { Icon: Stethoscope,    titleKey: 'card1Title' as const, descKey: 'card1Description' as const },
  { Icon: Microscope,     titleKey: 'card2Title' as const, descKey: 'card2Description' as const },
  { Icon: HeartHandshake, titleKey: 'card3Title' as const, descKey: 'card3Description' as const },
];

export function PriorityCare({
  title,
  subtitle,
  card1Title,
  card1Description,
  card2Title,
  card2Description,
  card3Title,
  card3Description,
  additionalServices,
}: PriorityCareProps) {
  const cardData = {
    card1Title, card1Description,
    card2Title, card2Description,
    card3Title, card3Description,
  };

  return (
    <Section theme="deeper">

      <SectionHeader title={title} intro={subtitle} theme="dark" align="center" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10">
        {CARDS.map(({ Icon, titleKey, descKey }) => (
          <article
            key={titleKey}
            className="group rounded-2xl border border-white/[0.08] p-8 md:p-10 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] hover:border-white/[0.16]"
            style={{ background: 'linear-gradient(160deg, #1e1e22 0%, #27272c 100%)' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
              <Icon className="w-6 h-6 text-white/70" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-4 leading-tight tracking-[-0.01em]">
              {cardData[titleKey]}
            </h3>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              {cardData[descKey]}
            </p>
          </article>
        ))}
      </div>

      <div className="text-center">
        <p className="font-sans text-xs text-white/35 tracking-[0.12em] uppercase">
          {additionalServices}
        </p>
      </div>

    </Section>
  );
}
