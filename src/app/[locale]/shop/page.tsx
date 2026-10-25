import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { categories, products, type CategoryId } from "@/lib/catalog";
import { getDict, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ c?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { c } = await searchParams;
  const t = getDict(locale);
  const active = categories.find((cat) => cat.id === c)?.id as CategoryId | undefined;
  const list = active ? products.filter((p) => p.category === active) : products;
  const base = `/${locale}/shop`;

  const chips = [{ id: undefined, label: t.shop.all }, ...categories.map((cat) => ({ id: cat.id, label: cat.name[locale] }))];

  return (
    <>
      <PageHeader eyebrow="luxurypresent" title={t.shop.title} lead={t.shop.lead} />
      <div className="sticky top-[76px] z-30 border-b border-line bg-ivory/85 backdrop-blur-xl sm:top-[84px]">
        <div className="container-lux flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.id ? `${base}?c=${chip.id}` : base}
              scroll={false}
              className={`chip shrink-0 ${active === chip.id ? "chip-on" : ""}`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
      <section className="container-lux py-10 sm:py-14">
        {list.length === 0 ? (
          <p className="text-muted">{t.shop.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 0.06}>
                <ProductCard product={p} locale={locale} t={t} priority={i < 2} />
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <Link
                href={`/${locale}/custom`}
                className="grain relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-noir-3 to-bordeaux-deep p-5 text-ivory"
              >
                <Sparkles className="size-6 text-gold" strokeWidth={1.4} />
                <div>
                  <p className="eyebrow text-gold">{t.home.customEyebrow}</p>
                  <p className="mt-2 font-display text-[1.7rem] leading-[1.05]">{t.home.customTitle}</p>
                  <span className="btn btn-gold mt-4 !px-4 !py-2.5 text-[13px]">{t.home.customCta}</span>
                </div>
              </Link>
            </Reveal>
          </div>
        )}
      </section>
    </>
  );
}
