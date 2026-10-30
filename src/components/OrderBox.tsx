'use client';
import Link from 'next/link';
import { useState } from 'react';
import { formatFcfa, waLink } from '@/lib/format';
import { cart } from '@/lib/cart';

type Props = {
  slug: string;
  name: string;
  price: number | null;
  volume: string | null;
  sizes: string | null;
  inStock: boolean;
  whatsappCm: string;
  url: string;
};

/** « 5 ml • 10 ml • 15 ml » ou « 100 ml – 250 ml » → ['5 ml', '10 ml', '15 ml'] */
function splitSizes(sizes: string | null): string[] {
  if (!sizes) return [];
  return sizes
    .split(/\s*[•–,/]\s*|\s+-\s*/)
    .map((s) => s.trim())
    .filter((s) => /\d/.test(s));
}

export default function OrderBox({ slug, name, price, volume, sizes, inStock, whatsappCm, url }: Props) {
  const options = splitSizes(sizes);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(options[0] ?? volume ?? '');
  const [added, setAdded] = useState(false);
  const msg =
    `Bonjour Pur'Essence, je souhaite commander :\n` +
    `• ${name}${size ? ` (${size})` : ''} × ${qty}\n` +
    `Lien : ${url}`;

  return (
    <div className="buy-box">
      {price !== null && <p className="price-tag" style={{ fontSize: '1.4rem', margin: 0 }}>{formatFcfa(price)}</p>}
      {!inStock && <span className="chip out">Actuellement en rupture : écrivez-nous pour connaître le délai</span>}
      {options.length > 1 ? (
        <div>
          <p className="buy-label">Contenance</p>
          <div className="choice-group" role="radiogroup" aria-label="Contenance">
            {options.map((o) => (
              <label key={o}>
                <input type="radio" name="size" value={o} checked={size === o} onChange={() => setSize(o)} />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        size && (
          <p className="buy-label" style={{ margin: 0 }}>
            Contenance : <strong>{size}</strong>
          </p>
        )
      )}
      <div className="qty-row">
        <label htmlFor="qty">Quantité</label>
        <div className="qty-stepper">
          <button type="button" aria-label="Moins" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <input
            id="qty"
            type="number"
            min={1}
            max={50}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
          />
          <button type="button" aria-label="Plus" onClick={() => setQty((q) => Math.min(50, q + 1))}>
            +
          </button>
        </div>
      </div>
      <button
        type="button"
        className="button button-primary"
        onClick={() => {
          cart.add({ slug, name, size, qty });
          setAdded(true);
        }}
      >
        <i className="fas fa-basket-shopping"></i> Ajouter au panier
      </button>
      {added && (
        <div className="form-msg ok" role="status" style={{ margin: 0 }}>
          Ajouté au panier.{' '}
          <Link href="/commande" style={{ fontWeight: 600, textDecoration: 'underline' }}>
            Voir le panier et commander
          </Link>
        </div>
      )}
      {whatsappCm && (
        <a className="button button-outline" href={waLink(whatsappCm, msg)} target="_blank" rel="noopener">
          <i className="fab fa-whatsapp"></i> Commander ce produit seul sur WhatsApp
        </a>
      )}
      <p className="muted small" style={{ margin: 0 }}>
        Prix, disponibilité et livraison vous sont communiqués sur WhatsApp avant toute validation.{' '}
        <Link href="/commande#comment-commander" style={{ textDecoration: 'underline' }}>
          Comment commander ?
        </Link>
      </p>
    </div>
  );
}
