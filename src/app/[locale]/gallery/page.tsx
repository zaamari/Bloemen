import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHeader } from "@/components/PageHeader";
import { gallery } from "@/lib/catalog";
import { getDict, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Galerij" };

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  return (
    <>
      <PageHeader eyebrow="luxurypresent" title={t.gallery.title} lead={t.gallery.lead} />
      <section className="container-lux py-10 sm:py-14">
        <GalleryGrid items={gallery.map((g) => ({ image: g.image, title: g.title[locale], tall: g.tall }))} />
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="font-display text-3xl sm:text-4xl">{t.gallery.cta}</p>
          <Link href={`/${locale}/custom`} className="btn btn-gold">{t.home.customCta}</Link>
        </div>
      </section>
    </>
  );
}
