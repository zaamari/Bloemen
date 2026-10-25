import Link from "next/link";
import { Logo, WhatsAppIcon } from "./Logo";
import { categories, WHATSAPP_NUMBER } from "@/lib/catalog";
import type { Dict, Locale } from "@/lib/i18n";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const base = `/${locale}`;
  return (
    <footer className="grain relative overflow-hidden bg-noir pb-[max(28px,env(safe-area-inset-bottom))] pt-20 text-ivory">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-bordeaux/30 blur-[120px]" />
      <div className="container-lux relative">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-ivory/60">{t.footer.tagline}</p>
          </div>
          <div>
            <p className="eyebrow text-gold">{t.footer.shop}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`${base}/shop?c=${c.id}`} className="hover:text-gold">{c.name[locale]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-gold">{t.footer.service}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
              <li><Link href={`${base}/custom`} className="hover:text-gold">{t.nav.custom}</Link></li>
              <li><Link href={`${base}/gallery`} className="hover:text-gold">{t.nav.gallery}</Link></li>
              <li><Link href={`${base}/account`} className="hover:text-gold">{t.nav.account}</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-gold">{t.footer.contact}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-ivory/70 hover:text-gold"
            >
              <WhatsAppIcon className="size-4" /> {t.footer.whatsapp}
            </a>
          </div>
        </div>
        <div className="mt-20 select-none overflow-hidden">
          <p className="gold-text whitespace-nowrap font-display text-[17vw] leading-[0.8] tracking-tight opacity-90 lg:text-[12.5rem]">luxurypresent</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ivory/40">
          <span>© {new Date().getFullYear()} luxurypresent. {t.footer.rights}</span>
          <span>NL · BE</span>
        </div>
      </div>
    </footer>
  );
}
