"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Check, Heart, Inbox, LogOut, Package, Send } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { ProductCard } from "./ProductCard";
import { StatusBadge } from "./StatusBadge";
import { useStore, type CustomRequest } from "@/lib/store";
import { getProduct, products } from "@/lib/catalog";
import { formatPrice, type Dict, type Locale } from "@/lib/i18n";

type Tab = "orders" | "requests" | "favorites";

export function AccountView({ locale, t }: { locale: Locale; t: Dict }) {
  const { user, login, logout, orders, requests, favorites, ready } = useStore();
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "favorites" || hash === "requests" || hash === "orders") setTab(hash);
  }, []);

  if (!ready) return <PageHeader title={t.account.title} />;

  if (!user) {
    const submit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const email = String(new FormData(e.currentTarget).get("email") ?? "");
      login({ name: email.split("@")[0], email });
    };
    return (
      <>
        <PageHeader title={t.account.loginTitle} lead={t.account.loginLead} />
        <section className="container-lux py-12">
          <div className="mx-auto max-w-md rounded-[28px] border border-line bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={() => login({ name: "Google-gebruiker", email: "demo@gmail.com" })}
              className="btn w-full border border-line bg-white text-ink hover:border-ink/40"
            >
              <GoogleIcon /> {t.account.google}
            </button>
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted">
              <span className="h-px flex-1 bg-line" /> {t.account.or} <span className="h-px flex-1 bg-line" />
            </div>
            <form onSubmit={submit} className="grid gap-4">
              <div>
                <label htmlFor="login-email" className="label">{t.cart.email}</label>
                <input id="login-email" name="email" type="email" required autoComplete="email" className="field" />
              </div>
              <div>
                <label htmlFor="login-password" className="label">{t.account.password}</label>
                <input id="login-password" name="password" type="password" required autoComplete="current-password" className="field" />
              </div>
              <button type="submit" className="btn btn-dark w-full">{t.account.login}</button>
              <p className="text-center text-[12.5px] text-muted">{t.account.noAccount}</p>
            </form>
            <p className="mt-6 rounded-xl bg-ivory-2 p-3 text-[12px] text-muted">{t.account.demo}</p>
          </div>
        </section>
      </>
    );
  }

  const tabs: { id: Tab; label: string; Icon: typeof Package; count: number }[] = [
    { id: "orders", label: t.account.orders, Icon: Package, count: orders.length },
    { id: "requests", label: t.account.requests, Icon: Inbox, count: requests.length },
    { id: "favorites", label: t.account.favorites, Icon: Heart, count: favorites.length },
  ];

  return (
    <>
      <PageHeader eyebrow={t.account.title} title={`${t.account.hello} ${user.name}`}>
        <button type="button" onClick={logout} className="mt-6 inline-flex items-center gap-2 text-sm text-ivory/60 hover:text-gold">
          <LogOut className="size-4" /> {t.account.logout}
        </button>
      </PageHeader>
      <div className="sticky top-[76px] z-30 border-b border-line bg-ivory/85 backdrop-blur-xl sm:top-[84px]">
        <div className="container-lux flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]" role="tablist">
          {tabs.map(({ id, label, Icon, count }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`chip shrink-0 gap-2 ${tab === id ? "chip-on" : ""}`}
            >
              <Icon className="size-4" strokeWidth={1.7} /> {label}
              <span className="text-[11px] opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="container-lux py-10">
        {tab === "orders" &&
          (orders.length === 0 ? (
            <Empty text={t.account.noOrders} cta={t.cart.emptyCta} href={`/${locale}/shop`} />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {orders.map((o) => (
                <article key={o.id} className="rounded-[22px] border border-line bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{o.id}</p>
                      <p className="text-[12.5px] text-muted">{new Date(o.createdAt).toLocaleDateString(locale)}</p>
                    </div>
                    <StatusBadge status={o.status} t={t} />
                  </div>
                  <ul className="mt-4 flex gap-2">
                    {o.items.map((i) => {
                      const p = getProduct(i.slug);
                      return p ? (
                        <li key={i.slug} className="relative aspect-[4/5] w-14 overflow-hidden rounded-lg bg-ivory-2">
                          <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                          {i.qty > 1 && <span className="absolute bottom-1 right-1 rounded bg-noir/70 px-1 text-[10px] text-ivory">×{i.qty}</span>}
                        </li>
                      ) : null;
                    })}
                  </ul>
                  <p className="mt-4 text-sm font-semibold tabular-nums text-bordeaux">
                    {formatPrice(o.items.reduce((s, i) => s + i.price * i.qty, 0), locale)}
                  </p>
                </article>
              ))}
            </div>
          ))}

        {tab === "requests" &&
          (requests.length === 0 ? (
            <Empty text={t.account.noRequests} cta={t.home.customCta} href={`/${locale}/custom`} />
          ) : (
            <div className="grid gap-4">
              {requests.map((r) => (
                <RequestCard key={r.id} request={r} locale={locale} t={t} />
              ))}
            </div>
          ))}

        {tab === "favorites" &&
          (favorites.length === 0 ? (
            <Empty text={t.account.noFavorites} cta={t.cart.emptyCta} href={`/${locale}/shop`} />
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
              {products
                .filter((p) => favorites.includes(p.slug))
                .map((p) => (
                  <ProductCard key={p.slug} product={p} locale={locale} t={t} />
                ))}
            </div>
          ))}
      </section>
    </>
  );
}

function RequestCard({ request: r, locale, t }: { request: CustomRequest; locale: Locale; t: Dict }) {
  const { updateRequest } = useStore();
  const [text, setText] = useState("");

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    updateRequest(r.id, (req) => ({ ...req, messages: [...req.messages, { from: "customer", text: text.trim(), at: new Date().toISOString() }] }));
    setText("");
  };

  return (
    <article className="rounded-[22px] border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{r.occasion} · {r.id}</p>
          <p className="text-[12.5px] text-muted">{new Date(r.createdAt).toLocaleDateString(locale)}</p>
        </div>
        <StatusBadge status={r.status} t={t} />
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-ink/80">{r.description}</p>
      {(r.colors.length > 0 || r.extras.length > 0) && (
        <p className="mt-2 text-[12.5px] text-muted">{[...r.colors, ...r.extras].join(" · ")}</p>
      )}
      {r.photos.length > 0 && (
        <div className="mt-3 flex gap-2">
          {r.photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="size-14 rounded-lg object-cover" />
          ))}
        </div>
      )}

      {r.quote && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-noir p-5 text-ivory">
          <p className="eyebrow text-gold">{t.account.quote}</p>
          <p className="mt-2 font-display text-3xl text-gold">{formatPrice(r.quote.price, locale)}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ivory/75">{r.quote.text}</p>
          {r.status === "quoted" ? (
            <button
              type="button"
              onClick={() => updateRequest(r.id, (req) => ({ ...req, status: "accepted" }))}
              className="btn btn-gold mt-4"
            >
              <Check className="size-4" /> {t.account.accept}
            </button>
          ) : (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-gold"><Check className="size-4" /> {t.account.accepted}</p>
          )}
        </motion.div>
      )}

      {r.messages.length > 0 && (
        <ul className="mt-5 grid gap-2">
          {r.messages.map((m, i) => (
            <li
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] ${m.from === "customer" ? "ml-auto rounded-br-md bg-bordeaux text-ivory" : "rounded-bl-md bg-ivory-2"}`}
            >
              {m.text}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={send} className="mt-4 flex gap-2">
        <label htmlFor={`reply-${r.id}`} className="sr-only">{t.account.reply}</label>
        <input id={`reply-${r.id}`} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.account.replyPlaceholder} className="field !rounded-full" />
        <button type="submit" className="btn btn-dark !rounded-full !px-4" aria-label={t.account.send}>
          <Send className="size-4" />
        </button>
      </form>
    </article>
  );
}

function Empty({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <p className="text-muted">{text}</p>
      <Link href={href} className="btn btn-dark mt-6">{cta}</Link>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}
