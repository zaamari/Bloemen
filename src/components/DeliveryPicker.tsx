"use client";

import { PackageCheck, Store, Truck } from "lucide-react";
import type { DeliveryMethod } from "@/lib/store";
import type { Dict } from "@/lib/i18n";

export function DeliveryPicker({ value, onChange, t }: { value: DeliveryMethod; onChange: (v: DeliveryMethod) => void; t: Dict }) {
  const options: { id: DeliveryMethod; label: string; Icon: typeof Store }[] = [
    { id: "pickup", label: t.cart.pickup, Icon: Store },
    { id: "local", label: t.cart.localDelivery, Icon: Truck },
    { id: "shipping", label: t.cart.shipping, Icon: PackageCheck },
  ];
  return (
    <fieldset>
      <legend className="label">{t.cart.deliveryPref}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map(({ id, label, Icon }) => (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-[14px] font-medium transition ${
              value === id ? "border-noir bg-noir text-ivory" : "border-line bg-white hover:border-ink/40"
            }`}
          >
            <input type="radio" name="delivery" value={id} checked={value === id} onChange={() => onChange(id)} className="sr-only" />
            <Icon className={`size-[18px] ${value === id ? "text-gold" : "text-gold-deep"}`} strokeWidth={1.6} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
