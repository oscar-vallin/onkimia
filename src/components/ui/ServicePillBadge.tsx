import type { ReactNode } from 'react';

interface ServicePillBadgeProps {
  name: string;
  icon: ReactNode;
}

export function ServicePillBadge({ name, icon }: ServicePillBadgeProps) {
  return (
    <div className="flex items-center gap-4 bg-white border border-black/[0.08] rounded-2xl px-5 py-4 hover:border-teal/30 hover:shadow-sm transition-all duration-200">
      <div className="w-11 h-11 rounded-full bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon}
        </svg>
      </div>
      <span className="font-sans text-sm font-medium text-primary leading-snug">{name}</span>
    </div>
  );
}
