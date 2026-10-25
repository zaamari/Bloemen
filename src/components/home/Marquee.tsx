export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-gold/20 bg-bordeaux-deep py-4 text-gold" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-10">
            {row.map((item, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10 font-display text-xl tracking-wide sm:text-2xl">
                {item}
                <span className="text-sm text-gold/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
