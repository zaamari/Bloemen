import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, PackageCheck, Store, Truck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { SatinSection } from "@/components/home/SatinSection";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { categories, gallery, products } from "@/lib/catalog";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = getDict(locale);
  const base = `/${locale}`;
  const popular = products.slice(0, 4);
  const deliveryIcons = [Store, Truck, PackageCheck];

  return (
    <>
      <Hero locale={locale} t={t} />
      <Marquee items={t.marquee} />

      {/* Categorieën */}
      <section className="container-lux py-20 sm:py-28">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl sm:text-5xl">{t.home.categoriesTitle}</h2>
          <Link href={`${base}/shop`} className="hidden items-center gap-1.5 text-sm font-semibold text-bordeaux hover:underline sm:inline-flex">
            {t.home.viewAll} <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <Link href={`${base}/shop?c=${c.id}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[22px] bg-noir">
                <Image src={c.image} alt="" fill sizes="(min-width:640px) 25vw, 62vw" className="object-cover opacity-90 transition duration-[1.2s] ease-(--ease-lux) group-hover:scale-105 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-ivory">
                  <span className="font-display text-2xl leading-tight">{c.name[locale]}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/30 transition group-hover:border-gold group-hover:bg-gold group-hover:text-noir">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Populair */}
      <section className="bg-ivory-2/60 py-20 sm:py-28">
        <div className="container-lux">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl">{t.home.popularTitle}</h2>
            <Link href={`${base}/shop`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-bordeaux hover:underline">
              {t.home.viewAll} <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {popular.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.08}>
                <ProductCard product={p} locale={locale} t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SatinSection t={t} />

      {/* Custom */}
      <section className="grain relative overflow-hidden bg-noir py-20 text-ivory sm:py-28">
        <div className="pointer-events-none absolute -right-40 top-10 size-[30rem] rounded-full bg-bordeaux/50 blur-[120px]" />
        <div className="container-lux relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-gold">{t.home.customEyebrow}</p>
            <h2 className="mt-4 font-display text-[2.7rem] leading-[1] sm:text-6xl">{t.home.customTitle}</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ivory/70">{t.home.customText}</p>
            <ol className="mt-10 space-y-6">
              {t.home.customSteps.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/50 font-display text-lg text-gold">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-sm text-ivory/60">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href={`${base}/custom`} className="btn btn-gold mt-10">{t.home.customCta} <ArrowRight className="size-4" /></Link>
          </Reveal>
          <Reveal delay={0.15} className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3">
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[22px]">
              <Image src="/images/gallery/spiegel.jpg" alt="" fill sizes="(min-width:1024px) 220px, 45vw" className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[22px]">
              <Image src="/images/gallery/cadeautas.jpg" alt="" fill sizes="(min-width:1024px) 220px, 45vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-noir/80 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur">
              {t.home.customEyebrow}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Galerij */}
      <section className="container-lux py-20 sm:py-28">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl sm:text-5xl">{t.home.galleryTitle}</h2>
          <Link href={`${base}/gallery`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-bordeaux hover:underline">
            {t.home.galleryCta} <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <div className="mt-8 columns-2 gap-3 sm:columns-3 sm:gap-5">
          {gallery.slice(0, 6).map((g, i) => (
            <Reveal key={g.image} delay={(i % 3) * 0.08} className="mb-3 break-inside-avoid sm:mb-5">
              <figure className="group relative overflow-hidden rounded-[22px]">
                <div className={`relative ${g.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                  <Image src={g.image} alt={g.title[locale]} fill sizes="(min-width:640px) 33vw, 50vw" className="object-cover transition duration-[1.2s] ease-(--ease-lux) group-hover:scale-105" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/80 to-transparent p-3 pt-10 text-[12.5px] text-ivory opacity-0 transition group-hover:opacity-100">
                  {g.title[locale]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Levering */}
      <section className="border-t border-line bg-ivory-2/60 py-20">
        <div className="container-lux">
          <Reveal className="max-w-xl">
            <h2 className="font-display text-4xl sm:text-5xl">{t.home.deliveryTitle}</h2>
            <p className="mt-4 text-[15px] text-muted">{t.home.deliveryText}</p>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-5">
            {t.home.delivery.map((d, i) => {
              const Icon = deliveryIcons[i];
              return (
                <Reveal key={d.title} delay={i * 0.08} className="flex items-center gap-4 rounded-[22px] border border-line bg-white p-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-noir text-gold">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="font-semibold">{d.title}</p>
                    <p className="text-sm text-muted">{d.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
