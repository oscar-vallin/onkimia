type AccentVariant = 'primary' | 'endos';

const ACCENT: Record<AccentVariant, { detailsBorder: string; badgeBg: string; badgeBorder: string }> = {
  primary: {
    detailsBorder: 'open:border-l-primary',
    badgeBg:       'group-open:bg-primary',
    badgeBorder:   'group-open:border-primary',
  },
  endos: {
    detailsBorder: 'open:border-l-endos-teal-700',
    badgeBg:       'group-open:bg-endos-teal-700',
    badgeBorder:   'group-open:border-endos-teal-700',
  },
};

interface FAQAccordionItemProps {
  question: string;
  answer: string;
  accent?: AccentVariant;
}

export function FAQAccordionItem({ question, answer, accent = 'primary' }: FAQAccordionItemProps) {
  const a = ACCENT[accent];
  return (
    <details className={`group bg-white border border-black/[0.07] rounded-2xl overflow-hidden open:border-l-4 ${a.detailsBorder}`}>
      <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none select-none">
        <span className="font-medium text-primary text-sm leading-snug">{question}</span>
        <span className={`w-7 h-7 rounded-full border border-black/[0.07] flex items-center justify-center flex-shrink-0 ${a.badgeBg} ${a.badgeBorder} transition-colors`}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-secondary group-open:text-white group-open:rotate-45 transition-all"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 1v10M1 6h10" />
          </svg>
        </span>
      </summary>
      <div className="px-7 pb-6 text-secondary text-sm leading-relaxed border-t border-black/[0.07] pt-4">
        {answer}
      </div>
    </details>
  );
}
