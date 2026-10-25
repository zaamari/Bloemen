"use client";

// Tijdelijke opslag in de browser (localStorage) zolang Supabase nog niet gekoppeld is.
// Alle lees/schrijfacties lopen via deze provider, zodat we later alleen dit bestand vervangen.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { slug: string; qty: number };
export type DeliveryMethod = "pickup" | "local" | "shipping";
export type Status = "received" | "contacted" | "quoted" | "accepted" | "in_progress" | "ready" | "delivered";

export type Customer = { name: string; email: string; phone: string };

export type Order = {
  id: string;
  createdAt: string;
  items: { slug: string; qty: number; price: number }[];
  customer: Customer;
  delivery: { method: DeliveryMethod; address?: string; postcode?: string; city?: string; date?: string };
  note?: string;
  status: Status;
};

export type Message = { from: "customer" | "shop"; text: string; at: string };

export type CustomRequest = {
  id: string;
  createdAt: string;
  customer: Customer;
  occasion: string;
  colors: string[];
  extras: string[];
  budget: string;
  description: string;
  photos: string[]; // verkleinde data-URL's
  delivery: DeliveryMethod;
  date?: string;
  status: Status;
  quote?: { price: number; text: string };
  messages: Message[];
};

export type User = { name: string; email: string; isAdmin?: boolean };

type State = {
  cart: CartItem[];
  favorites: string[];
  user: User | null;
  orders: Order[];
  requests: CustomRequest[];
};

const empty: State = { cart: [], favorites: [], user: null, orders: [], requests: [] };
const KEY = "lp-store-v1";

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
}

function useStoreValue() {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Opslag vol of geblokkeerd: de site blijft werken, alleen zonder bewaren.
    }
  }, [state, ready]);

  const update = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const addToCart = useCallback(
    (slug: string, qty = 1) =>
      update((s) => {
        const existing = s.cart.find((i) => i.slug === slug);
        const cart = existing
          ? s.cart.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i))
          : [...s.cart, { slug, qty }];
        return { ...s, cart };
      }),
    [update],
  );

  const setQty = useCallback(
    (slug: string, qty: number) =>
      update((s) => ({
        ...s,
        cart: qty <= 0 ? s.cart.filter((i) => i.slug !== slug) : s.cart.map((i) => (i.slug === slug ? { ...i, qty } : i)),
      })),
    [update],
  );

  const toggleFavorite = useCallback(
    (slug: string) =>
      update((s) => ({
        ...s,
        favorites: s.favorites.includes(slug) ? s.favorites.filter((f) => f !== slug) : [...s.favorites, slug],
      })),
    [update],
  );

  const placeOrder = useCallback(
    (order: Omit<Order, "id" | "createdAt" | "status">) => {
      const full: Order = { ...order, id: newId("LP"), createdAt: new Date().toISOString(), status: "received" };
      update((s) => ({ ...s, orders: [full, ...s.orders], cart: [] }));
      return full;
    },
    [update],
  );

  const submitRequest = useCallback(
    (req: Omit<CustomRequest, "id" | "createdAt" | "status" | "messages">) => {
      const full: CustomRequest = {
        ...req,
        id: newId("CU"),
        createdAt: new Date().toISOString(),
        status: "received",
        messages: [],
      };
      update((s) => ({ ...s, requests: [full, ...s.requests] }));
      return full;
    },
    [update],
  );

  const updateRequest = useCallback(
    (id: string, fn: (r: CustomRequest) => CustomRequest) =>
      update((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? fn(r) : r)) })),
    [update],
  );

  const updateOrder = useCallback(
    (id: string, fn: (o: Order) => Order) =>
      update((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? fn(o) : o)) })),
    [update],
  );

  const login = useCallback((user: User) => update((s) => ({ ...s, user })), [update]);
  const logout = useCallback(() => update((s) => ({ ...s, user: null })), [update]);

  return {
    ...state,
    ready,
    cartCount: state.cart.reduce((n, i) => n + i.qty, 0),
    addToCart,
    setQty,
    toggleFavorite,
    placeOrder,
    submitRequest,
    updateRequest,
    updateOrder,
    login,
    logout,
  };
}

type Store = ReturnType<typeof useStoreValue>;
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore moet binnen StoreProvider gebruikt worden");
  return ctx;
}
