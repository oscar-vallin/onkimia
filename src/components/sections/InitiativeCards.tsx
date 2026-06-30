import { SanityImage as Image } from '@/components/ui/SanityImage';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';

interface InitiativeCardsProps {
  eyebrow: string;
  description: string;
  /* kept for callers that still pass these — unused in new design */
  bodyMindTitlePrefix?: string;
  bodyMindTitleUnderlined?: string;
  bodyMindTitleSuffix?: string;
  bodyMindDescription?: string;
  supportGroupTitle: string;
  supportGroupDescription: string;
  supportGroupCategory: string;
  supportGroupLink: string;
  supportGroupImage?: SanityImageWithLQIP;
  awareTitle: string;
  awareDescription: string;
  awareCategory: string;
  awareLink: string;
  awareImage?: SanityImageWithLQIP;
}

function CommunityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function PreventionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
  );
}

interface CardProps {
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  image?: SanityImageWithLQIP;
}

function InitiativeCard({ title, description, category, icon, image }: CardProps) {
  const imgSrc = image
    ? urlFor(image).width(760).height(480).format('webp').quality(82).url()
    : null;
  return (
    <article className="flex flex-col">
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-6">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
      </div>

      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-secondary flex-shrink-0">
          {icon}
        </div>
        <span className="text-xs tracking-[0.18em] uppercase font-medium text-secondary">
          {category}
        </span>
      </div>

      <h3 className="font-serif text-3xl text-primary mb-4 leading-tight">{title}</h3>
      <p className="text-secondary  leading-relaxed flex-1">{description}</p>
    </article>
  );
}

export function InitiativeCards({
  eyebrow,
  description,
  supportGroupTitle,
  supportGroupDescription,
  supportGroupCategory,
  supportGroupImage,
  awareTitle,
  awareDescription,
  awareCategory,
  awareImage,
}: InitiativeCardsProps) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-onkimia">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-4">
            {eyebrow}
          </h2>
          <p className="text-secondary text-lg leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          <InitiativeCard
            title={supportGroupTitle}
            description={supportGroupDescription}
            category={supportGroupCategory}
            icon={<CommunityIcon />}
            image={supportGroupImage}
          />
          <InitiativeCard
            title={awareTitle}
            description={awareDescription}
            category={awareCategory}
            icon={<PreventionIcon />}
            image={awareImage}
          />
        </div>
      </div>
    </section>
  );
}
