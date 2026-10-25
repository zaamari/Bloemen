"use client";

// Beheerpaneel voor de eigenaar. Nu nog op basis van de tijdelijke browseropslag;
// na koppeling met Supabase is dit alleen bereikbaar voor admin-accounts.

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Image as ImageIcon, Inbox, LayoutGrid, Package, Pencil, Plus, Send } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { StatusBadge } from "./StatusBadge";
import { useStore, type CustomRequest, type Status } from "@/lib/store";
import { categories, gallery, getProduct, products } from "@/lib/catalog";
import { formatPrice, type Dict, type Locale } from "@/lib/i18n";

type Tab = "overview" | "orders" | "requests" | "products" | "gallery";
const statuses: Status[] = ["received", "contacted", "quoted", "accepted", "in_progress", "ready", "delivered"];
const deliveryLabel = { pickup: "Ophalen", local: "Bezorgen in de regio", shipping: "Verzenden" } as const;

export function AdminView({ locale, t }: { locale: Locale; t: Dict }) {
  const { orders, requests, updateOrder } = useStore();
  const [tab, setTab] = useState<Tab>("overview");

  const openOrders = orders.filter((o) => o.status !== "delivered").length;
  const waiting = requests.filter((r) => r.status === "received").length;

  const tabs: { id: Tab; label: string; Icon: typeof Package }[] = [
    { id: "overview", label: "Overzicht", Icon: LayoutGrid },
    { id: "orders", label: "Bestellingen", Icon: Package },
    { id: "requests", label: "Aanvragen", Icon: Inbox },
    { id: "products", label: "Producten", Icon: LayoutGrid },
    { id: "gallery", label: "Galerij", Icon: ImageIcon },
  ];

  return (
    <>
      <PageHeader eyebrow="Beheer" title="Dashboard" lead="Demo: gegevens staan nu alleen in deze browser. Na koppeling met de database zie je hier alle echte bestellingen." />
      <div className="sticky top-[76px] z-30 border-b border-line bg-ivory/85 backdrop-blur-xl sm:top-[84px]">
        <div className="container-lux flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]" role="tablist">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`chip shrink-0 gap-2 ${tab === id ? "chip-on" : ""}`}>
              <Icon className="size-4" strokeWidth={1.7} /> {label}
            </button>
          ))}
        </div>
      </div>

      <section className="container-lux py-10">
        {tab === "overview" && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Open bestellingen" value={openOrders} onClick={() => setTab("orders")} />
            <Stat label="Nieuwe aanvragen" value={waiting} onClick={() => setTab("requests")} highlight={waiting > 0} />
            <Stat label="Producten in de shop" value={products.length} onClick={() => setTab("products")} />
          </div>
        )}

        {tab === "orders" &&
          (orders.length === 0 ? (
            <p className="text-muted">Nog geen bestellingen. Plaats een testbestelling via de shop.</p>
          ) : (
            <div className="grid gap-4">
              {orders.map((o) => (
                <article key={o.id} className="grid gap-4 rounded-[22px] border border-line bg-white p-5 lg:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{o.id}</p>
                      <StatusBadge status={o.status} t={t} />
                    </div>
                    <p className="mt-1 text-[12.5px] text-muted">{new Date(o.createdAt).toLocaleString("nl-NL")}</p>
                    <ul className="mt-3 text-sm">
                      {o.items.map((i) => (
                        <li key={i.slug}>{i.qty}× {getProduct(i.slug)?.name ?? i.slug}</li>
                      ))}
                    </ul>
                    <p className="mt-2 font-semibold tabular-nums text-bordeaux">{formatPrice(o.items.reduce((s, i) => s + i.price * i.qty, 0), locale)}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">{o.customer.name}</p>
                    <p className="text-muted">{o.customer.email} · {o.customer.phone}</p>
                    <p className="mt-2">{deliveryLabel[o.delivery.method]}{o.delivery.date ? ` · ${o.delivery.date}` : ""}</p>
                    {o.delivery.address && <p className="text-muted">{o.delivery.address}, {o.delivery.postcode} {o.delivery.city}</p>}
                    {o.note && <p className="mt-2 italic text-muted">“{o.note}”</p>}
                  </div>
                  <StatusSelect value={o.status} onChange={(s) => updateOrder(o.id, (x) => ({ ...x, status: s }))} t={t} />
                </article>
              ))}
            </div>
          ))}

        {tab === "requests" &&
          (requests.length === 0 ? (
            <p className="text-muted">Nog geen aanvragen. Doe een testaanvraag via “Custom boeket”.</p>
          ) : (
            <div className="grid gap-4">
              {requests.map((r) => (
                <AdminRequest key={r.id} request={r} locale={locale} t={t} />
              ))}
            </div>
          ))}

        {tab === "products" && (
          <div>
            <div className="flex justify-end">
              <button type="button" disabled className="btn btn-dark" title="Beschikbaar na koppeling met de database">
                <Plus className="size-4" /> Nieuw product
              </button>
            </div>
            <div className="mt-4 overflow-x-auto rounded-[22px] border border-line bg-white">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-line text-[12px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Categorie</th>
                    <th className="p-4 text-right font-semibold">Prijs</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {products.map((p) => (
                    <tr key={p.slug}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-ivory-2">
                            <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />
                          </span>
                          <span className="font-semibold">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted">{categories.find((c) => c.id === p.category)?.name.nl}</td>
                      <td className="p-4 text-right tabular-nums">{formatPrice(p.price, locale)}</td>
                      <td className="p-4 text-right">
                        <button type="button" disabled className="inline-flex items-center gap-1 text-muted" title="Beschikbaar na koppeling met de database">
                          <Pencil className="size-3.5" /> Bewerken
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "gallery" && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {gallery.map((g) => (
              <div key={g.image} className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={g.image} alt={g.title.nl} fill sizes="20vw" className="object-cover" />
              </div>
            ))}
            <button type="button" disabled className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-ink/15 text-muted" title="Beschikbaar na koppeling met de database">
              <Plus className="size-6" />
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function AdminRequest({ request: r, locale, t }: { request: CustomRequest; locale: Locale; t: Dict }) {
  const { updateRequest } = useStore();
  const [msg, setMsg] = useState("");

  const sendQuote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const price = Math.round(parseFloat(String(f.get("price")).replace(",", ".")) * 100);
    const text = String(f.get("text") ?? "").trim();
    if (!price) return;
    updateRequest(r.id, (x) => ({ ...x, quote: { price, text }, status: "quoted" }));
  };

  const reply = (e: FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    updateRequest(r.id, (x) => ({ ...x, messages: [...x.messages, { from: "shop", text: msg.trim(), at: new Date().toISOString() }] }));
    setMsg("");
  };

  return (
    <article className="grid gap-6 rounded-[22px] border border-line bg-white p-5 lg:grid-cols-2">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-semibold">{r.occasion} · {r.id}</p>
          <StatusBadge status={r.status} t={t} />
        </div>
        <p className="mt-1 text-[12.5px] text-muted">
          {r.customer.name} · {r.customer.email} · {r.customer.phone}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed">{r.description}</p>
        <p className="mt-2 text-[12.5px] text-muted">
          Budget: {r.budget} · {deliveryLabel[r.delivery]}{r.date ? ` · ${r.date}` : ""}
        </p>
        {(r.colors.length > 0 || r.extras.length > 0) && <p className="mt-1 text-[12.5px] text-muted">{[...r.colors, ...r.extras].join(" · ")}</p>}
        {r.photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {r.photos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="size-16 rounded-lg object-cover" />
            ))}
          </div>
        )}
        <div className="mt-4 max-w-56">
          <StatusSelect value={r.status} onChange={(s) => updateRequest(r.id, (x) => ({ ...x, status: s }))} t={t} />
        </div>
      </div>

      <div className="grid content-start gap-4">
        <form onSubmit={sendQuote} className="grid gap-3 rounded-2xl bg-ivory-2/70 p-4">
          <p className="eyebrow">Voorstel sturen</p>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <label htmlFor={`price-${r.id}`} className="sr-only">Prijs</label>
            <input id={`price-${r.id}`} name="price" inputMode="decimal" placeholder="€ 0,00" defaultValue={r.quote ? (r.quote.price / 100).toFixed(2).replace(".", ",") : ""} className="field" required />
            <label htmlFor={`text-${r.id}`} className="sr-only">Toelichting</label>
            <input id={`text-${r.id}`} name="text" placeholder="Toelichting (rozen, kleuren, levering…)" defaultValue={r.quote?.text} className="field" />
          </div>
          <button type="submit" className="btn btn-dark">{r.quote ? "Voorstel bijwerken" : "Voorstel versturen"}</button>
          {r.quote && <p className="text-[12.5px] text-muted">Huidig voorstel: {formatPrice(r.quote.price, locale)}</p>}
        </form>

        <div>
          {r.messages.length > 0 && (
            <ul className="mb-3 grid gap-2">
              {r.messages.map((m, i) => (
                <li key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] ${m.from === "shop" ? "ml-auto rounded-br-md bg-noir text-ivory" : "rounded-bl-md bg-ivory-2"}`}>
                  {m.text}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={reply} className="flex gap-2">
            <label htmlFor={`msg-${r.id}`} className="sr-only">Bericht</label>
            <input id={`msg-${r.id}`} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Bericht aan klant…" className="field !rounded-full" />
            <button type="submit" className="btn btn-dark !rounded-full !px-4" aria-label="Versturen">
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

function StatusSelect({ value, onChange, t }: { value: Status; onChange: (s: Status) => void; t: Dict }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as Status)} className="field h-fit cursor-pointer" aria-label="Status">
      {statuses.map((s) => (
        <option key={s} value={s}>{t.status[s]}</option>
      ))}
    </select>
  );
}

function Stat({ label, value, onClick, highlight }: { label: string; value: number; onClick: () => void; highlight?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-[22px] p-6 text-left transition hover:-translate-y-0.5 ${highlight ? "bg-noir text-ivory" : "border border-line bg-white"}`}>
      <p className={`font-display text-5xl tabular-nums ${highlight ? "text-gold" : ""}`}>{value}</p>
      <p className={`mt-2 text-sm ${highlight ? "text-ivory/70" : "text-muted"}`}>{label}</p>
    </button>
  );
}
