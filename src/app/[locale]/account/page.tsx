import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountView } from "@/components/AccountView";
import { getDict, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AccountView locale={locale} t={getDict(locale)} />;
}
