import type { ReactNode } from "react";

// Donkere kopband voor subpagina's, zodat het glazen menu overal hetzelfde oogt.
export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="grain relative overflow-hidden bg-noir pb-12 pt-32 text-ivory sm:pb-16 sm:pt-40">
      <div className="pointer-events-none absolute -left-32 -top-32 size-[28rem] animate-drift rounded-full bg-bordeaux/60 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 size-80 animate-drift-slow rounded-full bg-gold/20 blur-[110px]" />
      <div className="container-lux relative">
        {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-[2.9rem] leading-[1] sm:text-7xl">{title}</h1>
        {lead && <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/70">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
