'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Syringe,
  Droplets,
  Brain,
  Activity,
  Shield,
  Pill,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Syringe,
  Droplets,
  Brain,
  Activity,
  Shield,
  Pill,
};

export interface Treatment {
  id: string;
  iconKey: string;
  title: string;
  description: string;
}

interface TreatmentAccordionProps {
  treatments: Treatment[];
}

export function TreatmentAccordion({ treatments }: TreatmentAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      {/* Desktop: grid expandido siempre visible */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
        {treatments.map(({ id, iconKey, title, description }) => {
          const Icon = ICON_MAP[iconKey];
          return (
            <article
              key={id}
              className="bg-white border border-black/[0.07] rounded-2xl p-6 hover:border-cuidare-blue-700/20 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-cuidare-blue-100 text-cuidare-blue-700 flex items-center justify-center">
                  {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary mb-2">{title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mobile: accordion colapsable */}
      <div className="md:hidden space-y-3">
        {treatments.map(({ id, iconKey, title, description }) => {
          const isOpen = openId === id;
          const Icon = ICON_MAP[iconKey];
          return (
            <article
              key={id}
              className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(id)}
                aria-expanded={isOpen}
                aria-controls={`treatment-content-${id}`}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-cuidare-blue-100 text-cuidare-blue-700 flex items-center justify-center">
                  {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
                </div>
                <h3 className="flex-1 font-serif text-base text-primary">{title}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-secondary/50 transition-transform flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div
                  id={`treatment-content-${id}`}
                  className="px-4 pb-4 pl-[3.75rem]"
                >
                  <p className="text-secondary text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
