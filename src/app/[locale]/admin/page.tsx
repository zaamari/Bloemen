import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminView } from "@/components/AdminView";
import { getDict, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Beheer", robots: { index: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AdminView locale={locale} t={getDict(locale)} />;
}
