import { Car, Smartphone, Sparkles, ShieldCheck, Users, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ServiceIcon = 'car' | 'smartphone' | 'sparkles' | 'shield-check' | 'users' | 'globe';

interface Service {
  icon: ServiceIcon;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

interface MoreThanMedicineProps {
  eyebrow: string;
  titleLine1: string;
  titleUnderlined: string;
  titleSuffix: string;
  description: string;
  services: Service[];
}

const ICON_MAP: Record<ServiceIcon, LucideIcon> = {
  car: Car,
  smartphone: Smartphone,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
  users: Users,
  globe: Globe,
};

export function MoreThanMedicine({
  eyebrow,
  titleLine1,
  titleUnderlined,
  titleSuffix,
  description,
  services,
}: MoreThanMedicineProps) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-onkimia">

        {/* Centered header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-teal mb-5">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
            {titleLine1}{' '}
            <em className="not-italic text-teal-soft">{titleUnderlined}</em>
            {titleSuffix && titleSuffix}
          </h2>
          <p className="text-gray-warm text-lg leading-relaxed">{description}</p>
        </div>

        {/* 3×2 service card grid */}
        {services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, i) => {
              const Icon = ICON_MAP[service.icon] ?? Car;
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col gap-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  {/* Icon badge */}
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 text-ink/50">
                    <Icon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="font-semibold text-ink text-base mb-2 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-gray-warm text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
