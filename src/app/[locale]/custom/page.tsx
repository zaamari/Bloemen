import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomForm } from "@/components/CustomForm";
import { PageHeader } from "@/components/PageHeader";
import { getProduct } from "@/lib/catalog";
import { getDict, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Custom boeket" };

export default async function CustomPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { from } = await searchParams;
  const t = getDict(locale);
  const base = from ? getProduct(from) : undefined;

  return (
    <>
      <PageHeader eyebrow={t.custom.eyebrow} title={t.custom.title} lead={t.custom.lead} />
      <CustomForm locale={locale} t={t} basedOn={base?.name} />
    </>
  );
}
