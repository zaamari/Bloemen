"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { DeliveryPicker } from "./DeliveryPicker";
import { useStore, type DeliveryMethod, type Order } from "@/lib/store";
import { getProduct } from "@/lib/catalog";
import { formatPrice, type Dict, type Locale } from "@/lib/i18n";

export function CartView({ locale, t }: { locale: Locale; t: Dict }) {
  const { cart, setQty, placeOrder, user, ready } = useStore();
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [done, setDone] = useState<Order | null>(null);

  const lines = cart.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ ...item, product }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const order = placeOrder({
      items: lines.map((l) => ({ slug: l.slug, qty: l.qty, price: l.product.price })),
      customer: { name: get("name"), email: get("email"), phone: get("phone") },
      delivery: {
        method: delivery,
        address: get("address") || undefined,
        postcode: get("postcode") || undefined,
        city: get("city") || undefined,
        date: get("date") || undefined,
      },
      note: get("note") || undefined,
    });
    setDone(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <>
        <PageHeader title={t.cart.successTitle} />
        <section className="container-lux py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-lg rounded-[28px] border border-line bg-white p-8 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto grid size-16 place-items-center rounded-full bg-noir text-gold"
            >
              <Check className="size-7" />
            </motion.span>
            <p className="mt-6 text-[15px] leading-relaxed text-ink/80">{t.cart.successText}</p>
            <p className="mt-6 text-sm text-muted">
              {t.cart.successOrder}: <span className="font-semibold text-ink">{done.id}</span>
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href={`/${locale}/account`} className="btn btn-dark">{t.cart.successAccount}</Link>
              <Link href={`/${locale}`} className="btn btn-outline">{t.cart.successHome}</Link>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t.cart.title} />
      <section className="container-lux py-10 sm:py-14">
        {ready && lines.length === 0 ? (
          <div className="mx-auto max-w-md py-10 text-center">
            <ShoppingBag className="mx-auto size-10 text-gold-deep" strokeWidth={1.2} />
            <p className="mt-4 text-muted">{t.cart.empty}</p>
            <Link href={`/${locale}/shop`} className="btn btn-dark mt-6">{t.cart.emptyCta}</Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            {/* Overzicht */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ul className="divide-y divide-line">
                {lines.map((l) => (
                  <li key={l.slug} className="flex gap-4 py-4">
                    <Link href={`/${locale}/shop/${l.slug}`} className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-ivory-2">
                      <Image src={l.product.images[0]} alt={l.product.name} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="truncate font-display text-xl">{l.product.name}</p>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">{formatPrice(l.product.price * l.qty, locale)}</p>
                      </div>
                      <p className="truncate text-[12.5px] text-muted">{l.product.tagline[locale]}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-line bg-white" aria-label={t.cart.quantity}>
                          <button type="button" onClick={() => setQty(l.slug, l.qty - 1)} className="grid size-8 place-items-center" aria-label="-">
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                          <button type="button" onClick={() => setQty(l.slug, l.qty + 1)} className="grid size-8 place-items-center" aria-label="+">
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button type="button" onClick={() => setQty(l.slug, 0)} className="inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-bordeaux">
                          <Trash2 className="size-3.5" /> {t.cart.remove}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-baseline justify-between border-t border-ink/20 pt-4">
                <span className="font-semibold">{t.cart.subtotal}</span>
                <span className="text-xl font-semibold tabular-nums text-bordeaux">{formatPrice(subtotal, locale)}</span>
              </div>
              <p className="mt-1 text-[13px] text-muted">{t.cart.shippingNote}</p>
            </div>

            {/* Gegevens */}
            <form key={user?.email ?? "guest"} onSubmit={submit} className="rounded-[28px] border border-line bg-white/60 p-5 sm:p-8">
              <h2 className="font-display text-3xl">{t.cart.checkoutTitle}</h2>
              <div className="mt-6 grid gap-4">
                <div>
                  <label htmlFor="name" className="label">{t.cart.name}</label>
                  <input id="name" name="name" required autoComplete="name" defaultValue={user?.name} className="field" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="label">{t.cart.email}</label>
                    <input id="email" name="email" type="email" required autoComplete="email" defaultValue={user?.email} className="field" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="label">{t.cart.phone}</label>
                    <input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" />
                  </div>
                </div>
                <DeliveryPicker value={delivery} onChange={setDelivery} t={t} />
                {delivery !== "pickup" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid gap-4 overflow-hidden">
                    <div>
                      <label htmlFor="address" className="label">{t.cart.address}</label>
                      <input id="address" name="address" required autoComplete="street-address" className="field" />
                    </div>
                    <div className="grid grid-cols-[1fr_1.4fr] gap-4">
                      <div>
                        <label htmlFor="postcode" className="label">{t.cart.postcode}</label>
                        <input id="postcode" name="postcode" required autoComplete="postal-code" className="field" />
                      </div>
                      <div>
                        <label htmlFor="city" className="label">{t.cart.city}</label>
                        <input id="city" name="city" required autoComplete="address-level2" className="field" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div>
                  <label htmlFor="date" className="label">{t.cart.date}</label>
                  <input id="date" name="date" type="date" className="field" />
                </div>
                <div>
                  <label htmlFor="note" className="label">{t.cart.note}</label>
                  <textarea id="note" name="note" rows={3} placeholder={t.cart.notePlaceholder} className="field resize-none" />
                </div>
                <button type="submit" disabled={lines.length === 0} className="btn btn-gold mt-2 w-full !py-4 text-[15px]">
                  {t.cart.submit} · {formatPrice(subtotal, locale)}
                </button>
                <p className="text-center text-[13px] text-muted">{t.cart.noPayment}</p>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
}
