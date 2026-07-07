import { Building2, Sparkles, Zap } from 'lucide-react';

interface ServicesPremiumIntroProps {
  lead: string;
  feature1Title: string;
  feature1Stat: string;
  feature2Title: string;
  feature2Stat: string;
  feature3Title: string;
  feature3Stat: string;
}

export function ServicesPremiumIntro({
  lead,
  feature1Title,
  feature1Stat,
  feature2Title,
  feature2Stat,
  feature3Title,
  feature3Stat,
}: ServicesPremiumIntroProps) {
  const features = [
    {
      icon: Building2,
      title: feature1Title,
      stat: feature1Stat,
    },
    {
      icon: Sparkles,
      title: feature2Title,
      stat: feature2Stat,
    },
    {
      icon: Zap,
      title: feature3Title,
      stat: feature3Stat,
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-onkimia">
        {/* Prevention message */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6 leading-tight">
            Prevenir también es parte del tratamiento.
          </h2>
          <p className="text-lg md:text-xl text-secondary leading-relaxed">
            {lead}
          </p>
        </div>

        {/* Three features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex flex-row items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg md:text-xl text-primary leading-snug">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
