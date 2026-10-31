'use client';
import { useState } from 'react';
import { imgSrc } from '@/lib/format';

const ICONS: Record<string, string> = {
  'huile-essentielle': 'fa-leaf',
  'huile-vegetale': 'fa-tint',
  synergie: 'fa-flask',
  'hydrolat-absolue': 'fa-spa',
  soin: 'fa-sun',
};

/** Photo du produit, ou visuel de marque (icône + nom) tant que la photo n'est pas disponible. */
export default function ProductImage({
  url,
  alt,
  label,
  category,
  eager = false,
}: {
  url: string | null;
  alt: string;
  label?: string;
  category?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = imgSrc(url);
  return (
    <div className={`product-thumb${src && !failed ? '' : ' is-placeholder'}`} data-cat={category}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
      ) : (
        <div className="ph-inner">
          <i className={`fas ${ICONS[category ?? ''] ?? 'fa-leaf'} ph`} aria-hidden="true"></i>
          {label && <span className="ph-label">{label}</span>}
          <span className="ph-brand">Pur'Essence</span>
        </div>
      )}
    </div>
  );
}
