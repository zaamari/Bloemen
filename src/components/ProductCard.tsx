"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { formatPrice, type Dict, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product, locale, t, priority = false }: { product: Product; locale: Locale; t: Dict; priority?: boolean }) {
  const { favorites, toggleFavorite } = useStore();
  const fav = favorites.includes(product.slug);
  const second = product.images[1];

  return (
    <div className="group relative">
      <Link href={`/${locale}/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ivory-2">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            preload={priority}
            sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
            className="object-cover transition duration-[1.2s] ease-(--ease-lux) group-hover:scale-[1.06]"
          />
          {second && (
            <Image
              src={second}
              alt=""
              fill
              sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
              className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
            />
          )}
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-noir/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold backdrop-blur">
              {product.badge[locale]}
            </span>
          )}
        </div>
        <div className="mt-3 px-1">
          <h3 className="font-display text-[1.3rem] leading-tight sm:text-[1.45rem]">{product.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted">{product.tagline[locale]}</p>
          <p className="mt-1.5 text-[14px] font-semibold tabular-nums text-bordeaux">{formatPrice(product.price, locale)}</p>
        </div>
      </Link>
      <motion.button
        type="button"
        whileTap={{ scale: 0.8 }}
        onClick={() => toggleFavorite(product.slug)}
        aria-pressed={fav}
        aria-label={fav ? t.product.unfavorite : t.product.favorite}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/85 text-bordeaux shadow-sm backdrop-blur transition hover:bg-white"
      >
        <Heart className="size-[17px]" strokeWidth={1.8} fill={fav ? "currentColor" : "none"} />
      </motion.button>
    </div>
  );
}
