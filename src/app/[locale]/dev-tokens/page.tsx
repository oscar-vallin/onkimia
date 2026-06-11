export default function DevTokens() {
  return (
    <main className="min-h-screen bg-ink p-16 space-y-6">
      <h1 className="font-serif text-5xl text-white">
        Ver más allá. Cuidar <em className="italic text-teal-soft">profundamente</em>.
      </h1>
      <p className="font-sans text-gray-soft max-w-md">
        DM Sans en body. Si ves Fraunces arriba (serif con carácter) y esta
        línea en sans limpia, las fuentes están conectadas.
      </p>
      <div className="flex gap-3">
        {['bg-ink-2','bg-ink-3','bg-teal','bg-teal-soft','bg-cream','bg-cream-2'].map(c =>
          <div key={c} className={`${c} h-16 w-24 rounded-xl border border-line`} />
        )}
      </div>
      <button className="bg-teal hover:bg-teal-soft text-white rounded-full px-6 py-3 font-sans transition-colors">
        Agendar cita
      </button>
    </main>
  );
}

// Made with Bob
