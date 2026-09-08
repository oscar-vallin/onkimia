import { Stethoscope, Syringe, Radiation, Scissors, Dna, Apple, Brain, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CoreService {
  icon: LucideIcon;
  title: string;
}

interface ServicesPremiumIntroProps {
  coreServices: string[];
  geneticTestingStatement: string;
}

// Fixed order matching the `coreServices` translation array in
// messages/{en,es}.json → services.main.coreServices.
const CORE_SERVICE_ICONS: LucideIcon[] = [
  Stethoscope, // Consultas
  Syringe,     // Quimioterapias
  Radiation,   // Radioterapias
  Scissors,    // Cirugías
  Dna,         // Pruebas genéticas
  Apple,       // Nutrición
  Brain,       // Psicooncología
  Scale,       // Obesidad y metabolismo
];

export function ServicesPremiumIntro({
  coreServices,
  geneticTestingStatement,
}: ServicesPremiumIntroProps) {
  const services: CoreService[] = coreServices.map((title, i) => ({
    icon: CORE_SERVICE_ICONS[i] ?? Stethoscope,
    title,
  }));

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-onkimia">
        {/* Core services grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="flex flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-base md:text-lg text-primary leading-snug pt-2">
                  {service.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Genetic testing statement */}
        <div className="mt-14 md:mt-16 flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-7">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Dna className="w-5 h-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="font-serif text-lg md:text-xl text-primary leading-snug">
            {geneticTestingStatement}
          </p>
        </div>
      </div>
    </section>
  );
}
