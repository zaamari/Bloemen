"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Check, ImagePlus, X } from "lucide-react";
import { DeliveryPicker } from "./DeliveryPicker";
import { useStore, type DeliveryMethod } from "@/lib/store";
import type { Dict, Locale } from "@/lib/i18n";

// Verkleint een foto in de browser, zodat de tijdelijke opslag niet volloopt.
async function shrink(file: File, max = 640): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.75);
}

export function CustomForm({ locale, t, basedOn }: { locale: Locale; t: Dict; basedOn?: string }) {
  const { submitRequest, user } = useStore();
  const [occasion, setOccasion] = useState(t.custom.occasions[0]);
  const [colors, setColors] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [budget, setBudget] = useState(t.custom.budgets[4]);
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [photos, setPhotos] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const room = 5 - photos.length;
    const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    const shrunk = await Promise.all(picked.map((f) => shrink(f)));
    setPhotos((p) => [...p, ...shrunk]);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    submitRequest({
      customer: { name: get("name"), email: get("email"), phone: get("phone") },
      occasion,
      colors,
      extras,
      budget,
      description: get("description"),
      photos,
      delivery,
      date: get("date") || undefined,
    });
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <section className="container-lux py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg rounded-[28px] border border-line bg-white p-8 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mx-auto grid size-16 place-items-center rounded-full bg-noir text-gold">
            <Check className="size-7" />
          </motion.span>
          <h2 className="mt-6 font-display text-3xl">{t.custom.successTitle}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{t.custom.successText}</p>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href={`/${locale}/account`} className="btn btn-dark">{t.cart.successAccount}</Link>
            <Link href={`/${locale}`} className="btn btn-outline">{t.cart.successHome}</Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="container-lux py-10 sm:py-14">
      <form key={user?.email ?? "guest"} onSubmit={submit} className="mx-auto grid max-w-3xl gap-8">
        <Group title={t.custom.occasion}>
          <div className="flex flex-wrap gap-2">
            {t.custom.occasions.map((o) => (
              <button key={o} type="button" onClick={() => setOccasion(o)} aria-pressed={occasion === o} className={`chip ${occasion === o ? "chip-on" : ""}`}>
                {o}
              </button>
            ))}
          </div>
        </Group>

        <Group title={t.custom.colors}>
          <div className="flex flex-wrap gap-2">
            {t.custom.colorOptions.map((c, i) => (
              <button key={c} type="button" onClick={() => toggle(colors, setColors, c)} aria-pressed={colors.includes(c)} className={`chip gap-2 ${colors.includes(c) ? "chip-on" : ""}`}>
                <span className="size-3.5 rounded-full ring-1 ring-black/10" style={{ background: SWATCHES[i] }} />
                {c}
              </button>
            ))}
          </div>
        </Group>

        <Group title={t.custom.extras}>
          <div className="flex flex-wrap gap-2">
            {t.custom.extraOptions.map((x) => (
              <button key={x} type="button" onClick={() => toggle(extras, setExtras, x)} aria-pressed={extras.includes(x)} className={`chip ${extras.includes(x) ? "chip-on" : ""}`}>
                {x}
              </button>
            ))}
          </div>
        </Group>

        <Group title={t.custom.budget}>
          <div className="flex flex-wrap gap-2">
            {t.custom.budgets.map((b) => (
              <button key={b} type="button" onClick={() => setBudget(b)} aria-pressed={budget === b} className={`chip ${budget === b ? "chip-on" : ""}`}>
                {b}
              </button>
            ))}
          </div>
        </Group>

        <div>
          <label htmlFor="description" className="label">{t.custom.description}</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            defaultValue={basedOn ? `${basedOn}, ${locale === "nl" ? "maar dan" : "but"} …` : ""}
            placeholder={t.custom.descriptionPlaceholder}
            className="field resize-none"
          />
        </div>

        <div>
          <p className="label">{t.custom.photos}</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {photos.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-ivory-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                  className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-noir/70 text-ivory"
                  aria-label="Verwijder foto"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink/15 bg-white text-center text-[12px] text-muted transition hover:border-gold-deep hover:text-ink">
                <ImagePlus className="size-6 text-gold-deep" strokeWidth={1.4} />
                {t.custom.photosAdd}
                <input id="photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
              </label>
            )}
          </div>
          <p className="mt-1.5 text-[12px] text-muted">{t.custom.photosHint}</p>
        </div>

        <DeliveryPicker value={delivery} onChange={setDelivery} t={t} />

        <div className="grid gap-4 rounded-[22px] border border-line bg-white/60 p-5 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="label">{t.cart.name}</label>
            <input id="name" name="name" required autoComplete="name" defaultValue={user?.name} className="field" />
          </div>
          <div>
            <label htmlFor="email" className="label">{t.cart.email}</label>
            <input id="email" name="email" type="email" required autoComplete="email" defaultValue={user?.email} className="field" />
          </div>
          <div>
            <label htmlFor="phone" className="label">{t.cart.phone}</label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="date" className="label">{t.cart.date}</label>
            <input id="date" name="date" type="date" className="field" />
          </div>
        </div>

        <button type="submit" className="btn btn-gold w-full !py-4 text-[15px]">{t.custom.submit}</button>
      </form>
    </section>
  );
}

const SWATCHES = ["#5c0f1c", "#c4161c", "#111111", "#d8c3a0", "#f3ecdc", "#f2b8c6", "#6b2f80", "#d4b26a"];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="label">{title}</legend>
      {children}
    </fieldset>
  );
}
