'use client';

import type { ReactNode } from 'react';

interface BackButtonProps {
  children: ReactNode;
  className?: string;
}

export function BackButton({ children, className }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={className}
    >
      {children}
    </button>
  );
}
