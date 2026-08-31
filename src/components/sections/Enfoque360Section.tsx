import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';

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
}

// Local asset — not sourced from Sanity.
const IMAGE_SRC = '/about/tp_1.jpg';

export function Enfoque360Section({
  eyebrow,
  title,
  description,
  items,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
}: Enfoque360SectionProps) {
  const titleLines = title.split('\n');

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container-onkimia">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column — text */}
          <div>
            <SectionHeader
              align="left"
              eyebrow={eyebrow}
              title={titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
              titleClassName="mb-6"
              intro={description}
              introClassName="text-lg md:text-lg mb-10 max-w-lg"
            />

            {/* Checklist */}
            {/* <ul className="space-y-6">
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
            </ul> */}
          </div>

          {/* Right column — image with stat badges */}
          <div className="relative">
            <div className="relative w-full rounded-3xl overflow-hidden bg-gray-100">
              {/* Layer 1 — blurred absolute fill (behind), gives depth when image has letterbox */}
              <Image
                src={IMAGE_SRC}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover scale-110 blur-xl opacity-50"
                aria-hidden="true"
              />
              {/* Layer 2 — natural dimensions, defines container height, shows full image */}
              <Image
                src={IMAGE_SRC}
                alt="Instalaciones Onkimia"
                width={1200}
                height={800}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                className="relative z-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

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
