'use client';
import { useSyncExternalStore } from 'react';

/** Panier stocké dans le navigateur du visiteur : rien n'est envoyé tant qu'il ne valide pas sur WhatsApp. */
export type CartItem = { slug: string; name: string; size: string; qty: number };

const KEY = 'pe-cart-v1';
const EVENT = 'pe-cart-change';
const EMPTY: CartItem[] = [];
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cache.items;
  }
  if (raw === cache.raw) return cache.items;
  let items: CartItem[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      items = parsed
        .filter((i) => i && typeof i.slug === 'string' && typeof i.name === 'string')
        .map((i) => ({ slug: i.slug, name: i.name, size: String(i.size ?? ''), qty: Math.max(1, Math.min(50, Number(i.qty) || 1)) }));
    }
  } catch {
    items = EMPTY;
  }
  cache = { raw, items };
  return items;
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items);
  cache = { raw, items };
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // stockage indisponible (navigation privée) : le panier vit en mémoire le temps de la visite
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const cart = {
  add(item: CartItem) {
    const items = [...read()];
    const i = items.findIndex((x) => x.slug === item.slug && x.size === item.size);
    if (i >= 0) items[i] = { ...items[i], qty: Math.min(50, items[i].qty + item.qty) };
    else items.push(item);
    write(items);
  },
  setQty(slug: string, size: string, qty: number) {
    write(read().map((x) => (x.slug === slug && x.size === size ? { ...x, qty: Math.max(1, Math.min(50, qty)) } : x)));
  },
  remove(slug: string, size: string) {
    write(read().filter((x) => !(x.slug === slug && x.size === size)));
  },
  clear() {
    write([]);
  },
};

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
