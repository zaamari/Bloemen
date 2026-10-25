import type { Metadata, Viewport } from "next";
import { Italiana, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StoreProvider } from "@/lib/store";
import { getDict, isLocale, locales } from "@/lib/i18n";

const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-italiana", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale !== "en";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: "luxurypresent · Satijnen boeketten", template: "%s · luxurypresent" },
    description: nl
      ? "Handgemaakte boeketten van satijnlint, cadeaus en snoeptaarten. Kies uit de collectie of vraag een custom boeket aan."
      : "Handmade bouquets of satin ribbon, gifts and candy cakes. Choose from the collection or request a custom bouquet.",
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0606",
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  return (
    <html lang={locale} className={`${italiana.variable} ${manrope.variable}`}>
      <body>
        <StoreProvider>
          <Header locale={locale} t={t} />
          <main>{children}</main>
          <Footer locale={locale} t={t} />
          <WhatsAppButton label={t.whatsapp} />
        </StoreProvider>
      </body>
    </html>
  );
}
