import { Car, Smartphone, Sparkles, ShieldCheck, Users, Globe, Stethoscope, Clipboard, Hotel, Armchair, Building2, Droplets, Bone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export type ServiceIcon = 'car' | 'smartphone' | 'sparkles' | 'shield-check' | 'users' | 'globe' | 'stethoscope' | 'clipboard' | 'hotel' | 'armchair' | 'building2' | 'droplets' | 'bone';

interface Service {
  icon: ServiceIcon;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

interface MoreThanMedicineProps {
  title?: string;
  services: Service[];
}

const ICON_MAP: Record<ServiceIcon, LucideIcon> = {
  car: Car,
  smartphone: Smartphone,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
  users: Users,
  globe: Globe,
  stethoscope: Stethoscope,
  clipboard: Clipboard,
  hotel: Hotel,
  armchair: Armchair,
  building2: Building2,
  droplets: Droplets,
  bone: Bone,
};

export function MoreThanMedicine({
  title,
  services,
}: MoreThanMedicineProps) {
  return (
    <section className="bg-white py-20 md:py-26">
      <div className="container-onkimia">

        {title && <SectionHeader title={title} />}

        {/* 3×2 service card grid — flex (not grid) so an incomplete last
            row centers its cards instead of left-aligning under a fixed
            column track. */}
        {services.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((service, i) => {
              const Icon = ICON_MAP[service.icon] ?? Car;
              return (
                <div
                  key={i}
                  className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] bg-white border border-black/[0.07] rounded-2xl p-7 flex flex-row items-start gap-4 hover:border-black/[0.14] hover:shadow-sm transition-all duration-200"
                >
                  {/* Icon badge */}
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-black/[0.07] flex items-center justify-center flex-shrink-0 text-primary/50">
                    <Icon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="font-semibold text-primary text-base leading-snug">
                      {service.title}
                    </h3>
                    {/* <p className="text-secondary text-sm leading-relaxed">
                      {service.description}
                    </p> */}
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
