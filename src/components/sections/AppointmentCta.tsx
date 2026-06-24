import { ClipboardCheck, UserSearch, CalendarCheck } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { PillButton } from '@/components/ui/PillButton';

interface AppointmentCtaProps {
  title: string;
  description: string;
  step1: string;
  step2: string;
  step3: string;
  cta: string;
  ctaHref: string;
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
}: AppointmentCtaProps) {
  const steps = { step1, step2, step3 };

  return (
    <Section theme="dark">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] text-white leading-tight tracking-[-0.02em] mb-5">
          {title}
        </h2>
        <p className="font-sans text-sm md:text-base text-white/65 leading-relaxed mb-14">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {STEPS.map(({ Icon, key }, index) => (
            <div key={key} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white/80" aria-hidden="true" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-deep border border-white/[0.12] text-white text-xs font-medium font-sans flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-sans text-sm font-medium text-white/80 leading-snug">
                {steps[key]}
              </h3>
            </div>
          ))}
        </div>

        <PillButton variant="solid-light" href={ctaHref}>
          {cta}
        </PillButton>
      </div>
    </Section>
  );
}
