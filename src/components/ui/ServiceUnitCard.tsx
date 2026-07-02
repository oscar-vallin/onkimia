import { Link } from '@/i18n/navigation';

interface ServiceUnitCardProps {
  name: string;
  description: string;
  href: string;
  unitLabel: string;
  linkLabel: string;
}

export function ServiceUnitCard({
  name,
  description,
  href,
  unitLabel,
  linkLabel,
}: ServiceUnitCardProps) {
  return (
    <Link
      href={href as `/${string}`}
      className="group relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 overflow-hidden"
    >
      <div
        className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-white/[0.07] group-hover:bg-white/[0.12] group-hover:scale-[3.5] origin-bottom-right transition-all duration-500 ease-out pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">{unitLabel}</p>
        <h3 className="font-serif text-3xl text-white leading-none">{name}</h3>
      </div>

      <div className="h-px bg-white/10" aria-hidden="true" />

      <p className="text-white/60 text-sm leading-relaxed flex-1 relative">{description}</p>

      <span className="relative inline-flex items-center gap-2 text-white/50 group-hover:text-white transition-colors text-sm">
        {linkLabel}
        <svg
          width="14" height="14" viewBox="0 0 16 16"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}
