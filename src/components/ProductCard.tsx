import Link from 'next/link';
import ProductImage from './ProductImage';
import { formatFcfa } from '@/lib/format';
import { USAGE_LABELS } from '@/lib/types';
import { niceLabel } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductCard({ p }: { p: Product }) {
  const price = formatFcfa(p.price_fcfa);
  return (
    <article className="product-card">
      <Link href={`/produits/${p.slug}`} aria-label={p.name}>
        <ProductImage url={p.image_url} alt={p.name} label={p.name} category={p.category} />
      </Link>
      <div className="card-copy">
        <div className="chips">
          <span className="chip">{p.category === 'synergie' && p.domain ? niceLabel(p.domain) : USAGE_LABELS[p.usage] ?? p.usage}</span>
          {!p.in_stock && <span className="chip out">Rupture</span>}
        </div>
        <h3>
          <Link href={`/produits/${p.slug}`}>{p.name}</Link>
        </h3>
        {p.latin_name && <p className="latin small">{p.latin_name}</p>}
        <p className="card-desc">{p.short}</p>
        {(price || p.volume || p.sizes) && (
          <p className={price ? 'price-tag' : 'price-tag muted'}>
            {[price, p.volume || p.sizes].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="card-actions">
          <Link href={`/produits/${p.slug}`} className="button button-outline button-sm">
            Voir le produit
          </Link>
        </div>
      </div>
    </article>
  );
}
