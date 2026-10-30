'use client';
import { useState } from 'react';
import { formatFcfa, waLink } from '@/lib/format';

type Props = {
  name: string;
  price: number | null;
  volume: string | null;
  sizes: string | null;
  inStock: boolean;
  whatsappCm: string;
  whatsappCa: string;
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

export default function OrderBox({ name, price, volume, sizes, inStock, whatsappCm, whatsappCa, url }: Props) {
  const options = splitSizes(sizes);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(options[0] ?? volume ?? '');
  const total = price !== null ? formatFcfa(price * qty) : null;
  const msg =
    `Bonjour Pur'Essence, je souhaite commander :\n` +
    `• ${name}${size ? ` (${size})` : ''} × ${qty}\n` +
    (total ? `Total indicatif : ${total}\n` : '') +
    `Lien : ${url}`;

  return (
    <div className="buy-box">
      <p className={price !== null ? 'price-tag' : 'price-tag muted'} style={{ fontSize: '1.4rem', margin: 0 }}>
        {formatFcfa(price) ?? 'Prix sur demande'}
        {volume && <span className="muted small"> · {volume}</span>}
      </p>
      {!inStock && <span className="chip out">Actuellement en rupture : écrivez-nous pour connaître le délai</span>}
      {options.length > 1 && (
        <div className="choice-group" role="radiogroup" aria-label="Contenance">
          {options.map((o) => (
            <label key={o}>
              <input type="radio" name="size" value={o} checked={size === o} onChange={() => setSize(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      )}
      <div className="qty-row">
        <label htmlFor="qty">Quantité</label>
        <input
          id="qty"
          type="number"
          min={1}
          max={50}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
        />
        {total && qty > 1 && <span className="muted small">Total : {total}</span>}
      </div>
      {whatsappCm && (
        <a className="button button-primary" href={waLink(whatsappCm, msg)} target="_blank" rel="noopener">
          <i className="fab fa-whatsapp"></i> Commander sur WhatsApp
        </a>
      )}
      {whatsappCa && (
        <a className="button button-outline" href={waLink(whatsappCa, msg)} target="_blank" rel="noopener">
          🇨🇦 Commander depuis le Canada
        </a>
      )}
      <p className="muted small">La disponibilité, le prix final et la livraison vous sont confirmés sur WhatsApp.</p>
    </div>
  );
}
