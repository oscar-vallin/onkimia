import type { ReactNode } from 'react';

export function parseEmphasis(text: string, emphasisClassName = 'italic'): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*')
      ? <em key={i} className={emphasisClassName}>{part.slice(1, -1)}</em>
      : <span key={i}>{part}</span>
  );
}
