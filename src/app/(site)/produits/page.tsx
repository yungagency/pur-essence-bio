import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductCatalog from '@/components/ProductCatalog';
import { getProducts } from '@/lib/data';

export const metadata: Metadata = {
  alternates: { canonical: '/produits' },
  title: 'Nos produits',
  description: "Catalogue Pur'Essence : huiles essentielles et mélanges naturels (lavande, eucalyptus, menthe poivrée, palmarosa…). Commande sur WhatsApp.",
};

export default async function ProduitsPage() {
  const products = await getProducts();
  return (
    <>
      <section className="page-hero hero-photo hero-produits" style={{ height: 'auto', minHeight: 280, padding: '4rem 0 2rem' }}>
        <div className="page-hero-bg" style={{ backgroundImage: "url('/images/ambiance/produits-bandeau.webp')" }} aria-hidden="true" />
        <div className="page-hero-overlay" aria-hidden="true" />
        <div className="container page-hero-content reveal">
          <span className="eyebrow">Catalogue</span>
          <h1>Nos produits naturels</h1>
          <p>Cliquez sur un produit pour voir ses usages, ses précautions et le commander.</p>
        </div>
      </section>
      <section className="section bg-ivory pattern-leaf" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <Suspense fallback={<p className="empty-state">Chargement du catalogue…</p>}>
            <ProductCatalog products={products} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
