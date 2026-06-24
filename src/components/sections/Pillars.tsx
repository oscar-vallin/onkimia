import { PillButton } from '@/components/ui/PillButton';

interface Pillar {
  title: string;
  description: string;
}

interface PillarsProps {
  eyebrow: string;
  title: string;
  intro: string;
  cta: string;
  ctaHref: string;
  pillars: [Pillar, Pillar, Pillar, Pillar];
}

// Each orb is a CSS radial-gradient with off-center light for a 3D sphere look.
// Colors are hardcoded design identity (cancer=red, cardiovascular=purple,
// metabolic=orange, neurological=green). To change a pillar's color, edit
// ORB_STYLES below — these values do NOT come from Sanity or CSS tokens.
const ORB_STYLES: Array<{ gradient: string; glow: string }> = [
  {
    // Cancer detection — red / terracotta
    gradient: 'radial-gradient(circle at 35% 30%, #fca5a5 0%, #dc2626 45%, #7f1d1d 100%)',
    glow: '0 12px 40px rgba(220, 38, 38, 0.35)',
  },
  {
    // Cardiovascular — purple
    gradient: 'radial-gradient(circle at 35% 30%, #d8b4fe 0%, #9333ea 45%, #4c1d95 100%)',
    glow: '0 12px 40px rgba(147, 51, 234, 0.35)',
  },
  {
    // Metabolic — orange / amber
    gradient: 'radial-gradient(circle at 35% 30%, #fed7aa 0%, #ea580c 45%, #7c2d12 100%)',
    glow: '0 12px 40px rgba(234, 88, 12, 0.35)',
  },
  {
    // Neurological — green / teal
    gradient: 'radial-gradient(circle at 35% 30%, #6ee7b7 0%, #059669 45%, #064e3b 100%)',
    glow: '0 12px 40px rgba(5, 150, 105, 0.35)',
  },
];

export function Pillars({
  eyebrow,
  title,
  intro,
  cta,
  ctaHref,
  pillars,
}: PillarsProps) {
  return (
    <section style={{ backgroundColor: '#0d1117' }} className="py-20 md:py-28">
      <div className="container-onkimia max-w-6xl mx-auto">

        {/* Centred header */}
        <div className="text-center mb-14 md:mb-16 max-w-2xl mx-auto">
          <p className="font-sans text-[10px] md:text-xs font-medium tracking-[0.22em] uppercase text-white/45 mb-4">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] text-white leading-tight tracking-[-0.02em] mb-5">
            {title}
          </h2>
          <p className="font-sans text-sm md:text-base text-white/65 leading-relaxed mb-8">
            {intro}
          </p>
          <PillButton variant="outline-light" href={ctaHref}>
            {cta}
          </PillButton>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {pillars.map((pillar, i) => {
            const orb = ORB_STYLES[i];
            return (
              <article
                key={i}
                className="group flex flex-col items-center text-center rounded-2xl overflow-hidden border border-white/[0.08] p-8 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                style={{
                  background: 'linear-gradient(160deg, #1e1e22 0%, #27272c 100%)',
                }}
              >
                {/* Orb */}
                <div
                  className="w-[140px] h-[140px] rounded-full mb-8 shrink-0"
                  style={{
                    background: orb.gradient,
                    boxShadow: orb.glow,
                  }}
                  aria-hidden="true"
                />

                <h3 className="font-serif text-xl md:text-2xl text-white leading-snug tracking-[-0.01em] mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm text-white/60 leading-relaxed">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
