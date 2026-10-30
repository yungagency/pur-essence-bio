'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: 'Tableau de bord', key: '' },
  { href: '/admin/demandes', label: 'Demandes', key: 'demandes' },
  { href: '/admin/produits', label: 'Produits', key: '' },
  { href: '/admin/avis', label: 'Avis', key: 'avis' },
  { href: '/admin/equipe', label: 'Équipe', key: '' },
  { href: '/admin/confiance', label: 'Labels et résultats', key: '' },
  { href: '/admin/faq', label: 'FAQ', key: '' },
  { href: '/admin/reglages', label: 'Coordonnées', key: '' },
];

export default function AdminNav({ counts }: { counts: Record<string, number> }) {
  const path = usePathname();
  return (
    <>
      {ITEMS.map((i) => {
        const active = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
        const n = i.key ? counts[i.key] : 0;
        return (
          <Link key={i.href} href={i.href} className={active ? 'active' : ''}>
            {i.label}
            {n > 0 && <span className="badge-count">{n}</span>}
          </Link>
        );
      })}
    </>
  );
}
