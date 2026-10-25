"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Heart, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice, type Dict, type Locale } from "@/lib/i18n";
import { getCategory, type Product } from "@/lib/catalog";

export function ProductView({ product, locale, t }: { product: Product; locale: Locale; t: Dict }) {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const fav = favorites.includes(product.slug);
  const price = formatPrice(product.price, locale);

  // Vaste balk onderaan op mobiel: laat de WhatsApp-knop omhoog schuiven
  useEffect(() => {
    document.body.dataset.stickybar = "1";
    return () => {
      delete document.body.dataset.stickybar;
    };
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIndex(i);
  };

  const add = () => {
    addToCart(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="bg-ivory pt-[76px] sm:pt-[96px]">
      <div className="container-lux grid gap-8 pb-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pb-20">
        {/* Foto's: swipen op mobiel, miniaturen op desktop */}
        <div className="-mx-4 sm:mx-0 lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <div
              ref={scroller}
              onScroll={onScroll}
              className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] sm:rounded-[28px]"
            >
              {product.images.map((src, i) => (
                <div key={src} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-ivory-2">
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    preload={i === 0}
                    quality={85}
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-noir/40 px-2.5 py-2 backdrop-blur lg:hidden">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-gold" : "w-1.5 bg-white/60"}`}
                  />
                ))}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 hidden gap-3 lg:flex">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`relative aspect-square w-20 overflow-hidden rounded-xl ring-2 transition ${i === index ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:pt-6">
          <Link href={`/${locale}/shop`} className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
            <ArrowLeft className="size-4" /> {t.product.back}
          </Link>
          <p className="eyebrow mt-6 text-gold-deep">{getCategory(product.category).name[locale]}</p>
          <h1 className="mt-2 font-display text-[2.9rem] leading-[1] sm:text-6xl">{product.name}</h1>
          <p className="mt-2 text-muted">{product.tagline[locale]}</p>
          <p className="mt-5 text-2xl font-semibold tabular-nums text-bordeaux">{price}</p>

          <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink/80">{product.description[locale]}</p>

          <div className="mt-8 hidden gap-3 lg:flex">
            <AddButton added={added} onClick={add} t={t} />
            <FavButton fav={fav} onClick={() => toggleFavorite(product.slug)} t={t} />
          </div>
          <p className="mt-3 hidden text-[13px] text-muted lg:block">{t.product.noPayment}</p>

          <div className="mt-10 divide-y divide-line border-y border-line">
            <div className="py-5">
              <p className="eyebrow text-ink">{t.product.details}</p>
              <ul className="mt-3 grid gap-2 text-[14.5px]">
                {product.details.map((d) => (
                  <li key={d.nl} className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-gold-deep" /> {d[locale]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 py-5">
              <Truck className="mt-0.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.6} />
              <div>
                <p className="eyebrow text-ink">{t.product.delivery}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{t.product.deliveryText}</p>
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/custom?from=${product.slug}`}
            className="group mt-8 flex items-center gap-4 rounded-[22px] bg-noir p-5 text-ivory"
          >
            <Sparkles className="size-6 shrink-0 text-gold" strokeWidth={1.4} />
            <div className="flex-1">
              <p className="font-display text-xl">{t.product.customize}</p>
              <p className="text-[13px] text-gold">{t.product.customizeCta} →</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Vaste bestelbalk op mobiel */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <FavButton fav={fav} onClick={() => toggleFavorite(product.slug)} t={t} compact />
          <AddButton added={added} onClick={add} t={t} label={`${t.product.addToCart} · ${price}`} />
        </div>
      </div>
    </section>
  );
}

function AddButton({ added, onClick, t, label }: { added: boolean; onClick: () => void; t: Dict; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-dark relative flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span key="ok" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-flex items-center gap-2 text-gold">
            <Check className="size-4" /> {t.product.added}
          </motion.span>
        ) : (
          <motion.span key="add" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-flex items-center gap-2">
            <ShoppingBag className="size-4" /> {label ?? t.product.addToCart}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function FavButton({ fav, onClick, t, compact }: { fav: boolean; onClick: () => void; t: Dict; compact?: boolean }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-pressed={fav}
      aria-label={fav ? t.product.unfavorite : t.product.favorite}
      className={`btn btn-outline text-bordeaux ${compact ? "!px-4" : ""}`}
    >
      <Heart className="size-[18px]" strokeWidth={1.8} fill={fav ? "currentColor" : "none"} />
      {!compact && (fav ? t.product.unfavorite : t.product.favorite)}
    </motion.button>
  );
}
