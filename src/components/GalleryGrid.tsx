"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "./Reveal";

type Item = { image: string; title: string; tall?: boolean };

export function GalleryGrid({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, items.length]);

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-5">
        {items.map((g, i) => (
          <Reveal key={g.image} delay={(i % 3) * 0.06} className="mb-3 break-inside-avoid sm:mb-5">
            <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-[22px] text-left">
              <div className={`relative ${g.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image src={g.image} alt={g.title} fill sizes="(min-width:640px) 33vw, 50vw" className="object-cover transition duration-[1.2s] ease-(--ease-lux) group-hover:scale-105" />
              </div>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/80 to-transparent p-3 pt-10 text-[12.5px] text-ivory">{g.title}</span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-noir/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={items[open].title}
          >
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[78svh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={items[open].image} alt={items[open].title} fill sizes="100vw" quality={85} className="object-contain" />
            </motion.div>
            <p className="absolute inset-x-0 bottom-[max(24px,env(safe-area-inset-bottom))] text-center font-display text-xl text-ivory">{items[open].title}</p>
            <button type="button" className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] grid size-11 place-items-center rounded-full border border-white/20 text-ivory" aria-label="Sluiten">
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length); }}
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-noir/50 text-ivory"
              aria-label="Vorige"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length); }}
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-noir/50 text-ivory"
              aria-label="Volgende"
            >
              <ChevronRight className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
