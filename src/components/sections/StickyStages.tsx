import {
  Heart,
  Clipboard,
  Sun,
  Search,
  User,
  Activity,
  Microscope,
  Shield,
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

// Values must match the dropdown list in siteSettings.ts → servicesList[].icon
export type ServiceIconName =
  | 'heart' | 'clipboard' | 'sun' | 'search'
  | 'user' | 'activity' | 'microscope' | 'shield';

const ICON_MAP: Record<ServiceIconName, React.ReactNode> = {
  heart:      <Heart      className="w-5 h-5" aria-hidden="true" />,
  clipboard:  <Clipboard  className="w-5 h-5" aria-hidden="true" />,
  sun:        <Sun        className="w-5 h-5" aria-hidden="true" />,
  search:     <Search     className="w-5 h-5" aria-hidden="true" />,
  user:       <User       className="w-5 h-5" aria-hidden="true" />,
  activity:   <Activity   className="w-5 h-5" aria-hidden="true" />,
  microscope: <Microscope className="w-5 h-5" aria-hidden="true" />,
  shield:     <Shield     className="w-5 h-5" aria-hidden="true" />,
};

function iconNode(name: ServiceIconName | string): React.ReactNode {
  return ICON_MAP[name as ServiceIconName] ?? ICON_MAP.heart;
}

export interface ServiceItem {
  icon: ServiceIconName | string;
  title: string;
  description: string;
}

export interface StickyStagesProps {
  eyebrow: string;
  title: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
  items: ServiceItem[];
}

export function StickyStages({
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaHref,
  items,
}: StickyStagesProps) {
  return (
    <Section theme="gray">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-start">

        {/* LEFT — sticky on desktop, normal header on mobile */}
        <div className="lg:sticky lg:top-[110px]">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            intro={lead}
            theme="light"
            align="left"
          >
            <PillButton
              variant="solid-dark"
              href={ctaHref}
              icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            >
              {ctaLabel}
            </PillButton>
          </SectionHeader>
        </div>

        {/* RIGHT — scrolls with page */}
        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <article
              key={i}
              className="group flex items-start gap-5 bg-white border border-black/[0.07] rounded-2xl p-6 md:p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-black/[0.14]"
            >
              {/* Icon circle */}
              <div className="shrink-0 w-11 h-11 rounded-full border border-black/[0.09] bg-gray-50 flex items-center justify-center text-secondary group-hover:border-primary/20 transition-colors duration-300">
                {iconNode(item.icon)}
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="font-sans font-medium text-base text-primary leading-snug mb-1.5">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </Section>
  );
}
