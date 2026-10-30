'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { CATEGORY_LABELS, USAGE_LABELS } from '@/lib/types';
import type { Product } from '@/lib/types';

function norm(s: string) {
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function ProductCatalog({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(params.get('categorie') ?? '');
  const [use, setUse] = useState(params.get('usage') ?? '');
  const PAGE = 24;
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => setLimit(PAGE), [q, cat, use]);

  const categories = useMemo(
    () => Object.keys(CATEGORY_LABELS).filter((c) => products.some((p) => p.category === c)),
    [products]
  );

  const list = useMemo(() => {
    const nq = norm(q.trim());
    return products.filter(
      (p) =>
        (!nq || norm(`${p.name} ${p.short} ${p.latin_name ?? ''} ${p.domain ?? ''}`).includes(nq)) &&
        (!cat || p.category === cat) &&
        (!use || p.usage === use)
    );
  }, [products, q, cat, use]);

  return (
    <>
      <div className="search-bar">
        <i className="fas fa-search" aria-hidden="true"></i>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher : lavande, jojoba, sommeil, Lavandula…"
          aria-label="Rechercher un produit"
        />
      </div>
      <div className="filters-bar">
        <select className="filter-select" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Catégorie">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c] ?? c}
            </option>
          ))}
        </select>
        <select className="filter-select" value={use} onChange={(e) => setUse(e.target.value)} aria-label="Utilisation">
          <option value="">Toutes les utilisations</option>
          {Object.entries(USAGE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <p className="muted small" style={{ marginBottom: '1rem' }} aria-live="polite">
        {list.length} produit{list.length > 1 ? 's' : ''}
      </p>
      {list.length === 0 ? (
        <p className="empty-state">Aucun produit ne correspond à votre recherche.</p>
      ) : (
        <div className="product-grid">
          {list.slice(0, limit).map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
      {list.length > limit && (
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <button type="button" className="button button-outline" onClick={() => setLimit((l) => l + PAGE)}>
            Afficher plus de produits ({list.length - limit} restants)
          </button>
        </div>
      )}
    </>
  );
}
