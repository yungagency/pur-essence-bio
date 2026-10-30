import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import OrderBox from '@/components/OrderBox';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { getProduct, getProducts, getSettings } from '@/lib/data';
import { CATEGORY_LABELS, USAGE_LABELS } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: 'Produit introuvable' };
  return { title: p.name, description: `${p.name} — ${p.short}`.slice(0, 160) };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [p, all, s] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!p) notFound();

  const similar = all.filter((x) => x.slug !== p.slug && x.usage === p.usage).slice(0, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pur-essence.vercel.app';

  return (
    <section className="section bg-ivory" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link> › <Link href="/produits">Produits</Link> › <span>{p.name}</span>
        </nav>
        <div className="product-page">
          <div>
            <ProductImage url={p.image_url} alt={p.name} />
          </div>
          <div>
            <div className="chips">
              <span className="chip">{CATEGORY_LABELS[p.category] ?? p.category}</span>
              <span className="chip">{USAGE_LABELS[p.usage] ?? p.usage}</span>
            </div>
            <h1>{p.name}</h1>
            <p className="lead">{p.short}</p>

            <OrderBox
              name={p.name}
              price={p.price_fcfa}
              volume={p.volume}
              inStock={p.in_stock}
              whatsappCm={s.whatsapp_cm}
              whatsappCa={s.whatsapp_ca}
              url={`${siteUrl}/produits/${p.slug}`}
            />

            <h2>Description</h2>
            <p>{p.description}</p>

            {p.benefits.length > 0 && (
              <>
                <h2>Usages traditionnels</h2>
                <ul className="benefits">
                  {p.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </>
            )}

            {p.usage_tips && (
              <>
                <h2>Conseils d'utilisation</h2>
                <p>{p.usage_tips}</p>
              </>
            )}

            <h2>Précautions</h2>
            <div className="notice">
              {p.precautions && <p style={{ marginBottom: '.5rem' }}>{p.precautions}</p>}
              <p>
                <strong>Toujours diluer</strong> avant application sur la peau, ne pas appliquer près des yeux, tenir hors de
                portée des enfants. Demandez conseil avant usage en cas de grossesse, d'allaitement, d'épilepsie, chez l'enfant
                ou si vous suivez un traitement. Ces informations ne remplacent pas l'avis d'un médecin.
              </p>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Dans le même esprit</h2>
            <div className="product-grid">
              {similar.map((x) => (
                <ProductCard key={x.id} p={x} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
