interface InitiativeCardsProps {
  bodyMindTitlePrefix: string;
  bodyMindTitleUnderlined: string;
  bodyMindTitleSuffix: string;
  bodyMindDescription: string;
  supportGroupTitle: string;
  supportGroupDescription: string;
  awareTitle: string;
  awareDescription: string;
}

export function InitiativeCards({
  bodyMindTitlePrefix,
  bodyMindTitleUnderlined,
  bodyMindTitleSuffix,
  bodyMindDescription,
  supportGroupTitle,
  supportGroupDescription,
  awareTitle,
  awareDescription,
}: InitiativeCardsProps) {
  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="container-onkimia">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            {bodyMindTitlePrefix}{' '}
            <em className="italic text-teal-soft not-italic">{bodyMindTitleUnderlined}</em>
            {bodyMindTitleSuffix && ` ${bodyMindTitleSuffix}`}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mt-6">
            {bodyMindDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 md:p-10">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-6">
              <div className="w-4 h-4 rounded-full bg-teal-soft" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-4">{supportGroupTitle}</h3>
            <p className="text-white/70 text-base leading-relaxed">{supportGroupDescription}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 md:p-10">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-6">
              <div className="w-4 h-4 rounded-full bg-teal-soft" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-4">{awareTitle}</h3>
            <p className="text-white/70 text-base leading-relaxed">{awareDescription}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
