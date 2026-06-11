import type { ReactNode } from 'react';

/**
 * Convierte *palabra* → <em className="italic text-teal-soft">palabra</em>
 * Usado en títulos de secciones del Home y páginas de submarca.
 */
export function parseEmphasis(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*')
      ? <em key={i} className="italic text-teal-soft not-italic">{part.slice(1, -1)}</em>
      : <span key={i}>{part}</span>
  );
}
