'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@/sanity/types';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-lg font-semibold text-brand-900">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-500 underline hover:text-accent-600"
      >
        {children}
      </a>
    ),
  },
};

interface PortableTextContentProps {
  value: PortableTextBlock[];
  className?: string;
}

export function PortableTextContent({ value, className }: PortableTextContentProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
