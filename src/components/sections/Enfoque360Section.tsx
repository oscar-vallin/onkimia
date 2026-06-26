import { SanityImage as Image } from '@/components/ui/SanityImage';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';

interface ChecklistItem {
  title: string;
  description: string;
}

interface Enfoque360SectionProps {
  eyebrow: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  image?: SanityImageWithLQIP;
}

export function Enfoque360Section({
  eyebrow,
  title,
  description,
  items,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
  image,
}: Enfoque360SectionProps) {
  const imgSrc = image
    ? urlFor(image).width(1200).format('webp').quality(85).url()
    : null;
  const titleLines = title.split('\n');

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container-onkimia">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column — text */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-5">
              {eyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-primary font-normal leading-tight mb-6">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-secondary text-lg leading-relaxed mb-10 max-w-lg">
              {description}
            </p>

            {/* Checklist */}
            <ul className="space-y-6">
              {items.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-0.5" aria-hidden="true">
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-base leading-snug">{item.title}</p>
                    <p className="text-secondary text-sm leading-relaxed mt-1">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — image with stat badges */}
          <div className="relative">
            <div className="relative w-full rounded-3xl overflow-hidden bg-gray-100">
              {imgSrc ? (
                <>
                  {/* Layer 1 — blurred absolute fill (behind), gives depth when image has letterbox */}
                  <Image
                    src={imgSrc}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover scale-110 blur-xl opacity-50"
                    aria-hidden="true"
                  />
                  {/* Layer 2 — natural dimensions, defines container height, shows full image */}
                  <Image
                    src={imgSrc}
                    alt="Instalaciones Onkimia"
                    width={1200}
                    height={900}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    className="relative z-10"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </>
              ) : (
                <div className="min-h-[420px] bg-gradient-to-br from-gray-200 to-gray-400" />
              )}

              {/* Stat badge — top right */}
              <div className="absolute top-5 right-5 bg-primary rounded-2xl px-5 py-4 shadow-xl">
                <p className="font-serif text-3xl text-white leading-none">{stat1Value}</p>
                <p className="text-white/70 text-xs mt-1 leading-tight max-w-[80px]">{stat1Label}</p>
              </div>

              {/* Stat badge — bottom left */}
              <div className="absolute bottom-5 left-5 bg-white rounded-2xl px-5 py-4 shadow-xl">
                <p className="font-serif text-3xl text-primary leading-none">{stat2Value}</p>
                <p className="text-secondary text-xs mt-1 leading-tight max-w-[90px]">{stat2Label}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
