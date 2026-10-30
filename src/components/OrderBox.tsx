'use client';
import { useState } from 'react';
import { formatFcfa, waLink } from '@/lib/format';

type Props = {
  name: string;
  price: number | null;
  volume: string | null;
  inStock: boolean;
  whatsappCm: string;
  whatsappCa: string;
  url: string;
};

export default function OrderBox({ name, price, volume, inStock, whatsappCm, whatsappCa, url }: Props) {
  const [qty, setQty] = useState(1);
  const total = price !== null ? formatFcfa(price * qty) : null;
  const msg =
    `Bonjour Pur'Essence, je souhaite commander :\n` +
    `• ${name}${volume ? ` (${volume})` : ''} × ${qty}\n` +
    (total ? `Total indicatif : ${total}\n` : '') +
    `Lien : ${url}`;

  return (
    <div className="buy-box">
      <p className={price !== null ? 'price-tag' : 'price-tag muted'} style={{ fontSize: '1.4rem', margin: 0 }}>
        {formatFcfa(price) ?? 'Prix sur demande'}
        {volume && <span className="muted small"> · {volume}</span>}
      </p>
      {!inStock && <span className="chip out">Actuellement en rupture : écrivez-nous pour connaître le délai</span>}
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
