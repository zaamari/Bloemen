"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import type { Dict, Locale } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

// Vaste posities voor de gouden lichtpuntjes (geen random, zodat server en browser hetzelfde renderen)
const sparkles = [
  { x: 8, y: 22, s: 3, d: 0 }, { x: 18, y: 70, s: 2, d: 1.2 }, { x: 30, y: 12, s: 2, d: 2.1 },
  { x: 46, y: 84, s: 3, d: 0.6 }, { x: 62, y: 18, s: 2, d: 1.8 }, { x: 74, y: 62, s: 4, d: 0.3 },
  { x: 86, y: 30, s: 2, d: 2.6 }, { x: 92, y: 78, s: 3, d: 1.4 }, { x: 55, y: 45, s: 2, d: 3.1 },
  { x: 38, y: 52, s: 2, d: 2.2 }, { x: 12, y: 46, s: 3, d: 3.4 }, { x: 68, y: 92, s: 2, d: 0.9 },
];

export function Hero({ locale, t }: { locale: Locale; t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="grain relative isolate overflow-hidden bg-noir text-ivory">
      {/* Bewegende gloed in bordeaux en goud */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 size-[34rem] animate-drift rounded-full bg-bordeaux/70 blur-[110px]" />
        <div className="absolute -bottom-48 -right-32 size-[30rem] animate-drift-slow rounded-full bg-gold/25 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-bordeaux-deep/80 blur-[100px]" />
      </div>

      {/* Gouden lichtpuntjes */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {sparkles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold-light shadow-[0_0_12px_2px_rgba(243,226,179,0.6)]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
            animate={reduce ? undefined : { opacity: [0, 1, 0], y: [0, -24, -48] }}
            transition={{ duration: 5, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="container-lux grid min-h-[100svh] items-center gap-7 pb-14 pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-10 lg:pt-32">
        {/* Beeld (op mobiel bovenaan) */}
        <div className="relative order-1 mx-auto w-full max-w-[15rem] sm:max-w-sm lg:order-2 lg:max-w-[30rem]">
          {/* Tweede foto die achter de boog zweeft */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, rotate: -14, x: -40 }}
            animate={{ opacity: 1, rotate: -9, x: 0 }}
            transition={{ delay: 0.9, duration: 1.2, ease }}
            className="absolute -left-16 bottom-4 z-0 w-[48%] sm:-left-16 lg:-left-24"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/30 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
              <Image src="/images/hero/evening.jpg" alt="" fill sizes="(min-width:1024px) 200px, 40vw" className="object-cover" />
            </div>
          </motion.div>

          {/* Hoofdfoto in een boog */}
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 28px 28px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 28px 28px)" }}
            transition={{ duration: 1.4, ease, delay: 0.15 }}
            className="relative z-10 aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px] shadow-[0_40px_100px_-30px_rgba(125,20,36,0.9)]"
          >
            <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-[-6%]">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.4, ease }}
              >
                <Image
                  src="/images/hero/main.jpg"
                  alt={locale === "nl" ? "Boeket van bordeaux satijnen rozen in zwart-goud papier" : "Bouquet of burgundy satin roses in black and gold paper"}
                  fill
                  preload
                  quality={85}
                  sizes="(min-width:1024px) 480px, (min-width:640px) 384px, 88vw"
                  className="object-cover object-[50%_40%]"
                />
              </motion.div>
            </motion.div>
            {/* Lichtstreep die over het satijn glijdt */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light">
              <div className="absolute inset-y-0 -left-1/2 w-1/2 animate-shine bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-gold/40" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noir/60 to-transparent" />
          </motion.div>

          {/* Draaiende badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.9, ease }}
            className="absolute -right-8 top-[10%] z-20 size-20 sm:-right-8 sm:size-28"
          >
            <div className="relative size-full rounded-full bg-noir/70 backdrop-blur-md">
              <svg viewBox="0 0 100 100" className="size-full animate-[spin_18s_linear_infinite]" aria-hidden="true">
                <defs>
                  <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-gold text-[8px] uppercase tracking-[0.25em]">
                  <textPath href="#badge-circle">{t.hero.badge}</textPath>
                </text>
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-2xl text-gold">LS</span>
            </div>
          </motion.div>
        </div>

        {/* Tekst */}
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 order-2 text-center lg:order-1 lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
            className="eyebrow text-gold"
          >
            {t.hero.eyebrow}
          </motion.p>
          <h1 className="mt-4 font-display text-[2.7rem] leading-[0.95] sm:text-6xl lg:text-[5.6rem]">
            {[t.hero.title1, t.hero.title2].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === 1 ? "gold-text" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 1.1, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8, ease }}
            className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-ivory/70 lg:mx-0 lg:text-base"
          >
            {t.hero.lead}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease }}
            className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link href={`/${locale}/shop`} className="btn btn-gold">{t.hero.shop}</Link>
            <Link href={`/${locale}/custom`} className="btn btn-ghost-dark">{t.hero.custom}</Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50 lg:flex"
      >
        {t.hero.scroll}
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="size-4" strokeWidth={1.4} />
        </motion.span>
      </motion.div>
    </section>
  );
}
