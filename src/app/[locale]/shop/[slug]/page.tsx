import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, products } from "@/lib/catalog";
import { getDict, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(locale)) return {};
  return { title: product.name, description: product.tagline[locale], openGraph: { images: [product.images[0]] } };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(locale) || !product) notFound();
  const t = getDict(locale);
  const related = products.filter((p) => p.slug !== product.slug).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 4);

  return (
    <>
      <ProductView product={product} locale={locale} t={t} />
      <section className="container-lux border-t border-line py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl">{t.product.related}</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} t={t} />
          ))}
        </div>
      </section>
    </>
  );
}
