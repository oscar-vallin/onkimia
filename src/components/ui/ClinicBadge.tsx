import type { ReactNode } from 'react';

interface ClinicBadgeProps {
  name: string;
  icon: ReactNode;
  index: number;
}

export function ClinicBadge({ name, icon, index }: ClinicBadgeProps) {
  return (
    <div className="group relative bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/10 hover:-translate-y-1.5 hover:shadow-[-3px_8px_24px_rgba(0,0,0,0.10)] transition-all duration-300 cursor-default overflow-hidden">
      <div
        className="absolute left-0 top-0 w-0.5 h-0 group-hover:h-full bg-primary/25 rounded-l-2xl transition-all duration-300 ease-out"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 text-secondary/50">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            {icon}
          </svg>
        </div>
        <span className="font-serif text-2xl text-black/10 leading-none select-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <p className="font-sans text-sm font-medium text-primary leading-snug">{name}</p>
    </div>
  );
}
