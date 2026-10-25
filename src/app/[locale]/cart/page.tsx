import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartView } from "@/components/CartView";
import { getDict, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Winkelmand" };

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CartView locale={locale} t={getDict(locale)} />;
}
