"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";
import type { Dict, Locale } from "@/lib/i18n";

export function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const pathname = usePathname();
  const { cartCount, favorites } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const base = `/${locale}`;
  const links = [
    { href: `${base}/shop`, label: t.nav.shop },
    { href: `${base}/gallery`, label: t.nav.gallery },
    { href: `${base}/account`, label: t.nav.account },
  ];
  const otherLocale: Locale = locale === "nl" ? "en" : "nl";
  const switchHref = pathname.replace(/^\/(nl|en)/, `/${otherLocale}`);
  // Productpagina's beginnen met een lichte achtergrond: daar is het menu meteen donker
  const solid = scrolled || /\/shop\/[^/]+/.test(pathname);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(12px,env(safe-area-inset-top))] sm:px-6">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border py-2 pl-4 pr-2 text-ivory backdrop-blur-xl transition-all duration-500 ${
            solid ? "border-white/10 bg-noir/85 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]" : "border-white/15 bg-noir/40"
          }`}
        >
          <Link href={base} aria-label="luxurypresent home" className="shrink-0">
            <span className="hidden sm:inline"><Logo /></span>
            <span className="sm:hidden"><Logo compact /></span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-medium lg:flex" aria-label="Hoofdmenu">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`transition hover:text-gold ${pathname.startsWith(l.href) ? "text-gold" : "text-ivory/80"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href={switchHref} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] uppercase tracking-widest text-ivory/70 hover:text-gold">
              {otherLocale}
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <Link href={`${base}/account#favorites`} className="relative hidden size-10 place-items-center rounded-full hover:bg-white/10 sm:grid" aria-label={t.nav.favorites}>
              <Heart className="size-[18px]" strokeWidth={1.6} />
              {favorites.length > 0 && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" />}
            </Link>
            <Link href={`${base}/cart`} className="relative grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label={t.nav.cart}>
              <ShoppingBag className="size-[18px]" strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-noir">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href={`${base}/account`} className="hidden size-10 place-items-center rounded-full hover:bg-white/10 sm:grid lg:hidden" aria-label={t.nav.account}>
              <User className="size-[18px]" strokeWidth={1.6} />
            </Link>
            <Link href={`${base}/custom`} className="btn btn-gold hidden !rounded-full !px-5 !py-2.5 text-[13px] md:inline-flex">
              {t.nav.custom}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full hover:bg-white/10 lg:hidden"
              aria-label={t.nav.menu}
              aria-expanded={open}
            >
              <Menu className="size-5" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="grain fixed inset-0 z-[60] flex flex-col overflow-hidden bg-noir text-ivory lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -left-24 top-1/3 size-80 rounded-full bg-bordeaux/60 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-gold/25 blur-[90px]" />
            <div className="relative flex items-center justify-between px-5 pt-[max(20px,env(safe-area-inset-top))]">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-white/15" aria-label={t.nav.close}>
                <X className="size-5" strokeWidth={1.6} />
              </button>
            </div>
            <nav className="relative mt-14 flex flex-col gap-2 px-6" aria-label="Mobiel menu">
              {[{ href: base, label: "Home" }, ...links, { href: `${base}/custom`, label: t.nav.custom }, { href: `${base}/cart`, label: t.nav.cart }].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={l.href} className="flex items-center justify-between border-b border-white/10 py-3 font-display text-[2.4rem] leading-none">
                    {l.label}
                    <span className="text-lg text-gold/70">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="relative mt-auto flex items-center justify-between px-6 pb-[max(28px,env(safe-area-inset-bottom))] text-sm text-ivory/60">
              <span className="eyebrow">{t.nav.language}</span>
              <div className="flex gap-2">
                {(["nl", "en"] as const).map((l) => (
                  <Link
                    key={l}
                    href={pathname.replace(/^\/(nl|en)/, `/${l}`)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest ${l === locale ? "border-gold text-gold" : "border-white/15"}`}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
