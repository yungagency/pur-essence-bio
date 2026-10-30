'use client';
import Link from 'next/link';
import { useState } from 'react';
import { cart, cartCount, useCart } from '@/lib/cart';
import { waLink } from '@/lib/format';

type Props = { whatsappCm: string; whatsappCa: string; siteUrl: string };

export default function CartView({ whatsappCm, whatsappCa, siteUrl }: Props) {
  const items = useCart();
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <i className="fas fa-basket-shopping" aria-hidden="true"></i>
        <p>Votre panier est vide.</p>
        <Link href="/produits" className="button button-primary">
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  const msg = [
    "Bonjour Pur'Essence, je souhaite commander :",
    ...items.map((i) => `• ${i.name}${i.size ? ` (${i.size})` : ''} × ${i.qty}`),
    '',
    name && `Nom : ${name}`,
    place && `Livraison : ${place}`,
    note && `Remarque : ${note}`,
    'Merci de me confirmer les prix, la disponibilité et la livraison.',
    `(${siteUrl}/commande)`,
  ]
    .filter((l) => l !== false && l !== undefined && l !== null)
    .join('\n');

  return (
    <div className="cart-layout">
      <div className="cart-list">
        {items.map((i) => (
          <div key={`${i.slug}-${i.size}`} className="cart-item">
            <div>
              <Link href={`/produits/${i.slug}`} className="cart-name">
                {i.name}
              </Link>
              {i.size && <span className="muted small"> · {i.size}</span>}
            </div>
            <div className="cart-actions">
              <div className="qty-stepper">
                <button type="button" aria-label="Moins" onClick={() => cart.setQty(i.slug, i.size, i.qty - 1)}>
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={i.qty}
                  aria-label={`Quantité ${i.name}`}
                  onChange={(e) => cart.setQty(i.slug, i.size, Number(e.target.value) || 1)}
                />
                <button type="button" aria-label="Plus" onClick={() => cart.setQty(i.slug, i.size, i.qty + 1)}>
                  +
                </button>
              </div>
              <button type="button" className="cart-remove" onClick={() => cart.remove(i.slug, i.size)} aria-label={`Retirer ${i.name}`}>
                <i className="fas fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
        <p className="muted small">
          {cartCount(items)} article{cartCount(items) > 1 ? 's' : ''} ·{' '}
          <Link href="/produits" style={{ textDecoration: 'underline' }}>
            Continuer mes achats
          </Link>
        </p>
      </div>

      <div className="cart-send">
        <h2>Envoyer ma commande</h2>
        <p className="muted small">Facultatif : ces informations seront ajoutées à votre message WhatsApp.</p>
        <div className="form-group">
          <label htmlFor="cart-name">Votre nom</label>
          <input id="cart-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        </div>
        <div className="form-group">
          <label htmlFor="cart-place">Ville / quartier de livraison</label>
          <input id="cart-place" value={place} onChange={(e) => setPlace(e.target.value)} maxLength={80} placeholder="Ex. Yaoundé, Bastos" />
        </div>
        <div className="form-group">
          <label htmlFor="cart-note">Remarque</label>
          <textarea id="cart-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} rows={2} />
        </div>
        {whatsappCm && (
          <a className="button button-primary" style={{ width: '100%' }} href={waLink(whatsappCm, msg)} target="_blank" rel="noopener" onClick={() => setSent(true)}>
            <i className="fab fa-whatsapp"></i> Envoyer sur WhatsApp
          </a>
        )}
        {whatsappCa && (
          <a className="button button-outline" style={{ width: '100%', marginTop: '.6rem' }} href={waLink(whatsappCa, msg)} target="_blank" rel="noopener" onClick={() => setSent(true)}>
            🇨🇦 Envoyer depuis le Canada
          </a>
        )}
        <p className="muted small" style={{ marginTop: '.8rem' }}>
          Rien n'est payé ici : nous vous répondons sur WhatsApp avec les prix, la disponibilité et la livraison.
        </p>
        {sent && (
          <div className="form-msg ok" role="status">
            Message envoyé ?{' '}
            <button type="button" className="link-button" onClick={() => cart.clear()}>
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
