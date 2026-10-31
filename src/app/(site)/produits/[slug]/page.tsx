import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Fiche from '@/components/Fiche';
import OrderBox from '@/components/OrderBox';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { getProduct, getProducts, getSettings } from '@/lib/data';
import { niceLabel } from '@/lib/format';
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
  const prefix = p.category === 'huile-essentielle' ? 'Huile essentielle de ' : p.category === 'huile-vegetale' ? 'Huile végétale de ' : '';
  return {
    title: `${prefix}${p.name}${p.latin_name ? ` (${p.latin_name})` : ''}`,
    description: (p.short || p.description).slice(0, 160),
    openGraph: p.image_url ? { images: [p.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [p, all, s] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!p) notFound();

  const similar = all
    .filter((x) => x.slug !== p.slug && x.category === p.category && x.usage === p.usage)
    .sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url))
    .slice(0, 4);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pur-essence.vercel.app';
  const identity = (p.identity ?? []).filter((i) => i.value);

  return (
    <section className="section bg-ivory" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link> › <Link href="/produits">Produits</Link> ›{' '}
          <Link href={`/produits?categorie=${p.category}`}>{CATEGORY_LABELS[p.category] ?? p.category}</Link> › <span>{p.name}</span>
        </nav>
        <div className="product-page">
          <div className="product-media">
            <ProductImage url={p.image_url} alt={p.name} label={p.name} category={p.category} eager />
          </div>
          <div>
            <div className="chips">
              <span className="chip">{CATEGORY_LABELS[p.category] ?? p.category}</span>
              <span className="chip">{USAGE_LABELS[p.usage] ?? p.usage}</span>
              {p.domain && <span className="chip">{niceLabel(p.domain)}</span>}
            </div>
            <h1>{p.name}</h1>
            {p.latin_name && <p className="latin">{p.latin_name}</p>}
            {p.short && !p.description && <p className="lead">{p.short}</p>}

            <OrderBox
              slug={p.slug}
              name={p.name}
              price={p.price_fcfa}
              volume={p.volume}
              sizes={p.sizes}
              inStock={p.in_stock}
              whatsappCm={s.whatsapp_cm}
              url={`${siteUrl}/produits/${p.slug}`}
            />

            {identity.length > 0 && (
              <div className="identity-card" style={{ marginTop: '1.2rem' }}>
                <p className="identity-title">Carte d'identité</p>
                <dl>
                  {p.english_name && (
                    <div>
                      <dt>Nom anglais</dt>
                      <dd>{p.english_name}</dd>
                    </div>
                  )}
                  {identity.map((i) => (
                    <div key={i.label}>
                      <dt>{i.label}</dt>
                      <dd>{i.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {p.description && (
              <>
                <h2>Présentation</h2>
                {p.description.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} style={{ marginBottom: '.8rem' }}>
                    {para}
                  </p>
                ))}
              </>
            )}

            {p.fiche ? (
              <Fiche source={p.fiche} title={p.name} />
            ) : (
              <>
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
              </>
            )}

            <div className="notice" style={{ marginTop: '1.5rem' }}>
              {p.precautions && <p style={{ marginBottom: '.5rem' }}>{p.precautions}</p>}
              <p>
                <strong>Précautions générales :</strong> les huiles essentielles sont très concentrées. Toujours diluer avant
                application sur la peau, éviter les yeux et les muqueuses, tenir hors de portée des enfants. Demandez conseil
                avant usage en cas de grossesse, d'allaitement, d'épilepsie, chez l'enfant, en cas de maladie ou de traitement
                en cours. Ces informations ne remplacent pas l'avis d'un médecin.
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
