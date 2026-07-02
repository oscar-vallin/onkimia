interface MisionSectionProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function MisionSection({ eyebrow, title, description }: MisionSectionProps) {
  // Title may contain \n — split into lines for <br /> rendering
  const titleLines = title.split('\n');

  return (
    <section className="bg-white overflow-hidden mt-18">
      <div className="max-w-4xl mx-auto px-6 text-center pt-24 md:pt-28 pb-8">
        <p className="text-xs tracking-[0.25em] uppercase text-secondary mb-5">
          {eyebrow}
        </p>
        {/* h1: this section opens /nosotros, which has no PageHero — it owns
            the page's single h1. If this component is ever reused mid-page,
            add a headingLevel prop instead of demoting this back to h2. */}
        <h1 className="font-serif text-5xl lg:text-7xl text-primary font-normal leading-tight mb-6">
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="text-secondary text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Decorative animated waves — revealed left→right on page load */}
      <div className="waves-container w-full overflow-hidden" style={{ height: '220px', marginTop: '-10px' }} aria-hidden="true">
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            className="wave-1"
            d="M0 110 C180 40, 360 180, 540 110 S900 40, 1080 110 S1350 180, 1440 110"
            stroke="#d4d4d8"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            className="wave-2"
            d="M0 130 C200 60, 400 200, 600 130 S960 60, 1140 130 S1380 200, 1440 130"
            stroke="#a1a1aa"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            className="wave-3"
            d="M0 90 C240 20, 480 160, 720 90 S1200 20, 1440 90"
            stroke="#71717a"
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
          />
          <path
            className="wave-4"
            d="M0 150 C160 80, 320 220, 480 150 S800 80, 960 150 S1280 220, 1440 150"
            stroke="#27272c"
            strokeWidth="1.2"
            fill="none"
            opacity="0.35"
          />
        </svg>
      </div>
    </section>
  );
}
