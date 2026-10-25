"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { Dict } from "@/lib/i18n";

// Close-up van het satijn dat bij het scrollen openvouwt tot schermvullend beeld.
export function SatinSection({ t }: { t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const inset = useTransform(scrollYProgress, [0, 0.45], reduce ? ["0%", "0%"] : ["14%", "0%"]);
  const radius = useTransform(scrollYProgress, [0, 0.45], reduce ? ["0px", "0px"] : ["320px", "0px"]);
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(${i} ${i} ${i} ${i} round ${r})`);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.35, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.35, 0.6], [40, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section ref={ref} className="relative h-[260vh] bg-noir">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.p
          style={{ opacity: introOpacity }}
          className="eyebrow absolute inset-x-0 top-[8%] z-10 text-center text-gold"
        >
          {t.home.satinEyebrow}
        </motion.p>
        <motion.div style={{ clipPath }} className="absolute inset-0">
          <motion.div style={{ scale }} className="absolute inset-0">
            <Image src="/images/hero/detail.jpg" alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-noir/10" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="container-lux absolute inset-x-0 bottom-0 z-10 pb-[max(48px,env(safe-area-inset-bottom))] text-ivory"
        >
          <p className="eyebrow text-gold">{t.home.satinEyebrow}</p>
          <h2 className="mt-3 max-w-xl font-display text-[2.6rem] leading-[1] sm:text-6xl">{t.home.satinTitle}</h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ivory/75">{t.home.satinText}</p>
          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {t.home.satinStats.map((s) => (
              <div key={s.label}>
                <dt className="gold-text font-display text-3xl sm:text-4xl">{s.value}</dt>
                <dd className="mt-1 text-[11.5px] leading-snug text-ivory/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
